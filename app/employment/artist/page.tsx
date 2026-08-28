import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/employment")!;

export const metadata: Metadata = {
  title: "아티스트 접수",
};

export default function ArtistApplicationPage() {
  return (
    <PageShell
      title="아티스트 접수"
      description="프로그램 참여를 희망하는 아티스트 접수 안내입니다."
      subNav={section.children}
    >
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-wco-grey">
              접수 안내
            </h2>
            <p className="mt-4 text-base leading-relaxed text-wco-muted">
              우리챔버오케스트라 프로그램 참여를 희망하시는 분의 접수를
              받습니다. 자세한 선발 기준과 일정은 복지관 및 운영팀 안내에
              따릅니다.
            </p>
          </div>
          <InquiryForm
            title="아티스트 접수"
            description="폼 연동은 다음 단계에서 추가합니다."
            fields={[
              { label: "성명", type: "text" },
              { label: "연락처", type: "tel" },
              { label: "이메일", type: "email" },
              { label: "악기·분야", type: "text" },
              { label: "지원 동기", type: "textarea" },
            ]}
          />
        </div>
      </Section>
    </PageShell>
  );
}
