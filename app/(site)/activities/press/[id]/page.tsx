import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityArticleDetail } from "@/components/ActivityArticleDetail";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import {
  getPublishedPressById,
  getPublishedPressMeta,
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
  const item = await getPublishedPressMeta(id);
  if (!item) {
    return {
      title: { absolute: site.name },
      alternates: { canonical: `/activities/press/${id}` },
    };
  }
  const description =
    plainExcerpt(item.bodyHtml) ||
    (item.source ? `${item.source} 보도` : "우리챔버오케스트라 보도자료");
  const path = `/activities/press/${id}`;
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
