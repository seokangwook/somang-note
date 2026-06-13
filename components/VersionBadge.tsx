"use client";

import { useEffect, useState } from "react";
import { VERSION, shouldShowBadge } from "@/lib/version";

export default function VersionBadge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // production = 숨김. preview·development는 표시.
    // host 기반 fallback — VERCEL_ENV가 'production'이라도 staging-* host면 표시.
    const host = window.location.hostname;
    const hostHint = host.startsWith("staging-") || host.endsWith(".vercel.app") || host === "localhost";
    setShow(shouldShowBadge() || hostHint);
  }, []);

  if (!show) return null;

  const label = VERSION.env === "production" ? "LIVE" : "STAGING";
  const dateKST = new Date(VERSION.buildTime).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-2 top-2 z-[100] select-none rounded-md bg-black/75 px-2 py-1 text-right font-mono text-[10px] leading-tight text-white shadow-lg"
    >
      <div className="font-bold">{label} v{VERSION.semver}-{VERSION.commit}</div>
      <div className="opacity-75">{dateKST} KST</div>
    </div>
  );
}
