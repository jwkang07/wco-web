/** 검색어·대상 문자열: 모든 공백 제거 후 소문자 (중간 공백 무시 LIKE) */
export function compactSearchText(value: string) {
  return (value || "").replace(/\s+/g, "").toLowerCase();
}

/** haystack에 query가 포함되는지 */
export function matchesSearchText(haystack: string, query: string) {
  const q = compactSearchText(query);
  if (!q) return true;
  return compactSearchText(haystack).includes(q);
}

/** 여러 필드를 이어 붙여 검색 */
export function matchesSearchFields(
  fields: Array<string | null | undefined>,
  query: string,
) {
  return matchesSearchText(fields.filter(Boolean).join(" "), query);
}
