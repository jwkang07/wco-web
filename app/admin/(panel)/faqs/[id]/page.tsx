import { adminPath } from "@/lib/admin-path";
import { deleteFaqAction, saveFaqAction } from "@/app/admin/(panel)/content-actions";
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

export default async function AdminFaqEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const sb = createServiceClient();
    const { data } = await sb.from("faqs").select("*").eq("id", id).maybeSingle();
    row = data;
  }

  return (
    <div>
      <AdminPageHeader title={isNew ? "FAQ 등록" : "FAQ 수정"} />
      <AdminFormCard>
        <AdminActionForm
          action={saveFaqAction}
          confirmNoun="FAQ"
          confirmMode={isNew ? "create" : "edit"}
          fields={[
            {
              name: "question",
              fieldId: "field-question",
              label: "질문",
              required: true,
              maxLength: ADMIN_LIMITS.faq.question,
            },
            {
              name: "answer",
              fieldId: "field-answer",
              label: "답변",
              required: true,
              maxLength: ADMIN_LIMITS.faq.answer,
            },
          ]}
        >
          {!isNew ? <input type="hidden" name="id" value={id} /> : null}
          <AdminFormFields>
            <AdminFormRow>
              <label className={labelClassName()} id="field-question">
                질문 <span className="text-red-600" aria-hidden>*</span>
                <input
                  name="question"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.faq.question}
                  defaultValue={String(row?.question ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-answer">
                답변 <span className="text-red-600" aria-hidden>*</span>
                <textarea
                  name="answer"
                  rows={6}
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.faq.answer}
                  defaultValue={String(row?.answer ?? "")}
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
            cancelHref={adminPath("/faqs")}
            submitLabel={isNew ? "등록" : "수정"}
            deleteAction={
              !isNew ? (
                <AdminDeleteButton action={deleteFaqAction} id={id} noun="FAQ" />
              ) : null
            }
          />
        </AdminActionForm>
      </AdminFormCard>
    </div>
  );
}
