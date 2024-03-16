import type CacheArgs from '../cache/cache-args'
import type CacheKey from '../cache/cache-key'
import type GraphqlDiScope from '../types/graphql-di-scope'

class CacheService {
  private readonly graphqlDiScope: GraphqlDiScope

  constructor (graphqlDiScope: GraphqlDiScope) {
    this.graphqlDiScope = graphqlDiScope
  }

  async read<F extends CacheArgs, T> (key: CacheKey<F, T>, args: F): Promise<T | null> {
    const { redisClient } = this.graphqlDiScope
    const redisKey = key.build(args)
    const value = await redisClient.get(redisKey)
    if (value == null) {
      const resolvedValue = await key.resolver(this.graphqlDiScope, args)
      if (resolvedValue == null) {
        return null
      }
      await this.doWrite(redisKey, key.ttlInSeconds, resolvedValue)
      return resolvedValue
    }
    return JSON.parse(value) as T
  }

  async write<F extends CacheArgs, T> (key: CacheKey<any, T>, args: F, value: T): Promise<void> {
    const redisKey = key.build(args)
    await this.doWrite(redisKey, key.ttlInSeconds, value)
  }

  async expire<F extends CacheArgs, T> (key: CacheKey<any, T>, args: F): Promise<void> {
    const { redisClient } = this.graphqlDiScope
    const redisKey = key.build(args)
    await redisClient.del(redisKey)
  }

  private async doWrite (key: string, ttlInSeconds: number, value: unknown): Promise<void> {
    const { redisClient } = this.graphqlDiScope
    await redisClient.set(key, JSON.stringify(value), ttlInSeconds)
  }
}

export default CacheService
