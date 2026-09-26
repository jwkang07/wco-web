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

/** rewrite → /admin 재진입 시 /wco-console 리다이렉트 루프 방지 */
const INTERNAL_ADMIN_REWRITE = "x-wco-admin-internal";

function withAdminHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(ADMIN_SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

function rewriteToInternal(request: NextRequest, pathname: string) {
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = pathname;
  const headers = new Headers(request.headers);
  headers.set(INTERNAL_ADMIN_REWRITE, "1");
  return withAdminHeaders(
    NextResponse.rewrite(rewriteUrl, {
      request: { headers },
    }),
  );
}

export async function proxy(request: NextRequest) {
  // 공개 URL(/wco-console/…)을 /admin으로 rewrite한 뒤 proxy가 한 번 더 돌 때:
  // 외부 /admin 리다이렉트로 다시 보내지 않고 통과시킨다.
  if (request.headers.get(INTERNAL_ADMIN_REWRITE) === "1") {
    return withAdminHeaders(NextResponse.next());
  }

  const { pathname } = request.nextUrl;
  const adminBase = getAdminBasePath();

  // 예전 /admin URL → 공개 경로로 보냄 (브라우저가 직접 /admin을 친 경우만)
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

  if (isLoginPage) {
    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_HOME_HREF;
      url.search = "";
      return withAdminHeaders(NextResponse.redirect(url));
    }
    return rewriteToInternal(request, "/admin/login");
  }

  if (!session) {
    const login = request.nextUrl.clone();
    login.pathname = `${adminBase}/login`;
    login.searchParams.set("next", pathname);
    return withAdminHeaders(NextResponse.redirect(login));
  }

  return rewriteToInternal(request, internalAdmin);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/wco-console",
    "/wco-console/:path*",
  ],
};
