import type CacheArgs from './cache-args'

// TODO(tnegri): Args must have a defined sort order to allow expiration of half-baked keys ?
function cacheBuildArgs (obj: CacheArgs): string {
  const entries = Object.entries(obj)
  return [...entries]
    .sort(([a], [b]) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
    .map(([key, value]) => `${key}=${value}`).join('&')
}

export default cacheBuildArgs
