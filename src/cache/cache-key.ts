import type GraphqlDiScope from '../types/graphql-di-scope'
import type CacheArgs from './cache-args'
import cacheBuildArgs from './cache-build-args'
import { type CacheType } from './cache-type'

interface CacheOptions<T> {
  type: CacheType<T>
  ttlInSeconds: number
}

class CacheKey<F extends CacheArgs, T> {
  kind: 'simple' = 'simple'

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
    return `${this.key}:${this.type.name}.${this.type.version}?${cacheBuildArgs(args)}`
  }
}

export default CacheKey
