import { adminPath } from "@/lib/admin-path";
import { notFound } from "next/navigation";
import { updateInquiryAction } from "@/app/admin/(panel)/content-actions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import {
  AdminCard,
  AdminFormActions,
  AdminFormCard,
  AdminFormFields,
  AdminFormRow,
  AdminPageHeader,
  fieldClassName,
  labelClassName,
} from "@/components/admin/AdminUi";
import { ADMIN_LIMITS } from "@/lib/admin-field-limits";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createServiceClient();
  const { data: row } = await sb.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();

  return (
    <div>
      <AdminPageHeader
        title="문의 상세"
        description="전화·개별 메일로 안내한 뒤 상태와 메모를 남겨 주세요."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <AdminCard>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[#6B6B6B]">접수 시각</dt>
              <dd className="mt-1 font-semibold">
                {new Date(String(row.created_at)).toLocaleString("ko-KR")}
              </dd>
            </div>
            <div>
              <dt className="text-[#6B6B6B]">기관</dt>
              <dd className="mt-1 font-semibold">{String(row.organization || "-")}</dd>
            </div>
            <div>
              <dt className="text-[#6B6B6B]">담당자</dt>
              <dd className="mt-1 font-semibold">{String(row.name)}</dd>
            </div>
            <div>
              <dt className="text-[#6B6B6B]">연락처</dt>
              <dd className="mt-1 font-semibold">{String(row.phone || "-")}</dd>
            </div>
            <div>
              <dt className="text-[#6B6B6B]">이메일</dt>
              <dd className="mt-1 break-all font-semibold">{String(row.email)}</dd>
            </div>
            <div>
              <dt className="text-[#6B6B6B]">개인정보 동의</dt>
              <dd className="mt-1 font-semibold">
                {new Date(String(row.privacy_agreed_at)).toLocaleString("ko-KR")}
              </dd>
            </div>
            <div>
              <dt className="text-[#6B6B6B]">문의 내용</dt>
              <dd className="mt-1.5 whitespace-pre-wrap leading-7">{String(row.body)}</dd>
            </div>
          </dl>
        </AdminCard>
        <AdminFormCard>
          <AdminActionForm
            action={updateInquiryAction}
            confirmNoun="문의"
            confirmMode="edit"
            fields={[
              {
                name: "status",
                fieldId: "field-status",
                label: "상태",
                required: true,
              },
              {
                name: "admin_memo",
                fieldId: "field-memo",
                label: "관리자 메모",
                maxLength: ADMIN_LIMITS.inquiry.memo,
              },
            ]}
          >
            <input type="hidden" name="id" value={id} />
            <AdminFormFields>
              <AdminFormRow>
                <label className={labelClassName()} id="field-status">
                  상태
                  <select
                    name="status"
                    data-admin-focus
                    defaultValue={String(row.status)}
                    className={fieldClassName()}
                  >
                    <option value="received">접수</option>
                    <option value="in_progress">처리중</option>
                    <option value="done">완료</option>
                  </select>
                </label>
              </AdminFormRow>
              <AdminFormRow>
                <label className={labelClassName()} id="field-memo">
                  관리자 메모
                  <textarea
                    name="admin_memo"
                    rows={8}
                    data-admin-focus
                    maxLength={ADMIN_LIMITS.inquiry.memo}
                    defaultValue={String(row.admin_memo ?? "")}
                    className={fieldClassName()}
                  />
                </label>
              </AdminFormRow>
            </AdminFormFields>
            <AdminFormActions cancelHref={adminPath("/inquiries")} submitLabel="저장" />
          </AdminActionForm>
        </AdminFormCard>
      </div>
    </div>
  );
}
