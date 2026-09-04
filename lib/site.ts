export const site = {
  name: "우리챔버오케스트라",
  nameEn: "Woori Chamber Orchestra",
  displayName: "Woori Chamber Orchestra (우리챔버오케스트라)",
  shortName: "WCO",
  description:
    "은평구립우리장애인복지관 문화일자리와 기업연계형 일자리로 구성되어 있습니다. 발달장애 연주자가 협연으로 성장하는 우리챔버오케스트라입니다.",
  heroDescriptionLines: [
    "은평구립우리장애인복지관 문화일자리와 기업연계형 일자리로 구성되어 있습니다.",
    "발달장애 연주자가 협연으로 성장하는 우리챔버오케스트라입니다.",
  ] as const,
  taglineLines: ["음악으로 세상과 만나는,", "우리챔버오케스트라"] as const,
  parentOrg: "은평구립우리장애인복지관",
  programLabel: "기업연계형 일자리",
  parentOrgUrl: "https://www.goodwoori.or.kr/main/index.php",
  founded: 2023,
  locale: "ko_KR",
  hero: {
    image: "/images/hero/hero-main.png",
    imageAlt: "우리챔버오케스트라 정기연주회 무대 전경",
    imagePosition: "center center",
  },
  logo: {
    /** 상단 로고 — `public/images/logo/wco-header-logo.png` 교체 */
    main: "/images/logo/wco-header-logo.png",
    parentOrg: "/images/logo/goodwoori-logo.png",
  },
  footer: {
    address: "서울특별시 은평구 녹번로 1길 13",
    zip: "03380",
    tel: "02-6951-0301",
    fax: "02-6951-0302",
    email: "epwoori@goodwoori.or.kr",
    orgLegal: "사회복지법인 굿피플",
    copyrightLine: "COPYRIGHT(C) Good Woori Community Center.",
  },
} as const;

/** 공연·활동 사진 (`public/images/`) */
export const siteImages = {
  heroMain: "/images/hero/hero-main.png",
  heroAbout: "/images/hero/hero-about.png",
  photoRehearsal: "/images/photos/photo-rehearsal.png",
  photoConcert: "/images/photos/photo-concert.png",
  photoMusicians: "/images/photos/photo-musicians.png",
} as const;

export type NavChild = {
  label: string;
  href: string;
  note?: string;
};

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: readonly NavChild[];
};

export const nav: readonly NavItem[] = [
  {
    label: "우리챔버오케스트라",
    href: "/about",
    children: [
      { label: "관장 인삿말", href: "/about/director-greeting" },
      { label: "단장 인삿말", href: "/about/conductor-greeting" },
      { label: "오케스트라 소개", href: "/about/intro" },
    ],
  },
  {
    label: "우리활동",
    href: "/activities",
    children: [
      { label: "히스토리", href: "/activities/history" },
      { label: "공연 활동", href: "/activities/performances" },
      { label: "보도자료", href: "/activities/press" },
    ],
  },
  {
    label: "우리단원",
    href: "/musicians",
  },
  {
    label: "기업고용연계",
    href: "/employment",
    children: [
      { label: "고용 연계 소개", href: "/employment/intro" },
      { label: "기업 도입 문의", href: "/employment/corporate" },
      { label: "아티스트 접수", href: "/employment/artist" },
    ],
  },
  {
    label: "공연문의",
    href: "/contact",
  },
];

export const navMaxSubItems = Math.max(
  ...nav.map((item) => item.children?.length ?? 0),
);

export function findNavSection(pathname: string): NavItem | undefined {
  return nav.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

export const colors = {
  orange: "#E85A24",
  grey: "#262626",
  peach: "#FBE8E6",
  white: "#FFFFFF",
} as const;
