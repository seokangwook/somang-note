# 소망노트 CHANGELOG

## [Unreleased v3] — 2026-06-11
### Added
- 닉네임 자동 모달 (로그인 후 미설정 시 표시)
- 공개 비전보드 페이지 `/u/[nickname]` (기본 비공개, 가입 CTA)
- Toss Payments confirm webhook stub (`/api/donate/confirm`)
- 결제 결과 페이지 `/donate/success` · `/donate/cancel`
- 영어 Privacy 페이지 `/[locale]/privacy`
- 신년 결심 가이드 ja/zh-CN/zh-TW 추가

## [v2] — 2026-06-11
### Added
- Web Share API + 사용자별 1080×1080 share card (`/api/share-card`)
- SEO 콘텐츠: `/[locale]/guide/new-year-resolution` (ko/en 풀, 16 locale 정적)
- Article JSON-LD + canonical + sitemap 자동 등록
- 시즌 나무 디테일: 봄 꽃잎 / 여름 태양 / 가을 낙엽 / 겨울 눈

### Changed
- `@vercel/og` satori radial-gradient 미지원 → solid background

## [v1.1 — Post-MVP] — 2026-06-11
### Added
- 11개국 Gemini 일괄 자동 번역 (16개국 풀번역 완성)
- SEO: 동적 `generateMetadata` + JSON-LD WebApplication + hreflang 5개국
- OG image (`app/opengraph-image.tsx`, Edge runtime)
- PWA: icon-192.png · icon-512.png (any maskable) + 카테고리
- Vercel Analytics + Speed Insights
- README.md + docs/OPERATIONS.md + docs/SNS_COPY_7DAYS.md
- 자동화 스크립트: `scripts/translate-i18n.py` · `scripts/make-icons.py`

## [v1 — PoC MVP] — 2026-06-11
### Added
- Next.js 15 App Router + Tailwind + Framer Motion
- 인라인 SVG 나무 (계절: 봄/여름/가을/겨울)
- 포스트잇 컴포넌트 (yellow → blue → green 색 전이 + spring animation)
- 1·2·3단 소망 분해 (Gemini 2.5 Flash-Lite + ko/en/ja fallback 템플릿)
- Supabase Auth (Google OAuth) + 통합 프로필 + 츄르 + wishes + tree_state SQL
- 자동 계절 재계산 트리거
- AdSense (수동 AdSlot 전용 + 결과 직전 5초 인터스티셜)
- 츄르 응원 모달 (실버 ₩1,000 / 골드 ₩3,000, 1년 광고 제거)
- 16 locale 라우팅 (ko·en·ja·zh-CN·zh-TW 풀번역)
- PWA: manifest + service worker + assetlinks.json
- robots/sitemap, privacy
- GitHub: https://github.com/seokangwook/somang-note
