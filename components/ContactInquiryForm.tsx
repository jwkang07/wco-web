"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  startTransition,
  type FormEvent,
} from "react";
import {
  submitInquiryAction,
  type InquiryFormState,
} from "@/app/(site)/contact/actions";

const initial: InquiryFormState = {};

type FieldId =
  | "field-organization"
  | "field-name"
  | "field-email"
  | "field-phone"
  | "field-body"
  | "field-privacy";

const fieldClassBase =
  "mt-2 h-12 w-full rounded-xl border bg-neutral-50 px-4 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange focus:ring-2 focus:ring-wco-peach";
const areaClassBase =
  "mt-2 w-full resize-none rounded-xl border bg-neutral-50 px-4 py-3 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange focus:ring-2 focus:ring-wco-peach";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function focusField(id: string) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!(el instanceof HTMLElement)) return;
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
      el.focus({ preventScroll: true });
    });
  });
}

function validateClient(form: HTMLFormElement): {
  ok: true;
} | {
  ok: false;
  message: string;
  fieldId: FieldId;
} {
  const organization = String(
    new FormData(form).get("organization") ?? "",
  ).trim();
  const name = String(new FormData(form).get("name") ?? "").trim();
  const email = String(new FormData(form).get("email") ?? "").trim();
  const phone = String(new FormData(form).get("phone") ?? "").trim();
  const body = String(new FormData(form).get("body") ?? "").trim();
  const privacy = form.querySelector<HTMLInputElement>(
    'input[name="privacy_agreed"]',
  )?.checked;

  if (!organization) {
    return {
      ok: false,
      message: "기관·단체명을 입력해 주세요.",
      fieldId: "field-organization",
    };
  }
  if (!name) {
    return {
      ok: false,
      message: "담당자명을 입력해 주세요.",
      fieldId: "field-name",
    };
  }
  if (!phone) {
    return {
      ok: false,
      message: "연락처를 입력해 주세요.",
      fieldId: "field-phone",
    };
  }
  if (!/^[0-9\-+\s()]+$/.test(phone)) {
    return {
      ok: false,
      message: "연락처는 숫자와 - 만 입력해 주세요.",
      fieldId: "field-phone",
    };
  }
  if (!email) {
    return {
      ok: false,
      message: "이메일을 입력해 주세요.",
      fieldId: "field-email",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      message: "올바른 이메일을 입력해 주세요.",
      fieldId: "field-email",
    };
  }
  if (!body) {
    return {
      ok: false,
      message: "문의 내용을 입력해 주세요.",
      fieldId: "field-body",
    };
  }
  if (body.length < 10) {
    return {
      ok: false,
      message: "문의 내용을 조금 더 자세히 적어 주세요.",
      fieldId: "field-body",
    };
  }
  if (!privacy) {
    return {
      ok: false,
      message: "개인정보 수집·이용에 동의해 주세요.",
      fieldId: "field-privacy",
    };
  }
  return { ok: true };
}

function fieldBorderClass(fieldId: FieldId | null | undefined, id: FieldId) {
  if (fieldId === id) {
    return "border-red-400";
  }
  return "border-black/10";
}

export function ContactInquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiryAction,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<FieldId | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);
  /** 서버 왕복을 기다리는 중 (이전 state.ok 재사용 방지) */
  const [awaitingServer, setAwaitingServer] = useState(false);
  /** pending=true를 한 번이라도 본 뒤에만 결과를 반영 */
  const [sawPending, setSawPending] = useState(false);
  const [resetTick, setResetTick] = useState(0);
  const errorSummaryId = "inquiry-error-summary";

  const activeFieldId = focusId ?? (state.fieldId as FieldId | undefined) ?? null;

  // pending/결과 반영은 렌더 중 조정 (set-state-in-effect 회피). form reset만 effect.
  if (awaitingServer && pending && !sawPending) {
    setSawPending(true);
  }
  if (awaitingServer && !pending && sawPending) {
    setAwaitingServer(false);
    setSawPending(false);
    if (state.ok) {
      setMessage(null);
      setFocusId(null);
      setSuccessVisible(true);
      setResetTick((n) => n + 1);
    } else if (state.error) {
      setSuccessVisible(false);
      setMessage(state.error);
      setFocusId((state.fieldId as FieldId | undefined) ?? null);
    }
  }

  useEffect(() => {
    if (resetTick === 0) return;
    formRef.current?.reset();
  }, [resetTick]);

  useEffect(() => {
    if (!focusId && !state.fieldId) return;
    const id = focusId ?? (state.fieldId as string);
    if (id) focusField(id);
  }, [focusId, message, state.fieldId]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessVisible(false);
    const form = e.currentTarget;
    const parsed = validateClient(form);
    if (!parsed.ok) {
      setAwaitingServer(false);
      setSawPending(false);
      setMessage(parsed.message);
      setFocusId(parsed.fieldId);
      return;
    }
    setMessage(null);
    setFocusId(null);
    const fd = new FormData(form);
    setSawPending(false);
    setAwaitingServer(true);
    startTransition(() => {
      formAction(fd);
    });
  }

  function handleAnotherInquiry() {
    setSuccessVisible(false);
    setAwaitingServer(false);
    setSawPending(false);
    setMessage(null);
    setFocusId(null);
    formRef.current?.reset();
    focusField("field-organization");
  }

  if (successVisible) {
    return (
      <div
        className="rounded-3xl border border-wco-orange/15 bg-[#fff8f4] p-7 text-wco-grey shadow-[0_16px_45px_rgba(38,38,38,0.055)] sm:p-9"
        role="status"
        aria-live="polite"
      >
        <h3 className="text-xl font-bold text-wco-grey sm:text-2xl">
          문의가 접수되었습니다
        </h3>
        <p className="mt-4 text-sm leading-7 text-wco-muted">
          운영담당자가 내용을 확인한 뒤{" "}
          <strong className="font-semibold text-wco-grey">전화</strong> 또는{" "}
          <strong className="font-semibold text-wco-grey">개별 메일</strong>로
          안내드립니다.
        </p>
        <button
          type="button"
          onClick={handleAnotherInquiry}
          className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-wco-orange px-6 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wco-orange"
        >
          추가 문의하기
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="relative grid gap-5 rounded-3xl border border-wco-orange/15 bg-[#fff8f4] p-7 text-wco-grey shadow-[0_16px_45px_rgba(38,38,38,0.055)] sm:grid-cols-2 sm:p-9"
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

      {message ? (
        <div
          id={errorSummaryId}
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2"
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      ) : null}

      <label className="block">
        <span className="text-sm font-bold">
          기관·단체명 <span className="text-wco-orange">*</span>
        </span>
        <input
          id="field-organization"
          name="organization"
          maxLength={80}
          required
          aria-required="true"
          aria-invalid={activeFieldId === "field-organization" || undefined}
          aria-describedby={
            activeFieldId === "field-organization" ? errorSummaryId : undefined
          }
          placeholder="기관 또는 단체명을 입력해 주세요"
          className={`${fieldClassBase} ${fieldBorderClass(activeFieldId, "field-organization")}`}
        />
        {activeFieldId === "field-organization" && message ? (
          <p className="mt-1.5 text-xs text-red-600">{message}</p>
        ) : null}
      </label>
      <label className="block">
        <span className="text-sm font-bold">
          담당자명 <span className="text-wco-orange">*</span>
        </span>
        <input
          id="field-name"
          name="name"
          maxLength={40}
          required
          aria-required="true"
          aria-invalid={activeFieldId === "field-name" || undefined}
          aria-describedby={
            activeFieldId === "field-name" ? errorSummaryId : undefined
          }
          autoComplete="name"
          placeholder="성함을 입력해 주세요"
          className={`${fieldClassBase} ${fieldBorderClass(activeFieldId, "field-name")}`}
        />
        {activeFieldId === "field-name" && message ? (
          <p className="mt-1.5 text-xs text-red-600">{message}</p>
        ) : null}
      </label>
      <label className="block">
        <span className="text-sm font-bold">
          연락처 <span className="text-wco-orange">*</span>
        </span>
        <input
          id="field-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={15}
          required
          aria-required="true"
          aria-invalid={activeFieldId === "field-phone" || undefined}
          aria-describedby={
            activeFieldId === "field-phone" ? errorSummaryId : undefined
          }
          placeholder="010-0000-0000"
          className={`${fieldClassBase} ${fieldBorderClass(activeFieldId, "field-phone")}`}
        />
        {activeFieldId === "field-phone" && message ? (
          <p className="mt-1.5 text-xs text-red-600">{message}</p>
        ) : null}
      </label>
      <label className="block">
        <span className="text-sm font-bold">
          이메일 <span className="text-wco-orange">*</span>
        </span>
        <input
          id="field-email"
          name="email"
          type="email"
          maxLength={80}
          required
          aria-required="true"
          aria-invalid={activeFieldId === "field-email" || undefined}
          aria-describedby={
            activeFieldId === "field-email" ? errorSummaryId : undefined
          }
          autoComplete="email"
          placeholder="name@example.com"
          className={`${fieldClassBase} ${fieldBorderClass(activeFieldId, "field-email")}`}
        />
        {activeFieldId === "field-email" && message ? (
          <p className="mt-1.5 text-xs text-red-600">{message}</p>
        ) : null}
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-bold">
          문의 내용 <span className="text-wco-orange">*</span>
        </span>
        <textarea
          id="field-body"
          name="body"
          rows={5}
          maxLength={2000}
          required
          aria-required="true"
          aria-invalid={activeFieldId === "field-body" || undefined}
          aria-describedby={
            activeFieldId === "field-body" ? errorSummaryId : undefined
          }
          placeholder="행사 일정, 장소, 공연 목적과 문의 사항을 적어 주세요"
          className={`${areaClassBase} ${fieldBorderClass(activeFieldId, "field-body")}`}
        />
        {activeFieldId === "field-body" && message ? (
          <p className="mt-1.5 text-xs text-red-600">{message}</p>
        ) : null}
      </label>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-6 text-wco-muted">
          <input
            id="field-privacy"
            type="checkbox"
            name="privacy_agreed"
            required
            aria-required="true"
            aria-invalid={activeFieldId === "field-privacy" || undefined}
            aria-describedby={
              activeFieldId === "field-privacy" ? errorSummaryId : undefined
            }
            className="mt-1"
          />
          <span>
            개인정보 수집·이용에 동의합니다. (수집 항목: 이름, 연락처, 이메일,
            문의 내용 / 목적: 공연 문의 응대 / 보관: 문의 처리 완료 후 관련
            법령에 따른 기간)
          </span>
        </label>
        {activeFieldId === "field-privacy" && message ? (
          <p className="mt-1.5 text-xs text-red-600">{message}</p>
        ) : null}
      </div>

      <div className="sm:col-span-2">
        <p className="mb-3 text-xs text-wco-muted">
          접수 후 전화 또는 개별 메일로 안내드립니다.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-11 w-full items-center justify-center rounded-xl bg-wco-orange px-6 py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wco-orange disabled:opacity-60"
        >
          {pending ? "보내는 중…" : "문의 보내기"}
        </button>
      </div>
    </form>
  );
}
