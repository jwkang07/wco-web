import { GreetingBlock } from "@/components/GreetingBlock";
import { PageShell } from "@/components/PageShell";
import { greetings } from "@/lib/content";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/about")!;
const content = greetings.conductor;

export default function ConductorGreetingPage() {
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
        lead="연습과 열정이 모여, 우리만의 아름다운 하모니를 만듭니다."
        paragraphs={content.body}
      />
    </PageShell>
  );
}
