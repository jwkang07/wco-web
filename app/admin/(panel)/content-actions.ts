"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AdminFormActionState } from "@/components/admin/AdminActionForm";
import { writeAuditLog } from "@/lib/admin-audit";
import {
  ADMIN_LIMITS,
  adminInvalidNumber,
  adminTooLong,
} from "@/lib/admin-field-limits";
import {
  adminPleaseEnter,
  adminPleaseSelect,
} from "@/lib/admin-form-focus";
import { requireAdminSession } from "@/lib/admin-session";
import { uploadAdminImage } from "@/lib/admin-storage";
import {
  heroAdminListPath,
  isKnownHeroSection,
  revalidateHeroPublic,
} from "@/lib/admin-heroes";
import { adminPath } from "@/lib/admin-path";
import {
  ADMIN_IMAGE_MESSAGE,
  isAllowedAdminImage,
  isValidAdminLinkUrl,
  sanitizePlainLine,
  sanitizePlainMultiline,
} from "@/lib/sanitize";
import { createServiceClient } from "@/lib/supabase/admin";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function fail(message: string, fieldId?: string): AdminFormActionState {
  return { error: message, fieldId };
}

function requireLine(
  value: string,
  label: string,
  fieldId: string,
  max: number,
): { ok: true; value: string } | { ok: false; state: AdminFormActionState } {
  const cleaned = sanitizePlainLine(value, max);
  if (!cleaned) return { ok: false, state: fail(adminPleaseEnter(label), fieldId) };
  if (value.trim().length > max) {
    return { ok: false, state: fail(adminTooLong(label, max), fieldId) };
  }
  return { ok: true, value: cleaned };
}

function optionalLine(
  value: string,
  label: string,
  fieldId: string,
  max: number,
): { ok: true; value: string } | { ok: false; state: AdminFormActionState } {
  if (value.trim().length > max) {
    return { ok: false, state: fail(adminTooLong(label, max), fieldId) };
  }
  return { ok: true, value: sanitizePlainLine(value, max) };
}

function requireMultiline(
  value: string,
  label: string,
  fieldId: string,
  max: number,
): { ok: true; value: string } | { ok: false; state: AdminFormActionState } {
  const cleaned = sanitizePlainMultiline(value, max);
  if (!cleaned) return { ok: false, state: fail(adminPleaseEnter(label), fieldId) };
  if (value.trim().length > max) {
    return { ok: false, state: fail(adminTooLong(label, max), fieldId) };
  }
  return { ok: true, value: cleaned };
}

function optionalMultiline(
  value: string,
  label: string,
  fieldId: string,
  max: number,
): { ok: true; value: string } | { ok: false; state: AdminFormActionState } {
  if (value.trim().length > max) {
    return { ok: false, state: fail(adminTooLong(label, max), fieldId) };
  }
  return { ok: true, value: sanitizePlainMultiline(value, max) };
}

function parseSortOrder(
  raw: string,
  fieldId = "field-sort",
): { ok: true; value: number } | { ok: false; state: AdminFormActionState } {
  if (!raw.trim()) return { ok: true, value: 0 };
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    return { ok: false, state: fail(adminInvalidNumber("정렬"), fieldId) };
  }
  return { ok: true, value: n };
}

function checkImageFile(
  formData: FormData,
  field: string,
  fieldId: string,
): AdminFormActionState | null {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0 && !isAllowedAdminImage(file)) {
    return fail(ADMIN_IMAGE_MESSAGE, fieldId);
  }
  return null;
}

async function maybeUpload(
  formData: FormData,
  field: string,
  bucket: "heroes" | "performances" | "musicians",
  prefix: string,
  existing?: string | null,
) {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    return uploadAdminImage({ bucket, file, prefix });
  }
  return existing ?? null;
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function saveHeroAction(
  _prev: AdminFormActionState,
  formData: FormData,
): Promise<AdminFormActionState> {
  try {
    const session = await requireAdminSession();
    const id = sanitizePlainLine(str(formData, "id"), 80);

    const imgErr = checkImageFile(formData, "image", "field-image");
    if (imgErr) return imgErr;

    const sectionRaw = str(formData, "section_key");
    if (!sectionRaw.trim()) {
      return fail(adminPleaseSelect("메뉴"), "field-section");
    }
    const sectionKey = sanitizePlainLine(sectionRaw, 40);
    if (!isKnownHeroSection(sectionKey)) {
      return fail(adminPleaseSelect("메뉴"), "field-section");
    }

    const title = optionalLine(
      str(formData, "title"),
      "제목",
      "field-title",
      ADMIN_LIMITS.hero.title,
    );
    if (!title.ok) return title.state;
    const description = optionalMultiline(
      str(formData, "description"),
      "설명",
      "field-description",
      ADMIN_LIMITS.hero.description,
    );
    if (!description.ok) return description.state;
    const imageAlt = optionalLine(
      str(formData, "image_alt"),
      "이미지 대체 텍스트",
      "field-image-alt",
      ADMIN_LIMITS.hero.imageAlt,
    );
    if (!imageAlt.ok) return imageAlt.state;
    const imagePosition = optionalLine(
      str(formData, "image_position"),
      "이미지 위치",
      "field-image-position",
      ADMIN_LIMITS.hero.imagePosition,
    );
    if (!imagePosition.ok) return imagePosition.state;
    const sort = parseSortOrder(str(formData, "sort_order"));
    if (!sort.ok) return sort.state;

    const sb = createServiceClient();
    let existingPath: string | null = null;
    if (id) {
      const { data: current } = await sb
        .from("page_heroes")
        .select("image_path")
        .eq("id", id)
        .maybeSingle();
      existingPath = (current?.image_path as string | null) ?? null;
    } else {
      const file = formData.get("image");
      if (!(file instanceof File) || file.size <= 0) {
        return fail(adminPleaseEnter("이미지"), "field-image");
      }
    }

    const imagePath = await maybeUpload(
      formData,
      "image",
      "heroes",
      sectionKey || "hero",
      existingPath,
    );
    const payload = {
      section_key: sectionKey,
      title: title.value,
      description: description.value,
      image_alt: imageAlt.value,
      image_position: imagePosition.value || "center center",
      image_path: imagePath,
      is_published: bool(formData, "is_published"),
      sort_order: sort.value,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      if (payload.is_published) {
        // 게시 = 바로 노출. 같은 메뉴의 다른 건은 비게시·비해제로 정리
        await sb
          .from("page_heroes")
          .update({
            is_published: false,
            is_selected: false,
            updated_at: new Date().toISOString(),
          })
          .eq("section_key", sectionKey)
          .neq("id", id);
        const { error } = await sb
          .from("page_heroes")
          .update({ ...payload, is_selected: true })
          .eq("id", id);
        if (error) return fail(error.message);
      } else {
        const { error } = await sb
          .from("page_heroes")
          .update({ ...payload, is_selected: false })
          .eq("id", id);
        if (error) return fail(error.message);
      }
      await writeAuditLog({
        adminUsername: session.username,
        action: "update",
        entityType: "page_heroes",
        entityId: id,
        summary: `상단비주얼 수정: ${sectionKey}`,
      });
    } else {
      if (payload.is_published) {
        await sb
          .from("page_heroes")
          .update({
            is_published: false,
            is_selected: false,
            updated_at: new Date().toISOString(),
          })
          .eq("section_key", sectionKey);
      }
      const { data: inserted, error } = await sb
        .from("page_heroes")
        .insert({
          ...payload,
          is_selected: payload.is_published,
        })
        .select("id")
        .single();
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "create",
        entityType: "page_heroes",
        entityId: inserted?.id ? String(inserted.id) : undefined,
        summary: `상단비주얼 등록: ${sectionKey}`,
      });
    }

    revalidatePath("/");
    revalidateHeroPublic(sectionKey);
    revalidatePath(heroAdminListPath(sectionKey));
    revalidatePath("/admin/heroes");
    redirect(heroAdminListPath(sectionKey));
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return fail(e instanceof Error ? e.message : "저장에 실패했습니다.");
  }
}

export async function deleteHeroAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = sanitizePlainLine(str(formData, "id"), 80);
  const sb = createServiceClient();
  const { data: row } = await sb
    .from("page_heroes")
    .select("section_key, is_selected")
    .eq("id", id)
    .maybeSingle();
  const sectionKey = String(row?.section_key ?? "");
  const { error } = await sb.from("page_heroes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    adminUsername: session.username,
    action: "delete",
    entityType: "page_heroes",
    entityId: id,
    summary: `상단비주얼 삭제: ${sectionKey}`,
  });
  revalidatePath("/");
  if (sectionKey) {
    revalidateHeroPublic(sectionKey);
    revalidatePath(heroAdminListPath(sectionKey));
  }
  revalidatePath("/admin/heroes");
  redirect(sectionKey ? heroAdminListPath(sectionKey) : adminPath("/heroes/home"));
}

export async function saveHistoryAction(
  _prev: AdminFormActionState,
  formData: FormData,
): Promise<AdminFormActionState> {
  try {
    const session = await requireAdminSession();
    const year = requireLine(str(formData, "year"), "연도", "field-year", ADMIN_LIMITS.history.year);
    if (!year.ok) return year.state;
    const body = requireMultiline(str(formData, "body"), "내용", "field-body", ADMIN_LIMITS.history.body);
    if (!body.ok) return body.state;
    const sort = parseSortOrder(str(formData, "sort_order"));
    if (!sort.ok) return sort.state;

    const id = sanitizePlainLine(str(formData, "id"), 80);
    const payload = {
      year: year.value,
      body: body.value,
      sort_order: sort.value,
      is_published: bool(formData, "is_published"),
      updated_at: new Date().toISOString(),
    };
    const sb = createServiceClient();
    if (id) {
      const { error } = await sb.from("histories").update(payload).eq("id", id);
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "update",
        entityType: "histories",
        entityId: id,
        summary: `히스토리 수정: ${payload.year}`,
      });
    } else {
      const { data, error } = await sb.from("histories").insert(payload).select("id").single();
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "create",
        entityType: "histories",
        entityId: data.id,
        summary: `히스토리 등록: ${payload.year}`,
      });
    }
    revalidatePath("/activities/history");
    revalidatePath("/admin/histories");
    redirect(adminPath("/histories"));
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return fail(e instanceof Error ? e.message : "저장에 실패했습니다.");
  }
}

export async function deleteHistoryAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = sanitizePlainLine(str(formData, "id"), 80);
  const sb = createServiceClient();
  const { error } = await sb.from("histories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAuditLog({
    adminUsername: session.username,
    action: "delete",
    entityType: "histories",
    entityId: id,
    summary: "히스토리 삭제",
  });
  revalidatePath("/activities/history");
  revalidatePath("/admin/histories");
  redirect(adminPath("/histories"));
}

export async function savePerformanceAction(
  _prev: AdminFormActionState,
  formData: FormData,
): Promise<AdminFormActionState> {
  try {
    const session = await requireAdminSession();
    const imgErr = checkImageFile(formData, "image", "field-image");
    if (imgErr) return imgErr;

    const title = requireLine(str(formData, "title"), "제목", "field-title", ADMIN_LIMITS.performance.title);
    if (!title.ok) return title.state;
    const caption = optionalMultiline(
      str(formData, "caption"),
      "캡션",
      "field-caption",
      ADMIN_LIMITS.performance.caption,
    );
    if (!caption.ok) return caption.state;
    const year = optionalLine(str(formData, "year"), "연도", "field-year", ADMIN_LIMITS.performance.year);
    if (!year.ok) return year.state;
    const sort = parseSortOrder(str(formData, "sort_order"));
    if (!sort.ok) return sort.state;

    const id = sanitizePlainLine(str(formData, "id"), 80);
    const sb = createServiceClient();
    let existingPath: string | null = null;
    if (id) {
      const { data } = await sb.from("performances").select("image_path").eq("id", id).maybeSingle();
      existingPath = (data?.image_path as string | null) ?? null;
    }
    const imagePath = await maybeUpload(formData, "image", "performances", "perf", existingPath);
    const payload = {
      title: title.value,
      caption: caption.value,
      year: year.value,
      image_path: imagePath,
      show_on_home: bool(formData, "show_on_home"),
      sort_order: sort.value,
      is_published: bool(formData, "is_published"),
      updated_at: new Date().toISOString(),
    };
    if (id) {
      const { error } = await sb.from("performances").update(payload).eq("id", id);
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "update",
        entityType: "performances",
        entityId: id,
        summary: `공연 수정: ${payload.title}`,
      });
    } else {
      const { data, error } = await sb.from("performances").insert(payload).select("id").single();
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "create",
        entityType: "performances",
        entityId: data.id,
        summary: `공연 등록: ${payload.title}`,
      });
    }
    revalidatePath("/");
    revalidatePath("/activities/performances");
    revalidatePath("/admin/performances");
    redirect(adminPath("/performances"));
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return fail(e instanceof Error ? e.message : "저장에 실패했습니다.");
  }
}

export async function deletePerformanceAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = sanitizePlainLine(str(formData, "id"), 80);
  const sb = createServiceClient();
  const { error } = await sb.from("performances").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAuditLog({
    adminUsername: session.username,
    action: "delete",
    entityType: "performances",
    entityId: id,
    summary: "공연 삭제",
  });
  revalidatePath("/");
  revalidatePath("/activities/performances");
  revalidatePath("/admin/performances");
  redirect(adminPath("/performances"));
}

export async function savePressAction(
  _prev: AdminFormActionState,
  formData: FormData,
): Promise<AdminFormActionState> {
  try {
    const session = await requireAdminSession();
    const title = requireLine(str(formData, "title"), "제목", "field-title", ADMIN_LIMITS.press.title);
    if (!title.ok) return title.state;
    const source = optionalLine(str(formData, "source"), "출처", "field-source", ADMIN_LIMITS.press.source);
    if (!source.ok) return source.state;
    const hrefRaw = optionalLine(str(formData, "href"), "링크", "field-href", ADMIN_LIMITS.press.href);
    if (!hrefRaw.ok) return hrefRaw.state;
    if (!isValidAdminLinkUrl(hrefRaw.value || "#")) {
      return fail("올바른 링크 주소(http/https 또는 /경로)를 입력해 주세요.", "field-href");
    }
    const sort = parseSortOrder(str(formData, "sort_order"));
    if (!sort.ok) return sort.state;

    const id = sanitizePlainLine(str(formData, "id"), 80);
    const publishedOn = sanitizePlainLine(str(formData, "published_on"), 20) || null;
    const payload = {
      title: title.value,
      source: source.value,
      published_on: publishedOn,
      href: hrefRaw.value || "#",
      show_on_home: bool(formData, "show_on_home"),
      sort_order: sort.value,
      is_published: bool(formData, "is_published"),
      updated_at: new Date().toISOString(),
    };
    const sb = createServiceClient();
    if (id) {
      const { error } = await sb.from("press_articles").update(payload).eq("id", id);
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "update",
        entityType: "press_articles",
        entityId: id,
        summary: `보도 수정: ${payload.title}`,
      });
    } else {
      const { data, error } = await sb.from("press_articles").insert(payload).select("id").single();
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "create",
        entityType: "press_articles",
        entityId: data.id,
        summary: `보도 등록: ${payload.title}`,
      });
    }
    revalidatePath("/");
    revalidatePath("/activities/press");
    revalidatePath("/admin/press");
    redirect(adminPath("/press"));
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return fail(e instanceof Error ? e.message : "저장에 실패했습니다.");
  }
}

export async function deletePressAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = sanitizePlainLine(str(formData, "id"), 80);
  const sb = createServiceClient();
  const { error } = await sb.from("press_articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAuditLog({
    adminUsername: session.username,
    action: "delete",
    entityType: "press_articles",
    entityId: id,
    summary: "보도 삭제",
  });
  revalidatePath("/");
  revalidatePath("/activities/press");
  revalidatePath("/admin/press");
  redirect(adminPath("/press"));
}

export async function saveMusicianAction(
  _prev: AdminFormActionState,
  formData: FormData,
): Promise<AdminFormActionState> {
  try {
    const session = await requireAdminSession();
    const imgErr = checkImageFile(formData, "image", "field-image");
    if (imgErr) return imgErr;

    const name = requireLine(str(formData, "name"), "이름", "field-name", ADMIN_LIMITS.musician.name);
    if (!name.ok) return name.state;
    const sectionRaw = str(formData, "section_name");
    if (!sectionRaw.trim()) {
      return fail(adminPleaseSelect("악기군"), "field-section");
    }
    const section = optionalLine(
      sectionRaw,
      "악기군",
      "field-section",
      ADMIN_LIMITS.musician.sectionName,
    );
    if (!section.ok) return section.state;
    if (!section.value) return fail(adminPleaseSelect("악기군"), "field-section");
    const instrument = optionalLine(
      str(formData, "instrument"),
      "악기",
      "field-instrument",
      ADMIN_LIMITS.musician.instrument,
    );
    if (!instrument.ok) return instrument.state;
    const role = optionalLine(str(formData, "role"), "역할", "field-role", ADMIN_LIMITS.musician.role);
    if (!role.ok) return role.state;
    const sort = parseSortOrder(str(formData, "sort_order"));
    if (!sort.ok) return sort.state;

    const id = sanitizePlainLine(str(formData, "id"), 80);
    const sb = createServiceClient();
    let existingPath: string | null = null;
    if (id) {
      const { data } = await sb.from("musicians").select("photo_path").eq("id", id).maybeSingle();
      existingPath = (data?.photo_path as string | null) ?? null;
    }
    const photoPath = await maybeUpload(formData, "image", "musicians", "member", existingPath);
    const payload = {
      name: name.value,
      instrument: instrument.value,
      section_name: section.value,
      role: role.value,
      photo_path: photoPath,
      sort_order: sort.value,
      is_published: bool(formData, "is_published"),
      updated_at: new Date().toISOString(),
    };
    if (id) {
      const { error } = await sb.from("musicians").update(payload).eq("id", id);
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "update",
        entityType: "musicians",
        entityId: id,
        summary: `단원 수정: ${payload.name}`,
      });
    } else {
      const { data, error } = await sb.from("musicians").insert(payload).select("id").single();
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "create",
        entityType: "musicians",
        entityId: data.id,
        summary: `단원 등록: ${payload.name}`,
      });
    }
    revalidatePath("/musicians");
    revalidatePath("/admin/musicians");
    redirect(adminPath("/musicians"));
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return fail(e instanceof Error ? e.message : "저장에 실패했습니다.");
  }
}

export async function deleteMusicianAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = sanitizePlainLine(str(formData, "id"), 80);
  const sb = createServiceClient();
  const { error } = await sb.from("musicians").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAuditLog({
    adminUsername: session.username,
    action: "delete",
    entityType: "musicians",
    entityId: id,
    summary: "단원 삭제",
  });
  revalidatePath("/musicians");
  revalidatePath("/admin/musicians");
  redirect(adminPath("/musicians"));
}

export async function saveFaqAction(
  _prev: AdminFormActionState,
  formData: FormData,
): Promise<AdminFormActionState> {
  try {
    const session = await requireAdminSession();
    const question = requireLine(
      str(formData, "question"),
      "질문",
      "field-question",
      ADMIN_LIMITS.faq.question,
    );
    if (!question.ok) return question.state;
    const answer = requireMultiline(
      str(formData, "answer"),
      "답변",
      "field-answer",
      ADMIN_LIMITS.faq.answer,
    );
    if (!answer.ok) return answer.state;
    const sort = parseSortOrder(str(formData, "sort_order"));
    if (!sort.ok) return sort.state;

    const id = sanitizePlainLine(str(formData, "id"), 80);
    const payload = {
      question: question.value,
      answer: answer.value,
      sort_order: sort.value,
      is_published: bool(formData, "is_published"),
      updated_at: new Date().toISOString(),
    };
    const sb = createServiceClient();
    if (id) {
      const { error } = await sb.from("faqs").update(payload).eq("id", id);
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "update",
        entityType: "faqs",
        entityId: id,
        summary: "FAQ 수정",
      });
    } else {
      const { data, error } = await sb.from("faqs").insert(payload).select("id").single();
      if (error) return fail(error.message);
      await writeAuditLog({
        adminUsername: session.username,
        action: "create",
        entityType: "faqs",
        entityId: data.id,
        summary: "FAQ 등록",
      });
    }
    revalidatePath("/contact");
    revalidatePath("/admin/faqs");
    redirect(adminPath("/faqs"));
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return fail(e instanceof Error ? e.message : "저장에 실패했습니다.");
  }
}

export async function deleteFaqAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = sanitizePlainLine(str(formData, "id"), 80);
  const sb = createServiceClient();
  const { error } = await sb.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAuditLog({
    adminUsername: session.username,
    action: "delete",
    entityType: "faqs",
    entityId: id,
    summary: "FAQ 삭제",
  });
  revalidatePath("/contact");
  revalidatePath("/admin/faqs");
  redirect(adminPath("/faqs"));
}

export async function updateInquiryAction(
  _prev: AdminFormActionState,
  formData: FormData,
): Promise<AdminFormActionState> {
  try {
    const session = await requireAdminSession();
    const status = sanitizePlainLine(str(formData, "status"), 20);
    if (!["received", "in_progress", "done"].includes(status)) {
      return fail(adminPleaseSelect("상태"), "field-status");
    }
    const memo = optionalMultiline(
      str(formData, "admin_memo"),
      "관리자 메모",
      "field-memo",
      ADMIN_LIMITS.inquiry.memo,
    );
    if (!memo.ok) return memo.state;

    const id = sanitizePlainLine(str(formData, "id"), 80);
    const sb = createServiceClient();
    const { error } = await sb
      .from("inquiries")
      .update({
        status,
        admin_memo: memo.value,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) return fail(error.message);
    await writeAuditLog({
      adminUsername: session.username,
      action: "status",
      entityType: "inquiries",
      entityId: id,
      summary: `문의 상태: ${status}`,
    });
    revalidatePath("/admin/inquiries");
    redirect(adminPath(`/inquiries/${id}`));
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return fail(e instanceof Error ? e.message : "저장에 실패했습니다.");
  }
}
