"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavChild } from "@/lib/site";

/** 하위 탭 영역 고정 높이 — 페이지 이동 시 레이아웃 흔들림 방지 */
export const SUB_NAV_SLOT_CLASS = "h-14 shrink-0";

type SubNavSlotProps = {
  items?: readonly NavChild[];
};

export function SubNavSlot({ items }: SubNavSlotProps) {
  if (!items?.length) {
    return (
      <div
        className={`border-b border-wco-peach bg-white ${SUB_NAV_SLOT_CLASS}`}
        aria-hidden
      />
    );
  }

  return <SubNav items={items} />;
}

type SubNavProps = {
  items: readonly NavChild[];
};

function SubNav({ items }: SubNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하위 메뉴"
      className={`border-b border-wco-peach bg-white ${SUB_NAV_SLOT_CLASS}`}
    >
      <div className="container flex h-full items-center">
        <ul className="flex w-full items-center gap-1 overflow-x-auto sm:justify-center sm:gap-2">
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
