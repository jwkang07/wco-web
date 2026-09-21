"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { applyHeroSelectionAction } from "@/app/admin/(panel)/content-actions";
import { AdminEmptyTableRow } from "@/components/admin/AdminEmptyTableRow";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import { AdminListPagination } from "@/components/admin/AdminListPagination";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  heroAdminEditPath,
} from "@/lib/admin-heroes";
import { ADMIN_LIST_PAGE_SIZE, paginateAdminItems } from "@/lib/admin-pagination";
import {
  adminEmptyListMessage,
  type AdminFeedback,
} from "@/lib/admin-ui-messages";
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
  items: initialItems,
}: {
  sectionKey: string;
  sectionLabel: string;
  items: HeroListItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [published, setPublished] = useState<PublishFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [applied, setApplied] = useState({
    published: "all" as PublishFilter,
    keyword: "",
  });
  const [page, setPage] = useState(1);
  const [draftSelected, setDraftSelected] = useState<string | null>(
    () => initialItems.find((i) => i.isSelected)?.id ?? null,
  );
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [pending, startTransition] = useTransition();

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

  const savedSelected = items.find((i) => i.isSelected)?.id ?? null;
  const isDirty = draftSelected !== savedSelected;
  const hasActiveFilter =
    applied.published !== "all" || applied.keyword.trim() !== "";

  function handleApply() {
    if (!draftSelected) {
      setFeedback({
        tone: "error",
        message: "노출할 상단비주얼을 한 건 선정해 주세요.",
      });
      return;
    }
    const target = items.find((i) => i.id === draftSelected);
    if (target && !target.isPublished) {
      setFeedback({
        tone: "error",
        message: "게시 상태인 상단비주얼만 노출 선정할 수 있습니다.",
      });
      return;
    }
    if (!window.confirm(`[${sectionLabel}] 선정한 상단비주얼을 노출하시겠습니까?`)) {
      return;
    }
    startTransition(async () => {
      const res = await applyHeroSelectionAction(sectionKey, draftSelected);
      if (!res.ok) {
        setFeedback({ tone: "error", message: res.error });
        return;
      }
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          isSelected: item.id === draftSelected,
        })),
      );
      setFeedback({
        tone: "success",
        message: "선정한 상단비주얼이 해당 메뉴에 노출됩니다.",
      });
    });
  }

  return (
    <div>
      <AdminPageHeader
        title={`${sectionLabel} 상단비주얼`}
        description="상단비주얼을 등록·수정한 뒤, 노출 선정 체크와 「노출 반영」으로 공개 화면에 적용합니다."
      />

      <AdminFormFeedback
        feedback={feedback}
        onDismiss={() => setFeedback(null)}
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
            [{sectionLabel}] 노출 선정은 1건만 가능합니다.
            {isDirty ? " · 변경 후 하단 「노출 반영」을 눌러 주세요." : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-sm">
            <caption className="sr-only">
              {sectionLabel} 상단비주얼 목록. 총 {paged.total}건.
            </caption>
            <colgroup>
              <col className="w-16" />
              <col className="w-14" />
              <col className="w-28" />
              <col />
              <col className="w-20" />
              <col className="w-28" />
            </colgroup>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th className="px-3 py-3 text-center font-semibold">선정</th>
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
                  colSpan={6}
                  message={adminEmptyListMessage("상단비주얼", hasActiveFilter)}
                />
              ) : (
                paged.items.map((item, index) => {
                  const no =
                    paged.total -
                    ((paged.currentPage - 1) * paged.pageSize + index);
                  const checked = draftSelected === item.id;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-black/[0.08] last:border-b-0"
                    >
                      <td className="h-16 px-3 text-center">
                        <input
                          type="radio"
                          name={`hero-select-${sectionKey}`}
                          checked={checked}
                          disabled={!item.isPublished && !checked}
                          onChange={() => setDraftSelected(item.id)}
                          aria-label={`${item.title || "상단비주얼"} 노출 선정`}
                          className="size-4 accent-[#5a554c]"
                        />
                      </td>
                      <td className="h-16 px-3 text-center tabular-nums text-[#6B6B6B]">
                        {no}
                      </td>
                      <td className="h-16 px-3">
                        <Link
                          href={heroAdminEditPath(sectionKey, item.id)}
                          className="mx-auto block h-12 w-[6.5rem] overflow-hidden rounded border border-black/10 bg-black/[0.03]"
                        >
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
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
                          {item.isSelected ? (
                            <span className="ml-2 text-xs font-normal text-[#5a554c]">
                              노출중
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
          leading={
            <button
              type="button"
              onClick={handleApply}
              disabled={!isDirty || pending}
              className="min-w-[7.5rem] rounded bg-[#5a554c] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#433f38] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "반영 중…" : "노출 반영"}
            </button>
          }
        />
      </section>
    </div>
  );
}
