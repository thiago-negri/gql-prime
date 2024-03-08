import { type QueryResolvers } from '../../gen/generated-schema-types'

const userQueryResolver: QueryResolvers['user'] = async (_parent, args, _context) => {
  return {
    id: args.id,
    username: 'foo'
  }
}

const Query: QueryResolvers = { user: userQueryResolver }
export default { Query }
