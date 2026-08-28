import type { ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { SubNav } from "@/components/SubNav";
import type { NavChild } from "@/lib/site";

type PageShellProps = {
  title: string;
  description?: string;
  subNav?: readonly NavChild[];
  children: ReactNode;
};

export function PageShell({
  title,
  description,
  subNav,
  children,
}: PageShellProps) {
  return (
    <>
      <Hero title={title} description={description} />
      {subNav ? <SubNav items={subNav} /> : null}
      {children}
    </>
  );
}
