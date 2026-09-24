/**
 * 관리자 필드 한도 — UI maxLength / 서버 sanitize 와 일치
 */

export const ADMIN_LIMITS = {
  hero: {
    title: 120,
    description: 300,
    imageAlt: 120,
  },
  history: {
    year: 10,
    body: 500,
  },
  performance: {
    title: 120,
    caption: 200,
    year: 10,
    bodyHtml: 50000,
  },
  press: {
    title: 200,
    source: 80,
    href: 500,
    bodyHtml: 50000,
  },
  notice: {
    title: 200,
    bodyHtml: 50000,
  },
  musician: {
    name: 40,
    instrument: 40,
    sectionName: 40,
    role: 40,
  },
  faq: {
    question: 200,
    answer: 1000,
  },
  inquiry: {
    memo: 2000,
  },
} as const;

export function adminTooLong(label: string, max: number): string {
  return `${label}은(는) ${max}자 이내로 입력해 주세요.`;
}

export function adminInvalidNumber(label: string): string {
  return `${label}은(는) 0 이상의 숫자로 입력해 주세요.`;
}
