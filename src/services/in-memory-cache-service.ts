interface CachedValue {
  ttl: number
  value: unknown
}

function getNow (): number {
  return new Date().getTime()
}

class InMemoryCacheService {
  private readonly cache: Map<string, CachedValue> = new Map<string, CachedValue>()

  get (key: string): unknown {
    const cachedValue = this.cache.get(key)
    if (cachedValue == null) {
      return null
    }
    const { ttl, value } = cachedValue
    if (getNow() > ttl) {
      this.cache.delete(key)
      return null
    }
    return value
  }

  set (key: string, value: unknown, ttlInSeconds: number): void {
    const cachedValue = {
      ttl: getNow() + ttlInSeconds * 1000,
      value
    }
    this.cache.set(key, cachedValue)
  }

  expire (key: string): void {
    this.cache.delete(key)
  }
}

export default InMemoryCacheService
