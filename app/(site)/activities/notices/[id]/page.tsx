import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityArticleDetail } from "@/components/ActivityArticleDetail";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import {
  getPublishedNoticeById,
  getPublishedNoticeMeta,
  plainExcerpt,
} from "@/lib/public-content";
import { nav, site } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getPublishedNoticeMeta(id);
  if (!item) {
    return {
      title: { absolute: site.name },
      alternates: { canonical: `/activities/notices/${id}` },
    };
  }
  const description = plainExcerpt(item.bodyHtml) || "우리챔버오케스트라 공지사항";
  const path = `/activities/notices/${id}`;
  return {
    title: { absolute: site.name },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: item.title,
      description,
      url: path,
    },
  };
}

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
