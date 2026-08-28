"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { NavItem } from "@/lib/site";
import { nav, navMaxSubItems } from "@/lib/site";
import { SiteLogo } from "@/components/SiteLogo";

/** 하위 메뉴 영역 고정 높이 — 메뉴별 펼침 시 크기 변동 방지 */
const SUB_AREA_MIN_H = `${navMaxSubItems * 2.25 + 1.5}rem`;

type HoverProps = {
  hoveredSection: string | null;
  onHoverSection: (href: string) => void;
  onMenuClose: () => void;
};

function MegaMenuColumn({
  item,
  hoveredSection,
  onHoverSection,
  onMenuClose,
}: { item: NavItem } & HoverProps) {
  const pathname = usePathname();
  const sectionActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isHovered = hoveredSection === item.href;
  const isDimmed = hoveredSection !== null && !isHovered;
  const borderTone = isHovered ? "border-wco-orange/30" : "border-wco-peach";

  return (
    <div
      className={`flex min-h-full min-w-0 flex-col rounded-lg border-l-4 p-3 transition-[opacity,background-color,border-color] duration-200 ${
        isHovered
          ? "border-wco-orange bg-wco-peach"
          : isDimmed
            ? "border-transparent opacity-40"
            : "border-transparent opacity-100"
      }`}
      onMouseEnter={() => onHoverSection(item.href)}
    >
      <Link
        href={item.href}
        onClick={onMenuClose}
        className={`block font-serif text-sm font-bold leading-snug transition-colors xl:text-base ${
          isHovered || sectionActive
            ? "text-wco-orange"
            : "text-wco-grey hover:text-wco-orange"
        }`}
      >
        {item.label}
      </Link>

      <div
        className={`mt-2 flex flex-col border-t pt-2 ${borderTone}`}
        style={{ minHeight: SUB_AREA_MIN_H }}
      >
        {item.children ? (
          <ul className="space-y-1.5">
            {item.children.map((child) => {
              const childActive = pathname === child.href;
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={onMenuClose}
                    aria-current={childActive ? "page" : undefined}
                    className={`block rounded-md px-2 py-1.5 text-sm leading-snug transition-colors ${
                      isHovered
                        ? childActive
                          ? "bg-white font-semibold text-wco-orange"
                          : "text-wco-grey hover:bg-white hover:text-wco-orange"
                        : childActive
                          ? "font-semibold text-wco-orange"
                          : "text-wco-muted hover:text-wco-orange"
                    }`}
                  >
                    {child.label}
                    {child.note ? (
                      <span className="ml-1 text-xs font-normal text-wco-muted">
                        ({child.note})
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function DesktopNavLink({
  item,
  hoveredSection,
  onHoverSection,
  onMenuClose,
}: { item: NavItem } & HoverProps) {
  const pathname = usePathname();
  const sectionActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isHovered = hoveredSection === item.href;

  return (
    <Link
      href={item.href}
      aria-current={sectionActive ? "page" : undefined}
      onMouseEnter={() => onHoverSection(item.href)}
      onClick={onMenuClose}
      className={`inline-flex items-center rounded-md px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors xl:px-3 xl:text-base ${
        isHovered
          ? "bg-wco-orange text-white"
          : sectionActive
            ? "text-wco-orange"
            : "text-wco-grey hover:bg-wco-peach hover:text-wco-orange"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const menuId = useId();
  const pathname = usePathname();

  const closeMegaMenu = () => {
    setMegaOpen(false);
    setHoveredSection(null);
  };

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setHoveredSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-wco-peach bg-white">
      <div className="container flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <SiteLogo />

        <div
          className="relative hidden min-w-0 flex-1 lg:block"
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={closeMegaMenu}
        >
          <nav
            aria-label="주 메뉴"
            className="flex items-center justify-end gap-0.5 xl:gap-1"
          >
            {nav.map((item) => (
              <DesktopNavLink
                key={item.href}
                item={item}
                hoveredSection={hoveredSection}
                onHoverSection={setHoveredSection}
                onMenuClose={closeMegaMenu}
              />
            ))}
          </nav>

          <div
            className={`absolute top-full right-0 left-1/2 z-50 w-screen max-w-none -translate-x-1/2 pt-2 transition-opacity duration-150 ${
              megaOpen
                ? "visible pointer-events-auto opacity-100"
                : "invisible pointer-events-none opacity-0"
            }`}
          >
            <div className="border-t border-wco-peach bg-white shadow-lg">
              <div
                className="container grid grid-cols-5 items-stretch gap-4 py-5"
                style={{ minHeight: `calc(${SUB_AREA_MIN_H} + 3.5rem)` }}
              >
                {nav.map((item) => (
                  <MegaMenuColumn
                    key={item.href}
                    item={item}
                    hoveredSection={hoveredSection}
                    onHoverSection={setHoveredSection}
                    onMenuClose={closeMegaMenu}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-wco-peach text-wco-grey transition-colors hover:bg-wco-peach lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="메뉴 닫기"
            className="fixed inset-0 z-40 bg-wco-grey/40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id={menuId}
            aria-label="주 메뉴"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-wco-peach bg-white px-4 py-5 lg:hidden"
          >
            <ul className="space-y-4">
              {nav.map((item) => {
                const sectionActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <li
                    key={item.href}
                    className="rounded-xl border border-wco-peach bg-wco-peach/30 p-4"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block font-serif text-base font-bold ${
                        sectionActive ? "text-wco-orange" : "text-wco-grey"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.children ? (
                      <ul className="mt-3 space-y-1 border-t border-white/80 pt-3">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setMenuOpen(false)}
                                aria-current={childActive ? "page" : undefined}
                                className={`block rounded-md px-3 py-2.5 text-sm ${
                                  childActive
                                    ? "bg-white font-semibold text-wco-orange"
                                    : "text-wco-muted hover:bg-white hover:text-wco-orange"
                                }`}
                              >
                                {child.label}
                                {child.note ? (
                                  <span className="ml-1 text-xs">
                                    ({child.note})
                                  </span>
                                ) : null}
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
        </>
      ) : null}

      <div className="h-[3px] bg-wco-orange" aria-hidden />
    </header>
  );
}
