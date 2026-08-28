"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavChild } from "@/lib/site";

type SubNavProps = {
  items: readonly NavChild[];
};

export function SubNav({ items }: SubNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하위 메뉴"
      className="border-b border-wco-peach bg-white"
    >
      <div className="container">
        <ul className="flex gap-1 overflow-x-auto py-2 sm:justify-center sm:gap-2">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 sm:text-base ${
                    active
                      ? "bg-wco-orange text-white"
                      : "text-wco-grey hover:bg-wco-peach hover:text-wco-orange"
                  }`}
                >
                  {item.label}
                  {item.note ? (
                    <span
                      className={`text-xs font-normal ${active ? "text-white/80" : "text-wco-muted"}`}
                    >
                      ({item.note})
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
