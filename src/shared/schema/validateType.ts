import { type, type Type } from "arktype";
import { Result, err, ok } from "neverthrow";

export const validateType = <T>(
  schema: Type<T>,
  value: unknown
): Result<T, Error> => {
  const result = schema(value);
  if (result instanceof type.errors) {
    return err(new Error(result.summary));
  }
  return ok(value as T);
};
