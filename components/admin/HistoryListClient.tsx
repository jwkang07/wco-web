"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminEmptyTableRow } from "@/components/admin/AdminEmptyTableRow";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import { AdminListPagination } from "@/components/admin/AdminListPagination";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { reorderHistoryAction } from "@/app/admin/(panel)/content-actions";
import {
  ADMIN_LIST_PAGE_SIZE,
  paginateAdminItems,
} from "@/lib/admin-pagination";
import {
  adminEmptyListMessage,
  adminEmptyLoadFailed,
  type AdminFeedback,
} from "@/lib/admin-ui-messages";
import { compactSearchText, matchesSearchText } from "@/lib/search-text";

export type HistoryListItem = {
  id: string;
  year: string;
  body: string;
  sortOrder: number;
  isPublished: boolean;
  createdAtLabel: string;
  searchText: string;
};

type PublishFilter = "all" | "published" | "unpublished";

type Props = {
  items: HistoryListItem[];
  loadError?: string;
  registerHref: string;
};

/**
 * 히스토리 관리 목록 — ▲▼ 순서 조정 (페이징 있음, 순서는 전체 목록 기준)
 */
export function HistoryListClient({
  items,
  loadError,
  registerHref,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  const [published, setPublished] = useState<PublishFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [applied, setApplied] = useState({
    published: "all" as PublishFilter,
    keyword: "",
  });
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.id.localeCompare(b.id);
      }),
    [items],
  );

  const filtered = useMemo(() => {
    const q = compactSearchText(applied.keyword);
    return sorted.filter((item) => {
      if (applied.published === "published" && !item.isPublished) return false;
      if (applied.published === "unpublished" && item.isPublished) return false;
      if (!q) return true;
      return matchesSearchText(item.searchText, q);
    });
  }, [sorted, applied]);

  const paged = useMemo(
    () => paginateAdminItems(filtered, page, ADMIN_LIST_PAGE_SIZE),
    [filtered, page],
  );

  const hasActiveFilter =
    applied.published !== "all" || applied.keyword.trim() !== "";

  function reorder(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await reorderHistoryAction(id, direction);
      if (result.error) {
        setFeedback({ tone: "error", message: result.error });
        return;
      }
      setFeedback(null);
      router.refresh();
    });
  }

  if (loadError) {
    return (
      <div>
        <AdminPageHeader title="히스토리" />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {adminEmptyLoadFailed(loadError)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="히스토리"
        description="▲▼로 공개 화면 표시 순서를 바꿉니다. 목록은 페이지당 20건입니다."
      />

      {feedback ? (
        <div className="mb-4">
          <AdminFormFeedback feedback={feedback} />
        </div>
      ) : null}

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
          <div>
            <label
              htmlFor="history-published"
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              게시
            </label>
            <select
              id="history-published"
              value={published}
              onChange={(e) => setPublished(e.target.value as PublishFilter)}
              className="min-w-[7rem] rounded border border-black/20 bg-white px-2 py-1.5 text-sm"
            >
              <option value="all">전체</option>
              <option value="published">게시</option>
              <option value="unpublished">비게시</option>
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="history-keyword"
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              검색
            </label>
            <input
              id="history-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="연도·내용"
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
        aria-label="히스토리 목록"
        className="overflow-hidden rounded-xl border border-black/10 bg-white"
      >
        <div className="overflow-x-auto">
          <table
            className="w-full table-fixed border-collapse text-sm"
            style={{ minWidth: "44rem" }}
          >
            <caption className="sr-only">
              히스토리 목록. 총 {paged.total}건. 페이지당 {ADMIN_LIST_PAGE_SIZE}
              건.
            </caption>
            <colgroup>
              <col style={{ width: "3.5rem" }} />
              <col style={{ width: "6.5rem" }} />
              <col style={{ width: "5rem" }} />
              <col />
              <col style={{ width: "5.5rem" }} />
              <col style={{ width: "7rem" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-sm font-semibold"
                >
                  NO
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-sm font-semibold"
                >
                  순서
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-sm font-semibold"
                >
                  연도
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-sm font-semibold"
                >
                  내용
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-sm font-semibold"
                >
                  게시여부
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-sm font-semibold"
                >
                  등록일
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.items.length === 0 ? (
                <AdminEmptyTableRow
                  colSpan={6}
                  message={adminEmptyListMessage("히스토리", hasActiveFilter)}
                />
              ) : (
                paged.items.map((item, index) => {
                  const no =
                    (paged.currentPage - 1) * paged.pageSize + index + 1;
                  const globalIndex = sorted.findIndex((r) => r.id === item.id);
                  const canUp = globalIndex > 0;
                  const canDown =
                    globalIndex >= 0 && globalIndex < sorted.length - 1;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-black/[0.08] last:border-b-0"
                    >
                      <td className="h-12 px-2 text-center tabular-nums text-[#6B6B6B]">
                        {no}
                      </td>
                      <td className="h-12 px-2 text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <span className="min-w-[1.25rem] tabular-nums">
                            {item.sortOrder}
                          </span>
                          <button
                            type="button"
                            aria-label={`${item.year} 순서 위로`}
                            disabled={pending || !canUp}
                            onClick={() => reorder(item.id, "up")}
                            className="rounded px-1 py-0.5 text-xs hover:bg-black/[0.06] disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            aria-label={`${item.year} 순서 아래로`}
                            disabled={pending || !canDown}
                            onClick={() => reorder(item.id, "down")}
                            className="rounded px-1 py-0.5 text-xs hover:bg-black/[0.06] disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      <td className="h-12 px-2 text-center tabular-nums">
                        <Link
                          href={`/admin/histories/${item.id}`}
                          className="font-medium underline-offset-2 hover:underline"
                        >
                          {item.year || "-"}
                        </Link>
                      </td>
                      <td className="h-12 max-w-0 px-3 text-left">
                        <Link
                          href={`/admin/histories/${item.id}`}
                          className="block truncate font-medium underline-offset-2 hover:underline"
                        >
                          {item.body || "-"}
                        </Link>
                      </td>
                      <td className="h-12 whitespace-nowrap px-2 text-center">
                        {item.isPublished ? "게시" : "비게시"}
                      </td>
                      <td className="h-12 whitespace-nowrap px-2 text-center tabular-nums text-[#6B6B6B]">
                        {item.createdAtLabel || "-"}
                      </td>
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
          registerLabel="등록"
        />
      </section>
    </div>
  );
}
