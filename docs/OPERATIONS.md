# 소망노트 운영 매뉴얼

## 배포 환경
- **운영**: https://somang.revely.company
- **staging**: https://staging-somang.revely.company
- **GitHub**: https://github.com/seokangwook/somang-note
- **Vercel project**: (사용자 import 후 채울 것)

## 신년 결심 피크 캠페인 (2026-12 ~ 2027-01)
시장 분석에 따른 마케팅 최적 시점. 그 전에 cross-promo + SNS 자산 준비 완료해야 함.

## 광고 위치 영구 룰
- ✅ 결과 직전 5초 인터스티셜 (수동 트리거, 영구 룰)
- ✅ 결과 하단 AdSlot (자연 전환점)
- ❌ 자동 광고 X · 홈 X · 헤더 X · 진행 중 X

## 츄르 (커피 한 잔) 영구 룰
- 실버 ₩1,000 · 골드 ₩3,000
- 결제 후 `somang_grant_chur(p_tier)` RPC 호출 → `ad_free_until` = now() + 365일
- AdFree 상태에서는 InterstitialAd 즉시 onComplete()
- "후원"·"구독"·"월결제" 카피 영구 금지

## Gemini 운영
- 모델: `gemini-2.5-flash-lite` (1회 분해 ~$0.0005~0.002)
- 크레딧 소진(429) 시: `lib/decompose.ts buildFallback()` 자동 응답 (ko/ja/en 템플릿)
- 사용자에 raw 에러 노출 절대 X
- 모니터링: AI Studio (ai.studio/projects) 잔액 + Vercel 함수 로그

## i18n 번역 갱신
```bash
# ko.json 수정 후
python scripts/translate-i18n.py
```
- 1회 11개국 일괄 번역 (~30초)
- ko·en·ja·zh-CN·zh-TW는 수동 유지 권장

## Supabase 데이터 모델
- `somang_profiles`: 닉네임 + 츄르 카운트 + ad_free_until
- `somang_wishes`: 1·2·3단 트리 (parent_id) + status(yellow/blue/green) + RLS
- `somang_tree_state`: 사용자별 통계 (트리거로 자동 재계산)

## SEO
- 메타 + JSON-LD WebApplication · alternates languages 5개
- robots/sitemap auto-generate
- og image: `app/opengraph-image.tsx` (Edge 런타임 SVG → PNG)

## 헬스 체크 (수동만)
- 사용자 직접 / staging-somang.revely.company /ko 접속 → 분해 1회 동작 확인
- 자동 cron 영구 X (Claude Max 사용량 보호)

## 알려진 제약
- 인라인 SVG 나무 (PoC) — v2: dotLottie 교체 고려
- staging-apps.ts / apps.ts 미등록 — 사용자 OK 시 wip 등록
