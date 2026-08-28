import { Section } from "@/components/Section";

type GreetingBlockProps = {
  title: string;
  name: string;
  org: string;
  paragraphs: readonly string[];
};

export function GreetingBlock({
  title,
  name,
  org,
  paragraphs,
}: GreetingBlockProps) {
  return (
    <Section title={title}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex aspect-[16/9] max-w-md items-center justify-center rounded-xl bg-neutral-100 text-sm text-wco-muted">
          사진 준비 중
        </div>
        <p className="font-serif text-lg font-bold text-wco-grey">
          {org} {name}
        </p>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-wco-muted">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
