"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import {
  adminPleaseEnter,
  failAdminField,
  focusAdminField,
} from "@/lib/admin-form-focus";
import { adminTooLong } from "@/lib/admin-field-limits";
import {
  adminConfirmSave,
  type AdminFeedback,
} from "@/lib/admin-ui-messages";
import {
  ADMIN_IMAGE_MESSAGE,
  isAllowedAdminImage,
} from "@/lib/sanitize";
import { isEmptyRichHtml } from "@/lib/sanitize-html";

export type AdminFormActionState = {
  error?: string;
  fieldId?: string;
};

export type AdminFieldRule = {
  name: string;
  fieldId: string;
  label: string;
  /** 필수 (기본 false) */
  required?: boolean;
  maxLength?: number;
  /** file input — 이미지 MIME 검사 */
  imageFile?: boolean;
  /** TipTap 등 리치 HTML — 빈 태그(<p></p>)도 미입력으로 처리 */
  richHtml?: boolean;
};

type Props = {
  action: (
    prev: AdminFormActionState,
    formData: FormData,
  ) => Promise<AdminFormActionState>;
  fields?: AdminFieldRule[];
  /** @deprecated fields 사용 */
  required?: { name: string; fieldId: string; message: string }[];
  /**
   * 유효성 통과 후 저장 confirm 대상명
   * 예: "히스토리" → 「히스토리을(를) 등록하시겠습니까?」
   */
  confirmNoun?: string;
  /** confirm 문구 모드 (기본 create) */
  confirmMode?: "create" | "edit";
  encType?: string;
  className?: string;
  children: ReactNode;
};

const initial: AdminFormActionState = {};

function validateFields(
  data: FormData,
  fields: AdminFieldRule[],
  setFeedback: (f: AdminFeedback) => void,
): boolean {
  for (const rule of fields) {
    const raw = data.get(rule.name);

    if (rule.imageFile) {
      const hasFile = raw instanceof File && raw.size > 0;
      if (rule.required && !hasFile) {
        failAdminField(
          setFeedback,
          rule.fieldId,
          adminPleaseEnter(rule.label),
        );
        return false;
      }
      if (hasFile && !isAllowedAdminImage(raw as File)) {
        failAdminField(setFeedback, rule.fieldId, ADMIN_IMAGE_MESSAGE);
        return false;
      }
      continue;
    }

    const value = typeof raw === "string" ? raw.trim() : "";
    const empty = rule.richHtml ? isEmptyRichHtml(value) : !value;
    if (rule.required && empty) {
      failAdminField(
        setFeedback,
        rule.fieldId,
        adminPleaseEnter(rule.label),
      );
      return false;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      failAdminField(
        setFeedback,
        rule.fieldId,
        adminTooLong(rule.label, rule.maxLength),
      );
      return false;
    }
  }
  return true;
}

/**
 * 관리자 폼 공통 — 인라인 피드백 + 첫 오류 포커스 + 저장 confirm (나무말미와 동일)
 */
export function AdminActionForm({
  action,
  fields = [],
  required = [],
  confirmNoun,
  confirmMode = "create",
  encType,
  className,
  children,
}: Props) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [serverErrorKey, setServerErrorKey] = useState("");

  const legacyFields: AdminFieldRule[] = required.map((r) => ({
    name: r.name,
    fieldId: r.fieldId,
    label: r.message
      .replace(/을\(를\) 입력해 주세요\.$/, "")
      .replace(/을\(를\) 선택해 주세요\.$/, ""),
    required: true,
  }));

  const allFields = fields.length ? fields : legacyFields;

  // 서버 액션 오류 → 피드백 (렌더 중 조정). 포커스는 DOM 동기화만 effect.
  const nextErrorKey = state.error
    ? `${state.error}\0${state.fieldId ?? ""}`
    : "";
  if (nextErrorKey && nextErrorKey !== serverErrorKey) {
    setServerErrorKey(nextErrorKey);
    setFeedback({ tone: "error", message: state.error! });
  }

  useEffect(() => {
    if (state.error && state.fieldId) focusAdminField(state.fieldId);
  }, [state]);

  return (
    <form
      action={formAction}
      encType={encType}
      className={className}
      noValidate
      onSubmit={(e) => {
        const form = e.currentTarget;
        const data = new FormData(form);
        if (!validateFields(data, allFields, setFeedback)) {
          e.preventDefault();
          return;
        }
        setFeedback(null);
        if (
          confirmNoun &&
          !window.confirm(adminConfirmSave(confirmNoun, confirmMode))
        ) {
          e.preventDefault();
        }
      }}
      data-admin-pending={pending ? "1" : "0"}
    >
      {feedback ? (
        <div className="border-b border-black/10 px-5 py-4 sm:px-6">
          <AdminFormFeedback
            feedback={feedback}
            className="mb-0"
            onDismiss={() => setFeedback(null)}
          />
        </div>
      ) : null}
      <fieldset disabled={pending} className="min-w-0 border-0 p-0">
        {children}
      </fieldset>
    </form>
  );
}
