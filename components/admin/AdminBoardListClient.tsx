"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminEmptyTableRow } from "@/components/admin/AdminEmptyTableRow";
import { AdminListPagination } from "@/components/admin/AdminListPagination";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  ADMIN_LIST_PAGE_SIZE,
  paginateAdminItems,
} from "@/lib/admin-pagination";
import {
  adminEmptyListMessage,
  adminEmptyLoadFailed,
} from "@/lib/admin-ui-messages";
import { compactSearchText, matchesSearchText } from "@/lib/search-text";

export type AdminBoardPublishFilter = "all" | "published" | "unpublished";

/** 서버에서 직렬화해 넘기는 컬럼 정의 (함수 금지) */
export type AdminBoardColumnDef = {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  /** true면 cells[key]를 상세 링크로 렌더 */
  link?: boolean;
};

/** 서버에서 직렬화해 넘기는 행 */
export type AdminBoardRow = {
  id: string;
  href: string;
  searchText: string;
  published?: boolean;
  cells: Record<string, string>;
};

type Props = {
  title: string;
  description?: string;
  noun: string;
  items: AdminBoardRow[];
  loadError?: string;
  registerHref?: string;
  registerLabel?: string;
  searchPlaceholder?: string;
  showPublishedFilter?: boolean;
  columns: AdminBoardColumnDef[];
  minWidth?: string;
};

/**
 * 관리자 게시판형 목록 — 조회 필터 + NO 내림차순 + 하단 페이징(나무말미와 동일)
 * props는 모두 직렬화 가능해야 함 (Server → Client)
 */
export function AdminBoardListClient({
  title,
  description,
  noun,
  items,
  loadError,
  registerHref,
  registerLabel = "등록",
  searchPlaceholder = "검색어를 입력하세요.",
  showPublishedFilter = true,
  columns,
  minWidth = "720px",
}: Props) {
  const [published, setPublished] = useState<AdminBoardPublishFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [applied, setApplied] = useState({
    published: "all" as AdminBoardPublishFilter,
    keyword: "",
  });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = compactSearchText(applied.keyword);
    return items.filter((item) => {
      if (showPublishedFilter && applied.published !== "all") {
        const pub = Boolean(item.published);
        if (applied.published === "published" && !pub) return false;
        if (applied.published === "unpublished" && pub) return false;
      }
      if (!q) return true;
      return matchesSearchText(item.searchText, q);
    });
  }, [items, applied, showPublishedFilter]);

  const paged = useMemo(
    () => paginateAdminItems(filtered, page, ADMIN_LIST_PAGE_SIZE),
    [filtered, page],
  );

  const hasActiveFilter =
    (showPublishedFilter && applied.published !== "all") ||
    applied.keyword.trim() !== "";

  if (loadError) {
    return (
      <div>
        <AdminPageHeader title={title} description={description} />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {adminEmptyLoadFailed(loadError)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title={title} description={description} />

      <section
        aria-label="검색 조건"
        className="mb-5 rounded-xl border border-black/10 bg-white p-4 sm:p-5"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setApplied({ published, keyword });
            setPage(1);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          {showPublishedFilter ? (
            <div>
              <label
                htmlFor={`${noun}-published`}
                className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
              >
                게시
              </label>
              <select
                id={`${noun}-published`}
                value={published}
                onChange={(e) =>
                  setPublished(e.target.value as AdminBoardPublishFilter)
                }
                className="min-w-[7rem] rounded border border-black/20 bg-white px-2 py-1.5 text-sm"
              >
                <option value="all">전체</option>
                <option value="published">게시</option>
                <option value="unpublished">비게시</option>
              </select>
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`${noun}-keyword`}
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              검색
            </label>
            <input
              id={`${noun}-keyword`}
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full min-w-[12rem] rounded border border-black/20 bg-white px-3 py-1.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-[#5a554c] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#433f38]"
          >
            조회
          </button>
        </form>
      </section>

      <section
        aria-label={`${noun} 목록`}
        className="overflow-hidden rounded-xl border border-black/10 bg-white"
      >
        <div className="overflow-x-auto">
          <table
            className="w-full table-fixed border-collapse text-sm"
            style={{ minWidth }}
          >
            <caption className="sr-only">
              {noun} 목록. 총 {paged.total}건. 페이지당 {ADMIN_LIST_PAGE_SIZE}건.
            </caption>
            <colgroup>
              <col className="w-14" />
              {columns.map((col) => (
                <col
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-sm font-semibold"
                >
                  NO
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-3 py-3 text-sm font-semibold ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.items.length === 0 ? (
                <AdminEmptyTableRow
                  colSpan={columns.length + 1}
                  message={adminEmptyListMessage(noun, hasActiveFilter)}
                />
              ) : (
                paged.items.map((item, index) => {
                  const no =
                    paged.total -
                    ((paged.currentPage - 1) * paged.pageSize + index);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-black/[0.08] last:border-b-0"
                    >
                      <td className="h-12 px-3 text-center tabular-nums text-[#6B6B6B]">
                        {no}
                      </td>
                      {columns.map((col) => {
                        const align =
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                              ? "text-right"
                              : "text-left";
                        const text = item.cells[col.key] ?? "";
                        return (
                          <td key={col.key} className={`h-12 max-w-0 px-3 ${align}`}>
                            {col.link ? (
                              <Link
                                href={item.href}
                                className="block truncate font-medium underline-offset-2 hover:underline"
                              >
                                {text}
                              </Link>
                            ) : (
                              <div className="truncate">{text}</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <AdminListPagination
          currentPage={paged.currentPage}
          totalPages={paged.totalPages}
          onPageChange={setPage}
          registerHref={registerHref}
          registerLabel={registerLabel}
        />
      </section>
    </div>
  );
}
