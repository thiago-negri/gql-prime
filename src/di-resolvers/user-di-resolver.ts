import type PublicUserModel from '../models/public-user-model'
import type GraphqlDiScope from '../types/graphql-di-scope'

function userDiResolver ({ request, authService, usersData }: GraphqlDiScope): PublicUserModel | undefined {
  const authToken = request.headers['x-auth-token']
  if (typeof authToken !== 'string') {
    return undefined
  }
  const userId = authService.validateAuthToken(authToken)
  return usersData.findById(userId)
}

export default userDiResolver
