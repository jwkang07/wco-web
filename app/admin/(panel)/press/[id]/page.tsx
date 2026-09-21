import { adminPath } from "@/lib/admin-path";
import { deletePressAction, savePressAction } from "@/app/admin/(panel)/content-actions";
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
      <AdminPageHeader title={isNew ? "보도 등록" : "보도 수정"} />
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
              name: "source",
              fieldId: "field-source",
              label: "출처",
              maxLength: ADMIN_LIMITS.press.source,
            },
            {
              name: "href",
              fieldId: "field-href",
              label: "링크",
              maxLength: ADMIN_LIMITS.press.href,
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
              <label className={labelClassName()} id="field-source">
                출처
                <input
                  name="source"
                  maxLength={ADMIN_LIMITS.press.source}
                  defaultValue={String(row?.source ?? "")}
                  className={fieldClassName()}
                />
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
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-href">
                링크
                <input
                  name="href"
                  maxLength={ADMIN_LIMITS.press.href}
                  placeholder="https:// 또는 /경로 또는 #"
                  defaultValue={String(row?.href ?? "#")}
                  className={fieldClassName()}
                />
                <p className="mt-1.5 text-xs text-[#6B6B6B]">
                  사이트 경로(/…) 또는 http(s)://로 시작하는 외부 URL
                </p>
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
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                <label className={adminCheckClassName()}>
                  <input
                    type="checkbox"
                    name="show_on_home"
                    defaultChecked={Boolean(row?.show_on_home)}
                  />
                  홈 보도자료 노출
                </label>
                <label className={adminCheckClassName()}>
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={row ? Boolean(row.is_published) : true}
                  />
                  공개
                </label>
              </div>
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
