import * as Sentry from "@sentry/nextjs";

/** 서버·엣지 런타임 Sentry 초기화. DSN 미설정이면 SDK가 아무것도 보내지 않음 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }
}

/** Server Component · Route Handler · Server Action 에서 던져진 오류 수집 */
export const onRequestError = Sentry.captureRequestError;
