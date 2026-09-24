"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminEmptyTableRow } from "@/components/admin/AdminEmptyTableRow";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import { AdminListPagination } from "@/components/admin/AdminListPagination";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  applyPerformanceHomeAction,
  applyPerformancePinAction,
} from "@/app/admin/(panel)/content-actions";
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

export const PERFORMANCE_HOME_MAX = 3;

export type PerformanceListItem = {
  id: string;
  title: string;
  year: string;
  imageUrl: string | null;
  showOnHome: boolean;
  isPinned: boolean;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  createdAtLabel: string;
  searchText: string;
};

type PublishFilter = "all" | "published" | "unpublished";

type Props = {
  items: PerformanceListItem[];
  loadError?: string;
  registerHref: string;
};

/**
 * 공연 활동 관리 목록 — 메인 노출·상단고정 체크 + 반영 (나무말미 행사/전시와 동일 패턴)
 * 정렬: 상단고정 우선 → 등록일 내림차순 (서버에서 이미 정렬된 목록을 받음)
 */
export function PerformanceListClient({
  items,
  loadError,
  registerHref,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  const [homeIds, setHomeIds] = useState(() =>
    new Set(items.filter((i) => i.showOnHome).map((i) => i.id)),
  );
  const [pinIds, setPinIds] = useState(() =>
    new Set(items.filter((i) => i.isPinned).map((i) => i.id)),
  );

  const [published, setPublished] = useState<PublishFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [applied, setApplied] = useState({
    published: "all" as PublishFilter,
    keyword: "",
  });
  const [page, setPage] = useState(1);

  // 서버 데이터 갱신 시 체크 상태 동기화
  const itemsKey = items
    .map((i) => `${i.id}:${i.showOnHome}:${i.isPinned}`)
    .join("|");
  useEffect(() => {
    setHomeIds(new Set(items.filter((i) => i.showOnHome).map((i) => i.id)));
    setPinIds(new Set(items.filter((i) => i.isPinned).map((i) => i.id)));
  }, [itemsKey, items]);

  const filtered = useMemo(() => {
    const q = compactSearchText(applied.keyword);
    const list = items.filter((item) => {
      if (applied.published === "published" && !item.isPublished) return false;
      if (applied.published === "unpublished" && item.isPublished) return false;
      if (!q) return true;
      return matchesSearchText(item.searchText, q);
    });
    // 상단고정(체크 미리보기) 우선 → 등록일 최신 → id
    return [...list].sort((a, b) => {
      const pinA = pinIds.has(a.id) ? 1 : 0;
      const pinB = pinIds.has(b.id) ? 1 : 0;
      if (pinB !== pinA) return pinB - pinA;
      const t = (b.createdAt || "").localeCompare(a.createdAt || "");
      if (t !== 0) return t;
      const y = (b.year || "").localeCompare(a.year || "");
      if (y !== 0) return y;
      return b.id.localeCompare(a.id);
    });
  }, [items, applied, pinIds]);

  const paged = useMemo(
    () => paginateAdminItems(filtered, page, ADMIN_LIST_PAGE_SIZE),
    [filtered, page],
  );

  const hasActiveFilter =
    applied.published !== "all" || applied.keyword.trim() !== "";
  const homeCount = homeIds.size;
  const pinCount = pinIds.size;

  function toggleHome(id: string) {
    setHomeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= PERFORMANCE_HOME_MAX) {
          setFeedback({
            tone: "error",
            message: `메인 노출은 최대 ${PERFORMANCE_HOME_MAX}건까지 선택할 수 있습니다.`,
          });
          return prev;
        }
        next.add(id);
      }
      setFeedback(null);
      return next;
    });
  }

  function togglePin(id: string) {
    setPinIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setFeedback(null);
  }

  function applyHome() {
    if (
      !window.confirm(
        `메인 노출 ${homeIds.size}건을 반영하시겠습니까? (최대 ${PERFORMANCE_HOME_MAX}건)`,
      )
    ) {
      return;
    }
    const fd = new FormData();
    for (const id of homeIds) fd.append("ids", id);
    startTransition(async () => {
      const result = await applyPerformanceHomeAction(fd);
      if (result.error) {
        setFeedback({ tone: "error", message: result.error });
        return;
      }
      setFeedback({ tone: "success", message: "메인 노출을 반영했습니다." });
      router.refresh();
    });
  }

  function applyPin() {
    if (!window.confirm(`상단 고정 ${pinIds.size}건을 반영하시겠습니까?`)) {
      return;
    }
    const fd = new FormData();
    for (const id of pinIds) fd.append("ids", id);
    startTransition(async () => {
      const result = await applyPerformancePinAction(fd);
      if (result.error) {
        setFeedback({ tone: "error", message: result.error });
        return;
      }
      setFeedback({ tone: "success", message: "상단 고정을 반영했습니다." });
      router.refresh();
    });
  }

  if (loadError) {
    return (
      <div>
        <AdminPageHeader title="공연 활동" />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {adminEmptyLoadFailed(loadError)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="공연 활동"
        description="메인 노출·상단 고정은 목록에서 체크 후 「반영」하세요. 정렬: 상단고정 우선 → 등록일 최신순."
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
              htmlFor="perf-published"
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              게시
            </label>
            <select
              id="perf-published"
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
              htmlFor="perf-keyword"
              className="mb-1.5 block text-xs font-medium text-[#6B6B6B]"
            >
              검색
            </label>
            <input
              id="perf-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="제목·연도"
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
        aria-label="공연 목록"
        className="overflow-hidden rounded-xl border border-black/10 bg-white"
      >
        <p className="border-b border-black/10 px-4 py-2.5 text-sm text-[#6B6B6B]">
          [공연 활동] 메인 노출 {homeCount}/{PERFORMANCE_HOME_MAX} · 상단 고정{" "}
          {pinCount}건
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{ minWidth: "64rem" }}>
            <caption className="sr-only">
              공연 목록. 총 {paged.total}건. 페이지당 {ADMIN_LIST_PAGE_SIZE}건.
            </caption>
            <colgroup>
              {/* 하단「메인 노출 반영」「상단 고정 반영」버튼과 동일 폭 */}
              <col style={{ width: "8.75rem" }} />
              <col style={{ width: "8.75rem" }} />
              <col style={{ width: "3.25rem" }} />
              <col style={{ width: "5.5rem" }} />
              <col style={{ width: "4.25rem" }} />
              <col />
              <col style={{ width: "5.5rem" }} />
              <col style={{ width: "5.5rem" }} />
              <col style={{ width: "7rem" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  메인
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  상단고정
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  NO
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  이미지
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  연도
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 text-left text-sm font-semibold"
                >
                  글제목
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  조회수
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  게시여부
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3 text-center text-sm font-semibold"
                >
                  등록일
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.items.length === 0 ? (
                <AdminEmptyTableRow
                  colSpan={9}
                  message={adminEmptyListMessage("공연", hasActiveFilter)}
                />
              ) : (
                paged.items.map((item, index) => {
                  const no =
                    paged.total -
                    ((paged.currentPage - 1) * paged.pageSize + index);
                  const views = Number.isFinite(item.viewCount)
                    ? item.viewCount
                    : 0;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-black/[0.08] last:border-b-0"
                    >
                      <td className="h-14 w-[8.75rem] px-2 text-center">
                        <input
                          type="checkbox"
                          checked={homeIds.has(item.id)}
                          onChange={() => toggleHome(item.id)}
                          aria-label={`${item.title} 메인 노출`}
                          className="h-4 w-4 accent-[#5a554c]"
                        />
                      </td>
                      <td className="h-14 w-[8.75rem] px-2 text-center">
                        <input
                          type="checkbox"
                          checked={pinIds.has(item.id)}
                          onChange={() => togglePin(item.id)}
                          aria-label={`${item.title} 상단고정`}
                          className="h-4 w-4 accent-[#5a554c]"
                        />
                      </td>
                      <td className="h-14 px-2 text-center tabular-nums text-[#6B6B6B]">
                        {no}
                      </td>
                      <td className="h-14 px-2">
                        <Link
                          href={`/admin/performances/${item.id}`}
                          className="mx-auto block h-10 w-[4.5rem] overflow-hidden rounded border border-black/10 bg-black/[0.03]"
                          aria-label={`${item.title} 수정`}
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
                      <td className="h-14 px-2 text-center tabular-nums">
                        {item.year || "-"}
                      </td>
                      <td className="h-14 max-w-0 px-3 text-left">
                        <Link
                          href={`/admin/performances/${item.id}`}
                          className="block truncate font-medium underline-offset-2 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="h-14 whitespace-nowrap px-2 text-center tabular-nums text-[#6B6B6B]">
                        {views.toLocaleString("ko-KR")}
                      </td>
                      <td className="h-14 whitespace-nowrap px-2 text-center">
                        {item.isPublished ? "게시" : "비게시"}
                      </td>
                      <td className="h-14 whitespace-nowrap px-2 text-center tabular-nums text-[#6B6B6B]">
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
          leading={
            <div className="grid w-[calc(8.75rem+0.5rem+8.75rem)] grid-cols-2 gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={applyHome}
                className="w-full whitespace-nowrap rounded border border-emerald-700/40 bg-emerald-50 px-2 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-50"
              >
                메인 노출 반영
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={applyPin}
                className="w-full whitespace-nowrap rounded border border-emerald-700/40 bg-emerald-50 px-2 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-50"
              >
                상단 고정 반영
              </button>
            </div>
          }
        />
      </section>
    </div>
  );
}
