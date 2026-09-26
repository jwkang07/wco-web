import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityArticleDetail } from "@/components/ActivityArticleDetail";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import {
  getPublishedPerformanceById,
  getPublishedPerformanceMeta,
  plainExcerpt,
} from "@/lib/public-content";
import { absoluteUrl } from "@/lib/seo";
import { nav, site } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getPublishedPerformanceMeta(id);
  if (!item) {
    return {
      title: { absolute: site.name },
      alternates: { canonical: `/activities/performances/${id}` },
    };
  }
  const description =
    plainExcerpt(item.caption || item.bodyHtml) ||
    "우리챔버오케스트라 공연 활동";
  const path = `/activities/performances/${id}`;
  return {
    title: { absolute: site.name },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: item.title,
      description,
      url: path,
      ...(item.imageSrc
        ? { images: [{ url: absoluteUrl(item.imageSrc) }] }
        : {}),
    },
  };
}

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
          imageAlt={item.title}
          imageProminent
          listHref="/activities/performances"
          listLabel="목록으로"
        />
      </Section>
    </PageShell>
  );
}
