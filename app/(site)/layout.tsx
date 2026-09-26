import { site } from "@/lib/site";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { Metadata } from "next";

/** CMS 상단비주얼·콘텐츠 즉시 반영 — Zero-regression: force-dynamic 유지 */
export const dynamic = "force-dynamic";

/** 공개 페이지 브라우저 탭 제목 고정 (OG title은 각 페이지에서 별도 설정) */
export const metadata: Metadata = {
  title: {
    absolute: site.name,
  },
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-wco-grey focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-wco-orange"
      >
        본문 바로가기
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
