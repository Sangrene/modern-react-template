import { err, errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { Type, type } from "arktype";
import { validateType } from "../schema/validateType";

export interface HTTPClient {
  post: <T extends unknown>(p: {
    url: string;
    body: any;
    responseType: Type<T>;
    headers?: Record<string, string>;
  }) => ResultAsync<T, Error>;
  get: <T extends unknown>(p: {
    url: string;
    responseType: Type<T>;
    headers?: Record<string, string>;
  }) => ResultAsync<T, Error>;
}

export const httpClient: HTTPClient = {
  post: <T>({
    body,
    responseType,
    url,
    headers,
  }: {
    url: string;
    body: any;
    responseType: Type<T>;
    headers?: Record<string, string>;
  }) => {
    return ResultAsync.fromPromise(
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(body),
        credentials: "include",
      }),
      (error) => error as Error
    )
      .andThen((response) =>
        ResultAsync.fromPromise(response.json(), (error) => error as Error)
      )
      .andThen((json) => validateType(responseType, json));
  },
  get: <T>({
    url,
    responseType,
    headers,
  }: {
    url: string;
    responseType: Type<T>;
    headers?: Record<string, string>;
  }) => {
    return ResultAsync.fromPromise(
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        credentials: "include",
      }),
      (error) => error as Error
    )
      .andThen((response) =>
        ResultAsync.fromPromise(response.json(), (error) => error as Error)
      )
      .andThen((json) => validateType(responseType, json));
  },
};
