import Link from "next/link";
import { Hero } from "@/components/Hero";
import { SubNavSlot } from "@/components/SubNav";
import { Section } from "@/components/Section";
import { site } from "@/lib/site";

const highlights = [
  {
    title: "기업연계형 일자리",
    body: "발달장애 예술가가 음악을 통해 사회에 참여하고, 연주자로 성장하는 프로그램입니다.",
    href: "/employment/intro",
  },
  {
    title: "공연 활동",
    body: "정기연주회와 초청 공연을 통해 장애 인식 개선과 문화 나눔을 이어갑니다.",
    href: "/activities/performances",
  },
  {
    title: "함께 만드는 무대",
    body: "단원 한 사람 한 사람이 전문연주자로서 무대에 서는 오케스트라입니다.",
    href: "/musicians",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero
        titleLines={site.taglineLines}
        descriptionLines={site.heroDescriptionLines}
        showCta
        imageSrc={site.hero.image}
        imageAlt={site.hero.imageAlt}
        imagePosition={site.hero.imagePosition}
        mainVisual
      />

      <SubNavSlot />

      <Section
        title="우리챔버오케스트라"
        description="무대 위에서는 연주자로서 당당히 서는 오케스트라입니다."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="min-w-0 rounded-xl border border-wco-grey/10 bg-white p-6 shadow-sm"
            >
              <h3 className="font-serif text-lg font-bold text-wco-grey">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed break-keep text-pretty text-wco-muted">
                {item.body}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-flex text-sm font-semibold text-wco-orange underline-offset-2 hover:underline"
              >
                자세히 보기 →
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="공연문의"
        description="공연 초청, 취재, 협력 문의를 환영합니다."
      >
        <Link
          href="/contact"
          className="inline-flex rounded-full bg-wco-orange px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          공연문의하기
        </Link>
      </Section>
    </>
  );
}
