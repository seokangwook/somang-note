// 배포 버전 — build time에 자동 박힘. 하드코딩 X.
// next.config.{js,mjs} `env` 블록에서 주입.
// Vercel은 VERCEL_GIT_COMMIT_SHA·VERCEL_ENV 자동 주입; semver는 package.json에서 주입.

export const VERSION = {
  semver: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0',
  commit: (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7),
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
  env: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development', // 'production' | 'preview' | 'development'
};

export function formatVersion(): string {
  const label = VERSION.env === 'production' ? 'LIVE' : 'STAGING';
  const dateKST = new Date(VERSION.buildTime).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    hour12: false,
  });
  return `${label} v${VERSION.semver}-${VERSION.commit} / ${dateKST} KST`;
}

// production은 숨김 (preview·development만 표시)
export function shouldShowBadge(): boolean {
  return VERSION.env !== 'production';
}
