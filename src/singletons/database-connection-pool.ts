import knex, { type Knex } from 'knex'

class DatabaseConnectionPool {
  private readonly knexInstance: Knex

  constructor (knexConfiguration: Knex.Config) {
    this.knexInstance = knex(knexConfiguration)
  }

  get (): Knex {
    return this.knexInstance
  }
}

export default DatabaseConnectionPool
