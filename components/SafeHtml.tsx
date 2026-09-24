import { sanitizeRichHtml } from "@/lib/sanitize-html";

export function SafeHtml({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  const clean = sanitizeRichHtml(html);
  if (!clean) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
