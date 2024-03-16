import type CacheArgs from '../cache/cache-args'
import type CacheKey from '../cache/cache-key'
import type CacheKeyComposite from '../cache/cache-key-composite'

interface CachedValue {
  ttl: number
  value: unknown
}

function getNow (): number {
  return new Date().getTime()
}

class InMemoryCacheService {
  private readonly cache: Map<string, CachedValue> = new Map<string, CachedValue>()

  get <PF extends CacheArgs, F extends CacheArgs, T, CT> (key: CacheKey<F, T> | CacheKeyComposite<PF, T, F, CT>, args: F): T | null {
    if (key.inMemoryTtlInSeconds == null) {
      return null
    }
    const cacheKey = key.build(args)
    const cachedValue = this.cache.get(cacheKey)
    if (cachedValue == null) {
      return null
    }
    const { ttl, value } = cachedValue
    if (getNow() > ttl) {
      this.cache.delete(cacheKey)
      return null
    }
    return value as T
  }

  set <PF extends CacheArgs, F extends CacheArgs, T, CT> (key: CacheKey<F, T> | CacheKeyComposite<PF, T, F, CT>, args: F, value: T): void {
    if (key.inMemoryTtlInSeconds == null) {
      return
    }
    const cacheKey = key.build(args)
    const cachedValue = {
      ttl: getNow() + key.ttlInSeconds * 1000,
      value
    }
    this.cache.set(cacheKey, cachedValue)
  }

  expire <PF extends CacheArgs, F extends CacheArgs> (key: CacheKey<F, unknown> | CacheKeyComposite<PF, unknown, F, unknown>, args: F): void {
    if (key.inMemoryTtlInSeconds == null) {
      return
    }
    this.cache.delete(key.build(args))
  }
}

export default InMemoryCacheService
