import { notFound } from "next/navigation";
import { ActivityArticleDetail } from "@/components/ActivityArticleDetail";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { getPublishedPressById } from "@/lib/public-content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export default async function PressDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPublishedPressById(id);
  if (!item) notFound();

  return (
    <PageShell
      title="보도자료"
      description={item.title}
      sectionHref="/activities"
      subNav={section.children}
    >
      <Section>
        <ActivityArticleDetail
          title={item.title}
          dateLabel={item.dateLabel || item.date || "-"}
          meta={item.source ? `출처 ${item.source}` : undefined}
          bodyHtml={item.bodyHtml}
          listHref="/activities/press"
          listLabel="목록으로"
        />
      </Section>
    </PageShell>
  );
}
