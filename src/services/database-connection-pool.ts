import knex, { type Knex } from 'knex'

class DatabaseConnectionPool {
  private readonly knexInstance: Knex

  constructor () {
    // TODO(tnegri): Secrets manager
    this.knexInstance = knex({
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'gqlprime-rw',
        password: 'passw0rd',
        database: 'gqlprime'
      }
    })
  }

  get (): Knex {
    return this.knexInstance
  }
}

export default DatabaseConnectionPool
