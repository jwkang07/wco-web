import { PageShell } from "@/components/PageShell";
import { PressList } from "@/components/PressList";
import { Section } from "@/components/Section";
import { pressArticles } from "@/lib/content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export default function PressPage() {
  return (
    <PageShell
      title="보도자료"
      description="언론 보도 및 협력 기관 소식입니다."
      sectionHref="/activities"
      subNav={section.children}
    >
      <Section title="보도자료">
        <PressList items={pressArticles} />
        <p className="mt-6 text-sm text-wco-muted">
          기사 링크와 상세 내용은 준비되는 대로 연결됩니다.
        </p>
      </Section>
    </PageShell>
  );
}
