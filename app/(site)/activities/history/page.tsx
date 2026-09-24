import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getPublishedHistories } from "@/lib/public-content";
import { nav } from "@/lib/site";

export const metadata: Metadata = {
  title: "히스토리",
  description: "우리챔버오케스트라의 연혁과 주요 활동을 소개합니다.",
  alternates: { canonical: "/activities/history" },
};

const section = nav.find((item) => item.href === "/activities")!;

const relatedLinks = [
  {
    href: "/activities/performances",
    label: "공연 활동",
    description: "무대와 연습의 기록을 사진으로 봅니다.",
  },
  {
    href: "/activities/press",
    label: "보도자료",
    description: "언론과 협력 기관에 소개된 소식을 확인합니다.",
  },
] as const;

export default async function HistoryPage() {
  const history = await getPublishedHistories();

  return (
    <PageShell title="히스토리" sectionHref="/activities" subNav={section.children}>
      <section className="bg-white">
        <div className="container py-14 sm:py-16">
          <header className="mb-10 max-w-3xl">
            <h2 className="font-serif text-2xl font-bold text-wco-grey sm:text-3xl">
              우리챔버오케스트라 히스토리
            </h2>
            <p className="mt-3 text-base leading-7 text-wco-muted">
              출범부터 지금까지, 음악으로 세상과 만나 온 발걸음입니다.
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.8fr)] lg:items-start lg:gap-14 xl:gap-16">
            {history.length === 0 ? (
              <p className="border-y border-wco-peach py-10 text-center text-sm text-wco-muted lg:col-span-2">
                등록된 히스토리가 없습니다.
              </p>
            ) : (
              <ol className="relative ml-1 border-l-2 border-wco-orange/25 pl-8 sm:ml-2 sm:pl-10">
                {history.map((item, index) => (
                  <li
                    key={`${item.year}-${item.text}-${index}`}
                    className="relative pb-10 last:pb-0"
                  >
                    <span
                      className="absolute -left-[2.45rem] top-1.5 h-3 w-3 rounded-full border-2 border-wco-orange bg-white sm:-left-[2.95rem]"
                      aria-hidden
                    />
                    <div className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-6">
                      <span className="font-serif text-xl font-bold tabular-nums text-wco-orange sm:text-2xl">
                        {item.year}
                      </span>
                      <p className="text-base leading-8 break-keep text-wco-grey sm:pt-1">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <aside className="flex flex-col gap-5 self-start lg:sticky lg:top-28">
              <div className="rounded-3xl border border-wco-orange/15 bg-[#fff7f2] p-7 sm:p-8">
                <p className="text-xs font-bold tracking-[0.1em] text-wco-orange">
                  CONTINUE
                </p>
                <h3 className="mt-3 text-xl font-bold leading-snug text-wco-grey sm:text-2xl">
                  이어지는 활동을 살펴보세요
                </h3>
                <ul className="mt-6 space-y-4">
                  {relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group block border-b border-wco-orange/15 pb-4 last:border-b-0 last:pb-0"
                      >
                        <span className="text-sm font-bold text-wco-grey transition group-hover:text-wco-orange">
                          {link.label} →
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-wco-muted">
                          {link.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-wco-grey/10 bg-neutral-50 p-7 sm:p-8">
                <p className="text-xs font-bold tracking-[0.1em] text-wco-orange">
                  PERFORMANCE INQUIRY
                </p>
                <h3 className="mt-3 text-xl font-bold leading-snug text-wco-grey">
                  공연을 함께 만들고 싶으신가요?
                </h3>
                <p className="mt-3 text-sm leading-7 break-keep text-wco-muted">
                  공연 초청, 취재, 협력 관련 문의를 안내해 드립니다.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white hover:opacity-90"
                >
                  공연문의 안내
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
