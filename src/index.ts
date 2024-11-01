import dotenv from "dotenv";
import Fastify from "fastify";

import configSecureProperties from "./config/config-secure-properties";
import configAwilix from "./config/config-awilix";
import configMercurius from "./config/config-mercurius";

async function start(): Promise<void> {
  dotenv.config();

  const secureProperties = await configSecureProperties();

  const app = Fastify();
  await configAwilix(app, secureProperties);
  await configMercurius(app);
  await app.listen({ port: 3000 });
}

void start();
