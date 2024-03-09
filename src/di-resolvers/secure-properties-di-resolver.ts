import fs from 'fs'
import type SecureProperties from '../types/secure-properties'
import { Lifetime, RESOLVER } from 'awilix'
import type AwilixFunction from '../types/awilix-function'

const securePropertiesDiResolver: AwilixFunction<SecureProperties> = () => {
  const secureProperties = fs.readFileSync(`secure-properties-${process.env.ENV_NAME}.json`, { encoding: 'utf8' })
  return JSON.parse(secureProperties)
}

securePropertiesDiResolver[RESOLVER] = {
  lifetime: Lifetime.SINGLETON
}

export default securePropertiesDiResolver
