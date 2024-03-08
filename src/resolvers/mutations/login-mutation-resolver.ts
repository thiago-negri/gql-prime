import { type MutationResolvers } from '../../gen/generated-schema-types'
import type GraphqlContext from '../../types/graphql-context'

const loginMutationResolver: MutationResolvers<GraphqlContext>['login'] = async (_parent, { input }, context) => {
  const { usersData } = context.diScope
  const { username, password } = input
  const passwordMatch = usersData.checkPassword(username, password)
  return { ok: passwordMatch }
}

const Mutation: MutationResolvers<GraphqlContext> = { login: loginMutationResolver }
export { Mutation }
