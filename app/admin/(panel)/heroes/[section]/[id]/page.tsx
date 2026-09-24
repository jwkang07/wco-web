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
  AdminPublishRadios,
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
  const isHome = section === "home";
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
  const imageTitleDefault = isHome
    ? String(row?.image_alt ?? "")
    : String(row?.image_alt || row?.title || "");

  const focusFields = isHome
    ? [
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
          name: "image",
          fieldId: "field-image",
          label: "이미지",
          imageFile: true,
          required: isNew,
        },
      ]
    : [
        {
          name: "image_alt",
          fieldId: "field-image-alt",
          label: "이미지제목",
          maxLength: ADMIN_LIMITS.hero.imageAlt,
          required: true,
        },
        {
          name: "image",
          fieldId: "field-image",
          label: "이미지",
          imageFile: true,
          required: isNew,
        },
      ];

  return (
    <div>
      <AdminPageHeader
        title={isNew ? `${label} 상단비주얼 등록` : `${label} 상단비주얼 수정`}
        description={
          isHome
            ? "이미지·제목·설명을 저장하고 「게시」하면 홈 메인비주얼에 바로 반영됩니다."
            : "이미지와 이미지제목만 등록합니다. 「게시」로 저장하면 바로 공개되고, 이 메뉴의 다른 게시 건은 자동으로 비게시됩니다."
        }
      />
      <AdminFormCard>
        <AdminActionForm
          action={saveHeroAction}
          encType="multipart/form-data"
          confirmNoun="상단비주얼"
          confirmMode={isNew ? "create" : "edit"}
          fields={focusFields}
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
                <p className="mb-1.5 text-xs text-[#6B6B6B]">
                  공개 화면과 같은 비율 미리보기 (가운데 기준)
                </p>
                <div className="relative h-40 w-full max-w-2xl overflow-hidden rounded bg-[#262626]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[#262626]/72 via-[#262626]/52 to-[#262626]/28"
                    aria-hidden
                  />
                </div>
              </AdminFormRow>
            ) : null}

            {isHome ? (
              <>
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
                      defaultValue={imageTitleDefault}
                      className={fieldClassName()}
                    />
                  </label>
                </AdminFormRow>
              </>
            ) : (
              <AdminFormRow>
                <label className={labelClassName()} id="field-image-alt">
                  이미지제목{" "}
                  <span className="text-red-600" aria-hidden>
                    *
                  </span>
                  <input
                    name="image_alt"
                    data-admin-focus
                    required
                    maxLength={ADMIN_LIMITS.hero.imageAlt}
                    defaultValue={imageTitleDefault}
                    className={fieldClassName()}
                  />
                </label>
                <p className="mt-1.5 text-xs text-[#6B6B6B]">
                  관리자 목록에 표시되며, 접근성용 이미지 설명으로도 사용됩니다.
                </p>
              </AdminFormRow>
            )}

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
              <AdminPublishRadios
                defaultPublished={row ? Boolean(row.is_published) : true}
                hint="게시로 저장하면 즉시 공개되고, 이 메뉴의 다른 건은 자동 비게시됩니다."
              />
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
