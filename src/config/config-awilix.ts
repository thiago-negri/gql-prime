import { fastifyAwilixPlugin } from '@fastify/awilix'
import { Lifetime, asClass, asFunction, asValue } from 'awilix'
import { type FastifyInstance } from 'fastify'

import UsersData from '../data/users/users-data'
import AuthService from '../services/auth-service'
import userDiResolver from '../di-resolvers/user-di-resolver'

async function configAwilix (app: FastifyInstance): Promise<void> {
  await app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true
  })
  app.diContainer.register({
    usersData: asClass(UsersData, { lifetime: Lifetime.SINGLETON }),
    authService: asClass(AuthService, { lifetime: Lifetime.SINGLETON }),
    user: asFunction(userDiResolver, { lifetime: Lifetime.SCOPED })
  })
  app.addHook('onRequest', (request, reply, done) => {
    request.diScope.register({ request: asValue(request) })
    request.diScope.register({ reply: asValue(reply) })
    done()
  })
}

export default configAwilix
