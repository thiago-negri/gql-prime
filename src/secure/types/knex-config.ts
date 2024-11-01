import { type JSONSchemaType } from "ajv";

interface KnexConfig {
  client: string;
  connection: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
}

export const knexConfigSchemaType: JSONSchemaType<KnexConfig> = {
  type: "object",
  properties: {
    client: { type: "string" },
    connection: {
      type: "object",
      properties: {
        host: { type: "string" },
        port: { type: "number" },
        user: { type: "string" },
        password: { type: "string" },
        database: { type: "string" },
      },
      required: ["host", "port", "user", "password", "database"],
    },
  },
  required: ["client", "connection"],
};

export default KnexConfig;
