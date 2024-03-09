import { type Knex } from 'knex'

/**
 * This is read from a JSON file, there's no type safety.
 */
interface SecureProperties {
  knexConfiguration: Knex.Config
}

export default SecureProperties
