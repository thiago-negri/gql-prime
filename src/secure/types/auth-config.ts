import { type JSONSchemaType } from "ajv";

interface AuthConfig {
  tokenSecret: string;
}

export const authConfigSchemaType: JSONSchemaType<AuthConfig> = {
  type: "object",
  properties: {
    tokenSecret: { type: "string" },
  },
  required: ["tokenSecret"],
};

export default AuthConfig;
