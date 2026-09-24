"use client";

import { useEffect } from "react";

/**
 * 브라우저 기본 유효성 말풍선(「이 입력란을 작성하세요」 등)을 막습니다.
 * 각 폼은 noValidate + 화면 내 텍스트 안내로 검증하세요. (나무말미와 동일)
 */
export function SuppressNativeValidationBubble() {
  useEffect(() => {
    const onInvalid = (event: Event) => {
      event.preventDefault();
    };
    document.addEventListener("invalid", onInvalid, true);
    return () => document.removeEventListener("invalid", onInvalid, true);
  }, []);

  return null;
}
