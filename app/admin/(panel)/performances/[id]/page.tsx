import { adminPath } from "@/lib/admin-path";
import {
  deletePerformanceAction,
  savePerformanceAction,
} from "@/app/admin/(panel)/content-actions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminFileButton } from "@/components/admin/AdminFileButton";
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
import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

export default async function AdminPerformanceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const sb = createServiceClient();
    const { data } = await sb.from("performances").select("*").eq("id", id).maybeSingle();
    row = data;
  }
  const image = getSupabasePublicUrl(row?.image_path as string | null);

  return (
    <div>
      <AdminPageHeader title={isNew ? "공연 등록" : "공연 수정"} />
      <AdminFormCard>
        <AdminActionForm
          action={savePerformanceAction}
          encType="multipart/form-data"
          confirmNoun="공연"
          confirmMode={isNew ? "create" : "edit"}
          fields={[
            {
              name: "title",
              fieldId: "field-title",
              label: "제목",
              required: true,
              maxLength: ADMIN_LIMITS.performance.title,
            },
            {
              name: "caption",
              fieldId: "field-caption",
              label: "캡션",
              maxLength: ADMIN_LIMITS.performance.caption,
            },
            {
              name: "year",
              fieldId: "field-year",
              label: "연도",
              maxLength: ADMIN_LIMITS.performance.year,
            },
            { name: "image", fieldId: "field-image", label: "이미지", imageFile: true },
          ]}
        >
          {!isNew ? <input type="hidden" name="id" value={id} /> : null}
          <AdminFormFields>
            {image ? (
              <AdminFormRow>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" className="h-36 w-56 rounded object-cover" />
              </AdminFormRow>
            ) : null}
            <AdminFormRow>
              <label className={labelClassName()} id="field-title">
                제목 <span className="text-red-600" aria-hidden>*</span>
                <input
                  name="title"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.performance.title}
                  defaultValue={String(row?.title ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-caption">
                캡션
                <textarea
                  name="caption"
                  rows={3}
                  maxLength={ADMIN_LIMITS.performance.caption}
                  defaultValue={String(row?.caption ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-year">
                연도
                <input
                  name="year"
                  maxLength={ADMIN_LIMITS.performance.year}
                  defaultValue={String(row?.year ?? "")}
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
              <AdminFileButton name="image" focusId="field-image" label="이미지" />
            </AdminFormRow>
            <AdminFormRow>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                <label className={adminCheckClassName()}>
                  <input
                    type="checkbox"
                    name="show_on_home"
                    defaultChecked={Boolean(row?.show_on_home)}
                  />
                  홈 최근공연 노출
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
            cancelHref={adminPath("/performances")}
            submitLabel={isNew ? "등록" : "수정"}
            deleteAction={
              !isNew ? (
                <AdminDeleteButton
                  action={deletePerformanceAction}
                  id={id}
                  noun={`공연(${String(row?.title ?? "")})`}
                />
              ) : null
            }
          />
        </AdminActionForm>
      </AdminFormCard>
    </div>
  );
}
