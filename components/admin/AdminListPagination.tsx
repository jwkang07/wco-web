"use client";

import Link from "next/link";
import { getAdminPageNumbers } from "@/lib/admin-pagination";

type AdminListPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** 있으면 우측 「등록」 링크 표시 */
  registerHref?: string;
  registerLabel?: string;
  /** 좌측 영역 (예: 일괄 반영 버튼). 없으면 데스크톱에서만 빈 spacer */
  leading?: React.ReactNode;
};

export function AdminListPagination({
  currentPage,
  totalPages,
  onPageChange,
  registerHref,
  registerLabel = "등록",
  leading,
}: AdminListPaginationProps) {
  const pageNumbers = getAdminPageNumbers(currentPage, totalPages);

  return (
    <div className="sticky bottom-0 z-10 flex flex-col gap-4 border-t border-black/10 bg-white px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      {leading ? (
        <div className="order-2 flex flex-wrap justify-start gap-2 lg:order-1">
          {leading}
        </div>
      ) : (
        <div className="order-2 hidden lg:order-1 lg:block lg:min-w-[6rem]" />
      )}
      <nav
        className="order-1 flex flex-1 items-center justify-center gap-1 lg:order-2"
        aria-label="페이지 탐색"
      >
        <PageBtn
          label="첫 페이지"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
        >
          ≪
        </PageBtn>
        <PageBtn
          label="이전 페이지"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          ＜
        </PageBtn>
        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n}페이지`}
            aria-current={n === currentPage ? "page" : undefined}
            onClick={() => onPageChange(n)}
            className={`min-w-8 rounded px-2 py-1 text-sm ${
              n === currentPage
                ? "border border-[#5a554c] font-semibold text-[#5a554c]"
                : "text-[#262626] hover:bg-black/[0.05]"
            }`}
          >
            {n}
          </button>
        ))}
        <PageBtn
          label="다음 페이지"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          ＞
        </PageBtn>
        <PageBtn
          label="마지막 페이지"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          ≫
        </PageBtn>
      </nav>
      <div className="order-3 flex justify-end lg:min-w-[6rem]">
        {registerHref ? (
          <Link
            href={registerHref}
            className="rounded bg-[#5a554c] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#433f38]"
          >
            {registerLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function PageBtn({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="min-w-8 rounded px-2 py-1 text-sm text-[#262626] hover:bg-black/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
