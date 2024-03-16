import cacheKeys from '../cache/cache-keys'
import type PublicUserModel from '../models/public-user-model'
import type GraphqlDiScope from '../types/graphql-di-scope'

async function userDiResolver ({ request, authService, cacheService }: GraphqlDiScope): Promise<PublicUserModel | null> {
  const authToken = request.headers['x-auth-token']
  if (typeof authToken !== 'string') {
    return null
  }
  const userId = authService.validateAuthToken(authToken)
  if (userId == null) {
    return null
  }
  return await cacheService.read(cacheKeys.users.public.byId, { id: userId })
}

export default userDiResolver
