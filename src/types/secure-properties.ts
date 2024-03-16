import { type Knex } from 'knex'
import type RedisConfig from './redis-config'

/**
 * This is read from a JSON file, there's no type safety.
 */
interface SecureProperties {
  knex: Knex.Config
  redis: RedisConfig
}

export default SecureProperties
