import cacheKeys from '../../cache/cache-keys'
import { type QueryResolvers } from '../../gen/generated-schema-types'
import type GraphqlContext from '../../types/graphql-context'

const findUserQueryResolver: QueryResolvers<GraphqlContext>['findUser'] = async (_parent, { input }, context) => {
  const { cacheService } = context.diScope
  const { id } = input
  const user = await cacheService.read(cacheKeys.users.public.byId, { id })
  return { user }
}

const Query: QueryResolvers = { findUser: findUserQueryResolver }
export default { Query }
