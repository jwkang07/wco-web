import { MemberSections } from "@/components/MemberSections";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { musicianSections } from "@/lib/content";

export default function MusiciansPage() {
  return (
    <PageShell
      title="우리단원"
      description="악기 분야별로 우리챔버오케스트라 연주자를 소개합니다."
      sectionHref="/musicians"
    >
      <Section>
        <MemberSections sections={musicianSections} />
      </Section>
    </PageShell>
  );
}
