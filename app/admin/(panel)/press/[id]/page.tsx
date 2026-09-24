import { adminPath } from "@/lib/admin-path";
import { deletePressAction, savePressAction } from "@/app/admin/(panel)/content-actions";
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

export default async function AdminPressEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const sb = createServiceClient();
    const { data } = await sb.from("press_articles").select("*").eq("id", id).maybeSingle();
    row = data;
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? "보도 등록" : "보도 수정"}
        description="제목은 공개 목록에서 상세로 연결됩니다. 상세에는 본문·출처·날짜가 보이며, 별도 원문 링크는 없습니다."
      />
      <AdminFormCard>
        <AdminActionForm
          action={savePressAction}
          confirmNoun="보도자료"
          confirmMode={isNew ? "create" : "edit"}
          fields={[
            {
              name: "title",
              fieldId: "field-title",
              label: "제목",
              required: true,
              maxLength: ADMIN_LIMITS.press.title,
            },
            {
              name: "body_html",
              fieldId: "field-body",
              label: "본문",
              required: true,
              richHtml: true,
              maxLength: ADMIN_LIMITS.press.bodyHtml,
            },
            {
              name: "source",
              fieldId: "field-source",
              label: "출처",
              maxLength: ADMIN_LIMITS.press.source,
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
                  maxLength={ADMIN_LIMITS.press.title}
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
                    placeholder="본문 내용을 입력하세요."
                  />
                </div>
              </div>
            </AdminFormRow>

            <AdminFormRow>
              <label className={labelClassName()} id="field-source">
                출처
                <input
                  name="source"
                  maxLength={ADMIN_LIMITS.press.source}
                  defaultValue={String(row?.source ?? "")}
                  className={fieldClassName()}
                />
                <p className="mt-1.5 text-xs text-[#6B6B6B]">
                  언론사·기관명 등. 목록(NO와 제목 사이)과 상세에 표시됩니다.
                </p>
              </label>
            </AdminFormRow>

            <AdminFormRow>
              <label className={labelClassName()}>
                날짜
                <input
                  name="published_on"
                  type="date"
                  defaultValue={String(row?.published_on ?? "")}
                  className={fieldClassName()}
                />
                <p className="mt-1.5 text-xs text-[#6B6B6B]">
                  보도·게시 기준일. 비우면 등록일 기준으로 보일 수 있습니다.
                </p>
              </label>
            </AdminFormRow>

            <AdminFormRow>
              <AdminPublishRadios
                defaultPublished={row ? Boolean(row.is_published) : true}
              />
            </AdminFormRow>
          </AdminFormFields>
          <AdminFormActions
            cancelHref={adminPath("/press")}
            submitLabel={isNew ? "등록" : "수정"}
            deleteAction={
              !isNew ? (
                <AdminDeleteButton
                  action={deletePressAction}
                  id={id}
                  noun={`보도(${String(row?.title ?? "")})`}
                />
              ) : null
            }
          />
        </AdminActionForm>
      </AdminFormCard>
    </div>
  );
}
