import { adminPath } from "@/lib/admin-path";
import { deleteHistoryAction, saveHistoryAction } from "@/app/admin/(panel)/content-actions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import {
  AdminFormActions,
  AdminFormCard,
  AdminFormFields,
  AdminFormRow,
  AdminPageHeader,
  adminCheckClassName,
  fieldClassName,
  labelClassName,
} from "@/components/admin/AdminUi";
import { ADMIN_LIMITS } from "@/lib/admin-field-limits";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminHistoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const sb = createServiceClient();
    const { data } = await sb.from("histories").select("*").eq("id", id).maybeSingle();
    row = data;
  }

  return (
    <div>
      <AdminPageHeader title={isNew ? "히스토리 등록" : "히스토리 수정"} />
      <AdminFormCard>
        <AdminActionForm
          action={saveHistoryAction}
          confirmNoun="히스토리"
          confirmMode={isNew ? "create" : "edit"}
          fields={[
            {
              name: "year",
              fieldId: "field-year",
              label: "연도",
              required: true,
              maxLength: ADMIN_LIMITS.history.year,
            },
            {
              name: "body",
              fieldId: "field-body",
              label: "내용",
              required: true,
              maxLength: ADMIN_LIMITS.history.body,
            },
          ]}
        >
          {!isNew ? <input type="hidden" name="id" value={id} /> : null}
          <AdminFormFields>
            <AdminFormRow>
              <label className={labelClassName()} id="field-year">
                연도 <span className="text-red-600" aria-hidden>*</span>
                <input
                  name="year"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.history.year}
                  defaultValue={String(row?.year ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-body">
                내용 <span className="text-red-600" aria-hidden>*</span>
                <textarea
                  name="body"
                  rows={4}
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.history.body}
                  defaultValue={String(row?.body ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-sort">
                정렬
                <input
                  name="sort_order"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={String(row?.sort_order ?? 0)}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={adminCheckClassName()}>
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={row ? Boolean(row.is_published) : true}
                />
                공개
              </label>
            </AdminFormRow>
          </AdminFormFields>
          <AdminFormActions
            cancelHref={adminPath("/histories")}
            submitLabel={isNew ? "등록" : "수정"}
            deleteAction={
              !isNew ? (
                <AdminDeleteButton
                  action={deleteHistoryAction}
                  id={id}
                  noun={`히스토리(${String(row?.year ?? "")})`}
                />
              ) : null
            }
          />
        </AdminActionForm>
      </AdminFormCard>
    </div>
  );
}
