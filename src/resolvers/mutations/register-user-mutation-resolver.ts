import { type MutationResolvers } from '../../gen/generated-schema-types'
import type GraphqlContext from '../../types/graphql-context'

const registerUserMutationResolver: MutationResolvers<GraphqlContext>['registerUser'] = async (
  _parent,
  { input },
  context
) => {
  const { usersData } = context.diScope
  const { username } = input
  const id = usersData.addUser({ username })
  return { user: { id, username } }
}

const Mutation: MutationResolvers = { registerUser: registerUserMutationResolver }
export default { Mutation }
