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
        await this.doWrite(redisKey, key.ttlInSeconds, resolvedValue)
        return resolvedValue as T
      }
      const [parentArgs, valueToWrite] = key.writeCallback(resolvedValue)
      await this.doWrite(redisKey, key.ttlInSeconds, valueToWrite)

      const { parentKey } = key
      await this.doWrite(parentKey.build(parentArgs), parentKey.ttlInSeconds, resolvedValue)
      return resolvedValue
    }
    const readValue = JSON.parse(value)
    if (key.kind === 'simple') {
      return readValue as T
    }
    const valueToReturn = await this.read(key.parentKey, key.readCallback(readValue as CT))
    return valueToReturn
  }

  private async loadRead (redisKeys: readonly string[]): Promise<Array<string | null>> {
    const { redisClient } = this.graphqlDiScope
    if (redisKeys.length === 1) {
      return [await redisClient.get(redisKeys[0])]
    }
    return await redisClient.mget([...redisKeys])
  }

  async write<F extends CacheArgs, T> (key: CacheKey<F, T>, args: F, value: T): Promise<void> {
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
