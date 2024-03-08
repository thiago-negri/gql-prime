import { type FastifyRequest } from 'fastify'
import type UsersData from '../data/users/users-data'

interface GraphqlContext {
  diScope: {
    request: FastifyRequest
    usersData: UsersData
  }
}

export default GraphqlContext
