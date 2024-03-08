import Fastify from 'fastify'
import mercurius from 'mercurius'
import { asValue } from 'awilix'
import { fastifyAwilixPlugin } from '@fastify/awilix'

import configMercurius from './config/config-mercurius'
import configAwilix from './config/config-awilix'

async function start (): Promise<void> {
  const app = Fastify()

  // Awilix
  configAwilix()
  await app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true
  })
  app.addHook('onRequest', (request, _reply, done) => {
    request.diScope.register({
      request: asValue(request)
    })
    done()
  })

  // Mercurius
  await app.register(mercurius, configMercurius())

  await app.listen({ port: 3000 })
}

void start()
