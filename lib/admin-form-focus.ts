import type { AdminFeedback } from "@/lib/admin-ui-messages";

function focusElement(el: HTMLElement) {
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (typeof el.focus === "function") {
    el.focus({ preventScroll: true });
  }
}

/** 관리자 폼 — 탭 순서상 첫 오류 필드로 포커스·스크롤 */
export function focusAdminField(elementId: string) {
  const run = () => {
    const root = document.getElementById(elementId);
    if (!root) return;

    const marked = root.matches("[data-admin-focus]")
      ? root
      : root.querySelector<HTMLElement>("[data-admin-focus]");
    if (marked) {
      focusElement(marked);
      return;
    }

    const editable = root.matches(".ProseMirror, [contenteditable='true']")
      ? root
      : root.querySelector<HTMLElement>(
          "[data-admin-editor-surface] .ProseMirror, .ProseMirror[contenteditable='true'], [contenteditable='true']",
        );
    if (editable) {
      focusElement(editable);
      return;
    }

    if (
      root instanceof HTMLInputElement ||
      root instanceof HTMLSelectElement ||
      root instanceof HTMLTextAreaElement ||
      root instanceof HTMLButtonElement
    ) {
      focusElement(root);
      return;
    }

    const field = root.querySelector<HTMLElement>(
      "input:not([type='hidden']):not([type='file']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])",
    );
    if (field) {
      focusElement(field);
      return;
    }

    focusElement(root);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
}

/**
 * 필드 오류: 상단 배너 + 해당 필드 포커스. validate에서 `return failAdminField(...)`.
 */
export function failAdminField(
  setFeedback: (feedback: AdminFeedback) => void,
  fieldId: string,
  message: string,
): false {
  setFeedback({ tone: "error", message });
  focusAdminField(fieldId);
  return false;
}

/** 「○○을(를) 입력해 주세요.」 */
export function adminPleaseEnter(label: string): string {
  return `${label}을(를) 입력해 주세요.`;
}

/** 「○○을(를) 선택해 주세요.」 */
export function adminPleaseSelect(label: string): string {
  return `${label}을(를) 선택해 주세요.`;
}

/** 「○○을(를) 등록해 주세요.」 (이미지 등) */
export function adminPleaseUpload(label: string): string {
  return `${label}을(를) 등록해 주세요.`;
}
