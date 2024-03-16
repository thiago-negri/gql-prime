export interface CacheType<T> {
  version: number
  name: string
  value?: T
}
