import type { MusicianSection } from "@/lib/content";

type MemberSectionsProps = {
  sections: readonly MusicianSection[];
};

export function MemberSections({ sections }: MemberSectionsProps) {
  return (
    <div className="space-y-14">
      {sections.map((section, index) => (
        <section key={section.name}>
          <header className="mb-6 flex flex-wrap items-end gap-3 border-b border-wco-peach pb-4">
            <h2 className="font-serif text-2xl font-bold text-wco-grey">
              {section.name}
            </h2>
            <p className="text-sm text-wco-muted">{section.description}</p>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {section.members.map((member) => (
              <li key={member.name + member.instrument}>
                <article className="overflow-hidden rounded-xl border border-wco-peach bg-white">
                  {member.photoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoSrc}
                      alt={member.photoAlt ?? member.name}
                      className="aspect-[3/4] w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-neutral-100 text-xs text-wco-muted">
                      사진 준비 중
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-serif text-base font-bold text-wco-grey">
                      {member.name}
                    </p>
                    <p className="mt-1 text-sm text-wco-orange">
                      {member.instrument}
                    </p>
                    {member.role ? (
                      <p className="mt-1 text-xs text-wco-muted">
                        {member.role}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
          {index === 0 ? (
            <p className="mt-4 text-sm text-wco-muted">
              단원 사진과 프로필은 초상권 동의 후 순차적으로 게시됩니다.
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
