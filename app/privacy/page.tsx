export default function Privacy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-somang-ink leading-relaxed">
      <h1 className="text-2xl font-bold text-somang-bark mb-6">개인정보 처리방침 · Privacy</h1>

      <h2 className="font-semibold text-somang-bark mt-6 mb-2">1. 수집 항목</h2>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Google 로그인 시: 이메일, 표시 이름, 프로필 사진</li>
        <li>사용자 입력: 소망 텍스트 (1·2·3단계)</li>
        <li>자동 수집: 익명 사용 통계 (Vercel Analytics)</li>
      </ul>

      <h2 className="font-semibold text-somang-bark mt-6 mb-2">2. 이용 목적</h2>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>소망 데이터 저장 및 동기화</li>
        <li>AI 분해 결과 제공 (소망 텍스트를 Google Gemini API로 전송)</li>
        <li>서비스 개선 및 통계</li>
      </ul>

      <h2 className="font-semibold text-somang-bark mt-6 mb-2">3. 보관 기간</h2>
      <p className="text-sm">계정 삭제 요청 시 즉시 영구 삭제. 로그아웃 후에도 데이터는 유지(재로그인 시 복구).</p>

      <h2 className="font-semibold text-somang-bark mt-6 mb-2">4. 광고</h2>
      <p className="text-sm">
        Google AdSense를 사용합니다. 쿠키 기반 맞춤 광고가 표시될 수 있으며,
        Google 광고 설정에서 거부할 수 있습니다 (https://adssettings.google.com).
      </p>

      <h2 className="font-semibold text-somang-bark mt-6 mb-2">5. 문의</h2>
      <p className="text-sm">revely.company@gmail.com</p>

      <p className="text-xs text-somang-stone mt-10">
        Operated by Revely · revely.company
      </p>
    </main>
  );
}
