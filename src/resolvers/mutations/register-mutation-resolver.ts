import { type MutationResolvers } from '../../gen/generated-schema-types'

const registerMutationResolver: MutationResolvers['register'] = async (
  _parent,
  { input },
  _context
) => {
  const { username } = input
  return {
    user: {
      id: '1',
      username
    }
  }
}

const Mutation: MutationResolvers = { register: registerMutationResolver }
export default { Mutation }
