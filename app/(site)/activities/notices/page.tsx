import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ActivityBoard } from "@/components/ActivityBoard";
import { ListPagination } from "@/components/ListPagination";
import { Section } from "@/components/Section";
import { getPublishedNotices } from "@/lib/public-content";
import {
  PUBLIC_BOARD_PAGE_SIZE,
  paginateItems,
  parsePageParam,
} from "@/lib/public-pagination";
import { nav, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.name },
  description: "우리챔버오케스트라 공지와 안내입니다.",
  alternates: { canonical: "/activities/notices" },
};

const section = nav.find((item) => item.href === "/activities")!;
const BASE = "/activities/notices";

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const sp = await searchParams;
  const all = await getPublishedNotices();
  const paged = paginateItems(
    all,
    parsePageParam(sp.page),
    PUBLIC_BOARD_PAGE_SIZE,
  );

  return (
    <PageShell
      title="공지사항"
      description="오케스트라 운영·공연 관련 안내를 확인하세요."
      sectionHref="/activities"
      subNav={section.children}
    >
      <Section title="공지사항">
        <ActivityBoard
          basePath={BASE}
          emptyMessage="등록된 공지사항이 없습니다."
          totalCount={paged.total}
          startIndex={paged.startIndex}
          items={paged.items.map((item) => ({
            id: item.id,
            title: item.title,
            dateLabel: item.dateLabel || "-",
          }))}
        />
        <ListPagination
          basePath={BASE}
          currentPage={paged.currentPage}
          totalPages={paged.totalPages}
        />
      </Section>
    </PageShell>
  );
}
