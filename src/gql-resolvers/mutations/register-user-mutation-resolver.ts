import { type MutationResolvers } from '../../gen/generated-schema-types'
import type GraphqlContext from '../../types/graphql-context'
import GraphqlError from '../../types/graphql-error'

const registerUserMutationResolver: MutationResolvers<GraphqlContext>['registerUser'] = async (
  _parent,
  { input },
  context
) => {
  const { usersData } = context.diScope
  const { username, password } = input
  const usernameExists = await usersData.existsUsername(username)
  if (usernameExists) {
    throw new GraphqlError('usernameAlreadyExists')
  }
  const id = await usersData.addUser({ username, password })
  return { user: { id, username } }
}

const Mutation: MutationResolvers<GraphqlContext> = { registerUser: registerUserMutationResolver }
export default { Mutation }
