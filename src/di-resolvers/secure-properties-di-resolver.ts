import fs from 'fs'
import type SecureProperties from '../types/secure-properties'

function securePropertiesDiResolver (): SecureProperties {
  const secureProperties = fs.readFileSync(`secure-properties-${process.env.ENV_NAME}.json`, { encoding: 'utf8' })
  return JSON.parse(secureProperties)
}

export default securePropertiesDiResolver
