import { HomeClient } from "@/components/home/HomeClient";
import { getHomeContent } from "@/lib/cms";

export const revalidate = 60;

export default async function Home() {
  const home = await getHomeContent();
  return <HomeClient home={home} />;
}
