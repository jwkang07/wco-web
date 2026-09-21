import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "우리챔버오케스트라(관리자)" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
