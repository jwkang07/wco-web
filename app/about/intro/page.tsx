import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { nav, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "오케스트라 소개",
  description:
    "우리챔버오케스트라는 은평구립우리장애인복지관 기업연계형 일자리로, 발달장애 연주자가 협연으로 성장하는 오케스트라입니다.",
  alternates: { canonical: "/about/intro" },
};

const section = nav.find((item) => item.href === "/about")!;
const values = [
  {
    number: "01",
    title: "전문연주자로 성장",
    description: "지속적인 연습과 공연 경험을 통해 한 사람의 연주자로 성장합니다.",
  },
  {
    number: "02",
    title: "일자리로 연결",
    description: "문화일자리와 기업연계형 일자리로 지속 가능한 예술 활동을 이어갑니다.",
  },
  {
    number: "03",
    title: "사회와 소통",
    description: "관객과 음악으로 만나며 장애 인식 개선과 문화 나눔을 실천합니다.",
  },
] as const;

export default function AboutIntroPage() {
  return (
    <PageShell
      title="오케스트라 소개"
      description="발달장애 연주자가 협연으로 성장하는 우리챔버오케스트라입니다."
      sectionHref="/about"
      subNav={section.children}
    >
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <Image
              src="/images/hero/hero-main.png"
              alt="우리챔버오케스트라 연주회 무대 전경"
              width={1200}
              height={750}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-20 text-white">
              <p className="text-sm font-semibold">우리챔버오케스트라 공연 현장</p>
              <p className="mt-1 text-xs text-white/70">Woori Chamber Orchestra</p>
            </div>
          </div>

          <div>
            <p className="flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-wco-orange before:h-0.5 before:w-8 before:bg-wco-orange">
              ABOUT WCO
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-wco-grey sm:text-4xl">
              음악으로 가능성을 연결하고,
              <br className="hidden sm:block" /> 전문연주자로 성장합니다.
            </h2>
            <p className="mt-6 text-base leading-8 break-keep text-wco-muted">
              우리챔버오케스트라는 2023년 은평구립우리장애인복지관의
              문화일자리와 기업연계형 일자리 프로그램으로 출발했습니다.
              발달장애 연주자가 음악을 통해 사회에 참여하고, 무대 위에서 자신의
              가능성을 펼칠 수 있도록 연주 활동과 성장의 기회를 만들어갑니다.
            </p>
            <p className="mt-4 text-base leading-8 break-keep text-wco-muted">
              단원들은 관객에게 감동을 전하는 예술가로서 공연하고, 기업과
              지역사회는 지속 가능한 문화예술 일자리를 함께 만들어갑니다.
            </p>
            <blockquote className="mt-7 border-l-4 border-wco-orange bg-[#fff7f2] px-5 py-4 text-base font-semibold leading-7 text-wco-grey">
              “한 사람 한 사람이 전문연주자로 서는 무대”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-[0.14em] text-wco-orange">OUR VALUES</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-wco-grey sm:text-4xl">우리가 음악으로 만드는 변화</h2>
            <p className="mt-4 leading-7 text-wco-muted">연주자의 성장에서 일자리와 지역사회의 변화까지 연결합니다.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.number} className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm sm:p-8">
                <span className="text-sm font-black tracking-wider text-wco-orange">{value.number}</span>
                <h3 className="mt-7 text-xl font-bold text-wco-grey">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 break-keep text-wco-muted">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-sm font-bold tracking-[0.14em] text-wco-orange">OPERATED BY</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-wco-grey sm:text-4xl">함께 운영하고 연결합니다</h2>
            <p className="mt-5 leading-8 break-keep text-wco-muted">우리챔버오케스트라는 은평구립우리장애인복지관이 운영하며, 사회복지법인 굿피플과 함께 발달장애 예술가의 안정적인 연주 활동과 일자리를 지원합니다.</p>
          </div>
          <div className="rounded-3xl border border-wco-orange/15 bg-[#fff7f2] p-7 sm:p-9">
            <dl className="grid gap-5 text-sm sm:grid-cols-[8rem_1fr] sm:items-center">
              <dt className="font-bold text-wco-grey">운영 기관</dt><dd className="text-wco-muted">{site.parentOrg}</dd>
              <dt className="font-bold text-wco-grey">운영 법인</dt><dd className="text-wco-muted">사회복지법인 굿피플</dd>
              <dt className="font-bold text-wco-grey">사업 형태</dt><dd className="text-wco-muted">문화일자리 · 기업연계형 일자리</dd>
            </dl>
            <a href={site.parentOrgUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white hover:opacity-90">복지관 홈페이지 방문하기 →</a>
          </div>
        </div>
      </section>

      <section className="bg-wco-grey py-14 text-white sm:py-16">
        <div className="container flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-sm font-bold text-wco-orange">NEXT STORY</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">우리의 연주와 단원을 더 만나보세요.</h2></div>
          <div className="flex flex-wrap gap-3"><Link href="/activities/performances" className="rounded-full bg-wco-orange px-6 py-3 text-sm font-bold">공연 활동 보기</Link><Link href="/musicians" className="rounded-full border border-white/50 px-6 py-3 text-sm font-bold hover:bg-white/10">우리단원 만나보기</Link></div>
        </div>
      </section>
    </PageShell>
  );
}
