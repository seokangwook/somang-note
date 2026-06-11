import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '소망노트 — 막연한 꿈을 오늘의 한 걸음으로';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#fdf7ec',
          padding: 72,
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* tree */}
        <svg width={300} height={300} viewBox="0 0 300 300" style={{ position: 'absolute', right: 60, top: 110 }}>
          <ellipse cx="150" cy="280" rx="120" ry="10" fill="#e8dfd1" />
          <path d="M150 280 Q145 220 155 180 Q163 140 155 110" stroke="#5a3f2b" strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="90" cy="100" r="48" fill="#9bc59d" />
          <circle cx="170" cy="80" r="56" fill="#9bc59d" />
          <circle cx="220" cy="120" r="44" fill="#9bc59d" />
          <circle cx="140" cy="150" r="42" fill="#9bc59d" />
          <rect x="120" y="80" width="60" height="60" fill="#fff4a3" stroke="#e8d971" strokeWidth="3" transform="rotate(-8 150 110)" />
          <rect x="60" y="120" width="50" height="50" fill="#bcd9f5" stroke="#7aaadc" strokeWidth="3" transform="rotate(6 85 145)" />
          <rect x="200" y="160" width="55" height="55" fill="#bfe5b8" stroke="#74b46c" strokeWidth="3" transform="rotate(-4 227 187)" />
        </svg>

        <div style={{ display: 'flex', fontSize: 28, color: '#8a7867', marginBottom: 8 }}>Somang Note · 소망노트</div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: '#3c2e21', lineHeight: 1.15, marginBottom: 24 }}>
          막연한 꿈을 오늘의 한 걸음으로
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#5a3f2b', maxWidth: 600, lineHeight: 1.4 }}>
          AI가 큰 꿈을 오늘 할 일로 분해해 드려요. 나무가 자라는 나만의 비전보드.
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 48, left: 72, fontSize: 22, color: '#8a7867' }}>
          revely.company
        </div>
      </div>
    ),
    { ...size },
  );
}
