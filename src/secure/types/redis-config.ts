import { type JSONSchemaType } from "ajv";

interface RedisConfig {
  url: string;
}

export const redisConfigSchemaType: JSONSchemaType<RedisConfig> = {
  type: "object",
  properties: {
    url: { type: "string" },
  },
  required: ["url"],
};

export default RedisConfig;
