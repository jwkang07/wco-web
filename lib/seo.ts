import { site } from "@/lib/site";

/** Production canonical origin. Override with NEXT_PUBLIC_SITE_URL when a custom domain is connected. */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://wco-web.vercel.app";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

/** Public content routes for sitemap (preview/contact1–3 hubs excluded). */
export const sitemapPaths = [
  "/",
  "/about/director-greeting",
  "/about/conductor-greeting",
  "/about/intro",
  "/activities/history",
  "/activities/performances",
  "/activities/press",
  "/musicians",
  "/employment/intro",
  "/employment/corporate",
  "/employment/artist",
  "/contact",
] as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: site.name,
    alternateName: site.nameEn,
    description: site.description,
    url: getSiteUrl(),
    image: absoluteUrl(site.hero.image),
    logo: absoluteUrl(site.logo.main),
    foundingDate: String(site.founded),
    telephone: site.footer.tel,
    email: site.footer.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.footer.address,
      postalCode: site.footer.zip,
      addressLocality: "서울특별시 은평구",
      addressCountry: "KR",
    },
    parentOrganization: {
      "@type": "NGO",
      name: site.parentOrg,
      url: site.parentOrgUrl,
    },
    foundingOrganization: {
      "@type": "Organization",
      name: site.footer.orgLegal,
    },
  } as const;
}

export const contactFaqs = [
  {
    question: "오케스트라 전체 편성이 아닌 소규모 앙상블 초청도 가능한가요?",
    answer:
      "네, 가능합니다. 무대 공간이나 행사 규모에 따라 현악 앙상블, 목관 앙상블, 솔로 협연 등 맞춤형으로 팀을 구성할 수 있습니다.",
  },
  {
    question: "공연 문의는 행사 며칠 전까지 접수해야 하나요?",
    answer:
      "단원 연습과 맞춤 편성을 위해 희망일 최소 3~4주 전에 문의해 주시면 일정 조율이 원활합니다. 급한 일정은 전화로 먼저 연락해 주세요.",
  },
  {
    question: "기업 장애인식개선 교육이나 사회공헌 행사와 연계할 수 있나요?",
    answer:
      "네. 음악 공연과 함께 장애인식개선 문화체험, 기업연계형 일자리 상담을 연계할 수 있습니다.",
  },
] as const;

export function contactFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contactFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } as const;
}
