import { type } from "arktype";

export const UpdateCurrentUserInputSchema = type({
  "name?": "string > 3",
  "email?": "string.email",
});