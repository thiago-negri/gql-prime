import { diContainer } from '@fastify/awilix'
import { Lifetime, asClass } from 'awilix'
import UsersData from '../data/users/users-data'

function configAwilix (): void {
  diContainer.register({
    usersData: asClass(UsersData, { lifetime: Lifetime.SINGLETON })
  })
}

export default configAwilix
