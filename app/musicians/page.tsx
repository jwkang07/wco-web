import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { musicianSections, type MusicianMember } from "@/lib/content";

export const metadata: Metadata = {
  title: "우리단원",
  description:
    "악기 분야별로 우리챔버오케스트라 연주자를 소개합니다.",
  alternates: { canonical: "/musicians" },
};

export default function MusiciansPage() {
  return (
    <PageShell title="우리단원" description="악기 분야별로 우리챔버오케스트라 연주자를 소개합니다." sectionHref="/musicians">
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <div className="grid gap-7 border-b border-black/10 pb-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div><p className="flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-wco-orange before:h-0.5 before:w-8 before:bg-wco-orange">WOORI MUSICIANS</p><h2 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-wco-grey sm:text-4xl">한 사람 한 사람의 소리가<br />우리의 하모니가 됩니다.</h2></div>
            <p className="max-w-xl text-sm leading-7 break-keep text-wco-muted sm:text-base sm:leading-8">우리챔버오케스트라의 단원들은 각자의 악기와 음악으로 관객을 만납니다. 서로 다른 소리가 하나의 하모니를 이루며, 무대 위에서 전문연주자로 성장해 갑니다.</p>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="악기 분야 바로가기">
            {musicianSections.map((group) => <a key={group.name} href={`#${group.name}`} className="shrink-0 rounded-full border border-wco-grey/15 px-5 py-2.5 text-sm font-bold text-wco-grey transition-colors hover:border-wco-orange hover:text-wco-orange">{group.name}</a>)}
          </nav>

          <div className="mt-16 space-y-20">
            {musicianSections.map((group, groupIndex) => (
              <section key={group.name} id={group.name} className="scroll-mt-28">
                <header className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                  <div><p className="text-xs font-black tracking-[0.15em] text-wco-orange">SECTION {String(groupIndex + 1).padStart(2, "0")}</p><h2 className="mt-2 text-2xl font-bold text-wco-grey sm:text-3xl">{group.name}</h2></div>
                  <p className="text-sm text-wco-muted">{group.description}</p>
                </header>
                <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {group.members.map((member) => <MemberPortrait key={member.name + member.instrument} member={member} />)}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-20 rounded-2xl border border-wco-orange/15 bg-[#fff7f2] px-6 py-5 text-sm leading-7 text-wco-muted sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
            <p><strong className="text-wco-grey">사진 게시 안내</strong><br className="sm:hidden" /> 단원 프로필은 본인 및 보호자의 초상권 동의 후 공개합니다.</p>
            <span className="mt-2 block shrink-0 font-bold text-wco-orange sm:mt-0">Woori Chamber Orchestra</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function MemberPortrait({ member }: { member: MusicianMember }) {
  const cropPositions = {
    "top-left": "8.333% 0%",
    "top-right": "91.667% 0%",
    "bottom-left": "8.333% 100%",
    "bottom-right": "91.667% 100%",
  } as const;

  return (
    <li>
      <article className="group relative aspect-[4/5] overflow-hidden bg-[#343230] text-white">
        {member.photoSrc && member.photoCrop ? (
          <div
            role="img"
            aria-label={member.photoAlt ?? `${member.name} ${member.instrument} 임시 프로필`}
            className="absolute inset-0 bg-no-repeat grayscale-[75%] sepia-[8%] saturate-[65%] contrast-[1.05] transition duration-500 group-hover:grayscale-[35%] group-hover:saturate-[80%] group-hover:scale-[1.02]"
            style={{
              backgroundImage: `url(${member.photoSrc})`,
              backgroundPosition: cropPositions[member.photoCrop],
              backgroundSize: "250% auto",
            }}
          />
        ) : member.photoSrc ? (
          <Image src={member.photoSrc} alt={member.photoAlt ?? `${member.name} ${member.instrument} 연주자`} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-cover object-top grayscale-[75%] sepia-[8%] saturate-[65%] contrast-[1.05] transition duration-500 group-hover:grayscale-[35%] group-hover:saturate-[80%] group-hover:scale-[1.02]" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_38%,#54514e_0%,#363432_48%,#292827_100%)]">
            <span className="text-5xl font-black tracking-[-0.08em] text-white/[0.09] sm:text-7xl" aria-hidden>WCO</span>
            <span className="mt-3 text-xs tracking-[0.16em] text-white/40">PORTRAIT COMING SOON</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
        {member.photoCrop ? <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white/80 backdrop-blur-sm">임시 이미지</span> : null}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-base font-bold sm:text-lg">{member.name}</p>
          <p className="mt-1 text-xs font-semibold text-[#ff8450] sm:text-sm">{member.instrument}</p>
          {member.role ? <p className="mt-1 text-xs text-white/60">{member.role}</p> : null}
        </div>
      </article>
    </li>
  );
}
