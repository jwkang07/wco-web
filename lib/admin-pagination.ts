/** 관리자 목록 페이징 공통 — 나무말미와 동일 */

export const ADMIN_LIST_PAGE_SIZE = 20;
export const ADMIN_PAGE_WINDOW = 5;

export function paginateAdminItems<T>(
  items: T[],
  page: number,
  pageSize = ADMIN_LIST_PAGE_SIZE,
) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    totalPages,
    currentPage,
    pageSize,
  };
}

/** 현재 페이지 주변 번호 창 (최대 ADMIN_PAGE_WINDOW개) */
export function getAdminPageNumbers(
  current: number,
  total: number,
  windowSize = ADMIN_PAGE_WINDOW,
) {
  if (total <= 0) return [1];
  const max = Math.min(total, windowSize);
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  const end = Math.min(total, start + max - 1);
  start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
