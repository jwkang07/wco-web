import Link from "next/link";
import { site } from "@/lib/site";

type HeroProps = {
  title: string;
  description?: string;
  showCta?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export function Hero({
  title,
  description,
  showCta = false,
  imageSrc,
  imageAlt = "",
  imagePosition = "center",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-wco-grey text-white">
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

      <div className="container relative py-16 sm:py-24 lg:py-28">
        <p className="text-sm font-medium text-white/70">{site.parentOrg}</p>
        <h1 className="mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {description}
          </p>
        ) : null}
        {showCta ? (
          <Link
            href="/about"
            className="mt-8 inline-flex rounded-full bg-wco-orange px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            우리챔버오케스트라 보기
          </Link>
        ) : null}
      </div>
    </section>
  );
}
