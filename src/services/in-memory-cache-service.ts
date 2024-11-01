import NodeCache from "node-cache";
import type CacheArgs from "../cache/cache-args";
import type CacheKey from "../cache/cache-key";
import type CacheKeyComposite from "../cache/cache-key-composite";

class InMemoryCacheService {
  private readonly cache: NodeCache = new NodeCache();

  get<PF extends CacheArgs, F extends CacheArgs, T, CT>(
    key: CacheKey<F, T> | CacheKeyComposite<PF, T, F, CT>,
    args: F
  ): T | null {
    if (key.inMemoryTtlInSeconds == null) {
      return null;
    }
    const cacheKey = key.build(args);
    const cachedValue = this.cache.get(cacheKey);
    if (cachedValue == null) {
      return null;
    }
    return cachedValue as T;
  }

  set<PF extends CacheArgs, F extends CacheArgs, T, CT>(
    key: CacheKey<F, T> | CacheKeyComposite<PF, T, F, CT>,
    args: F,
    value: T
  ): void {
    if (key.inMemoryTtlInSeconds == null) {
      return;
    }
    const cacheKey = key.build(args);
    this.cache.set(cacheKey, value, key.inMemoryTtlInSeconds);
  }

  expire<PF extends CacheArgs, F extends CacheArgs>(
    key: CacheKey<F, unknown> | CacheKeyComposite<PF, unknown, F, unknown>,
    args: F
  ): void {
    if (key.inMemoryTtlInSeconds == null) {
      return;
    }
    const cacheKey = key.build(args);
    this.cache.del(cacheKey);
  }
}

export default InMemoryCacheService;
