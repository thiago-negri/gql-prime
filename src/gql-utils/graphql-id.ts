import ErrorCodes from "constants/error-codes";
import GraphqlError from "types/graphql-error";

export const enum GraphqlEntityType {
  USER = "user",
}

export function idFromGraphl(id: string, entity: GraphqlEntityType): number {
  const prefix = `${entity}:`;
  if (id.startsWith(prefix)) {
    try {
      return parseInt(id.substring(prefix.length), 10);
    } catch (e) {
      throw new GraphqlError(ErrorCodes.INVALID_INPUT, "invalid id");
    }
  }
  throw new GraphqlError(ErrorCodes.INVALID_INPUT, "invalid id");
}

export function idToGraphql(id: number, entity: GraphqlEntityType): string {
  return `${entity}:${id}`;
}
