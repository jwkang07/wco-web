"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitInquiryAction,
  type InquiryFormState,
} from "@/app/(site)/contact/actions";

const initial: InquiryFormState = {};

export function ContactInquiryForm() {
  const [state, action, pending] = useActionState(submitInquiryAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="rounded-3xl border border-wco-orange/15 bg-[#fff8f4] p-7 sm:p-9" role="status">
        <p className="text-lg font-bold text-wco-grey">문의가 접수되었습니다.</p>
        <p className="mt-3 text-sm leading-7 text-wco-muted">
          운영담당자가 내용을 확인한 뒤 전화 또는 개별 메일로 안내드립니다.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="grid gap-5 rounded-3xl border border-wco-orange/15 bg-[#fff8f4] p-7 text-wco-grey shadow-[0_16px_45px_rgba(38,38,38,0.055)] sm:grid-cols-2 sm:p-9"
      aria-label="공연문의 양식"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <label className="block">
        <span className="text-sm font-bold">기관·단체명</span>
        <input name="organization" placeholder="기관 또는 단체명을 입력해 주세요" className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-neutral-50 px-4 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange" />
      </label>
      <label className="block">
        <span className="text-sm font-bold">담당자명 *</span>
        <input name="name" required maxLength={40} placeholder="성함을 입력해 주세요" className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-neutral-50 px-4 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange" />
      </label>
      <label className="block">
        <span className="text-sm font-bold">연락처</span>
        <input name="phone" maxLength={15} placeholder="010-0000-0000" className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-neutral-50 px-4 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange" />
      </label>
      <label className="block">
        <span className="text-sm font-bold">이메일 *</span>
        <input name="email" type="email" required maxLength={80} placeholder="name@example.com" className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-neutral-50 px-4 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-bold">문의 내용 *</span>
        <textarea name="body" required rows={5} maxLength={2000} placeholder="행사 일정, 장소, 공연 목적과 문의 사항을 적어 주세요" className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange" />
      </label>
      <label className="flex items-start gap-3 sm:col-span-2 text-sm leading-6 text-wco-muted">
        <input type="checkbox" name="privacy_agreed" required className="mt-1" />
        <span>
          개인정보 수집·이용에 동의합니다. (수집 항목: 이름, 연락처, 이메일, 문의 내용 / 목적: 공연 문의 응대 / 보관: 문의 처리 완료 후 관련 법령에 따른 기간)
        </span>
      </label>
      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-wco-muted">접수 후 전화 또는 개별 메일로 안내드립니다.</p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-wco-orange px-6 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "보내는 중…" : "문의 보내기"}
        </button>
      </div>
    </form>
  );
}
