import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SectionHub } from "@/components/SectionHub";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/about")!;

export const metadata: Metadata = {
  title: "우리챔버오케스트라",
};

export default function AboutHubPage() {
  return (
    <PageShell
      title="우리챔버오케스트라"
      description="관장·단장 인삿말과 오케스트라를 소개합니다."
      sectionHref="/about"
      subNav={section.children}
    >
      <SectionHub
        title="소개"
        description="우리챔버오케스트라의 이야기를 나눕니다."
        items={section.children!}
      />
    </PageShell>
  );
}
