import { PageShell } from "@/components/PageShell";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Section } from "@/components/Section";
import { getPublishedPerformances } from "@/lib/public-content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export default async function ActivitiesPerformancesPage() {
  const performancePhotos = await getPublishedPerformances();

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
        <PhotoGrid items={performancePhotos} />
      </Section>
    </PageShell>
  );
}
