import DataLoader from 'dataloader'
import type CacheArgs from '../cache/cache-args'
import type CacheKey from '../cache/cache-key'
import type GraphqlDiScope from '../types/graphql-di-scope'
import type CacheKeyComposite from '../cache/cache-key-composite'

class CacheService {
  private readonly graphqlDiScope: GraphqlDiScope
  private readonly readDataLoader: DataLoader<string, string | null>
  private readonly expireDataLoader: DataLoader<string, number | null>

  constructor (graphqlDiScope: GraphqlDiScope) {
    this.graphqlDiScope = graphqlDiScope
    this.readDataLoader = new DataLoader(this.loadRead.bind(this), { maxBatchSize: 10, cache: false })
    this.expireDataLoader = new DataLoader(this.loadExpire.bind(this), { maxBatchSize: 10, cache: false })
  }

  async read<PF extends CacheArgs, F extends CacheArgs, T, CT> (key: CacheKey<F, T> | CacheKeyComposite<PF, T, F, CT>, args: F): Promise<T | null> {
    const redisKey = key.build(args)
    const value = await this.readDataLoader.load(redisKey)
    if (value == null) {
      const resolvedValue = await key.resolver(this.graphqlDiScope, args)
      if (resolvedValue == null) {
        return null
      }

      if (key.kind === 'simple') {
        await this.write(key, args, resolvedValue)
        return resolvedValue
      }

      const [parentArgs, childValue] = key.writeCallback(resolvedValue)
      await this.write(key, args, childValue)

      const { parentKey } = key
      await this.write(parentKey, parentArgs, resolvedValue)

      return resolvedValue
    }

    if (key.kind === 'simple') {
      const readValue = JSON.parse(value) as T
      return readValue
    }

    const readValue = JSON.parse(value) as CT
    const parentArgs = key.readCallback(readValue)
    return await this.read(key.parentKey, parentArgs)
  }

  private async loadRead (redisKeys: readonly string[]): Promise<Array<string | null>> {
    const { redisClient } = this.graphqlDiScope
    if (redisKeys.length === 1) {
      return [await redisClient.get(redisKeys[0])]
    }
    return await redisClient.mget([...redisKeys])
  }

  async write<PF extends CacheArgs, F extends CacheArgs, T, PT> (key: CacheKey<F, T> | CacheKeyComposite<PF, PT, F, T>, args: F, value: T): Promise<void> {
    const redisKey = key.build(args)
    await this.doWrite(redisKey, key.ttlInSeconds, value)
  }

  async expire<F extends CacheArgs> (key: CacheKey<F, unknown>, args: F): Promise<void> {
    const redisKey = key.build(args)
    await this.expireDataLoader.load(redisKey)
  }

  private async loadExpire (redisKeys: readonly string[]): Promise<Array<number | null>> {
    const { redisClient } = this.graphqlDiScope
    return [await redisClient.del([...redisKeys])] // We don't care about the returned value
  }

  private async doWrite (key: string, ttlInSeconds: number, value: unknown): Promise<void> {
    const { redisClient } = this.graphqlDiScope
    await redisClient.set(key, JSON.stringify(value), ttlInSeconds)
  }
}

export default CacheService
