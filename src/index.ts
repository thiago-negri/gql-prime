import Fastify from 'fastify'

import configAwilix from './config/config-awilix'
import configMercurius from './config/config-mercurius'

async function start (): Promise<void> {
  const app = Fastify()
  await configAwilix(app)
  await configMercurius(app)
  await app.listen({ port: 3000 })
}

void start()
