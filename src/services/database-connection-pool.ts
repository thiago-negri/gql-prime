import knex, { type Knex } from 'knex'
import type GraphqlDiScope from '../types/graphql-di-scope'

class DatabaseConnectionPool {
  private readonly knexInstance: Knex

  constructor ({ secureProperties }: GraphqlDiScope) {
    this.knexInstance = knex(secureProperties.knexConfiguration)
  }

  get (): Knex {
    return this.knexInstance
  }
}

export default DatabaseConnectionPool
