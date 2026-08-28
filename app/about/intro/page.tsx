import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { site, nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/about")!;

export const metadata: Metadata = {
  title: "오케스트라 소개",
};

export default function AboutIntroPage() {
  return (
    <PageShell
      title="우리챔버오케스트라 소개"
      sectionHref="/about"
      subNav={section.children}
    >
      <Section title={site.name}>
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-wco-muted">
          <p>
            <strong className="text-wco-grey">{site.name}</strong>은{" "}
            {site.parentOrg}에서 운영하는 {site.programLabel}입니다. 발달장애
            예술가가 음악을 통해 사회에 참여하고, 연주자로 성장할 수 있도록
            지원합니다.
          </p>
          <p>
            우리는 동정의 대상이 아니라, 무대에 서는 연주자입니다. 음악으로
            지역사회와 소통하며, 장애와 비장애가 함께 어우러지는 문화를
            만들어갑니다.
          </p>
        </div>
      </Section>

      <Section title="소속" variant="peach">
        <p className="max-w-2xl text-wco-muted">
          {site.parentOrg} · 사회복지법인 굿피플 산하
        </p>
        <a
          href={site.parentOrgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-wco-orange underline-offset-2 hover:underline"
        >
          복지관 홈페이지 방문 →
        </a>
      </Section>
    </PageShell>
  );
}
