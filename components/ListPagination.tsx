import Link from "next/link";
import { getPageNumbers, pageHref } from "@/lib/public-pagination";

type Props = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

export function ListPagination({
  basePath,
  currentPage,
  totalPages,
}: Props) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="페이지 탐색"
    >
      <PageLink
        href={pageHref(basePath, 1)}
        label="첫 페이지"
        disabled={currentPage <= 1}
      >
        ≪
      </PageLink>
      <PageLink
        href={pageHref(basePath, Math.max(1, currentPage - 1))}
        label="이전 페이지"
        disabled={currentPage <= 1}
      >
        ＜
      </PageLink>
      {pageNumbers.map((n) => {
        const active = n === currentPage;
        return (
          <Link
            key={n}
            href={pageHref(basePath, n)}
            aria-label={`${n}페이지`}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-w-9 items-center justify-center rounded px-2 py-1.5 text-sm transition ${
              active
                ? "border border-wco-grey font-semibold text-wco-grey"
                : "text-wco-muted hover:bg-wco-peach/40 hover:text-wco-grey"
            }`}
          >
            {n}
          </Link>
        );
      })}
      <PageLink
        href={pageHref(basePath, Math.min(totalPages, currentPage + 1))}
        label="다음 페이지"
        disabled={currentPage >= totalPages}
      >
        ＞
      </PageLink>
      <PageLink
        href={pageHref(basePath, totalPages)}
        label="마지막 페이지"
        disabled={currentPage >= totalPages}
      >
        ≫
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  label,
  children,
  disabled,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        aria-label={label}
        aria-disabled="true"
        className="inline-flex min-w-9 cursor-not-allowed items-center justify-center rounded px-2 py-1.5 text-sm text-wco-muted opacity-40"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex min-w-9 items-center justify-center rounded px-2 py-1.5 text-sm text-wco-muted transition hover:bg-wco-peach/40 hover:text-wco-grey"
    >
      {children}
    </Link>
  );
}
