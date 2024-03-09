import path from 'path'
import { fastifyAwilixPlugin } from '@fastify/awilix'
import { Lifetime, asClass, asFunction, asValue, createContainer } from 'awilix'
import { type FastifyInstance } from 'fastify'

/** user-service => userService */
function formatDiClassName (fileName: string): string {
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

async function configAwilix (app: FastifyInstance): Promise<void> {
  const container = createContainer({ strict: true })
  await app.register(fastifyAwilixPlugin, {
    container,
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true
  })
  // Services and Data are SINGLETON by default
  app.diContainer.loadModules([
    path.join(__dirname, '../data/**/*.ts'),
    path.join(__dirname, '../services/**/*.ts')
  ], {
    formatName: formatDiClassName,
    resolverOptions: {
      register: asClass,
      lifetime: Lifetime.SINGLETON
    }
  })
  // DI-Resolvers are SCOPED by default
  app.diContainer.loadModules([
    path.join(__dirname, '../di-resolvers/**/*.ts')
  ], {
    formatName: formatDiResolverName,
    resolverOptions: {
      register: asFunction,
      lifetime: Lifetime.SCOPED
    }
  })
  // Add 'request' and 'reply' to DI scope
  app.addHook('onRequest', (request, reply, done) => {
    request.diScope.register({
      request: asValue(request),
      reply: asValue(reply)
    })
    done()
  })
}

export default configAwilix
