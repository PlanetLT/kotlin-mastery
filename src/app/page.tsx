import { loadCurriculum } from "@/infrastructure/composition/server";
import { GuideHome } from "@/presentation/guide-home";
import { toMenu } from "@/presentation/menu";

export default function HomePage() {
  const menu = toMenu(loadCurriculum());
  return <GuideHome parts={menu} />;
}
