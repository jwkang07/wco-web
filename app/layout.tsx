import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl, getSiteUrl, organizationJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "우리챔버오케스트라",
    "Woori Chamber Orchestra",
    "은평구립우리장애인복지관",
    "기업연계형 일자리",
    "발달장애 오케스트라",
    "공연문의",
  ],
  authors: [{ name: site.parentOrg, url: site.parentOrgUrl }],
  creator: site.parentOrg,
  publisher: site.footer.orgLegal,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    siteName: site.displayName,
    locale: site.locale,
    type: "website",
    images: [
      {
        url: site.hero.image,
        alt: site.hero.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [absoluteUrl(site.hero.image)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${notoSans.variable} ${notoSans.className} antialiased`}
        suppressHydrationWarning
      >
        <JsonLd data={organizationJsonLd()} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
