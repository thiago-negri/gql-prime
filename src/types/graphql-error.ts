import type ErrorCodes from "../constants/error-codes";

class GraphqlError extends Error {
  constructor(error: ErrorCodes, message?: string) {
    super(`${error}${message != null ? ": " + message : ""}`);
  }
}

export default GraphqlError;
