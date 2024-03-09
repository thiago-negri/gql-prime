import { type QueryResolvers } from '../../gen/generated-schema-types'
import type GraphqlContext from '../../types/graphql-context'

const findUserQueryResolver: QueryResolvers<GraphqlContext>['findUser'] = async (_parent, { input }, context) => {
  const { usersData } = context.diScope
  const { id } = input
  const user = await usersData.findById(id)
  return { user }
}

const Query: QueryResolvers = { findUser: findUserQueryResolver }
export default { Query }
