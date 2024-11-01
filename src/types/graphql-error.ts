import { GraphQLError } from "graphql";
import type ErrorCodes from "../constants/error-codes";

class GraphqlError extends GraphQLError {
  constructor(error: ErrorCodes, message?: string) {
    super(`${error}${message != null ? ": " + message : ""}`, {
      extensions: { code: error },
    });
  }
}

export default GraphqlError;
