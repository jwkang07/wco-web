import type { Metadata } from "next";
import { GreetingBlock } from "@/components/GreetingBlock";
import { PageShell } from "@/components/PageShell";
import { greetings } from "@/lib/content";
import { nav } from "@/lib/site";

export const metadata: Metadata = {
  title: "관장 인삿말",
  description:
    "은평구립우리장애인복지관 관장의 우리챔버오케스트라 인삿말입니다.",
  alternates: { canonical: "/about/director-greeting" },
};

const section = nav.find((item) => item.href === "/about")!;
const content = greetings.director;

export default function DirectorGreetingPage() {
  return (
    <PageShell
      title={content.title}
      sectionHref="/about"
      subNav={section.children}
    >
      <GreetingBlock
        title={content.title}
        name={content.name}
        org={content.org}
        lead="예술가의 가능성을 응원하고, 함께 성장하는 길을 열겠습니다."
        paragraphs={content.body}
      />
    </PageShell>
  );
}
