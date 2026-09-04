import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { performancePhotos, pressArticles } from "@/lib/content";
import { site, siteImages } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.name },
  description: site.description,
  alternates: { canonical: "/" },
};

const memberPreviews = [
  { title: "현악기", description: "바이올린 · 비올라 · 첼로", image: siteImages.photoMusicians },
  { title: "목관악기", description: "플루트 · 클라리넷 · 오보에", image: "/images/members/member-clarinet.png" },
  { title: "함께 만드는 합주", description: "각자의 소리가 하나의 음악이 됩니다.", image: siteImages.photoRehearsal },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero titleLines={site.taglineLines} descriptionLines={site.heroDescriptionLines} showCta imageSrc={site.hero.image} imageAlt={site.hero.imageAlt} imagePosition={site.hero.imagePosition} mainVisual />

      <section className="bg-white">
        <div className="container grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20 lg:py-24">
          <div>
            <p className="flex items-center gap-3 text-sm font-bold tracking-[0.12em] text-wco-orange before:h-0.5 before:w-7 before:bg-wco-orange">ABOUT US</p>
            <h2 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-wco-grey sm:text-4xl">한 사람 한 사람이<br />전문연주자로 서는 무대</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 break-keep text-wco-muted">우리챔버오케스트라는 발달장애 예술가가 음악을 통해 사회에 참여하고 성장할 수 있도록 함께합니다. 정기연주회와 초청 공연을 통해 관객과 만나며 장애 인식 개선과 문화 나눔을 이어갑니다.</p>
            <Link href="/about/intro" className="mt-7 inline-flex text-sm font-bold text-wco-orange underline-offset-4 hover:underline">오케스트라 소개 보기 →</Link>
          </div>
          <div className="grid gap-4 rounded-3xl bg-neutral-50 p-4 sm:grid-cols-2 sm:p-5">
            <div className="relative min-h-44 overflow-hidden rounded-2xl bg-wco-grey p-7 text-white shadow-sm">
              <span className="absolute -right-3 -top-8 text-[7rem] font-black leading-none text-white/[0.04]">23</span>
              <p className="text-xs font-bold tracking-[0.16em] text-wco-orange">BEGINNING</p>
              <strong className="mt-4 block text-4xl font-bold">{site.founded}</strong>
              <p className="mt-2 text-sm text-white/70">우리챔버오케스트라 출범</p>
            </div>
            <div className="relative min-h-44 overflow-hidden rounded-2xl border border-wco-orange/15 bg-white p-7 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wco-orange text-xl font-bold text-white" aria-hidden>♪</span>
              <strong className="mt-4 block text-xl font-bold text-wco-grey">문화일자리</strong>
              <p className="mt-2 text-sm text-wco-muted">음악을 통한 사회 참여</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-wco-orange to-[#f47a42] p-7 text-white shadow-[0_12px_30px_rgba(232,90,36,0.2)] sm:col-span-2">
              <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full border-[28px] border-white/10" aria-hidden />
              <p className="text-xs font-bold tracking-[0.16em] text-white/75">CORPORATE PARTNERSHIP</p>
              <strong className="mt-3 block text-2xl font-bold">기업연계형 일자리</strong>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/85">예술가의 지속 가능한 성장과 기업의 사회적 가치를 연결합니다.</p>
              <Link href="/employment/intro" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">자세히 보기 <span className="transition-transform group-hover:translate-x-1">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="container py-16 sm:py-20 lg:py-24">
          <SectionTitle title="최근 공연" description="우리챔버오케스트라가 관객과 만난 무대를 소개합니다." href="/activities/performances" linkLabel="전체 공연 보기" />
          <div className="grid gap-6 md:grid-cols-3">
            {performancePhotos.slice(0, 3).map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.imageSrc} alt={item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></div>
                <div className="p-6"><p className="text-xs font-bold text-wco-orange">{item.year}</p><h3 className="mt-2 text-xl font-bold text-wco-grey">{item.title}</h3><p className="mt-2 text-sm text-wco-muted">{item.caption}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <SectionTitle title="우리단원" description="악기 분야별 연주자를 소개합니다." href="/musicians" linkLabel="전체 단원 보기" />
          <div className="grid gap-6 md:grid-cols-3">
            {memberPreviews.map((item) => (
              <article key={item.title} className="group relative min-h-80 overflow-hidden rounded-2xl bg-wco-grey text-white">
                <Image src={item.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6"><h3 className="text-2xl font-bold">{item.title}</h3><p className="mt-2 text-sm text-white/80">{item.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-wco-grey text-white">
        <div className="container grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          <div><p className="text-sm font-bold tracking-[0.12em] text-wco-orange">EMPLOYMENT</p><h2 className="mt-4 text-3xl font-bold leading-snug tracking-tight sm:text-4xl">예술가의 지속 가능한 일,<br />기업과 함께 만듭니다.</h2><p className="mt-5 max-w-2xl leading-8 text-white/70">기업고용연계 제도의 취지와 참여 절차를 안내하고 상담으로 연결합니다.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/employment/intro" className="inline-flex rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white hover:opacity-90">고용 연계 소개</Link><Link href="/employment/corporate" className="inline-flex rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">기업 도입 문의</Link></div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
          <div>
            <SectionTitle title="보도자료" description="오케스트라의 소식을 전합니다." href="/activities/press" linkLabel="전체 보기" />
            <ul className="border-t-2 border-wco-grey">
              {pressArticles.map((article) => <li key={article.title} className="border-b border-black/10"><Link href="/activities/press" className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-4"><time className="text-xs text-wco-muted">{article.date}</time><strong className="text-sm leading-6 text-wco-grey sm:text-base">{article.title}</strong></Link></li>)}
            </ul>
          </div>
          <aside className="self-start rounded-3xl border border-wco-orange/15 bg-[#fff7f2] p-8 sm:p-10">
            <p className="text-xs font-bold tracking-[0.1em] text-wco-orange">PERFORMANCE INQUIRY</p><h2 className="mt-4 text-2xl font-bold leading-snug text-wco-grey sm:text-3xl">공연을 함께 만들고 싶으신가요?</h2><p className="mt-4 leading-7 break-keep text-wco-muted">공연 초청, 취재, 협력 관련 문의를 안내해 드립니다.</p><Link href="/contact" className="mt-7 inline-flex rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white hover:opacity-90">공연문의 안내</Link>
          </aside>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ title, description, href, linkLabel }: { title: string; description: string; href: string; linkLabel: string }) {
  return <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-3xl font-bold tracking-tight text-wco-grey sm:text-4xl">{title}</h2><p className="mt-3 text-wco-muted">{description}</p></div><Link href={href} className="shrink-0 text-sm font-bold text-wco-orange underline-offset-4 hover:underline">{linkLabel} →</Link></div>;
}
