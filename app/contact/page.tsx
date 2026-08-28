import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "공연 문의",
};

export default function ContactPage() {
  return (
    <PageShell
      title="공연 문의"
      description="공연 초청, 협연, 취재 관련 문의를 남겨 주세요."
    >
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-wco-grey">
              연락 안내
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-wco-grey">운영</dt>
                <dd className="mt-1 text-wco-muted">
                  우리챔버오케스트라 운영담당자
                </dd>
              </div>
              <div>
                <dt className="font-medium text-wco-grey">소속</dt>
                <dd className="mt-1 text-wco-muted">{site.parentOrg}</dd>
              </div>
              <div>
                <dt className="font-medium text-wco-grey">복지관 문의</dt>
                <dd className="mt-1">
                  <a
                    href={site.parentOrgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wco-orange underline-offset-2 hover:underline"
                  >
                    goodwoori.or.kr
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-sm text-wco-muted">
              이메일·전화번호는 운영담당자 확인 후 업데이트 예정입니다.
            </p>
          </div>

          <InquiryForm
            title="공연 문의 양식"
            description="폼 연동은 다음 단계에서 추가합니다."
            fields={[
              { label: "이름", type: "text" },
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
