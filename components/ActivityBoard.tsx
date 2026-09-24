import Link from "next/link";

export type ActivityBoardItem = {
  id: string;
  title: string;
  dateLabel: string;
  meta?: string;
};

export function ActivityBoard({
  items,
  basePath,
  emptyMessage = "등록된 글이 없습니다.",
  /** 전체 건수 — 페이징 시 NO 계산용 (기본: 현재 페이지 건수) */
  totalCount,
  /** 현재 페이지 시작 오프셋 (0-based) */
  startIndex = 0,
  /** 있으면 NO와 제목 사이에 메타(출처 등) 열 표시 */
  metaLabel,
}: {
  items: readonly ActivityBoardItem[];
  basePath: string;
  emptyMessage?: string;
  totalCount?: number;
  startIndex?: number;
  metaLabel?: string;
}) {
  if (!items.length) {
    return (
      <p className="border-y border-wco-peach py-10 text-center text-sm text-wco-muted">
        {emptyMessage}
      </p>
    );
  }

  const total = totalCount ?? items.length;
  const showMeta = Boolean(metaLabel);

  return (
    <div className="overflow-hidden border-y border-wco-peach">
      <div
        className={`hidden border-b border-wco-peach bg-black/[0.02] px-3 py-3 text-sm font-semibold text-wco-grey sm:grid sm:gap-4 sm:px-4 ${
          showMeta
            ? "sm:grid-cols-[4rem_7rem_minmax(0,1fr)_8rem]"
            : "sm:grid-cols-[4rem_minmax(0,1fr)_8rem]"
        }`}
      >
        <span className="text-center">NO</span>
        {showMeta ? <span className="text-center">{metaLabel}</span> : null}
        <span>제목</span>
        <span className="text-center">등록일</span>
      </div>
      <ul>
        {items.map((item, index) => {
          const no = total - startIndex - index;
          return (
            <li
              key={item.id}
              className="border-b border-wco-peach/80 last:border-b-0"
            >
              <Link
                href={`${basePath}/${item.id}`}
                className={`grid min-h-[3.75rem] items-center gap-3 px-3 py-3 transition hover:bg-wco-peach/20 sm:h-16 sm:min-h-0 sm:gap-4 sm:px-4 sm:py-0 ${
                  showMeta
                    ? "grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[4rem_7rem_minmax(0,1fr)_8rem]"
                    : "grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)_8rem]"
                }`}
              >
                <span className="text-center text-sm tabular-nums text-wco-muted">
                  {no}
                </span>
                {showMeta ? (
                  <span className="hidden truncate text-center text-sm text-wco-muted sm:block">
                    {item.meta || "-"}
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium text-wco-grey">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-wco-muted sm:hidden">
                    {item.meta ? `${item.meta} · ` : ""}
                    {item.dateLabel}
                  </span>
                </span>
                <span className="hidden text-center text-sm tabular-nums text-wco-muted sm:block">
                  {item.dateLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
