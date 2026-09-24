import { adminPath } from "@/lib/admin-path";
import { deleteMusicianAction, saveMusicianAction } from "@/app/admin/(panel)/content-actions";
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
import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

const SECTIONS = ["현악기", "목관악기", "금관악기", "타악기"];

export default async function AdminMusicianEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const sb = createServiceClient();
    const { data } = await sb.from("musicians").select("*").eq("id", id).maybeSingle();
    row = data;
  }
  const photo = getSupabasePublicUrl(row?.photo_path as string | null);

  return (
    <div>
      <AdminPageHeader title={isNew ? "단원 등록" : "단원 수정"} />
      <AdminFormCard>
        <AdminActionForm
          action={saveMusicianAction}
          encType="multipart/form-data"
          confirmNoun="단원"
          confirmMode={isNew ? "create" : "edit"}
          fields={[
            {
              name: "name",
              fieldId: "field-name",
              label: "이름",
              required: true,
              maxLength: ADMIN_LIMITS.musician.name,
            },
            {
              name: "section_name",
              fieldId: "field-section",
              label: "악기군",
              required: true,
              maxLength: ADMIN_LIMITS.musician.sectionName,
            },
            {
              name: "instrument",
              fieldId: "field-instrument",
              label: "악기",
              maxLength: ADMIN_LIMITS.musician.instrument,
            },
            {
              name: "role",
              fieldId: "field-role",
              label: "역할",
              maxLength: ADMIN_LIMITS.musician.role,
            },
            { name: "image", fieldId: "field-image", label: "사진", imageFile: true },
          ]}
        >
          {!isNew ? <input type="hidden" name="id" value={id} /> : null}
          <AdminFormFields>
            {photo ? (
              <AdminFormRow>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="h-32 w-32 rounded object-cover" />
              </AdminFormRow>
            ) : null}
            <AdminFormRow>
              <label className={labelClassName()} id="field-name">
                이름 <span className="text-red-600" aria-hidden>*</span>
                <input
                  name="name"
                  data-admin-focus
                  maxLength={ADMIN_LIMITS.musician.name}
                  defaultValue={String(row?.name ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-section">
                악기군 <span className="text-red-600" aria-hidden>*</span>
                <select
                  name="section_name"
                  data-admin-focus
                  defaultValue={String(row?.section_name ?? "현악기")}
                  className={fieldClassName()}
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-instrument">
                악기
                <input
                  name="instrument"
                  maxLength={ADMIN_LIMITS.musician.instrument}
                  defaultValue={String(row?.instrument ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <label className={labelClassName()} id="field-role">
                역할
                <input
                  name="role"
                  maxLength={ADMIN_LIMITS.musician.role}
                  defaultValue={String(row?.role ?? "")}
                  className={fieldClassName()}
                />
              </label>
            </AdminFormRow>
            <AdminFormRow>
              <AdminFileButton name="image" focusId="field-image" label="사진" />
            </AdminFormRow>
            <AdminFormRow>
              <AdminPublishRadios
                defaultPublished={row ? Boolean(row.is_published) : true}
              />
            </AdminFormRow>
          </AdminFormFields>
          <AdminFormActions
            cancelHref={adminPath("/musicians")}
            submitLabel={isNew ? "등록" : "수정"}
            deleteAction={
              !isNew ? (
                <AdminDeleteButton
                  action={deleteMusicianAction}
                  id={id}
                  noun={`단원(${String(row?.name ?? "")})`}
                />
              ) : null
            }
          />
        </AdminActionForm>
      </AdminFormCard>
    </div>
  );
}
