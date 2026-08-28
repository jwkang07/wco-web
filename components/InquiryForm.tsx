type InquiryFormProps = {
  title: string;
  description: string;
  fields: readonly { label: string; type: "text" | "email" | "tel" | "textarea" }[];
  submitLabel?: string;
};

export function InquiryForm({
  title,
  description,
  fields,
  submitLabel = "보내기 (준비 중)",
}: InquiryFormProps) {
  return (
    <form className="rounded-xl bg-wco-peach p-6 sm:p-8">
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
                className="mt-1 w-full rounded-lg border border-white bg-white px-3 py-2 text-sm disabled:opacity-60"
              />
            ) : (
              <input
                type={field.type}
                disabled
                placeholder="준비 중"
                className="mt-1 w-full rounded-lg border border-white bg-white px-3 py-2 text-sm disabled:opacity-60"
              />
            )}
          </label>
        ))}
        <button
          type="button"
          disabled
          className="rounded-full bg-wco-orange px-6 py-2.5 text-sm font-semibold text-white opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
