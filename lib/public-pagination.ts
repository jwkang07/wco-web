/** 공개 목록 페이징 — 공연활동·보도자료 */

export const PUBLIC_BOARD_PAGE_SIZE = 10;
export const PUBLIC_PHOTO_PAGE_SIZE = 9;
export const PUBLIC_PAGE_WINDOW = 5;

export function parsePageParam(raw: string | string[] | undefined) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export function paginateItems<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
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
    startIndex: start,
  };
}

export function getPageNumbers(
  current: number,
  total: number,
  windowSize = PUBLIC_PAGE_WINDOW,
) {
  if (total <= 0) return [1];
  const max = Math.min(total, windowSize);
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  const end = Math.min(total, start + max - 1);
  start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** page=1은 쿼리 없이 깔끔한 URL */
export function pageHref(basePath: string, page: number) {
  if (page <= 1) return basePath;
  return `${basePath}?page=${page}`;
}
