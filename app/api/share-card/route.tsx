// 사용자별 share card SVG → PNG (Edge). 인스타·X용 1080x1080.
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const nickname = (url.searchParams.get('n') || '소망지기').slice(0, 16);
  const done = Math.max(0, Math.min(999, parseInt(url.searchParams.get('done') || '0', 10) || 0));
  const total = Math.max(0, Math.min(999, parseInt(url.searchParams.get('total') || '0', 10) || 0));
  const season = (url.searchParams.get('s') || 'spring') as 'spring'|'summer'|'autumn'|'winter';

  const palette = ({
    spring: { leaf: '#bce3a5', accent: '#f4b8c0', sky: '#fef0f2', label: '🌸 봄' },
    summer: { leaf: '#7ac072', accent: '#fff4a3', sky: '#e7f6e3', label: '🌿 여름' },
    autumn: { leaf: '#e89a4a', accent: '#d6553a', sky: '#fdecd1', label: '🍂 가을' },
    winter: { leaf: '#cfd9d4', accent: '#ffffff', sky: '#eef5f4', label: '❄️ 겨울' },
  })[season];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: palette.sky,
          padding: 80,
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: 32, color: '#8a7867', display: 'flex' }}>소망노트 · Somang Note</div>
        <div style={{ marginTop: 16, fontSize: 56, fontWeight: 800, color: '#3c2e21', display: 'flex' }}>
          {nickname}님의 소망 나무
        </div>

        {/* tree */}
        <svg width={500} height={500} viewBox="0 0 360 360" style={{ alignSelf: 'center', marginTop: 30 }}>
          <ellipse cx="180" cy="320" rx="140" ry="14" fill="#e8dfd1" />
          <path d="M170 320 Q165 260 175 220 Q183 180 175 140" stroke="#5a3f2b" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M175 180 Q140 165 110 150" stroke="#5a3f2b" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M175 195 Q210 180 245 165" stroke="#5a3f2b" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="130" cy="100" r="40" fill={palette.leaf} />
          <circle cx="200" cy="80" r="50" fill={palette.leaf} />
          <circle cx="260" cy="110" r="38" fill={palette.leaf} />
          <circle cx="150" cy="170" r="38" fill={palette.leaf} />
          <circle cx="220" cy="160" r="42" fill={palette.accent} opacity="0.8" />
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 36, color: '#5a3f2b', fontWeight: 700 }}>{palette.label}</div>
          <div style={{ display: 'flex', fontSize: 36, color: '#5a3f2b', fontWeight: 700 }}>{done} / {total}</div>
        </div>

        <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center', fontSize: 28, color: '#8a7867', display: 'flex', justifyContent: 'center' }}>
          somang.revely.company
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  );
}
