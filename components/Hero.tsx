import Link from "next/link";

/** 모든 페이지 메인 비주얼 영역의 동일한 세로 높이 */
export const HERO_HEIGHT_CLASS = "h-[360px] sm:h-[400px] lg:h-[440px]";
export const MAIN_HERO_HEIGHT_CLASS = "h-[432px] sm:h-[480px] lg:h-[528px]";

type HeroProps = {
  title?: string;
  titleLines?: readonly string[];
  description?: string;
  descriptionLines?: readonly string[];
  showCta?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
  mainVisual?: boolean;
};

export function Hero({
  title,
  titleLines,
  description,
  descriptionLines,
  showCta = false,
  imageSrc,
  imageAlt = "",
  imagePosition = "center",
  mainVisual = false,
}: HeroProps) {
  return (
    <section
      className={`relative shrink-0 overflow-hidden bg-wco-grey text-white ${mainVisual ? MAIN_HERO_HEIGHT_CLASS : HERO_HEIGHT_CLASS}`}
    >
      {imageSrc ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: imagePosition,
            }}
            role="img"
            aria-label={imageAlt}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-wco-grey/90 via-wco-grey/75 to-wco-grey/55"
            aria-hidden
          />
        </>
      ) : null}

      <div className="container relative h-full">
        <div className="flex h-full flex-col pt-10 sm:pt-12 lg:pt-14">
          <h1 className="line-clamp-2 min-h-[2.75rem] shrink-0 font-serif text-3xl font-bold leading-tight tracking-tight sm:min-h-[3.5rem] sm:text-4xl lg:min-h-[4.5rem] lg:text-5xl">
            {titleLines ? (
              titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))
            ) : (
              title
            )}
          </h1>
          <div className="mt-3 min-h-[4.5rem] shrink-0 sm:mt-4">
            {descriptionLines ? (
              <p className="max-w-[44rem] text-base leading-relaxed text-white/85 sm:text-lg">
                {descriptionLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ) : description ? (
              <p className="max-w-[44rem] text-base leading-relaxed break-keep text-pretty text-white/85 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          <div className="mt-6 h-11 shrink-0 sm:mt-8">
            {showCta ? (
              <Link
                href="/about"
                className="inline-flex rounded-full bg-wco-orange px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                우리챔버오케스트라 보기
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
