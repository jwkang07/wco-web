import type { ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { SubNavSlot } from "@/components/SubNav";
import { getPageHero } from "@/lib/public-content";
import type { NavChild } from "@/lib/site";

type PageShellProps = {
  title: string;
  description?: string;
  subNav?: readonly NavChild[];
  /** 섹션 경로 — CMS 게시 상단비주얼 적용 (예: `/about`) */
  sectionHref?: string;
  heroImage?: string;
  heroImageAlt?: string;
  children: ReactNode;
};

export async function PageShell({
  title,
  description,
  subNav,
  sectionHref,
  heroImage,
  heroImageAlt,
  children,
}: PageShellProps) {
  const sectionKey = sectionHref
    ? sectionHref.replace(/^\//, "").split("/")[0] || "home"
    : undefined;
  const dbHero = sectionKey ? await getPageHero(sectionKey) : null;

  return (
    <>
      <Hero
        title={title}
        description={description ?? (dbHero?.description || undefined)}
        imageSrc={heroImage ?? dbHero?.image}
        imageAlt={heroImageAlt ?? dbHero?.alt}
      />
      <SubNavSlot items={subNav} />
      {children}
    </>
  );
}
