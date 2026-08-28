import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/employment")!;

export const metadata: Metadata = {
  title: "기업 도입 문의",
};

export default function CorporateInquiryPage() {
  return (
    <PageShell
      title="기업 도입 문의"
      description="기업연계형 일자리 도입을 희망하는 기업·기관을 위한 문의입니다."
      sectionHref="/employment"
      subNav={section.children}
    >
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-wco-grey">
              도입 안내
            </h2>
            <p className="mt-4 text-base leading-relaxed text-wco-muted">
              우리챔버오케스트라와 함께 기업연계형 일자리를 운영하고자 하는
              기업·기관의 문의를 받습니다. 프로그램 소개와 협력 방식을
              안내해 드립니다.
            </p>
          </div>
          <InquiryForm
            title="기업 도입 문의"
            description="폼 연동은 다음 단계에서 추가합니다."
            fields={[
              { label: "기업·기관명", type: "text" },
              { label: "담당자", type: "text" },
              { label: "연락처", type: "tel" },
              { label: "이메일", type: "email" },
              { label: "문의 내용", type: "textarea" },
            ]}
          />
        </div>
      </Section>
    </PageShell>
  );
}
