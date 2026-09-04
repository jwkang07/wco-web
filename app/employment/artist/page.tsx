import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { nav, site } from "@/lib/site";

const section = nav.find((item) => item.href === "/employment")!;

export default function ArtistApplicationPage() {
  return (
    <PageShell title="아티스트 접수" description="우리챔버오케스트라와 함께할 연주자를 위한 접수 안내입니다." sectionHref="/employment" subNav={section.children}>
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div><p className="flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-wco-orange before:h-0.5 before:w-8 before:bg-wco-orange">FOR ARTISTS</p><h2 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-wco-grey sm:text-4xl">당신의 음악이<br />새로운 무대를 만납니다.</h2><p className="mt-6 text-base leading-8 break-keep text-wco-muted">우리챔버오케스트라는 음악 활동을 이어가며 전문연주자로 성장하고 싶은 아티스트의 참여를 기다립니다. 모집 여부와 접수 일정, 세부 기준은 운영 상황에 따라 안내합니다.</p></div>
          <aside className="relative overflow-hidden rounded-3xl bg-wco-grey p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:p-10"><div className="absolute -right-14 -top-14 h-48 w-48 rounded-full border-[34px] border-wco-orange/15" aria-hidden/><p className="relative text-xs font-bold tracking-[0.14em] text-wco-orange">APPLICATION NOTICE</p><h3 className="relative mt-4 text-2xl font-bold">접수 전 확인해 주세요</h3><ul className="relative mt-7 space-y-4 text-sm leading-7 text-white/75"><li>• 현재 모집 여부와 접수 기간</li><li>• 참여 대상과 연주 분야</li><li>• 오디션 또는 상담 진행 여부</li><li>• 제출 자료와 개인정보 처리 안내</li></ul></aside>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
        <div className="container"><div className="max-w-2xl"><p className="text-sm font-bold tracking-[0.14em] text-wco-orange">APPLICATION GUIDE</p><h2 className="mt-4 text-3xl font-bold text-wco-grey sm:text-4xl">접수는 이렇게 진행됩니다</h2><p className="mt-4 leading-7 text-wco-muted">정식 모집이 시작되면 상세 일정과 기준을 이 페이지에서 안내합니다.</p></div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            <li className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e8] font-black text-wco-orange">01</span><h3 className="mt-6 text-xl font-bold text-wco-grey">모집 공고 확인</h3><p className="mt-3 text-sm leading-7 break-keep text-wco-muted">모집 기간, 대상, 연주 분야와 필요한 자료를 확인합니다.</p></li>
            <li className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e8] font-black text-wco-orange">02</span><h3 className="mt-6 text-xl font-bold text-wco-grey">접수 및 상담</h3><p className="mt-3 text-sm leading-7 break-keep text-wco-muted">안내된 방법으로 기본 정보를 전달하고 운영팀과 상담합니다.</p></li>
            <li className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e8] font-black text-wco-orange">03</span><h3 className="mt-6 text-xl font-bold text-wco-grey">선발 절차 안내</h3><p className="mt-3 text-sm leading-7 break-keep text-wco-muted">해당 모집의 기준에 따라 이후 일정과 참여 절차를 안내받습니다.</p></li>
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="rounded-3xl border border-wco-orange/15 bg-[#fff7f2] p-8 sm:p-10"><p className="text-sm font-bold tracking-[0.14em] text-wco-orange">PREPARE</p><h2 className="mt-4 text-2xl font-bold text-wco-grey sm:text-3xl">미리 준비하면 좋은 정보</h2><ul className="mt-7 space-y-4 text-sm leading-7 text-wco-muted"><li className="border-b border-wco-orange/10 pb-4"><strong className="text-wco-grey">기본 정보</strong><br/>성명, 연락처, 거주 지역</li><li className="border-b border-wco-orange/10 pb-4"><strong className="text-wco-grey">연주 정보</strong><br/>악기·분야, 연주 경력</li><li><strong className="text-wco-grey">참여 이야기</strong><br/>지원 동기와 희망하는 활동</li></ul></div>
          <div className="flex flex-col justify-center"><p className="text-sm font-bold tracking-[0.14em] text-wco-orange">CONTACT</p><h2 className="mt-4 text-3xl font-bold leading-snug text-wco-grey sm:text-4xl">현재 모집 여부를<br/>운영팀에 문의해 주세요.</h2><p className="mt-5 leading-8 break-keep text-wco-muted">온라인 접수 기능은 모집 기준과 개인정보 처리 절차가 확정된 후 제공합니다. 현재는 전화 또는 이메일로 안내받을 수 있습니다.</p><div className="mt-7 flex flex-wrap gap-3"><a href={`mailto:${site.footer.email}?subject=${encodeURIComponent("우리챔버오케스트라 아티스트 접수 문의")}`} className="rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white">이메일 문의</a><a href={`tel:${site.footer.tel.replaceAll("-", "")}`} className="rounded-full border border-wco-grey/20 px-6 py-3 text-sm font-bold text-wco-grey">{site.footer.tel}</a></div></div>
        </div>
      </section>
      <section className="border-t border-black/5 bg-neutral-50 py-10"><div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold text-wco-grey">프로그램의 운영 방식이 궁금하신가요?</p><Link href="/employment/intro" className="text-sm font-bold text-wco-orange">기업연계형 일자리 소개 보기 →</Link></div></section>
    </PageShell>
  );
}
