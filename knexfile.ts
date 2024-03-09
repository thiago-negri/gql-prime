import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'gqlprime-rw',
      password: 'passw0rd',
      database: 'gqlprime'
    }
  },
};

module.exports = config;
