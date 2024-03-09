import type PublicUserModel from '../models/public-user-model'
import type GraphqlDiScope from '../types/graphql-di-scope'

async function userDiResolver ({ request, authService, usersData }: GraphqlDiScope): Promise<PublicUserModel | undefined> {
  const authToken = request.headers['x-auth-token']
  if (typeof authToken !== 'string') {
    return undefined
  }
  const userId = authService.validateAuthToken(authToken)
  if (userId == null) {
    return undefined
  }
  return await usersData.findById(userId)
}

export default userDiResolver
