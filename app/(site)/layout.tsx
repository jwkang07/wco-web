import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/** CMS 상단비주얼·콘텐츠가 하위 메뉴마다 다른 캐시로 갈라지지 않도록 매 요청 조회 */
export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
