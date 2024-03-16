import { type JSONSchemaType } from 'ajv'
import type KnexConfig from './knex-config'
import { knexConfigSchemaType } from './knex-config'
import type RedisConfig from './redis-config'
import { redisConfigSchemaType } from './redis-config'

interface SecureProperties {
  knex: KnexConfig
  redis: RedisConfig
}

export const securePropertiesSchemaType: JSONSchemaType<SecureProperties> = {
  type: 'object',
  properties: {
    knex: knexConfigSchemaType,
    redis: redisConfigSchemaType
  },
  required: ['knex', 'redis'],
  additionalProperties: false
}

export default SecureProperties
