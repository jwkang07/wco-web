"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminEmptyTableRow } from "@/components/admin/AdminEmptyTableRow";
import { AdminListPagination } from "@/components/admin/AdminListPagination";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { heroAdminEditPath } from "@/lib/admin-heroes";
import { ADMIN_LIST_PAGE_SIZE, paginateAdminItems } from "@/lib/admin-pagination";
import { adminEmptyListMessage } from "@/lib/admin-ui-messages";
import { compactSearchText, matchesSearchText } from "@/lib/search-text";

export type HeroListItem = {
  id: string;
  title: string;
  imageUrl?: string;
  isSelected: boolean;
  isPublished: boolean;
  updatedAt: string;
};

type PublishFilter = "all" | "published" | "unpublished";

export function HeroSectionListClient({
  sectionKey,
  sectionLabel,
  items,
}: {
  sectionKey: string;
  sectionLabel: string;
  items: HeroListItem[];
}) {
  const [published, setPublished] = useState<PublishFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [applied, setApplied] = useState({
    published: "all" as PublishFilter,
    keyword: "",
  });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = compactSearchText(applied.keyword);
    return items.filter((item) => {
      if (applied.published === "published" && !item.isPublished) return false;
      if (applied.published === "unpublished" && item.isPublished) return false;
      if (!q) return true;
      return matchesSearchText(item.title, q);
    });
  }, [items, applied]);

  const paged = useMemo(
    () => paginateAdminItems(filtered, page, ADMIN_LIST_PAGE_SIZE),
    [filtered, page],
  );

  const hasActiveFilter =
    applied.published !== "all" || applied.keyword.trim() !== "";
  const liveCount = items.filter((i) => i.isPublished && i.isSelected).length;

  return (
    <div>
      <AdminPageHeader
        title={`${sectionLabel} 상단비주얼`}
        description="상세에서 「게시」로 저장하면 바로 공개되고, 「비게시」로 저장하면 숨깁니다. 메뉴당 게시 1건만 유지됩니다."
      />

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
              htmlFor={`hero-${sectionKey}-published`}
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              게시
            </label>
            <select
              id={`hero-${sectionKey}-published`}
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
              htmlFor={`hero-${sectionKey}-keyword`}
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              검색
            </label>
            <input
              id={`hero-${sectionKey}-keyword`}
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="제목"
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
        aria-label={`${sectionLabel} 상단비주얼 목록`}
        className="overflow-hidden rounded-xl border border-black/10 bg-white"
      >
        <div className="border-b border-black/10 px-4 py-3">
          <p className="text-xs text-[#6B6B6B] sm:text-sm" aria-live="polite">
            [{sectionLabel}] 게시 중인 상단비주얼 {liveCount}건
            {liveCount === 0 ? " · 공개 화면에 이미지가 없습니다." : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
            <caption className="sr-only">
              {sectionLabel} 상단비주얼 목록. 총 {paged.total}건.
            </caption>
            <colgroup>
              <col className="w-14" />
              <col className="w-28" />
              <col />
              <col className="w-24" />
              <col className="w-28" />
            </colgroup>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th className="px-3 py-3 text-center font-semibold">NO</th>
                <th className="px-3 py-3 text-center font-semibold">이미지</th>
                <th className="px-3 py-3 text-left font-semibold">제목</th>
                <th className="px-3 py-3 text-center font-semibold">게시</th>
                <th className="px-3 py-3 text-center font-semibold">수정일</th>
              </tr>
            </thead>
            <tbody>
              {paged.items.length === 0 ? (
                <AdminEmptyTableRow
                  colSpan={5}
                  message={adminEmptyListMessage("상단비주얼", hasActiveFilter)}
                />
              ) : (
                paged.items.map((item, index) => {
                  const no =
                    paged.total -
                    ((paged.currentPage - 1) * paged.pageSize + index);
                  const isLive = item.isPublished && item.isSelected;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-black/[0.08] last:border-b-0"
                    >
                      <td className="h-16 px-3 text-center tabular-nums text-[#6B6B6B]">
                        {no}
                      </td>
                      <td className="h-16 px-3">
                        <Link
                          href={heroAdminEditPath(sectionKey, item.id)}
                          className={`mx-auto block h-12 w-[6.5rem] overflow-hidden rounded border bg-black/[0.03] ${
                            isLive
                              ? "border-[#5a554c] ring-1 ring-[#5a554c]/40"
                              : "border-black/10 opacity-55"
                          }`}
                        >
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          ) : null}
                        </Link>
                      </td>
                      <td className="h-16 max-w-0 px-3">
                        <Link
                          href={heroAdminEditPath(sectionKey, item.id)}
                          className="block truncate font-medium underline-offset-2 hover:underline"
                        >
                          {item.title || "(제목 없음)"}
                          {isLive ? (
                            <span className="ml-2 text-xs font-normal text-[#5a554c]">
                              게시중
                            </span>
                          ) : null}
                        </Link>
                      </td>
                      <td className="h-16 px-3 text-center">
                        {item.isPublished ? "게시" : "비게시"}
                      </td>
                      <td className="h-16 px-3 text-center tabular-nums text-[#6B6B6B]">
                        {item.updatedAt}
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
          registerHref={heroAdminEditPath(sectionKey, "new")}
        />
      </section>
    </div>
  );
}
