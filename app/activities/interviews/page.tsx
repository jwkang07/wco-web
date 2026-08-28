import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export const metadata: Metadata = {
  title: "인터뷰",
};

export default function InterviewsPage() {
  return (
    <PageShell title="인터뷰" sectionHref="/activities" subNav={section.children}>
      <Section title="부모·단원 인터뷰">
        <div className="max-w-2xl space-y-4 text-base text-wco-muted">
          <p>
            부모님과 단원의 이야기를 담은 인터뷰 콘텐츠를 준비하고 있습니다.
          </p>
          <p className="rounded-xl border border-wco-grey/10 bg-neutral-50 px-5 py-4 text-sm">
            콘텐츠 기획 및 동의 절차 확인 후 순차적으로 게시 예정입니다.
          </p>
        </div>
      </Section>
    </PageShell>
  );
}
