import { adminPath } from "@/lib/admin-path";
import { revalidatePath } from "next/cache";

/** 상단비주얼 — 메뉴(섹션) 키와 표시명 */

export const HERO_SECTIONS = [
  { key: "home", label: "홈" },
  { key: "about", label: "오케스트라 소개" },
  { key: "activities", label: "우리활동" },
  { key: "musicians", label: "우리단원" },
  { key: "employment", label: "기업고용연계" },
  { key: "contact", label: "공연문의" },
] as const;

export type HeroSectionKey = (typeof HERO_SECTIONS)[number]["key"];

/** 섹션별 공개 하위 경로 — 히어로 변경 시 함께 revalidate */
const HERO_PUBLIC_PATHS: Record<HeroSectionKey, readonly string[]> = {
  home: ["/"],
  about: [
    "/about",
    "/about/director-greeting",
    "/about/conductor-greeting",
    "/about/intro",
  ],
  activities: [
    "/activities",
    "/activities/history",
    "/activities/performances",
    "/activities/press",
  ],
  musicians: ["/musicians"],
  employment: [
    "/employment",
    "/employment/intro",
    "/employment/corporate",
    "/employment/artist",
  ],
  contact: ["/contact"],
};

const LABEL_BY_KEY = Object.fromEntries(
  HERO_SECTIONS.map((s) => [s.key, s.label]),
) as Record<string, string>;

export function heroSectionLabel(sectionKey: string): string {
  return LABEL_BY_KEY[sectionKey] ?? sectionKey;
}

export function isKnownHeroSection(sectionKey: string): sectionKey is HeroSectionKey {
  return sectionKey in LABEL_BY_KEY;
}

/** 공개 사이트 경로 revalidate용 (섹션 루트) */
export function heroPublicPath(sectionKey: string): string {
  if (sectionKey === "home") return "/";
  return `/${sectionKey}`;
}

/** 해당 메뉴·모든 하위 페이지 공개 캐시 무효화 */
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

export function heroAdminListPath(sectionKey: string): string {
  return adminPath(`/heroes/${sectionKey}`);
}

export function heroAdminEditPath(sectionKey: string, id: string): string {
  return adminPath(`/heroes/${sectionKey}/${id}`);
}
