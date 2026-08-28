type InquiryFormProps = {
  title: string;
  description: string;
  fields: readonly { label: string; type: "text" | "email" | "tel" | "textarea" }[];
  submitLabel?: string;
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-wco-grey/12 bg-white px-3 py-2.5 text-sm text-wco-grey outline-none placeholder:text-wco-muted/70 focus:border-wco-orange focus:ring-2 focus:ring-wco-orange/15 disabled:bg-neutral-50 disabled:text-wco-muted";

export function InquiryForm({
  title,
  description,
  fields,
  submitLabel = "보내기 (준비 중)",
}: InquiryFormProps) {
  return (
    <form className="rounded-xl border border-wco-grey/10 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-xl font-bold text-wco-grey">{title}</h2>
      <p className="mt-2 text-sm text-wco-muted">{description}</p>
      <div className="mt-6 space-y-4">
        {fields.map((field) => (
          <label key={field.label} className="block text-sm">
            <span className="font-medium text-wco-grey">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                rows={4}
                disabled
                placeholder="준비 중"
                className={fieldClass}
              />
            ) : (
              <input
                type={field.type}
                disabled
                placeholder="준비 중"
                className={fieldClass}
              />
            )}
          </label>
        ))}
        <button
          type="button"
          disabled
          className="w-full rounded-xl bg-wco-orange px-6 py-3 text-sm font-semibold text-white opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
