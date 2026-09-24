/**
 * 리치 HTML(TipTip 등) XSS 살균 — 저장·표시 모두에서 사용.
 */
import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "code",
  "pre",
  "blockquote",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "a",
  "span",
  "div",
];

function isSafeHref(href: string): boolean {
  const v = href.trim();
  if (!v) return false;
  if (v.startsWith("/")) return !v.toLowerCase().startsWith("//");
  if (v.startsWith("#")) return true;
  if (v.startsWith("mailto:") || v.startsWith("tel:")) return true;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeRichHtml(html: string): string {
  const raw = String(html ?? "");
  if (!raw.trim()) return "";
  try {
    return sanitizeHtmlLib(raw, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: {
        a: ["href", "name", "target", "rel", "title", "class"],
        p: ["style", "class"],
        h2: ["style", "class"],
        h3: ["style", "class"],
        h4: ["style", "class"],
        div: ["style", "class"],
        "*": ["class"],
      },
      allowedStyles: {
        "*": {
          "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        },
      },
      allowedSchemes: ["http", "https", "mailto", "tel"],
      allowProtocolRelative: false,
      transformTags: {
        a: (tagName, attribs) => {
          const href = String(attribs.href ?? "");
          if (!isSafeHref(href)) {
            return { tagName: "span", attribs: {} };
          }
          const next: Record<string, string> = {
            ...attribs,
            href,
            rel: "noopener noreferrer",
          };
          if (attribs.target === "_blank") {
            next.target = "_blank";
          } else {
            delete next.target;
          }
          return { tagName, attribs: next };
        },
      },
    });
  } catch {
    return "";
  }
}

/** 에디터 빈 문서 여부 */
export function isEmptyRichHtml(html: string): boolean {
  const text = sanitizeRichHtml(html)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return !text;
}
