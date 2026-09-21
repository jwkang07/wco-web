"use client";

import { useState, type ReactNode } from "react";

type Props = {
  name: string;
  /** 검증 포커스용 (`field-image` 등) */
  focusId: string;
  label: ReactNode;
  accept?: string;
  buttonLabel?: string;
  emptyText?: string;
  helpText?: string;
};

/**
 * 네이티브 file input 대신 나무말미식 「파일등록」 버튼 UI
 * FormData 제출용 — input에 name을 유지하고 선택 파일명은 옆에 표시
 */
export function AdminFileButton({
  name,
  focusId,
  label,
  accept = "image/jpeg,image/png,image/webp",
  buttonLabel = "파일등록",
  emptyText = "파일이 없습니다.",
  helpText = "jpg / png / webp",
}: Props) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div id={focusId} className="w-full">
      <p className="mb-2 text-sm font-medium leading-6 text-[#262626]">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label
          data-admin-focus
          tabIndex={-1}
          className="inline-flex cursor-pointer items-center rounded border border-black/20 bg-black/[0.03] px-3 py-1.5 text-sm outline-none focus-visible:border-[#5a554c]"
        >
          {buttonLabel}
          <input
            type="file"
            name={name}
            accept={accept}
            className="sr-only"
            onChange={(e) => {
              setFileName(e.target.files?.[0]?.name ?? null);
            }}
          />
        </label>
        <p className="text-sm text-[#6B6B6B]" aria-live="polite">
          {fileName ?? emptyText}
        </p>
      </div>
      {helpText ? (
        <p className="mt-1.5 text-xs text-[#6B6B6B]">{helpText}</p>
      ) : null}
    </div>
  );
}
