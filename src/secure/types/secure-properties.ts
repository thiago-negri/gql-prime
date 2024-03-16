import { type JSONSchemaType } from 'ajv'
import type KnexConfig from './knex-config'
import { knexConfigSchemaType } from './knex-config'
import type RedisConfig from './redis-config'
import { redisConfigSchemaType } from './redis-config'
import type AuthConfig from './auth-config'
import { authConfigSchemaType } from './auth-config'

interface SecureProperties {
  knex: KnexConfig
  redis: RedisConfig
  auth: AuthConfig
}

export const securePropertiesSchemaType: JSONSchemaType<SecureProperties> = {
  type: 'object',
  properties: {
    knex: knexConfigSchemaType,
    redis: redisConfigSchemaType,
    auth: authConfigSchemaType
  },
  required: ['knex', 'redis', 'auth'],
  additionalProperties: false
}

export default SecureProperties
