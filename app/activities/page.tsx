import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionHub } from "@/components/SectionHub";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export const metadata: Metadata = {
  title: "우리활동",
};

export default function ActivitiesHubPage() {
  return (
    <PageShell
      title="우리활동"
      description="히스토리, 공연 활동, 보도자료를 확인하실 수 있습니다."
      sectionHref="/activities"
      subNav={section.children}
    >
      <SectionHub
        title="활동"
        description="우리챔버오케스트라의 발자취와 기록입니다."
        items={section.children!}
      />
    </PageShell>
  );
}
