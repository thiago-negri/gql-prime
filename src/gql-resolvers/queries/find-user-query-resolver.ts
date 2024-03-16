import cacheKeys from '../../cache/cache-keys'
import { type QueryResolvers } from '../../gen/generated-schema-types'
import type GraphqlContext from '../../types/graphql-context'
import GraphqlError from '../../types/graphql-error'

const findUserQueryResolver: QueryResolvers<GraphqlContext>['findUser'] = async (_parent, { input }, context) => {
  const { cacheService } = context.diScope
  const { id, username } = input
  if (id == null && username == null) {
    throw new GraphqlError('invalidMutationInput', '\'id\' or \'username\' must be set')
  }
  if (id != null && username != null) {
    throw new GraphqlError('invalidMutationInput', 'only one of \'id\' or \'username\' must be set')
  }
  const user = id != null
    ? await cacheService.read(cacheKeys.users.public.byId, { id })
    : username != null
      ? await cacheService.read(cacheKeys.users.public.byUsername, { username })
      : null
  return { user }
}

const Query: QueryResolvers = { findUser: findUserQueryResolver }
export default { Query }
