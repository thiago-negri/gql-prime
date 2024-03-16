import path from 'path'
import { fastifyAwilixPlugin } from '@fastify/awilix'
import { Lifetime, asClass, asFunction, asValue, createContainer } from 'awilix'
import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify'
import DatabaseConnectionPool from '../singletons/database-connection-pool'
import redisClient from '../singletons/redis-client'
import type SecureProperties from '../types/secure-properties'

/** user-service => userService */
function formatDiClassName (fileName: string): string {
  if (!fileName.endsWith('-service') && !fileName.endsWith('-data')) {
    throw new Error(`Invalid service name: ${fileName}`)
  }
  const parts = fileName.split('-')
  let result = parts[0]
  for (let i = 1; i < parts.length; i++) {
    result += parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1)
  }
  return result
}

/** current-date-di-resolver => currentDate */
function formatDiResolverName (fileName: string): string {
  if (!fileName.endsWith('-di-resolver')) {
    throw new Error(`Invalid DI resolver name: ${fileName}`)
  }
  const parts = fileName.split('-')
  let result = parts[0]
  for (let i = 1; i < parts.length - 2; i++) {
    result += parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1)
  }
  return result
}

async function configAwilix (app: FastifyInstance, secureProperties: SecureProperties): Promise<void> {
  const container = createContainer({ strict: true })

  await app.register(fastifyAwilixPlugin, {
    container,
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true
  })

  // Services and Data are SINGLETON by default
  app.diContainer.loadModules([
    path.resolve(__dirname, '../data/**/*.ts'),
    path.resolve(__dirname, '../services/**/*.ts')
  ], {
    formatName: formatDiClassName,
    resolverOptions: {
      register: asClass,
      lifetime: Lifetime.SINGLETON
    }
  })

  // DI-Resolvers are SCOPED by default
  app.diContainer.loadModules([
    path.resolve(__dirname, '../di-resolvers/**/*.ts')
  ], {
    formatName: formatDiResolverName,
    resolverOptions: {
      register: asFunction,
      lifetime: Lifetime.SCOPED
    }
  })

  // Add 'request' and 'reply' to DI scope
  app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done: () => unknown): void => {
    request.diScope.register({
      request: asValue(request),
      reply: asValue(reply)
    })
    done()
  })

  // Manual registration of singletons
  app.diContainer.register('secureProperties', asValue(secureProperties))
  app.diContainer.register('databaseConnectionPool', asValue(new DatabaseConnectionPool(secureProperties.knex)))
  app.diContainer.register('redisClient', asValue(await redisClient(secureProperties.redis)))
}

export default configAwilix
