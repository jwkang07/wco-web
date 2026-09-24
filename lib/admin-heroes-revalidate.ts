import { revalidatePath } from "next/cache";
import {
  HERO_PUBLIC_PATHS,
  heroPublicPath,
  isKnownHeroSection,
} from "@/lib/admin-heroes";

/** 서버 전용 — 해당 메뉴·모든 하위 페이지 공개 캐시 무효화 */
export function revalidateHeroPublic(sectionKey: string) {
  if (!isKnownHeroSection(sectionKey)) {
    revalidatePath(heroPublicPath(sectionKey), "layout");
    return;
  }
  for (const path of HERO_PUBLIC_PATHS[sectionKey]) {
    revalidatePath(path);
  }
  if (sectionKey !== "home") {
    revalidatePath(heroPublicPath(sectionKey), "layout");
  }
}
