import { type QueryResolvers } from '../../gen/generated-schema-types'

const findUserQueryResolver: QueryResolvers['findUser'] = async (_parent, { input }, _context) => {
  return {
    user: {
      id: input.id,
      username: 'foo'
    }
  }
}

const Query: QueryResolvers = { findUser: findUserQueryResolver }
export default { Query }
