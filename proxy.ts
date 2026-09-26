import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, readAdminSession } from "@/lib/admin-auth";
import { ADMIN_HOME_HREF } from "@/lib/admin-nav";
import {
  getAdminBasePath,
  isAdminPathname,
  toInternalAdminPath,
  toPublicAdminPath,
} from "@/lib/admin-path";

const ADMIN_SECURITY_HEADERS: Record<string, string> = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
};

function withAdminHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(ADMIN_SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminBase = getAdminBasePath();

  // 예전 /admin URL → 공개 경로로 보냄
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = toPublicAdminPath(pathname);
    return NextResponse.redirect(url);
  }

  if (!isAdminPathname(pathname)) {
    return NextResponse.next();
  }

  const internalAdmin = toInternalAdminPath(pathname);
  if (!internalAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await readAdminSession(token);
  const isLoginPage =
    internalAdmin === "/admin/login" || internalAdmin === "/admin";

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = internalAdmin === "/admin" ? "/admin/login" : internalAdmin;

  if (isLoginPage || internalAdmin === "/admin") {
    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_HOME_HREF;
      url.search = "";
      return withAdminHeaders(NextResponse.redirect(url));
    }
    rewriteUrl.pathname = "/admin/login";
    return withAdminHeaders(
      NextResponse.rewrite(rewriteUrl, {
        request: { headers: request.headers },
      }),
    );
  }

  if (!session) {
    const login = request.nextUrl.clone();
    login.pathname = `${adminBase}/login`;
    login.searchParams.set("next", pathname);
    return withAdminHeaders(NextResponse.redirect(login));
  }

  return withAdminHeaders(
    NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    }),
  );
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/wco-console",
    "/wco-console/:path*",
  ],
};
