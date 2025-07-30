import { type } from "arktype";

export const CurrentUserSchema = type({
  id: "string",
  name: "string",
  email: "string",
});