import { notFound } from "next/navigation";
import { ActivityArticleDetail } from "@/components/ActivityArticleDetail";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { getPublishedNoticeById } from "@/lib/public-content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPublishedNoticeById(id);
  if (!item) notFound();

  return (
    <PageShell
      title="공지사항"
      description={item.title}
      sectionHref="/activities"
      subNav={section.children}
    >
      <Section>
        <ActivityArticleDetail
          title={item.title}
          dateLabel={item.dateLabel || "-"}
          bodyHtml={item.bodyHtml}
          listHref="/activities/notices"
          listLabel="목록으로"
        />
      </Section>
    </PageShell>
  );
}
