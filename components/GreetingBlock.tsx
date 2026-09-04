type GreetingBlockProps = {
  title: string;
  name: string;
  org: string;
  lead: string;
  paragraphs: readonly string[];
};

export function GreetingBlock({ title, name, org, lead, paragraphs }: GreetingBlockProps) {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="mb-10 max-w-3xl sm:mb-14">
          <p className="flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-wco-orange before:h-0.5 before:w-8 before:bg-wco-orange">GREETING</p>
          <h2 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-wco-grey sm:text-4xl">{lead}</h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <aside className="relative min-h-80 overflow-hidden rounded-3xl bg-wco-grey p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:min-h-96 sm:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[42px] border-wco-orange/15" aria-hidden />
            <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-white/[0.035]" aria-hidden />
            <span className="relative block text-7xl font-black leading-none text-wco-orange" aria-hidden>&ldquo;</span>
            <p className="relative mt-3 max-w-sm text-2xl font-bold leading-relaxed break-keep sm:text-3xl">음악으로 가능성을 만나고,<br />함께 성장합니다.</p>
            <div className="absolute inset-x-8 bottom-8 border-t border-white/15 pt-5 sm:inset-x-10 sm:bottom-10">
              <p className="text-xs font-bold tracking-[0.12em] text-wco-orange">WOORI CHAMBER ORCHESTRA</p>
              <p className="mt-2 text-sm text-white/65">{title}</p>
            </div>
          </aside>
          <article className="flex flex-col justify-center rounded-3xl border border-black/5 bg-white px-1 py-3 sm:px-4 lg:px-8">
            <div className="space-y-6 text-base leading-8 break-keep text-wco-muted sm:text-[17px] sm:leading-9">
              {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
            </div>
            <div className="mt-10 flex items-end justify-between gap-5 border-t border-black/10 pt-6">
              <div><p className="text-sm text-wco-muted">{org}</p><p className="mt-1 text-lg font-bold text-wco-grey">{name}</p></div>
              <p className="text-2xl font-semibold tracking-[0.15em] text-wco-grey/35" aria-label={`${name} 서명`}>{name}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
