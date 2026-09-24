import { adminPath } from "@/lib/admin-path";
import {
  deletePerformanceAction,
  savePerformanceAction,
} from "@/app/admin/(panel)/content-actions";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminFileButton } from "@/components/admin/AdminFileButton";
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
              name: "year",
              fieldId: "field-year",
              label: "연도",
              required: true,
              maxLength: ADMIN_LIMITS.performance.year,
            },
            {
              name: "title",
              fieldId: "field-title",
              label: "제목",
              required: true,
              maxLength: ADMIN_LIMITS.performance.title,
            },
            {
              name: "body_html",
              fieldId: "field-body",
              label: "본문",
              required: true,
              richHtml: true,
              maxLength: ADMIN_LIMITS.performance.bodyHtml,
            },
            {
              name: "caption",
              fieldId: "field-caption",
              label: "목록요약",
              required: true,
              maxLength: ADMIN_LIMITS.performance.caption,
            },
            {
              name: "image",
              fieldId: "field-image",
              label: "이미지",
              imageFile: true,
              required: isNew,
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
                  maxLength={ADMIN_LIMITS.performance.year}
                  placeholder="예: 2025"
                  defaultValue={String(row?.year ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>

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
              <label className={labelClassName()} id="field-caption">
                목록요약 <span className="text-red-600" aria-hidden>*</span>
                <textarea
                  name="caption"
                  rows={2}
                  maxLength={ADMIN_LIMITS.performance.caption}
                  defaultValue={String(row?.caption ?? "")}
                  className={fieldClassName()}
                />
                <p className="mt-1.5 text-xs text-[#6B6B6B]">
                  홈·공연 목록 카드에 표시됩니다.
                </p>
              </label>
            </AdminFormRow>

            <AdminFormRow>
              <div>
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt=""
                    className="mb-2 h-44 w-full max-w-md rounded object-cover"
                  />
                ) : null}
                <AdminFileButton
                  name="image"
                  focusId="field-image"
                  label={
                    <>
                      이미지 <span className="text-red-600" aria-hidden>*</span>
                    </>
                  }
                  emptyText="파일이 없습니다."
                  helpText="이미지 권장 사이즈: 가로 850, 세로 무관 (jpg / png / webp)"
                />
              </div>
            </AdminFormRow>

            <AdminFormRow>
              <AdminPublishRadios
                defaultPublished={row ? Boolean(row.is_published) : true}
              />
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
