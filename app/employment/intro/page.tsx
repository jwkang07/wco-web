import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { site, nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/employment")!;

export const metadata: Metadata = {
  title: "고용 연계 소개",
};

export default function EmploymentIntroPage() {
  return (
    <PageShell title="고용 연계 소개" sectionHref="/employment" subNav={section.children}>
      <Section title="기업연계형 일자리">
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-wco-muted">
          <p>
            {site.name}은 {site.parentOrg}의 {site.programLabel}로
            운영됩니다. 발달장애 예술가가 음악 활동을 통해 일자리를
            수행하며, 연주자로 성장할 수 있는 환경을 제공합니다.
          </p>
          <p>
            기업과의 연계를 통해 아티스트는 안정적인 활동 기반을 갖추고,
            기업은 장애 인식 개선과 사회적 가치 실현에 함께할 수 있습니다.
          </p>
        </div>
      </Section>

      <Section title="프로그램 특징" variant="peach">
        <ul className="grid gap-4 sm:grid-cols-3">
          {[
            "음악 기반 일자리 및 연주 활동",
            "기업·기관 연계 협력",
            "연주자로서의 성장 지원",
          ].map((item) => (
            <li
              key={item}
              className="rounded-xl bg-white p-5 text-sm font-medium text-wco-grey"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
