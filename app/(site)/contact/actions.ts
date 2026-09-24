"use server";

import { createServiceClient } from "@/lib/supabase/admin";
import { isValidEmail, isValidPhone, sanitizePlainText } from "@/lib/sanitize";

export type InquiryFormState = {
  ok?: boolean;
  error?: string;
  fieldId?: string;
};

const rateBucket = new Map<string, { count: number; resetAt: number }>();

function allowRequest(ip: string) {
  const now = Date.now();
  const current = rateBucket.get(ip);
  if (!current || now > current.resetAt) {
    rateBucket.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

function fail(error: string, fieldId?: string): InquiryFormState {
  return { error, fieldId };
}

export async function submitInquiryAction(
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return { ok: true };

  const organization = sanitizePlainText(
    String(formData.get("organization") ?? ""),
    80,
  );
  const name = sanitizePlainText(String(formData.get("name") ?? ""), 40);
  const phone = sanitizePlainText(String(formData.get("phone") ?? ""), 15);
  const email = sanitizePlainText(String(formData.get("email") ?? ""), 80);
  const body = sanitizePlainText(String(formData.get("body") ?? ""), 2000);
  const privacy = formData.get("privacy_agreed") === "on";

  if (!organization) {
    return fail("기관·단체명을 입력해 주세요.", "field-organization");
  }
  if (!name) return fail("담당자명을 입력해 주세요.", "field-name");
  if (!phone) return fail("연락처를 입력해 주세요.", "field-phone");
  if (!isValidPhone(phone)) {
    return fail("연락처는 숫자와 - 만 입력해 주세요.", "field-phone");
  }
  if (!email) return fail("이메일을 입력해 주세요.", "field-email");
  if (!isValidEmail(email)) {
    return fail("올바른 이메일을 입력해 주세요.", "field-email");
  }
  if (!body) return fail("문의 내용을 입력해 주세요.", "field-body");
  if (body.length < 10) {
    return fail("문의 내용을 조금 더 자세히 적어 주세요.", "field-body");
  }
  if (!privacy) {
    return fail("개인정보 수집·이용에 동의해 주세요.", "field-privacy");
  }

  const ip = "form";
  if (!allowRequest(ip)) return fail("잠시 후 다시 시도해 주세요.");

  try {
    const sb = createServiceClient();
    const { error } = await sb.from("inquiries").insert({
      organization,
      name,
      phone,
      email,
      body,
      privacy_agreed_at: new Date().toISOString(),
      status: "received",
    });
    if (error) {
      return fail("접수에 실패했습니다. 전화 또는 이메일로 문의해 주세요.");
    }
    return { ok: true };
  } catch {
    return fail("접수에 실패했습니다. 전화 또는 이메일로 문의해 주세요.");
  }
}
