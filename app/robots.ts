import type { MetadataRoute } from "next";
import { getAdminBasePath } from "@/lib/admin-path";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const adminBase = getAdminBasePath();
  // 관리자 공개 경로 + 내부 /admin — 색인 안내(보안 통제 아님)
  const disallow = [
    `${adminBase}/`,
    adminBase,
    "/admin/",
    "/admin",
  ];

  const botRule = {
    allow: "/",
    disallow,
  };

  return {
    rules: [
      {
        userAgent: "*",
        ...botRule,
      },
      { userAgent: "GPTBot", ...botRule },
      { userAgent: "ChatGPT-User", ...botRule },
      { userAgent: "OAI-SearchBot", ...botRule },
      { userAgent: "PerplexityBot", ...botRule },
      { userAgent: "ClaudeBot", ...botRule },
      { userAgent: "Google-Extended", ...botRule },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
