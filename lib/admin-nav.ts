import { HERO_SECTIONS } from "@/lib/admin-heroes";
import { adminPath } from "@/lib/admin-path";

export type AdminNavChild = {
  label: string;
  href: string;
};

export type AdminNavItem = {
  label: string;
  href: string;
  children?: readonly AdminNavChild[];
  /** 메뉴 위에 여백 (그룹 구분) */
  spacedBefore?: boolean;
};

export const adminNav: AdminNavItem[] = [
  {
    label: "상단비주얼",
    href: adminPath("/heroes/home"),
    children: HERO_SECTIONS.map((s) => ({
      label: s.label,
      href: adminPath(`/heroes/${s.key}`),
    })),
  },
  {
    label: "우리활동",
    href: adminPath("/histories"),
    children: [
      { label: "히스토리", href: adminPath("/histories") },
      { label: "공연 활동", href: adminPath("/performances") },
      { label: "보도자료", href: adminPath("/press") },
      { label: "공지사항", href: adminPath("/notices") },
    ],
  },
  {
    label: "우리단원",
    href: adminPath("/musicians"),
  },
  {
    label: "공연문의",
    href: adminPath("/inquiries"),
  },
  {
    label: "FAQ",
    href: adminPath("/faqs"),
  },
  {
    label: "작업 이력",
    href: adminPath("/audit"),
    spacedBefore: true,
  },
];

/** 로그인·콘솔 진입 시 기본 목적지 (공개 URL) */
export const ADMIN_HOME_HREF = adminNav[0].href;
