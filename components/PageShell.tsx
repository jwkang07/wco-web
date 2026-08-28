import type { ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { SubNavSlot } from "@/components/SubNav";
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

export function PageShell({
  title,
  description,
  subNav,
  sectionHref,
  heroImage,
  heroImageAlt,
  heroImagePosition,
  children,
}: PageShellProps) {
  const resolved = sectionHref ? resolvePageHero(sectionHref) : undefined;

  return (
    <>
      <Hero
        title={title}
        description={description}
        imageSrc={heroImage ?? resolved?.image}
        imageAlt={heroImageAlt ?? resolved?.alt}
        imagePosition={heroImagePosition ?? resolved?.position}
      />
      <SubNavSlot items={subNav} />
      {children}
    </>
  );
}
