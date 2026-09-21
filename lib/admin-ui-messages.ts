/**
 * 관리자 UX 문구 헬퍼 — docs/ADMIN_UI_UX_GUIDE.md (나무말미와 동일)
 */

export type AdminFeedbackTone = "error" | "success";

export type AdminFeedback = {
  tone: AdminFeedbackTone;
  message: string;
};

/** 등록 데이터가 없을 때 */
export function adminEmptyRegistered(noun: string): string {
  return `등록된 ${noun}이(가) 없습니다.`;
}

/** 선정·노출 등 특수 목록이 비었을 때 */
export function adminEmptySelected(noun: string): string {
  return `선정된 ${noun}이(가) 없습니다.`;
}

/** 검색·필터 결과 없음 */
export function adminEmptySearch(): string {
  return "검색 결과가 없습니다.";
}

/** 목록 로드 실패 (상세 메시지 붙일 때) */
export function adminEmptyLoadFailed(detail?: string): string {
  if (detail?.trim()) {
    return `목록을 불러오지 못했습니다. ${detail.trim()}`;
  }
  return "목록을 불러오지 못했습니다.";
}

/**
 * 빈 목록 셀 문구 — 필터/검색이 걸려 있으면 검색 결과 없음, 아니면 등록 없음.
 */
export function adminEmptyListMessage(
  noun: string,
  hasActiveFilter: boolean,
  opts?: { selected?: boolean },
): string {
  if (hasActiveFilter) return adminEmptySearch();
  if (opts?.selected) return adminEmptySelected(noun);
  return adminEmptyRegistered(noun);
}

/** 삭제 confirm 문구 */
export function adminConfirmDelete(noun: string): string {
  return `${noun}을(를) 삭제하시겠습니까?`;
}

/** 등록·수정 저장 confirm (나무말미와 동일) */
export function adminConfirmSave(
  noun: string,
  mode: "create" | "edit",
): string {
  return mode === "edit"
    ? `${noun}을(를) 수정하시겠습니까?`
    : `${noun}을(를) 등록하시겠습니까?`;
}

/** 제외·해제 등 비파괴에 가까운 제거 */
export function adminConfirmRemove(noun: string, from: string): string {
  return `이 ${noun}을(를) ${from}에서 제외할까요?`;
}
