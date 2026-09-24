import Link from "next/link";
import { SafeHtml } from "@/components/SafeHtml";

export function ActivityArticleDetail({
  title,
  dateLabel,
  meta,
  bodyHtml,
  listHref,
  listLabel,
  imageSrc,
  externalHref,
  imageProminent = false,
}: {
  title: string;
  dateLabel: string;
  meta?: string;
  bodyHtml: string;
  listHref: string;
  listLabel: string;
  imageSrc?: string;
  externalHref?: string;
  /** 공연 등 — 이미지를 본문보다 크게 강조 */
  imageProminent?: boolean;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl">
      <header className="border-y border-wco-peach py-6 sm:py-7">
        <h2 className="text-xl font-bold leading-snug text-wco-grey sm:text-2xl">
          {title}
        </h2>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-wco-muted">
          <span>등록일 {dateLabel}</span>
          {meta ? <span>{meta}</span> : null}
        </p>
      </header>

      <div className="space-y-6 py-8 sm:py-10">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className={
              imageProminent
                ? "aspect-[4/3] w-full rounded-xl object-cover"
                : "mx-auto max-h-[28rem] w-full rounded-xl object-contain"
            }
          />
        ) : null}

        {bodyHtml ? (
          <SafeHtml
            html={bodyHtml}
            className="space-y-4 text-[15px] leading-[1.95] text-wco-grey sm:text-base sm:leading-[2] [&_a]:font-medium [&_a]:text-wco-orange [&_a]:underline [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_ol>li]:list-decimal [&_p]:mb-3 [&_ul]:my-3"
          />
        ) : imageProminent ? null : (
          <p className="text-sm text-wco-muted">등록된 본문이 없습니다.</p>
        )}

        {externalHref && externalHref !== "#" ? (
          <p>
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-bold text-wco-orange underline-offset-4 hover:underline"
            >
              원문 보기 →
            </a>
          </p>
        ) : null}
      </div>

      <div className="border-t border-wco-peach py-6">
        <Link
          href={listHref}
          className="inline-flex rounded-full border border-wco-grey/20 px-5 py-2.5 text-sm font-semibold text-wco-grey transition hover:border-wco-orange hover:text-wco-orange"
        >
          {listLabel}
        </Link>
      </div>
    </article>
  );
}
