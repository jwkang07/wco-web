import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { history } from "@/lib/content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/activities")!;

export const metadata: Metadata = {
  title: "히스토리",
};

export default function HistoryPage() {
  return (
    <PageShell title="히스토리" subNav={section.children}>
      <Section title="우리챔버오케스트라 히스토리">
        <ol className="max-w-2xl space-y-6">
          {history.map((item) => (
            <li key={item.year} className="flex gap-4">
              <span className="w-16 shrink-0 font-serif text-xl font-bold text-wco-orange">
                {item.year}
              </span>
              <span className="pt-0.5 text-base text-wco-muted">{item.text}</span>
            </li>
          ))}
        </ol>
      </Section>
    </PageShell>
  );
}
