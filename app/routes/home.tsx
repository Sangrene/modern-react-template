import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import i18next from "~/i18n/i18n.server";

export async function loader({ request }: Route.LoaderArgs) {
  let t = await i18next.getFixedT(request, "common", {});

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export function meta({data}: Route.MetaArgs) {
  return [
    { title: data?.title },
    { name: "description", content: data?.description },
  ];
}

export default function Home() {
  return <Welcome />;
}
