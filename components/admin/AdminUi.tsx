import type { ReactNode } from "react";
import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-[#6B6B6B]">{description}</p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="rounded bg-[#5a554c] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

/** 목록·상세용 일반 카드 */
export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded border border-black/10 bg-white p-6 shadow-sm sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * 등록·수정 폼 카드 — 나무말미처럼 구분선 행 + 전체 폭
 * padding은 AdminFormRow / AdminFormActions가 담당
 */
export function AdminFormCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded border border-black/10 bg-white shadow-sm">
      {children}
    </div>
  );
}

/** 필드 행들을 divide-y로 묶음 */
export function AdminFormFields({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-black/10">{children}</div>;
}

/** 단일 필드 행 */
export function AdminFormRow({ children }: { children: ReactNode }) {
  return <div className="px-5 py-5 sm:px-6">{children}</div>;
}

export function AdminFormActions({
  cancelHref,
  submitLabel,
  deleteAction,
}: {
  cancelHref: string;
  submitLabel: string;
  deleteAction?: ReactNode | null;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 border-t border-black/10 px-5 py-5 sm:gap-5">
      <Link
        href={cancelHref}
        className="rounded border border-black/20 bg-white px-5 py-2 text-sm font-medium hover:bg-black/[0.03]"
      >
        목록
      </Link>
      {deleteAction}
      <button
        type="submit"
        className="rounded bg-[#5a554c] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        {submitLabel}
      </button>
    </div>
  );
}

/** @deprecated AdminFormFields + AdminFormRow 사용 */
export function adminFormClassName(...extras: string[]) {
  return extras.filter(Boolean).join(" ");
}

/** 필드 라벨 */
export function labelClassName() {
  return "block text-sm font-medium leading-6 text-[#262626]";
}

export function fieldClassName() {
  return "mt-2 w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#5a554c]";
}

/** 게시·체크 옵션 행 */
export function adminCheckClassName() {
  return "flex items-center gap-2 text-sm text-[#262626]";
}

/** 게시 / 비게시 라디오 (name=is_published) */
export function AdminPublishRadios({
  defaultPublished = true,
  hint,
}: {
  defaultPublished?: boolean;
  hint?: string;
}) {
  return (
    <fieldset>
      <legend className={labelClassName()}>게시여부</legend>
      <div className="mt-2 flex flex-wrap gap-6">
        <label className={adminCheckClassName()}>
          <input
            type="radio"
            name="is_published"
            value="true"
            defaultChecked={defaultPublished}
          />
          게시
        </label>
        <label className={adminCheckClassName()}>
          <input
            type="radio"
            name="is_published"
            value="false"
            defaultChecked={!defaultPublished}
          />
          비게시
        </label>
      </div>
      {hint ? <p className="mt-1.5 text-xs text-[#6B6B6B]">{hint}</p> : null}
    </fieldset>
  );
}

