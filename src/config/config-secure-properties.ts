import fs from "fs";
import path from "path";
import Ajv from "ajv";
import type SecureProperties from "../secure/types/secure-properties";
import { securePropertiesSchemaType } from "../secure/types/secure-properties";

async function configSecureProperties(): Promise<SecureProperties> {
  const ajv = new Ajv();
  const validate = ajv.compile(securePropertiesSchemaType);
  const rawSecureProperties = fs.readFileSync(
    path.resolve(
      __dirname,
      `../secure/secure-properties-${process.env.ENV_NAME}.json`
    ),
    { encoding: "utf8" }
  );
  const secureProperties = JSON.parse(rawSecureProperties) as SecureProperties;
  const valid = validate(secureProperties);
  if (!valid) {
    throw new Error(
      `invalid secure properties file: ${JSON.stringify(validate.errors)}`
    );
  }
  return secureProperties;
}

export default configSecureProperties;
