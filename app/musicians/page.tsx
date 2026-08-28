import type { Metadata } from "next";
import { MemberSections } from "@/components/MemberSections";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { musicianSections } from "@/lib/content";

export const metadata: Metadata = {
  title: "우리단원",
};

export default function MusiciansPage() {
  return (
    <PageShell
      title="우리단원"
      description="악기 분야별로 우리챔버오케스트라 연주자를 소개합니다."
    >
      <Section>
        <MemberSections sections={musicianSections} />
      </Section>
    </PageShell>
  );
}
