import CacheKey from './cache-key'
import { PUBLIC_USER_MODEL_CACHE } from './cache-types'

const cacheKeys = {
  users: {
    public: {
      byId: new CacheKey('users.public.byId', {
        type: PUBLIC_USER_MODEL_CACHE,
        ttlInSeconds: 60,
        resolver: async ({ usersData }, args: { id: number }) => await usersData.findById(args.id)
      })
    }
  }
}

export default cacheKeys
