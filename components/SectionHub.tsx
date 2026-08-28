import Link from "next/link";
import type { NavChild } from "@/lib/site";
import { Section } from "@/components/Section";

type SectionHubProps = {
  title: string;
  description: string;
  items: readonly NavChild[];
};

export function SectionHub({ title, description, items }: SectionHubProps) {
  return (
    <Section title={title} description={description}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-xl border border-wco-peach bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-serif text-lg font-bold text-wco-grey group-hover:text-wco-orange">
                {item.label}
              </h3>
              {item.note ? (
                <p className="mt-2 text-sm text-wco-muted">{item.note}</p>
              ) : (
                <p className="mt-2 text-sm text-wco-muted">자세히 보기 →</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
