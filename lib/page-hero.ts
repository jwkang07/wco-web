import { siteImages } from "@/lib/site";

export type PageHeroConfig = {
  image: string;
  alt: string;
  position?: string;
};

/** 섹션별 기본 히어로 이미지 */
export const pageHeroBySection: Record<string, PageHeroConfig> = {
  "/about": {
    image: siteImages.heroAbout,
    alt: "우리챔버오케스트라 정기연주회 무대 전경",
    position: "center 42%",
  },
  "/activities": {
    image: siteImages.photoRehearsal,
    alt: "우리챔버오케스트라 연습 장면",
    position: "center",
  },
  "/musicians": {
    image: siteImages.photoMusicians,
    alt: "우리챔버오케스트라 단원 연주 장면",
    position: "center 40%",
  },
  "/employment": {
    image: siteImages.photoRehearsal,
    alt: "우리챔버오케스트라 연습 및 협연 장면",
    position: "center",
  },
  "/contact": {
    image: siteImages.photoConcert,
    alt: "우리챔버오케스트라 공연 무대",
    position: "center 35%",
  },
};

/** 하위 페이지별 히어로 이미지 (섹션 기본값 대체) */
export const pageHeroOverrides: Record<string, PageHeroConfig> = {
  "/activities/performances": {
    image: siteImages.photoConcert,
    alt: "우리챔버오케스트라 공연 무대",
    position: "center 35%",
  },
  "/activities/history": {
    image: siteImages.heroMain,
    alt: "우리챔버오케스트라 정기연주회 무대 전경",
    position: "center 42%",
  },
  "/activities/press": {
    image: siteImages.photoConcert,
    alt: "우리챔버오케스트라 공연 무대",
    position: "center 35%",
  },
};

export function resolvePageHero(pathname: string): PageHeroConfig | undefined {
  if (pageHeroOverrides[pathname]) {
    return pageHeroOverrides[pathname];
  }

  const section = Object.keys(pageHeroBySection).find(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );

  return section ? pageHeroBySection[section] : undefined;
}
