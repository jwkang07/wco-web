"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { adminLogoutAction } from "@/app/admin/actions";
import { adminNav } from "@/lib/admin-nav";
import { adminPath } from "@/lib/admin-path";

export function AdminShell({
  children,
  adminUsername,
}: {
  children: ReactNode;
  adminUsername?: string;
}) {
  const pathname = usePathname();
  const heroesBase = adminPath("/heroes");

  return (
    <div className="flex min-h-dvh bg-[#f7f7f6] text-[#262626]">
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-black/10 bg-white">
        <div className="border-b border-black/10 px-4 py-4">
          <p className="text-sm font-bold tracking-tight">WCO 관리자</p>
          <p className="mt-1 text-xs text-[#6B6B6B]">우리챔버오케스트라</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="관리자 메뉴">
          <ul className="space-y-0.5">
            {adminNav.map((item) => {
              const underHeroes =
                item.label === "상단비주얼" && pathname.startsWith(heroesBase);
              const parentActive =
                underHeroes ||
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                (item.children?.some(
                  (c) =>
                    pathname === c.href || pathname.startsWith(`${c.href}/`),
                ) ??
                  false);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded px-3 py-2 text-sm transition ${
                      parentActive && !item.children
                        ? "bg-black/[0.06] font-semibold text-[#262626]"
                        : parentActive && item.children
                          ? "font-semibold text-[#262626]"
                          : "text-[#6B6B6B] hover:bg-black/[0.04] hover:text-[#262626]"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mt-0.5 ml-3 space-y-0.5 border-l border-black/10 pl-2">
                      {item.children.map((child) => {
                        const active =
                          pathname === child.href ||
                          pathname.startsWith(`${child.href}/`);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`block rounded px-2.5 py-1.5 text-[13px] transition ${
                                active
                                  ? "bg-black/[0.06] font-semibold text-[#262626]"
                                  : "text-[#6B6B6B] hover:bg-black/[0.04] hover:text-[#262626]"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-black/10 bg-white px-5">
          <Link href="/" target="_blank" className="text-xs text-[#6B6B6B] hover:text-[#262626]">
            사이트 열기
          </Link>
          <div className="flex items-center gap-3">
            {adminUsername ? (
              <span className="text-sm text-[#6B6B6B]">관리자({adminUsername})</span>
            ) : null}
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="rounded border border-black/15 px-3 py-1.5 text-xs hover:bg-black/[0.04]"
              >
                로그아웃
              </button>
            </form>
          </div>
        </header>
        <main className="min-w-0 w-full flex-1 p-5 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
