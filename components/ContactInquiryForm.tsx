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

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-black/10 bg-neutral-50 px-4 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange";
const areaClass =
  "mt-2 w-full resize-none rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm outline-none placeholder:text-black/35 focus:border-wco-orange";

function focusField(id: string) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!(el instanceof HTMLElement)) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
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

export function ContactInquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiryAction,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setMessage(null);
      setFocusId(null);
      window.alert(
        "문의가 접수되었습니다.\n\n운영담당자가 내용을 확인한 뒤 전화 또는 개별 메일로 안내드립니다.",
      );
      return;
    }
    if (state.error) {
      setMessage(state.error);
      setFocusId(state.fieldId ?? null);
    }
  }, [state]);

  useEffect(() => {
    if (!focusId) return;
    focusField(focusId);
  }, [focusId, message]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = validateClient(form);
    if (!parsed.ok) {
      setMessage(parsed.message);
      setFocusId(parsed.fieldId);
      return;
    }
    setMessage(null);
    setFocusId(null);
    if (!window.confirm("문의를 등록하시겠습니까?")) return;
    const fd = new FormData(form);
    startTransition(() => {
      formAction(fd);
    });
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
      <label className="block">
        <span className="text-sm font-bold">
          기관·단체명 <span className="text-wco-orange">*</span>
        </span>
        <input
          id="field-organization"
          name="organization"
          maxLength={80}
          placeholder="기관 또는 단체명을 입력해 주세요"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold">
          담당자명 <span className="text-wco-orange">*</span>
        </span>
        <input
          id="field-name"
          name="name"
          maxLength={40}
          placeholder="성함을 입력해 주세요"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold">
          연락처 <span className="text-wco-orange">*</span>
        </span>
        <input
          id="field-phone"
          name="phone"
          maxLength={15}
          placeholder="010-0000-0000"
          className={fieldClass}
        />
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
          placeholder="name@example.com"
          className={fieldClass}
        />
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
          placeholder="행사 일정, 장소, 공연 목적과 문의 사항을 적어 주세요"
          className={areaClass}
        />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-wco-muted sm:col-span-2">
        <input
          id="field-privacy"
          type="checkbox"
          name="privacy_agreed"
          className="mt-1"
        />
        <span>
          개인정보 수집·이용에 동의합니다. (수집 항목: 이름, 연락처, 이메일,
          문의 내용 / 목적: 공연 문의 응대 / 보관: 문의 처리 완료 후 관련
          법령에 따른 기간)
        </span>
      </label>

      {message ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2"
          role="alert"
        >
          {message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-wco-muted">
          접수 후 전화 또는 개별 메일로 안내드립니다.
        </p>
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
