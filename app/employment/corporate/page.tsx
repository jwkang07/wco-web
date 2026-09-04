import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { nav, site } from "@/lib/site";

const section = nav.find((item) => item.href === "/employment")!;
const steps = [
  ["01", "문의 접수", "기업·기관의 참여 목적과 기본 정보를 전달합니다."],
  ["02", "상담과 협의", "프로그램 취지, 고용 및 활동 방식에 대해 안내받습니다."],
  ["03", "운영안 구성", "기업과 아티스트의 상황에 맞는 협력 방식을 함께 설계합니다."],
  ["04", "연계 진행", "세부 조건을 확인한 뒤 고용 연계와 음악 활동을 시작합니다."],
] as const;

export default function CorporateInquiryPage() {
  return (
    <PageShell title="기업 도입 문의" description="기업연계형 일자리 참여를 검토하는 기업·기관을 안내합니다." sectionHref="/employment" subNav={section.children}>
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div><p className="flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-wco-orange before:h-0.5 before:w-8 before:bg-wco-orange">FOR BUSINESS</p><h2 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-wco-grey sm:text-4xl">고용으로 함께 만들고,<br />음악으로 가치를 나눕니다.</h2><p className="mt-6 text-base leading-8 break-keep text-wco-muted">우리챔버오케스트라와 기업연계형 일자리를 함께 운영하고자 하는 기업·기관에 프로그램의 취지와 협력 방식을 안내합니다. 처음 검토하는 단계부터 편하게 문의해 주세요.</p></div>
          <aside className="rounded-3xl border border-wco-orange/15 bg-[#fff7f2] p-8 sm:p-10"><p className="text-xs font-bold tracking-[0.14em] text-wco-orange">PARTNERSHIP VALUE</p><h3 className="mt-4 text-2xl font-bold text-wco-grey">기업이 함께하면</h3><ul className="mt-7 space-y-4 text-sm leading-7 text-wco-muted"><li className="flex gap-3"><Check />발달장애 예술가의 안정적인 일자리 기반을 만듭니다.</li><li className="flex gap-3"><Check />문화예술을 통한 사회적 가치 실천에 참여합니다.</li><li className="flex gap-3"><Check />공연과 연계 활동을 통해 구성원과 가치를 나눕니다.</li></ul></aside>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
        <div className="container"><div className="max-w-2xl"><p className="text-sm font-bold tracking-[0.14em] text-wco-orange">PROCESS</p><h2 className="mt-4 text-3xl font-bold text-wco-grey sm:text-4xl">도입 검토 과정</h2><p className="mt-4 leading-7 text-wco-muted">기업별 상황과 운영 여건을 확인하며 단계적으로 협의합니다.</p></div><ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([number,title,description])=><li key={number} className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm"><span className="text-sm font-black text-wco-orange">{number}</span><h3 className="mt-6 text-lg font-bold text-wco-grey">{title}</h3><p className="mt-3 text-sm leading-7 break-keep text-wco-muted">{description}</p></li>)}</ol></div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div><p className="text-sm font-bold tracking-[0.14em] text-wco-orange">BEFORE CONTACT</p><h2 className="mt-4 text-3xl font-bold text-wco-grey sm:text-4xl">문의 전에 알려주세요</h2><p className="mt-5 leading-8 break-keep text-wco-muted">정해진 내용이 많지 않아도 괜찮습니다. 아래 정보를 함께 보내주시면 보다 구체적으로 안내할 수 있습니다.</p></div>
          <div className="rounded-3xl bg-wco-grey p-8 text-white sm:p-10"><ul className="grid gap-4 text-sm leading-7 sm:grid-cols-2"><li className="rounded-xl bg-white/[0.06] p-4">기업·기관명과 담당자</li><li className="rounded-xl bg-white/[0.06] p-4">연락 가능한 전화·이메일</li><li className="rounded-xl bg-white/[0.06] p-4">도입을 검토하는 배경</li><li className="rounded-xl bg-white/[0.06] p-4">희망 일정 및 문의 사항</li></ul><div className="mt-8 border-t border-white/15 pt-7"><p className="text-sm text-white/65">기업 도입 문의</p><p className="mt-2 text-lg font-bold">{site.footer.tel} · {site.footer.email}</p><a href={`mailto:${site.footer.email}?subject=${encodeURIComponent("우리챔버오케스트라 기업 도입 문의")}`} className="mt-6 inline-flex rounded-full bg-wco-orange px-6 py-3 text-sm font-bold">이메일로 문의하기</a></div></div>
        </div>
      </section>
      <section className="border-t border-black/5 bg-[#fff7f2] py-10"><div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold text-wco-grey">사업에 대해 먼저 알아보고 싶으신가요?</p><Link href="/employment/intro" className="text-sm font-bold text-wco-orange">기업연계형 일자리 소개 보기 →</Link></div></section>
    </PageShell>
  );
}

function Check() { return <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wco-orange text-xs font-bold text-white" aria-hidden>✓</span>; }
