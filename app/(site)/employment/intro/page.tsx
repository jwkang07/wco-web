import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { nav, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "고용 연계 소개",
  description:
    "우리챔버오케스트라 기업연계형 일자리 프로그램 소개와 협력 안내입니다.",
  alternates: { canonical: "/employment/intro" },
};

const section = nav.find((item) => item.href === "/employment")!;

const features: readonly { icon: "music" | "link" | "growth"; title: string; description: string }[] = [
  { icon: "music", title: "음악을 기반으로 한 일", description: "연습과 공연 등 음악 활동이 예술가의 지속 가능한 일로 이어집니다." },
  { icon: "link", title: "기업과 예술가의 연결", description: "기업의 고용 참여와 오케스트라의 전문적인 연주 활동을 연결합니다." },
  { icon: "growth", title: "함께 만드는 성장", description: "단원의 역량과 활동 환경을 살피며 연주자로서 꾸준히 성장하도록 지원합니다." },
] as const;

const process = [
  ["01", "기업·기관 상담", "사업 취지와 참여 목적, 협력 가능 범위를 함께 확인합니다."],
  ["02", "활동 방식 협의", "근무 및 연주 활동의 형태와 필요한 지원 사항을 조율합니다."],
  ["03", "고용 연계와 활동", "기업과 예술가를 연결하고 계획에 따라 음악 활동을 진행합니다."],
  ["04", "지속적인 소통", "운영 과정과 활동 현황을 공유하며 안정적인 참여를 지원합니다."],
] as const;

export default function EmploymentIntroPage() {
  return (
    <PageShell title="기업연계형 일자리" description="예술가의 지속 가능한 일과 기업의 사회적 가치를 음악으로 연결합니다." sectionHref="/employment" subNav={section.children}>
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <p className="flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-wco-orange before:h-0.5 before:w-8 before:bg-wco-orange">EMPLOYMENT PROGRAM</p>
            <h2 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-wco-grey sm:text-4xl">음악 활동이<br />지속 가능한 일이 되도록</h2>
            <p className="mt-6 text-base leading-8 break-keep text-wco-muted">우리챔버오케스트라는 {site.parentOrg}의 문화일자리와 기업연계형 일자리로 운영됩니다. 발달장애 예술가가 음악을 통해 사회에 참여하고, 전문연주자로 성장할 수 있는 안정적인 활동 기반을 함께 만들어갑니다.</p>
            <p className="mt-4 text-base leading-8 break-keep text-wco-muted">기업은 예술가의 고용과 활동을 지원하며 사회적 가치를 실천하고, 단원은 연습과 공연을 통해 자신의 전문성과 가능성을 펼칩니다.</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-wco-grey p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:p-10">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-[38px] border-wco-orange/15" aria-hidden />
            <p className="text-xs font-bold tracking-[0.16em] text-wco-orange">TOGETHER WITH BUSINESS</p>
            <h3 className="relative mt-5 text-2xl font-bold leading-snug sm:text-3xl">예술가에게는 일의 기회를,<br />기업에는 함께하는 가치를</h3>
            <dl className="relative mt-9 grid gap-5 border-t border-white/15 pt-7 sm:grid-cols-2">
              <div><dt className="text-sm font-bold text-white">예술가</dt><dd className="mt-2 text-sm leading-6 text-white/65">연주 경험과 안정적인 활동 기반</dd></div>
              <div><dt className="text-sm font-bold text-white">기업·기관</dt><dd className="mt-2 text-sm leading-6 text-white/65">고용을 통한 사회적 가치 실현</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <div className="max-w-2xl"><p className="text-sm font-bold tracking-[0.14em] text-wco-orange">PROGRAM FEATURES</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-wco-grey sm:text-4xl">프로그램 특징</h2><p className="mt-4 leading-7 text-wco-muted">오케스트라의 음악 활동과 기업의 고용 참여가 서로의 성장을 만듭니다.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => <article key={feature.title} className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition-transform hover:-translate-y-1 sm:p-8"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e8] text-wco-orange"><FeatureIcon type={feature.icon} /></span><h3 className="mt-7 text-xl font-bold text-wco-grey">{feature.title}</h3><p className="mt-3 text-sm leading-7 break-keep text-wco-muted">{feature.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <div className="max-w-2xl"><p className="text-sm font-bold tracking-[0.14em] text-wco-orange">HOW IT WORKS</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-wco-grey sm:text-4xl">함께하는 과정</h2><p className="mt-4 leading-7 text-wco-muted">각 기업과 단원의 상황에 맞춰 충분히 협의하며 진행합니다.</p></div>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-4">
            {process.map(([number, title, description]) => <li key={number} className="bg-white p-7 sm:p-8"><span className="text-sm font-black tracking-wider text-wco-orange">{number}</span><h3 className="mt-6 text-lg font-bold text-wco-grey">{title}</h3><p className="mt-3 text-sm leading-7 break-keep text-wco-muted">{description}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="bg-wco-grey py-14 text-white sm:py-16">
        <div className="container flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-bold text-wco-orange">JOIN THE PROGRAM</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">기업과 아티스트의 참여를 기다립니다.</h2></div><div className="flex flex-wrap gap-3"><Link href="/employment/corporate" className="rounded-full bg-wco-orange px-6 py-3 text-sm font-bold">기업 도입 문의</Link><Link href="/employment/artist" className="rounded-full border border-white/50 px-6 py-3 text-sm font-bold hover:bg-white/10">아티스트 접수 안내</Link></div></div>
      </section>
    </PageShell>
  );
}

function FeatureIcon({ type }: { type: "music" | "link" | "growth" }): ReactNode {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (type === "music") return <svg {...common}><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>;
  if (type === "link") return <svg {...common}><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>;
  return <svg {...common}><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="m3 7 6-4 6 5 6-5"/></svg>;
}
