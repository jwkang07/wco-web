import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { musicianSections, performancePhotos, pressArticles } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.name },
  description: site.description,
  alternates: { canonical: "/" },
};

const memberVisuals = [
  { artwork: <StringsArtwork />, background: "linear-gradient(145deg, #f5eee8 0%, #e8d8cc 100%)", dark: false },
  { artwork: <WoodwindArtwork />, background: "linear-gradient(145deg, #47433f 0%, #2f2d2b 100%)", dark: true },
  { artwork: <BrassArtwork />, background: "linear-gradient(145deg, #f4e9df 0%, #ead2c0 100%)", dark: false },
  { artwork: <PercussionArtwork />, background: "linear-gradient(145deg, #403d3a 0%, #292827 100%)", dark: true },
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
          <SectionTitle title="우리단원" description="각자의 소리가 모여 하나의 음악이 됩니다." href="/musicians" linkLabel="전체 단원 보기" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {musicianSections.map((section, index) => (
              <Link
                key={section.name}
                href={`/musicians#${section.name}`}
                className={`group relative h-56 overflow-hidden rounded-2xl outline-none ring-wco-orange ring-offset-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(38,38,38,0.14)] focus-visible:ring-2 sm:h-72 ${memberVisuals[index].dark ? "text-white" : "text-wco-grey"}`}
                aria-label={`${section.name} 단원 보기`}
                style={{ background: memberVisuals[index].background }}
              >
                <span className="absolute right-5 top-5 z-10 text-xs font-black tracking-[0.14em] text-wco-orange">0{index + 1}</span>
                <span className="absolute -right-12 -top-14 h-40 w-40 rounded-full border-[26px] border-wco-orange/[0.08] transition-transform duration-500 group-hover:scale-110" aria-hidden />
                <div className={`absolute inset-0 transition-transform duration-500 group-hover:scale-[1.025] ${memberVisuals[index].dark ? "text-[#dbc8bb]" : "text-[#514a45]"}`} role="img" aria-label={`${section.name}를 상징하는 악기 선화`}>
                  {memberVisuals[index].artwork}
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${memberVisuals[index].dark ? "from-black/55 via-black/5 to-transparent" : "from-white/72 via-white/5 to-transparent"}`} />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <h3 className="text-xl font-bold sm:text-2xl">{section.name}</h3>
                  <p className={`mt-1.5 text-xs leading-5 break-keep sm:mt-2 sm:text-sm ${memberVisuals[index].dark ? "text-white/75" : "text-wco-grey/70"}`}>{section.description}</p>
                </div>
              </Link>
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

function StringsArtwork() {
  return (
    <svg viewBox="0 0 320 320" className="absolute -right-5 -top-3 h-[90%] w-[92%]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M189 7c-8 51-13 91-7 120 5 25 19 34 43 42 24 8 42 25 45 51 5 42-30 81-76 85-47 4-89-24-94-66-4-29 11-48 32-61 22-13 32-27 32-52 0-27-5-69-2-119" strokeWidth="5" />
      <path d="M176 8l19 296M190 8l18 292" strokeWidth="1.7" opacity=".65" />
      <path d="M140 188c-18 8-24 29-11 44 7 8 17 9 25 4-14-3-19-14-13-24 4-7 10-10 18-9M226 177c18 6 27 25 17 41-5 9-15 12-24 8 13-5 16-17 9-26-5-6-12-8-19-6" strokeWidth="4" />
      <path d="M116 256c43 13 88 10 132-9" stroke="#e85a24" strokeWidth="7" opacity=".9" />
    </svg>
  );
}

function WoodwindArtwork() {
  return (
    <svg viewBox="0 0 320 320" className="absolute -right-5 top-1 h-[88%] w-[96%]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M49 273L262 60" strokeWidth="13" />
      <path d="M38 283l25-25M251 71l29-29M66 254L246 74" stroke="#e85a24" strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map((item) => <circle key={item} cx={91 + item * 27} cy={231 - item * 27} r="9" strokeWidth="4" />)}
      <path d="M82 215l-29-7M109 188l-31-9M136 161l-28-12M164 133l-28-11M191 106l-25-14" strokeWidth="3" />
      <circle cx="54" cy="277" r="18" strokeWidth="5" />
    </svg>
  );
}

function BrassArtwork() {
  return (
    <svg viewBox="0 0 320 320" className="absolute -right-10 -top-3 h-[94%] w-[105%]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M31 204h142c36 0 63-14 87-43l34-42v122l-34-42c-24-29-51-43-87-43H64" strokeWidth="6" />
      <path d="M43 156v48M76 147v66M110 147v66M144 147v66" strokeWidth="5" />
      <path d="M69 147v-27h20v27M103 147v-27h20v27M137 147v-27h20v27" strokeWidth="4" />
      <path d="M30 180h132c47 0 75 23 103 61" stroke="#e85a24" strokeWidth="5" />
      <path d="M288 119c-22 26-22 96 0 122" strokeWidth="3" opacity=".7" />
    </svg>
  );
}

function PercussionArtwork() {
  return (
    <svg viewBox="0 0 320 320" className="absolute -right-3 top-0 h-[92%] w-[98%]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M56 150h218M69 150c4 79 35 126 96 126s92-47 96-126" strokeWidth="6" />
      <ellipse cx="165" cy="150" rx="109" ry="25" strokeWidth="6" />
      <path d="M91 168l14 84M239 168l-14 84M165 176v100" strokeWidth="3" opacity=".65" />
      <path d="M73 35l129 138M250 32L124 171" strokeWidth="6" />
      <circle cx="62" cy="24" r="20" fill="currentColor" stroke="none" />
      <circle cx="260" cy="22" r="20" fill="#e85a24" stroke="none" />
      <path d="M116 279h98" stroke="#e85a24" strokeWidth="7" />
    </svg>
  );
}
