import { AuditListClient } from "@/components/admin/AuditListClient";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminAuditPage() {
  let rows: Array<{
    id: string;
    created_at: string;
    admin_username: string;
    action: string;
    entity_type: string;
    summary: string | null;
  }> = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("admin_audit_logs")
      .select("id, created_at, admin_username, action, entity_type, summary")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) loadError = error.message;
    rows = data ?? [];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return <AuditListClient items={rows} loadError={loadError} />;
}
