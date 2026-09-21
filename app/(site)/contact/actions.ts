"use server";

import { createServiceClient } from "@/lib/supabase/admin";
import { isValidEmail, isValidPhone, sanitizePlainText } from "@/lib/sanitize";

export type InquiryFormState = {
  ok?: boolean;
  error?: string;
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

export async function submitInquiryAction(
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return { ok: true };

  const organization = sanitizePlainText(String(formData.get("organization") ?? ""), 80);
  const name = sanitizePlainText(String(formData.get("name") ?? ""), 40);
  const phone = sanitizePlainText(String(formData.get("phone") ?? ""), 15);
  const email = sanitizePlainText(String(formData.get("email") ?? ""), 80);
  const body = sanitizePlainText(String(formData.get("body") ?? ""), 2000);
  const privacy = formData.get("privacy_agreed") === "on";

  if (!privacy) return { error: "개인정보 수집·이용에 동의해 주세요." };
  if (!name) return { error: "담당자명을 입력해 주세요." };
  if (!email || !isValidEmail(email)) return { error: "올바른 이메일을 입력해 주세요." };
  if (phone && !isValidPhone(phone)) return { error: "연락처는 숫자와 - 만 입력해 주세요." };
  if (!body || body.length < 10) return { error: "문의 내용을 조금 더 자세히 적어 주세요." };

  const ip = "form";
  if (!allowRequest(ip)) return { error: "잠시 후 다시 시도해 주세요." };

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
    if (error) return { error: "접수에 실패했습니다. 전화 또는 이메일로 문의해 주세요." };
    return { ok: true };
  } catch {
    return { error: "접수에 실패했습니다. 전화 또는 이메일로 문의해 주세요." };
  }
}
