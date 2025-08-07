import { redirect } from "react-router";
import { computeSetCookieHeader } from "src/authentication/oauth/cookies";

export async function loader() {
  return redirect("/", {
    headers: {
      "Set-Cookie": computeSetCookieHeader("").match(
        (cookie) => cookie,
        (e) => {
          return "";
        }
      ),
    },
  });
}
