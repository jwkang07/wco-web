"use client";

import { useMemo, useState } from "react";
import { AdminEmptyTableRow } from "@/components/admin/AdminEmptyTableRow";
import { AdminListPagination } from "@/components/admin/AdminListPagination";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ADMIN_LIST_PAGE_SIZE, paginateAdminItems } from "@/lib/admin-pagination";
import {
  adminEmptyListMessage,
  adminEmptyLoadFailed,
} from "@/lib/admin-ui-messages";
import { compactSearchText, matchesSearchFields } from "@/lib/search-text";

export type AdminAuditListItem = {
  id: string;
  created_at: string;
  admin_username: string;
  action: string;
  entity_type: string;
  summary: string | null;
};

export function AuditListClient({
  items,
  loadError,
}: {
  items: AdminAuditListItem[];
  loadError?: string;
}) {
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = compactSearchText(appliedKeyword);
    if (!q) return items;
    return items.filter((item) =>
      matchesSearchFields(
        [item.admin_username, item.action, item.entity_type, item.summary],
        q,
      ),
    );
  }, [items, appliedKeyword]);

  const paged = useMemo(
    () => paginateAdminItems(filtered, page, ADMIN_LIST_PAGE_SIZE),
    [filtered, page],
  );

  const hasActiveFilter = appliedKeyword.trim() !== "";

  if (loadError) {
    return (
      <div>
        <AdminPageHeader
          title="작업 이력"
          description="누가 등록·수정·삭제했는지 최근 기록입니다."
        />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {adminEmptyLoadFailed(loadError)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="작업 이력"
        description="누가 등록·수정·삭제했는지 최근 기록입니다."
      />

      <section
        aria-label="검색 조건"
        className="mb-5 rounded-xl border border-black/10 bg-white p-4 sm:p-5"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAppliedKeyword(keyword);
            setPage(1);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="audit-keyword"
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              검색
            </label>
            <input
              id="audit-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="관리자·행동·대상·요약"
              className="w-full rounded border border-black/20 bg-white px-3 py-1.5 text-sm"
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
        aria-label="작업 이력 목록"
        className="overflow-hidden rounded-xl border border-black/10 bg-white"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-sm">
            <caption className="sr-only">
              작업 이력. 총 {paged.total}건. 페이지당 {ADMIN_LIST_PAGE_SIZE}건.
            </caption>
            <colgroup>
              <col className="w-14" />
              <col className="w-[9.5rem]" />
              <col className="w-24" />
              <col className="w-20" />
              <col className="w-24" />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th className="px-3 py-3 text-center font-semibold">NO</th>
                <th className="px-3 py-3 text-left font-semibold">시각</th>
                <th className="px-3 py-3 text-left font-semibold">관리자</th>
                <th className="px-3 py-3 text-left font-semibold">행동</th>
                <th className="px-3 py-3 text-left font-semibold">대상</th>
                <th className="px-3 py-3 text-left font-semibold">요약</th>
              </tr>
            </thead>
            <tbody>
              {paged.items.length === 0 ? (
                <AdminEmptyTableRow
                  colSpan={6}
                  message={adminEmptyListMessage("작업 이력", hasActiveFilter)}
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
                      <td className="h-12 truncate px-3 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString("ko-KR")}
                      </td>
                      <td className="h-12 truncate px-3">{item.admin_username}</td>
                      <td className="h-12 truncate px-3">{item.action}</td>
                      <td className="h-12 truncate px-3">{item.entity_type}</td>
                      <td className="h-12 truncate px-3 text-[#6B6B6B]">
                        {item.summary || ""}
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
        />
      </section>
    </div>
  );
}
