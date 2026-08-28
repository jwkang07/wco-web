import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionHub } from "@/components/SectionHub";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/employment")!;

export const metadata: Metadata = {
  title: "기업고용연계",
};

export default function EmploymentHubPage() {
  return (
    <PageShell
      title="기업고용연계"
      description="기업연계형 일자리 프로그램과 참여 안내입니다."
      sectionHref="/employment"
      subNav={section.children}
    >
      <SectionHub
        title="고용 연계"
        description="기업과 아티스트를 연결하는 프로그램입니다."
        items={section.children!}
      />
    </PageShell>
  );
}
