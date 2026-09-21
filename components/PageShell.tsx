import type { ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { SubNavSlot } from "@/components/SubNav";
import { getPageHero } from "@/lib/public-content";
import type { NavChild } from "@/lib/site";
import { resolvePageHero } from "@/lib/page-hero";

type PageShellProps = {
  title: string;
  description?: string;
  subNav?: readonly NavChild[];
  /** 섹션 경로 — 히어로 이미지 자동 적용 (예: `/about`) */
  sectionHref?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImagePosition?: string;
  children: ReactNode;
};

export async function PageShell({
  title,
  description,
  subNav,
  sectionHref,
  heroImage,
  heroImageAlt,
  heroImagePosition,
  children,
}: PageShellProps) {
  const sectionKey = sectionHref
    ? sectionHref.replace(/^\//, "").split("/")[0] || "home"
    : undefined;
  const dbHero = sectionKey ? await getPageHero(sectionKey) : null;
  const resolved = sectionHref ? resolvePageHero(sectionHref) : undefined;

  return (
    <>
      <Hero
        title={title}
        description={description ?? (dbHero?.description || undefined)}
        imageSrc={heroImage ?? dbHero?.image ?? resolved?.image}
        imageAlt={heroImageAlt ?? dbHero?.alt ?? resolved?.alt}
        imagePosition={heroImagePosition ?? dbHero?.position ?? resolved?.position}
      />
      <SubNavSlot items={subNav} />
      {children}
    </>
  );
}
