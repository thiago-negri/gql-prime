import { type MutationResolvers } from '../../gen/generated-schema-types'

const registerUserMutationResolver: MutationResolvers['registerUser'] = async (
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

const Mutation: MutationResolvers = { registerUser: registerUserMutationResolver }
export default { Mutation }
