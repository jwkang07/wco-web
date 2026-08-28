import type { Metadata } from "next";
import { GreetingBlock } from "@/components/GreetingBlock";
import { PageShell } from "@/components/PageShell";
import { greetings } from "@/lib/content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/about")!;
const content = greetings.director;

export const metadata: Metadata = {
  title: "관장 인삿말",
};

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
        paragraphs={content.body}
      />
    </PageShell>
  );
}
