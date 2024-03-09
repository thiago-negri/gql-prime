import { type QueryResolvers } from '../../gen/generated-schema-types'
import type GraphqlContext from '../../types/graphql-context'

const myUserQueryResolver: QueryResolvers<GraphqlContext>['myUser'] = async (_parent, _args, context) => {
  const { user } = context.diScope
  return (await user) ?? null
}

const Query: QueryResolvers = { myUser: myUserQueryResolver }
export default { Query }
