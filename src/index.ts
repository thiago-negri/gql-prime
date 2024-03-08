import Fastify from 'fastify'
import mercurius from 'mercurius'

import configMercurius from './config/config-mercurius'

async function start (): Promise<void> {
  const app = Fastify()
  await app.register(mercurius, configMercurius())
  await app.listen({ port: 3000 })
}

void start()
