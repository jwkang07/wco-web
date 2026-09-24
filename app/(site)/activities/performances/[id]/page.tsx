import { notFound } from "next/navigation";
import { ActivityArticleDetail } from "@/components/ActivityArticleDetail";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { getPublishedPerformanceById } from "@/lib/public-content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export default async function PerformanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPublishedPerformanceById(id);
  if (!item) notFound();

  return (
    <PageShell
      title="공연 활동"
      description={item.title}
      sectionHref="/activities"
      subNav={section.children}
    >
      <Section>
        <ActivityArticleDetail
          title={item.title}
          dateLabel={item.dateLabel || item.year || "-"}
          meta={item.year ? `연도 ${item.year}` : undefined}
          bodyHtml={item.bodyHtml}
          imageSrc={item.imageSrc || undefined}
          imageProminent
          listHref="/activities/performances"
          listLabel="목록으로"
        />
      </Section>
    </PageShell>
  );
}
