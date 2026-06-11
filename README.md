# 소망노트 · Somang Note

> 막연한 꿈을 오늘의 한 걸음으로. AI가 큰 꿈을 오늘 할 일로 분해해 드리는 비전보드 + AI 코치.

[![Operated by Revely](https://img.shields.io/badge/Operated%20by-Revely-fdf7ec?style=flat&labelColor=5a3f2b)](https://revely.company)

## 핵심 컨셉
- **추상 → 구체 3단 분해**: 큰 꿈 → 구체 소망 → AI가 생성한 오늘의 작은 액션
- **나무 + 포스트잇 결합 시각화**: 한국·글로벌 0건의 whitespace (시장 분석 18/25점)
- **계절 변화**: 완료 비율에 따라 나무가 봄·여름·가을·겨울로
- **색 전이**: 포스트잇이 🟡(신규) → 🔵(진행) → 🟢(완료)로 자라남
- **처벌 메커니즘 없음** (Sailer et al., IJHCS 2019 역효과 입증)
- **구독 없음** — 영구 무료 + AdSense + 일회성 츄르 응원(₩1,000/₩3,000, 1년 광고 제거 답례)

## 기술 스택
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Framer Motion (포스트잇 인터랙션) · 인라인 SVG 나무 (PoC 단계)
- Gemini 2.5 Flash-Lite (AI 분해) + graceful fallback (크레딧 소진 시도 안전)
- Supabase (Auth + 통합 프로필 + wishes + tree_state + RLS)
- PWA (manifest + service worker + assetlinks 사전 준비)
- 16개 locale 라우팅 (ko·en·ja·zh-CN·zh-TW 풀번역, 11개국 Gemini 자동 번역)

## 로컬 실행
```bash
npm install
cp .env.example .env.local   # GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_*
npm run dev                  # http://localhost:3000/ko
```

## 폴더 구조
```
app/
  [locale]/               # 동적 locale 라우팅 (16개국)
    page.tsx              # 메타데이터 + JSON-LD + HomeClient
    HomeClient.tsx        # 클라이언트 컴포넌트 (소망 입력 + 결과 + 포스트잇)
    jsonld.tsx
  api/decompose/route.ts  # POST → Gemini 분해 → fallback 안전망
  auth/callback/route.ts  # Supabase OAuth 콜백
  privacy/                # 개인정보 처리방침
  robots.ts · sitemap.ts · opengraph-image.tsx
components/
  Tree.tsx                # SVG 나무 (계절별 색)
  PostIt.tsx              # 포스트잇 카드 (색 전이 + Framer Motion)
  WishForm.tsx            # 1·2단계 입력
  ActionList.tsx          # 3단계 액션 리스트
  AdSlot.tsx              # 수동 AdSense (자동 광고 X — 영구 룰)
  InterstitialAd.tsx      # 결과 직전 5초 인터스티셜
  DonateButton.tsx        # 츄르 응원 모달 (커피 한 잔)
  AuthChip.tsx            # 닉네임 + 로그인 / 로그아웃
  LocaleSwitcher.tsx      # 16개국 셀렉터
  Footer.tsx              # Revely · revely.company
lib/
  i18n.ts                 # 16 locale 메타 + 메시지 로더
  gemini.ts               # REST 호출 + GeminiQuotaError
  decompose.ts            # 시스템 프롬프트 + ko/en/ja fallback 템플릿
  supabase.ts             # 브라우저 클라이언트 (env 없으면 null)
  auth.ts                 # signInWithGoogle / signOut
  AuthProvider.tsx        # 사용자 + 프로필 컨텍스트
  storage.ts              # localStorage 임시 저장 + 통계 + 계절 계산
  wishes-sync.ts          # Supabase 동기화 (로그인 시)
messages/                 # 16개 locale JSON
db/schema.sql             # Supabase SQL (wishes/profiles/tree_state + 트리거)
public/
  manifest.json · sw.js · ads.txt · favicon.svg
  .well-known/assetlinks.json   # Play Console TWA 대비
scripts/translate-i18n.py        # Gemini 일괄 번역 헬퍼
```

## 사용자 수동 설정 단계 (외부 콘솔)
배포 자동화가 막힌 부분만 — Vercel/Supabase/Google OAuth/AdSense는 OAuth UI 거치는 콘솔 작업.

1. **Vercel**
   - GitHub `seokangwook/somang-note` repo import
   - env vars: `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 도메인 매핑: `staging-somang.revely.company`, `somang.revely.company`
2. **Supabase**
   - SQL Editor → `db/schema.sql` 실행
   - Auth → Providers → Google 활성화
   - Auth → URL Configuration → `https://somang.revely.company/auth/callback`, `https://staging-somang.revely.company/auth/callback` 추가
3. **Google Cloud Console**
   - OAuth 클라이언트 → Authorized redirect URIs에 위 콜백 URL 2개 추가
4. **AdSense Console**
   - 사이트 추가: `somang.revely.company`
5. **Gemini API**
   - AI Studio (ai.studio/projects) — prepay 크레딧 충전 (소진 시 자동 fallback로 운영은 계속 가능)
6. **admin staging-apps.ts / apps.ts**
   - 사용자 명시 OK 시 wip 상태로 등록 (영구 룰 준수)

## 영구 룰 체크
- ✅ Opus 빌드 · `revelycompany` author · 우당탕탕 X · "후원" X "커피 한 잔" O · 자동광고 X · 자동 cron X · 구독 X · "법인" X
- ✅ 16 locale · 닉네임 통일 · graceful fallback · 결과 페이지 다층 · assetlinks 사전
- ✅ admin LIVE 등록은 사용자 명시 후로 보류
- ✅ 처벌 메커니즘 X (학술적 역효과 회피)

## 시장 분석 핵심 (`../soman-note_market_research.md`)
- 차별화 5축 18/25 (B축 ★5: 나무+포스트잇 결합 = 글로벌·한국 0건)
- 진입 시퀀스: cross-promo → SNS 바이럴 → SEO
- 마케팅 피크: **2026-12 ~ 2027-01 신년 결심**

## 라이선스
이 저장소는 Revely(개인 사업자)의 비공개 운영물입니다. 외부 기여는 받지 않습니다.
