import CacheKey from './cache-key'
import CacheKeyComposite from './cache-key-composite'
import { NUMBER, PUBLIC_USER_MODEL_CACHE } from './cache-types'

const usersPublicById = new CacheKey('users.public.byId', {
  type: PUBLIC_USER_MODEL_CACHE,
  ttlInSeconds: 60,
  inMemoryTtlInSeconds: 10,
  resolver: async ({ usersDataLoader }, args: { id: number }) => await usersDataLoader.findById(args.id)
})

const usersPublicByUsername = new CacheKeyComposite('users.public.byUsername', {
  parentKey: usersPublicById,
  type: NUMBER,
  ttlInSeconds: 60,
  inMemoryTtlInSeconds: 10,
  resolver: async ({ usersDataLoader }, args: { username: string }) => await usersDataLoader.findByUsername(args.username),
  writeCallback: (user) => [{ id: user.id }, user.id],
  readCallback: (id) => ({ id })
})

const cacheKeys = {
  users: {
    public: {
      byId: usersPublicById,
      byUsername: usersPublicByUsername
    }
  }
}

export default cacheKeys
