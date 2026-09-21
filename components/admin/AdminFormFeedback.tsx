"use client";

import type { AdminFeedback } from "@/lib/admin-ui-messages";

type Props = {
  feedback: AdminFeedback | null;
  className?: string;
  onDismiss?: () => void;
};

/** 관리자 폼·목록 상단 인라인 성공/오류 배너 (나무말미와 동일) */
export function AdminFormFeedback({
  feedback,
  className = "",
  onDismiss,
}: Props) {
  if (!feedback) return null;

  const isError = feedback.tone === "error";

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded border px-3 py-2.5 text-sm leading-relaxed ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-900"
      } ${className}`}
      role={isError ? "alert" : "status"}
    >
      <p className="min-w-0 flex-1 whitespace-pre-wrap">{feedback.message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs font-medium opacity-70 transition hover:opacity-100"
          aria-label="알림 닫기"
        >
          닫기
        </button>
      ) : null}
    </div>
  );
}
