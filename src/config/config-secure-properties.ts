import fs from 'fs'
import path from 'path'
import type SecureProperties from '../types/secure-properties'

async function configSecureProperties (): Promise<SecureProperties> {
  const secureProperties = fs.readFileSync(
    path.resolve(__dirname, `../secure/secure-properties-${process.env.ENV_NAME}.json`), { encoding: 'utf8' }
  )
  return JSON.parse(secureProperties) as SecureProperties
}

export default configSecureProperties
