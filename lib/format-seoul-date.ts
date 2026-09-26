/**
 * Asia/Seoul 기준 날짜 표시.
 * - timestamptz(created_at 등): 서울 캘린더 날짜
 * - date-only(YYYY-MM-DD, published_on): 시간대 변환 없이 그대로 표시
 */

export function formatSeoulDate(raw: string | null | undefined): string {
  const v = String(raw ?? "").trim();
  if (!v) return "";

  // published_on 등 date 컬럼 — UTC 슬라이스로 날짜가 바뀌지 않게
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return `${v.slice(0, 4)}.${v.slice(5, 7)}.${v.slice(8, 10)}`;
  }

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) {
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}.${m[2]}.${m[3]}`;
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const mo = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!y || !mo || !day) return "";
  return `${y}.${mo}.${day}`;
}

/** 문의·감사로그 등 일시 표시 — `YYYY.MM.DD HH:mm:ss` (Asia/Seoul) */
export function formatSeoulDateTime(raw: string | null | undefined): string {
  const v = String(raw ?? "").trim();
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;
  const y = get("year");
  const mo = get("month");
  const day = get("day");
  let h = get("hour");
  const mi = get("minute");
  const s = get("second");
  if (!y || !mo || !day || h == null || !mi || !s) return "";
  // en-CA 일부 환경에서 24시를 24로 표기하는 경우 정규화
  if (h === "24") h = "00";
  return `${y}.${mo}.${day} ${h}:${mi}:${s}`;
}
