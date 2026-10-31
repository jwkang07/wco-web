import * as Sentry from "@sentry/nextjs";

/** 브라우저 Sentry 초기화. DSN 미설정이면 SDK가 아무것도 보내지 않음 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
