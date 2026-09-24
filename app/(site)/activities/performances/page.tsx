import { PageShell } from "@/components/PageShell";
import { PhotoGrid } from "@/components/PhotoGrid";
import { ListPagination } from "@/components/ListPagination";
import { Section } from "@/components/Section";
import { getPublishedPerformances } from "@/lib/public-content";
import {
  PUBLIC_PHOTO_PAGE_SIZE,
  paginateItems,
  parsePageParam,
} from "@/lib/public-pagination";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;
const BASE = "/activities/performances";

export default async function ActivitiesPerformancesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const sp = await searchParams;
  const all = await getPublishedPerformances();
  const paged = paginateItems(
    all,
    parsePageParam(sp.page),
    PUBLIC_PHOTO_PAGE_SIZE,
  );

  return (
    <PageShell
      title="공연 활동"
      description="정기연주회와 초청 공연 등 연주 활동을 사진으로 소개합니다."
      sectionHref="/activities"
      subNav={section.children}
    >
      <Section
        title="공연 활동"
        description="공연 사진은 순차적으로 업데이트됩니다."
      >
        <PhotoGrid
          items={paged.items.map((item) => ({
            id: item.id,
            title: item.title,
            caption: item.caption,
            year: item.year,
            imageSrc: item.imageSrc,
            href: item.id.startsWith("fallback-")
              ? undefined
              : `${BASE}/${item.id}`,
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
