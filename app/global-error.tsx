"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

/** 루트 레이아웃까지 깨진 렌더 오류를 Sentry로 보내고 최소 화면 표시 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "4rem 1rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontWeight: 700 }}>일시적인 오류가 발생했습니다.</p>
        <p style={{ marginTop: "0.5rem", color: "#6B6B6B" }}>
          잠시 후 다시 시도해 주세요.
        </p>
        <Link href="/" style={{ display: "inline-block", marginTop: "1.5rem" }}>
          홈으로
        </Link>
      </body>
    </html>
  );
}
