import type GraphqlDiScope from '../types/graphql-di-scope'
import type CacheArgs from './cache-args'
import { type CacheType } from './cache-type'

// TODO(tnegri): Args must have a defined sort order to allow expiration of half-baked keys ?
function buildArgs (obj: CacheArgs): string {
  const entries = Object.entries(obj)
  return [...entries]
    .sort(([a], [b]) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
    .map(([key, value]) => `${key}=${value}`).join('&')
}

interface CacheOptions<T> {
  type: CacheType<T>
  ttlInSeconds: number
}

class CacheKey<F extends CacheArgs, T> {
  readonly key: string
  readonly type: CacheType<T>
  readonly ttlInSeconds: number
  readonly resolver: (diScope: GraphqlDiScope, args: F) => Promise<T | null>

  constructor (key: string, options: CacheOptions<T> & { resolver: (diScope: GraphqlDiScope, args: F) => Promise<T | null> }) {
    this.key = key
    this.type = options.type
    this.ttlInSeconds = options.ttlInSeconds
    this.resolver = options.resolver
  }

  build (args: F): string {
    return `${this.key}:${this.type.name}.${this.type.version}?${buildArgs(args)}`
  }
}

export default CacheKey
