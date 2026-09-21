import { createServiceClient } from "@/lib/supabase/admin";

export async function writeAuditLog(input: {
  adminUsername: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "status";
  entityType: string;
  entityId?: string | null;
  summary?: string;
}) {
  try {
    const sb = createServiceClient();
    await sb.from("admin_audit_logs").insert({
      admin_username: input.adminUsername,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      summary: input.summary ?? "",
    });
  } catch {
    // 스키마 미적용 시에도 본 작업은 막지 않음
  }
}
