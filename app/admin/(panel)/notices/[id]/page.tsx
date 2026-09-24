import { adminPath } from "@/lib/admin-path";
import {
  deleteNoticeAction,
  saveNoticeAction,
} from "@/app/admin/(panel)/content-actions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminRichTextField } from "@/components/admin/AdminRichTextField";
import {
  AdminFormActions,
  AdminFormCard,
  AdminFormFields,
  AdminFormRow,
  AdminPageHeader,
  AdminPublishRadios,
  fieldClassName,
  labelClassName,
} from "@/components/admin/AdminUi";
import { ADMIN_LIMITS } from "@/lib/admin-field-limits";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminNoticeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const sb = createServiceClient();
    const { data } = await sb.from("notices").select("*").eq("id", id).maybeSingle();
    row = data;
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? "공지 등록" : "공지 수정"}
        description="제목은 공개 목록에서 상세로 연결됩니다. 본문에 링크·이미지를 넣을 수 있습니다. 메인 노출·상단 고정은 목록에서 설정합니다."
      />
      <AdminFormCard>
        <AdminActionForm
          action={saveNoticeAction}
          confirmNoun="공지사항"
          confirmMode={isNew ? "create" : "edit"}
          fields={[
            {
              name: "title",
              fieldId: "field-title",
              label: "제목",
              required: true,
              maxLength: ADMIN_LIMITS.notice.title,
            },
            {
              name: "body_html",
              fieldId: "field-body",
              label: "본문",
              required: true,
              richHtml: true,
              maxLength: ADMIN_LIMITS.notice.bodyHtml,
            },
          ]}
        >
          {!isNew ? <input type="hidden" name="id" value={id} /> : null}
          <AdminFormFields>
            <AdminFormRow>
              <label className={labelClassName()} id="field-title">
                제목 <span className="text-red-600" aria-hidden>*</span>
                <input
                  name="title"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.notice.title}
                  defaultValue={String(row?.title ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>

            <AdminFormRow>
              <div>
                <p className={labelClassName()} id="field-body">
                  본문 <span className="text-red-600" aria-hidden>*</span>
                </p>
                <div className="mt-1.5">
                  <AdminRichTextField
                    name="body_html"
                    labelId="field-body"
                    defaultValue={String(row?.body_html ?? "")}
                    placeholder="공지 내용을 입력하세요."
                  />
                </div>
              </div>
            </AdminFormRow>

            <AdminFormRow>
              <AdminPublishRadios
                defaultPublished={row ? Boolean(row.is_published) : true}
              />
            </AdminFormRow>
          </AdminFormFields>
          <AdminFormActions
            cancelHref={adminPath("/notices")}
            submitLabel={isNew ? "등록" : "수정"}
            deleteAction={
              !isNew ? (
                <AdminDeleteButton
                  action={deleteNoticeAction}
                  id={id}
                  noun={`공지(${String(row?.title ?? "")})`}
                />
              ) : null
            }
          />
        </AdminActionForm>
      </AdminFormCard>
    </div>
  );
}
