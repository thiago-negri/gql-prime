import fs from "fs";
import type { Knex } from "knex";

const securePropertiesContent = fs.readFileSync(
  `./src/secure/secure-properties-development.json`,
  { encoding: "utf8" }
);
const secureProperties = JSON.parse(securePropertiesContent);
const developmentConfiguration = secureProperties.knex;

const config: { [key: string]: Knex.Config } = {
  development: {
    migrations: {
      directory: "./src/migrations",
    },
    ...developmentConfiguration,
  },
};

module.exports = config;
