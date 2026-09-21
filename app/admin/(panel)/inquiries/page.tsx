import { InquiryListClient } from "@/components/admin/InquiryListClient";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminInquiriesPage() {
  let rows: Array<{
    id: string;
    created_at: string;
    name: string;
    organization: string | null;
    email: string;
    phone: string | null;
    status: string;
  }> = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("inquiries")
      .select("id, created_at, name, organization, email, phone, status")
      .order("created_at", { ascending: false });
    if (error) loadError = error.message;
    rows = data ?? [];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return <InquiryListClient items={rows} loadError={loadError} />;
}
