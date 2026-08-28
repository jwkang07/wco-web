import Link from "next/link";
import { site } from "@/lib/site";

type SiteLogoProps = {
  variant?: "header" | "footer";
};

export function SiteLogo({ variant = "header" }: SiteLogoProps) {
  if (variant === "footer") {
    return (
      <Link
        href={site.parentOrgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.logo.parentOrg}
          alt={site.parentOrg}
          className="h-auto max-h-[52px] w-auto max-w-[280px]"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={site.logo.main}
        alt={site.displayName}
        className="h-[44px] w-auto max-w-[min(100%,320px)] sm:h-[48px]"
      />
    </Link>
  );
}
