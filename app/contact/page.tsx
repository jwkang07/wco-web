import type { ReactNode } from "react";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

const inquiryTypes = [
  {
    number: "01",
    title: "초청 공연",
    description: "기업·기관 행사, 지역 축제와 기념식에 어울리는 공연을 제안합니다.",
    icon: <StageIcon />,
  },
  {
    number: "02",
    title: "협연·문화행사",
    description: "정기연주회 협연과 장애 인식 개선을 위한 문화행사를 함께 준비합니다.",
    icon: <MusicIcon />,
  },
  {
    number: "03",
    title: "취재·인터뷰",
    description: "오케스트라와 단원의 활동을 소개하는 취재 및 홍보 문의를 받습니다.",
    icon: <NewsIcon />,
  },
] as const;

const process = [
  ["01", "문의 접수", "행사 개요와 희망 일정을 전달합니다."],
  ["02", "내용 확인", "담당자가 일정과 공연 조건을 확인합니다."],
  ["03", "편성 제안", "행사에 적합한 규모와 프로그램을 협의합니다."],
  ["04", "공연 진행", "세부 준비와 리허설을 거쳐 무대에 오릅니다."],
] as const;

const checklist = [
  "행사명과 주최 기관",
  "희망 날짜와 공연 장소",
  "예상 관객과 행사 성격",
  "희망 공연 시간과 편성",
] as const;

export default function ContactPage() {
  return (
    <>
      <PageShell
        title="공연문의"
        description="공연 초청, 협연, 취재 관련 문의를 남겨 주세요."
        sectionHref="/contact"
      >
        <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
          <div className="container grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-20">
            <div>
              <Eyebrow>PERFORMANCE INQUIRY</Eyebrow>
              <h2 className="mt-5 text-3xl font-bold leading-[1.35] tracking-tight text-wco-grey sm:text-4xl lg:text-[2.75rem]">
                음악이 필요한 순간,
                <br />우리의 무대를 초대해 주세요.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 break-keep text-wco-muted">
                행사 목적과 공간에 맞는 연주 편성부터 프로그램 구성까지 운영담당자가 함께 이야기합니다. 아직 정해진 내용이 많지 않아도 편하게 문의해 주세요.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${site.footer.tel.replace(/-/g, "")}`} className="inline-flex items-center rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                  전화로 문의하기
                </a>
                <a href={`mailto:${site.footer.email}?subject=${encodeURIComponent("우리챔버오케스트라 공연문의")}`} className="inline-flex items-center rounded-full border border-wco-grey/20 px-6 py-3 text-sm font-bold text-wco-grey transition-colors hover:border-wco-orange hover:text-wco-orange">
                  이메일 보내기
                </a>
              </div>
            </div>

            <aside className="relative isolate overflow-hidden rounded-[2rem] border border-wco-orange/15 bg-[#fff8f4] p-8 text-wco-grey shadow-[0_18px_55px_rgba(38,38,38,0.08)] sm:p-10">
              <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full border-[44px] border-wco-orange/[0.08]" aria-hidden />
              <div className="absolute -bottom-16 -left-16 -z-10 h-48 w-48 rounded-full bg-wco-orange/[0.035]" aria-hidden />
              <p className="text-xs font-black tracking-[0.16em] text-wco-orange">DIRECT CONTACT</p>
              <h3 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">운영담당자가<br />직접 안내합니다.</h3>
              <dl className="mt-8 divide-y divide-black/[0.07] border-y border-black/[0.07]">
                <ContactRow label="전화" value={site.footer.tel} href={`tel:${site.footer.tel.replace(/-/g, "")}`} />
                <ContactRow label="이메일" value={site.footer.email} href={`mailto:${site.footer.email}`} />
                <ContactRow label="운영기관" value={site.parentOrg} />
              </dl>
              <p className="mt-6 text-xs leading-6 text-wco-muted">운영 시간과 담당자 직통 연락처는 운영 정보 확정 후 갱신할 수 있습니다.</p>
            </aside>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
          <div className="container">
            <div className="max-w-2xl">
              <Eyebrow>WHAT WE CAN DO</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-wco-grey sm:text-4xl">어떤 무대를 계획하고 계신가요?</h2>
              <p className="mt-4 leading-7 text-wco-muted">문의 목적을 알려 주시면 필요한 내용을 더 빠르게 안내할 수 있습니다.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {inquiryTypes.map((item) => (
                <article key={item.number} className="group relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-wco-orange/30 hover:shadow-[0_18px_45px_rgba(38,38,38,0.08)] sm:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <IconFrame>{item.icon}</IconFrame>
                    <span className="text-sm font-black tracking-[0.12em] text-wco-orange/35">{item.number}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-bold text-wco-grey">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 break-keep text-wco-muted">{item.description}</p>
                  <span className="mt-7 block h-0.5 w-8 bg-wco-orange transition-all duration-300 group-hover:w-14" aria-hidden />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="container grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-20">
            <div>
              <Eyebrow>BEFORE CONTACT</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold leading-snug text-wco-grey sm:text-4xl">이 네 가지만<br className="hidden lg:block" /> 알려주세요.</h2>
              <p className="mt-5 leading-8 break-keep text-wco-muted">구체적인 공연 내용은 상담 과정에서 함께 정합니다. 알고 계신 정보만 먼저 전달해도 충분합니다.</p>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-black/[0.06] bg-black/[0.06] sm:grid-cols-2">
              {checklist.map((item, index) => (
                <li key={item} className="flex min-h-36 items-start gap-4 bg-[#fffaf7] p-7 sm:p-8">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wco-orange text-xs font-black text-white">{index + 1}</span>
                  <div><p className="font-bold text-wco-grey">{item}</p><p className="mt-2 text-sm leading-6 text-wco-muted">정확하지 않아도 괜찮습니다.</p></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-black/[0.05] bg-neutral-50 py-16 text-wco-grey sm:py-20 lg:py-24">
          <div className="container">
            <div className="grid gap-10 border-b border-black/[0.08] pb-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
              <div>
                <p className="text-sm font-bold tracking-[0.14em] text-wco-orange">PROCESS</p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">문의부터 공연까지</h2>
                <p className="mt-5 leading-8 text-wco-muted">행사에 맞는 무대를 네 단계로 준비합니다.</p>
              </div>
              <ol className="grid gap-7 sm:grid-cols-2">
                {process.map(([number, title, description]) => (
                  <li key={number} className="relative rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(38,38,38,0.035)]">
                    <span className="text-xs font-black tracking-[0.14em] text-wco-orange">STEP {number}</span>
                    <h3 className="mt-2 text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 break-keep text-wco-muted">{description}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-10 pt-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
              <div>
                <p className="text-sm font-bold tracking-[0.14em] text-wco-orange">ONLINE INQUIRY</p>
                <h2 className="mt-4 text-3xl font-bold">문의 내용 남기기</h2>
                <p className="mt-5 text-sm leading-7 break-keep text-wco-muted">온라인 전송 기능은 다음 단계에서 연결합니다. 연결 전까지는 전화 또는 이메일을 이용해 주세요.</p>
              </div>
              <form className="grid gap-5 rounded-3xl border border-wco-orange/15 bg-[#fff8f4] p-7 text-wco-grey shadow-[0_16px_45px_rgba(38,38,38,0.055)] sm:grid-cols-2 sm:p-9" aria-label="공연문의 양식">
                <Field label="기관·단체명" placeholder="기관 또는 단체명을 입력해 주세요" />
                <Field label="담당자명" placeholder="성함을 입력해 주세요" />
                <Field label="연락처" placeholder="010-0000-0000" />
                <Field label="이메일" placeholder="name@example.com" />
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold">문의 내용</span>
                  <textarea rows={5} placeholder="행사 일정, 장소, 공연 목적과 문의 사항을 적어 주세요" className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange" />
                </label>
                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-wco-muted">온라인 접수 기능 연결 전까지 전화·이메일을 이용해 주세요.</p>
                  <button type="button" disabled className="rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white opacity-55">문의 보내기 · 준비 중</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-wco-orange before:h-0.5 before:w-8 before:bg-wco-orange">{children}</p>;
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-4 py-4 text-sm">
      <dt className="text-wco-muted">{label}</dt>
      <dd className="min-w-0 font-semibold break-all">{href ? <a href={href} className="transition-colors hover:text-wco-orange">{value}</a> : value}</dd>
    </div>
  );
}

function IconFrame({ children }: { children: ReactNode }) {
  return <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e9] text-wco-orange">{children}</span>;
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <input type="text" placeholder={placeholder} className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-neutral-50 px-4 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange" />
    </label>
  );
}

function StageIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M4 19V8l4-3v14M20 19V8l-4-3v14M8 9h8M8 15h8M3 19h18" /><path d="M10 12h4" /></svg>;
}

function MusicIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></svg>;
}

function NewsIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M5 5h14v14H5zM8 9h8M8 12h8M8 15h5" /></svg>;
}
