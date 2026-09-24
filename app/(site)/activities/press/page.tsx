import { PageShell } from "@/components/PageShell";
import { ActivityBoard } from "@/components/ActivityBoard";
import { ListPagination } from "@/components/ListPagination";
import { Section } from "@/components/Section";
import { getPublishedPress } from "@/lib/public-content";
import {
  PUBLIC_BOARD_PAGE_SIZE,
  paginateItems,
  parsePageParam,
} from "@/lib/public-pagination";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;
const BASE = "/activities/press";

export default async function PressPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const sp = await searchParams;
  const all = await getPublishedPress();
  const paged = paginateItems(
    all,
    parsePageParam(sp.page),
    PUBLIC_BOARD_PAGE_SIZE,
  );

  return (
    <PageShell
      title="보도자료"
      description="언론 보도 및 협력 기관 소식입니다."
      sectionHref="/activities"
      subNav={section.children}
    >
      <Section title="보도자료">
        <ActivityBoard
          basePath={BASE}
          emptyMessage="등록된 보도자료가 없습니다."
          totalCount={paged.total}
          startIndex={paged.startIndex}
          metaLabel="출처"
          items={paged.items.map((item) => ({
            id: item.id,
            title: item.title,
            dateLabel: item.dateLabel || item.date || "-",
            meta: item.source || undefined,
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
