"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminEmptyTableRow } from "@/components/admin/AdminEmptyTableRow";
import { AdminListPagination } from "@/components/admin/AdminListPagination";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ADMIN_LIST_PAGE_SIZE, paginateAdminItems } from "@/lib/admin-pagination";
import { adminPath } from "@/lib/admin-path";
import {
  adminEmptyListMessage,
  adminEmptyLoadFailed,
} from "@/lib/admin-ui-messages";
import { compactSearchText, matchesSearchFields } from "@/lib/search-text";

export type AdminInquiryListItem = {
  id: string;
  created_at: string;
  name: string;
  organization: string | null;
  email: string;
  phone: string | null;
  status: string;
};

const statusLabel: Record<string, string> = {
  received: "접수",
  in_progress: "처리중",
  done: "완료",
};

function formatCreatedAt(raw: string) {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "-";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

type StatusFilter = "all" | "received" | "in_progress" | "done";

export function InquiryListClient({
  items,
  loadError,
}: {
  items: AdminInquiryListItem[];
  loadError?: string;
}) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [applied, setApplied] = useState({
    status: "all" as StatusFilter,
    keyword: "",
  });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = compactSearchText(applied.keyword);
    return items.filter((item) => {
      if (applied.status !== "all" && item.status !== applied.status) return false;
      if (!q) return true;
      return matchesSearchFields(
        [item.name, item.email, item.organization, item.phone],
        q,
      );
    });
  }, [items, applied]);

  const paged = useMemo(
    () => paginateAdminItems(filtered, page, ADMIN_LIST_PAGE_SIZE),
    [filtered, page],
  );

  const hasActiveFilter =
    applied.status !== "all" || applied.keyword.trim() !== "";

  if (loadError) {
    return (
      <div>
        <AdminPageHeader
          title="공연문의"
          description="답변은 전화·개별 메일. 여기에서는 상태·메모만 관리합니다."
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
        title="공연문의"
        description="답변은 전화·개별 메일. 여기에서는 상태·메모만 관리합니다."
      />

      <section
        aria-label="검색 조건"
        className="mb-5 rounded-xl border border-black/10 bg-white p-4 sm:p-5"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setApplied({ status, keyword });
            setPage(1);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div>
            <label
              htmlFor="inquiry-status"
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              상태
            </label>
            <select
              id="inquiry-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="min-w-[7rem] rounded border border-black/20 bg-white px-2 py-1.5 text-sm"
            >
              <option value="all">전체</option>
              <option value="received">접수</option>
              <option value="in_progress">처리중</option>
              <option value="done">완료</option>
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="inquiry-keyword"
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              검색
            </label>
            <input
              id="inquiry-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="이름·이메일·기관·연락처"
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
        aria-label="문의 목록"
        className="overflow-hidden rounded-xl border border-black/10 bg-white"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] table-fixed border-collapse text-sm">
            <caption className="sr-only">
              문의 목록. 총 {paged.total}건. 페이지당 {ADMIN_LIST_PAGE_SIZE}건.
            </caption>
            <colgroup>
              <col style={{ width: "3.5rem" }} />
              <col style={{ width: "7rem" }} />
              <col style={{ width: "7rem" }} />
              <col />
              <col style={{ width: "11.5rem" }} />
              <col style={{ width: "5rem" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th className="px-3 py-3 text-center font-semibold">NO</th>
                <th className="px-3 py-3 text-left font-semibold">이름</th>
                <th className="px-3 py-3 text-left font-semibold">기관</th>
                <th className="px-3 py-3 text-left font-semibold">이메일</th>
                <th className="whitespace-nowrap px-3 py-3 text-left font-semibold">
                  등록일시
                </th>
                <th className="px-3 py-3 text-center font-semibold">상태</th>
              </tr>
            </thead>
            <tbody>
              {paged.items.length === 0 ? (
                <AdminEmptyTableRow
                  colSpan={6}
                  message={adminEmptyListMessage("문의", hasActiveFilter)}
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
                      <td className="h-12 max-w-0 px-3">
                        <Link
                          href={adminPath(`/inquiries/${item.id}`)}
                          className="block truncate font-medium underline-offset-2 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="h-12 truncate px-3">
                        {item.organization || "-"}
                      </td>
                      <td className="h-12 truncate px-3">{item.email}</td>
                      <td className="h-12 whitespace-nowrap px-3 tabular-nums text-[#6B6B6B]">
                        {formatCreatedAt(item.created_at)}
                      </td>
                      <td className="h-12 px-3 text-center">
                        {statusLabel[item.status] ?? item.status}
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
