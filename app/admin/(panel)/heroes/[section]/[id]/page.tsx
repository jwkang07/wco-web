import { notFound } from "next/navigation";
import {
  deleteHeroAction,
  saveHeroAction,
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
import {
  heroAdminListPath,
  heroSectionLabel,
  isKnownHeroSection,
} from "@/lib/admin-heroes";
import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

export default async function AdminHeroEditPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section, id } = await params;
  if (!isKnownHeroSection(section)) notFound();

  const isNew = id === "new";
  const label = heroSectionLabel(section);
  let row: Record<string, unknown> | null = null;

  if (!isNew) {
    const sb = createServiceClient();
    const { data } = await sb
      .from("page_heroes")
      .select("*")
      .eq("id", id)
      .eq("section_key", section)
      .maybeSingle();
    if (!data) notFound();
    row = data;
  }

  const image = getSupabasePublicUrl(row?.image_path as string | null);
  const listHref = heroAdminListPath(section);

  return (
    <div>
      <AdminPageHeader
        title={isNew ? `${label} 상단비주얼 등록` : `${label} 상단비주얼 수정`}
        description="모든 메뉴 동일: 게시 저장 후 목록에서 「노출 선정」·「노출 반영」을 해야 해당 메뉴·하위 페이지에 적용됩니다. 비게시면 이미지가 표시되지 않습니다."
      />
      <AdminFormCard>
        <AdminActionForm
          action={saveHeroAction}
          encType="multipart/form-data"
          confirmNoun="상단비주얼"
          confirmMode={isNew ? "create" : "edit"}
          fields={[
            {
              name: "title",
              fieldId: "field-title",
              label: "제목",
              maxLength: ADMIN_LIMITS.hero.title,
            },
            {
              name: "description",
              fieldId: "field-description",
              label: "설명",
              maxLength: ADMIN_LIMITS.hero.description,
            },
            {
              name: "image_alt",
              fieldId: "field-image-alt",
              label: "이미지 대체 텍스트",
              maxLength: ADMIN_LIMITS.hero.imageAlt,
            },
            {
              name: "image_position",
              fieldId: "field-image-position",
              label: "이미지 위치",
              maxLength: ADMIN_LIMITS.hero.imagePosition,
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
          <input type="hidden" name="section_key" value={section} />

          <AdminFormFields>
            <AdminFormRow>
              <p className="rounded border border-black/10 bg-black/[0.02] px-3 py-2 text-sm">
                메뉴: <strong>{label}</strong>
              </p>
            </AdminFormRow>
            {image ? (
              <AdminFormRow>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt=""
                  className="h-40 w-full max-w-2xl rounded object-cover"
                />
              </AdminFormRow>
            ) : null}
            <AdminFormRow>
              <label className={labelClassName()} id="field-title">
                제목/텍스트
                <input
                  name="title"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.hero.title}
                  defaultValue={String(row?.title ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-description">
                설명
                <textarea
                  name="description"
                  rows={3}
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.hero.description}
                  defaultValue={String(row?.description ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-image-alt">
                이미지 대체 텍스트
                <input
                  name="image_alt"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.hero.imageAlt}
                  defaultValue={String(row?.image_alt ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-image-position">
                이미지 위치 (CSS object-position)
                <input
                  name="image_position"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.hero.imagePosition}
                  defaultValue={String(row?.image_position ?? "center center")}
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
              <AdminFileButton
                name="image"
                focusId="field-image"
                label={
                  <>
                    이미지{" "}
                    {isNew ? (
                      <span className="text-red-600" aria-hidden>
                        *
                      </span>
                    ) : (
                      "(교체)"
                    )}
                  </>
                }
              />
            </AdminFormRow>
            <AdminFormRow>
              <label className={adminCheckClassName()}>
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={row ? Boolean(row.is_published) : true}
                />
                게시
              </label>
            </AdminFormRow>
          </AdminFormFields>

          <AdminFormActions
            cancelHref={listHref}
            submitLabel={isNew ? "등록" : "수정"}
            deleteAction={
              !isNew ? (
                <AdminDeleteButton
                  action={deleteHeroAction}
                  id={id}
                  noun={`상단비주얼(${label})`}
                />
              ) : null
            }
          />
        </AdminActionForm>
      </AdminFormCard>
    </div>
  );
}
