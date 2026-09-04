import { site, siteImages } from "./site";

export const history = [
  { year: "2023", text: "기업연계형 일자리 프로그램으로 우리챔버오케스트라 출범" },
  { year: "2024", text: "지역 공연 및 장애 인식 개선 활동 확대" },
  {
    year: "2025",
    text: "제2회 정기연주회 「별이 된 꿈, 세상을 물들이다」 개최",
  },
] as const;

export const performancePhotos = [
  {
    title: "제2회 정기연주회",
    caption: "별이 된 꿈, 세상을 물들이다",
    year: "2025",
    imageSrc: siteImages.photoConcert,
  },
  {
    title: "지역 초청 공연",
    caption: "은평구 문화 행사 연주",
    year: "2024",
    imageSrc: siteImages.heroMain,
  },
  {
    title: "연습 및 리허설",
    caption: "함께 만드는 무대",
    year: "2024",
    imageSrc: siteImages.photoRehearsal,
  },
  {
    title: "정기연주회",
    caption: "첫 정기연주 무대",
    year: "2023",
    imageSrc: siteImages.photoConcert,
  },
] as const;

export const pressArticles = [
  {
    date: "2025-03-15",
    title: "발달장애 예술가의 음악, 지역을 물들이다",
    source: "지역 언론",
    href: "#",
  },
  {
    date: "2024-11-02",
    title: "우리챔버오케스트라, 장애 인식 개선 공연 개최",
    source: "복지관 소식",
    href: "#",
  },
  {
    date: "2024-06-20",
    title: "음악으로 일터를 만나는 기업연계형 일자리",
    source: "아름다운은행",
    href: "#",
  },
] as const;

export type MusicianMember = {
  name: string;
  role?: string;
  instrument: string;
  photoSrc?: string;
  photoAlt?: string;
  photoCrop?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export type MusicianSection = {
  name: string;
  description: string;
  members: readonly MusicianMember[];
};

export const musicianSections: readonly MusicianSection[] = [
  {
    name: "현악기",
    description: "바이올린, 비올라, 첼로, 더블베이스 등",
    members: [
      { name: "단원 A", instrument: "바이올린", photoSrc: "/images/members/temp-member-set-01.png", photoCrop: "top-left" },
      { name: "단원 B", instrument: "바이올린", photoSrc: "/images/members/temp-member-set-02.png", photoCrop: "top-left" },
      { name: "단원 C", instrument: "비올라", photoSrc: "/images/members/temp-member-set-03.png", photoCrop: "top-left" },
      { name: "단원 D", instrument: "첼로", photoSrc: "/images/members/temp-member-set-04.png", photoCrop: "top-left" },
    ],
  },
  {
    name: "목관악기",
    description: "플루트, 클라리넷, 오보에, 바순 등",
    members: [
      { name: "단원 E", instrument: "플루트", photoSrc: "/images/members/temp-member-set-01.png", photoCrop: "top-right" },
      { name: "단원 F", instrument: "플루트", photoSrc: "/images/members/temp-member-set-02.png", photoCrop: "top-right" },
      { name: "단원 G", instrument: "클라리넷", photoSrc: "/images/members/temp-member-set-03.png", photoCrop: "top-right" },
      { name: "단원 H", instrument: "오보에", photoSrc: "/images/members/temp-member-set-04.png", photoCrop: "top-right" },
    ],
  },
  {
    name: "금관악기",
    description: "트럼펫, 트롬본, 호른, 튜바 등",
    members: [
      { name: "단원 I", instrument: "트럼펫", photoSrc: "/images/members/temp-member-set-01.png", photoCrop: "bottom-left" },
      { name: "단원 J", instrument: "트럼펫", photoSrc: "/images/members/temp-member-set-02.png", photoCrop: "bottom-left" },
      { name: "단원 K", instrument: "호른", photoSrc: "/images/members/temp-member-set-03.png", photoCrop: "bottom-left" },
      { name: "단원 L", instrument: "트롬본", photoSrc: "/images/members/temp-member-set-04.png", photoCrop: "bottom-left" },
    ],
  },
  {
    name: "타악기",
    description: "팀파니, 마림바, 스네어드럼, 심벌즈 등",
    members: [
      { name: "단원 M", instrument: "팀파니", photoSrc: "/images/members/temp-member-set-01.png", photoCrop: "bottom-right" },
      { name: "단원 N", instrument: "마림바", photoSrc: "/images/members/temp-member-set-02.png", photoCrop: "bottom-right" },
      { name: "단원 O", instrument: "스네어드럼", photoSrc: "/images/members/temp-member-set-03.png", photoCrop: "bottom-right" },
      { name: "단원 P", instrument: "타악기", photoSrc: "/images/members/temp-member-set-04.png", photoCrop: "bottom-right" },
    ],
  },
];

export const greetings = {
  director: {
    title: "관장 인삿말",
    name: "관장",
    org: site.parentOrg,
    body: [
      `${site.parentOrg}을 대표하여 우리챔버오케스트라 홈페이지를 방문해 주신 여러분께 감사드립니다.`,
      "우리챔버오케스트라는 기업연계형 일자리를 통해 발달장애 예술가가 음악으로 사회에 참여하고, 연주자로 성장하는 소중한 공간입니다. 복지관은 앞으로도 단원들의 꿈과 가능성을 응원하겠습니다.",
    ],
  },
  conductor: {
    title: "단장 인삿말",
    name: "단장",
    org: site.name,
    body: [
      "안녕하세요. 우리챔버오케스트라 단장입니다.",
      "우리는 동정의 대상이 아니라, 무대 위의 연주자입니다. 한 사람 한 사람의 연습과 열정이 모여 아름다운 하모니를 만들어 갑니다. 많은 관심과 응원 부탁드립니다.",
    ],
  },
} as const;
