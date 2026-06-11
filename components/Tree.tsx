'use client';
import { motion } from 'framer-motion';

interface TreeProps {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  total: number;
  done: number;
}

// 인라인 SVG 나무 - Lottie 의존 없이 PoC 단계에서 작동. 계절별 색·잎 변경.
// 향후 dotLottie로 교체 가능 (Phase 6+).
export default function Tree({ season, total, done }: TreeProps) {
  const palette = {
    spring: { leaf: '#bce3a5', accent: '#f4b8c0', sky: '#fef0f2' },
    summer: { leaf: '#7ac072', accent: '#fff4a3', sky: '#e7f6e3' },
    autumn: { leaf: '#e89a4a', accent: '#d6553a', sky: '#fdecd1' },
    winter: { leaf: '#cfd9d4', accent: '#ffffff', sky: '#eef5f4' },
  }[season];

  // 포스트잇 매달림 위치 (수관 안)
  const leafPositions = [
    { x: 110, y: 60, r: 18 },
    { x: 180, y: 50, r: 22 },
    { x: 250, y: 70, r: 19 },
    { x: 90, y: 110, r: 24 },
    { x: 165, y: 100, r: 28 },
    { x: 240, y: 110, r: 22 },
    { x: 130, y: 150, r: 20 },
    { x: 215, y: 150, r: 21 },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 360 320" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-sm">
        {/* sky background */}
        <defs>
          <radialGradient id="sky" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor={palette.sky} />
            <stop offset="100%" stopColor="#fdf7ec" />
          </radialGradient>
          <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7a5538" />
            <stop offset="100%" stopColor="#5a3f2b" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="360" height="320" fill="url(#sky)" rx="24" />

        {/* ground */}
        <ellipse cx="180" cy="290" rx="140" ry="14" fill="#e8dfd1" opacity="0.7" />

        {/* trunk */}
        <motion.path
          d="M170 290 Q165 240 175 200 Q183 165 175 130"
          stroke="url(#trunk)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* secondary branches */}
        <motion.path
          d="M175 160 Q140 145 110 130"
          stroke="url(#trunk)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
        />
        <motion.path
          d="M175 175 Q210 160 245 145"
          stroke="url(#trunk)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.45, ease: 'easeOut' }}
        />

        {/* canopy - main leaf clusters */}
        <motion.g
          initial={{ scale: 0, originX: '50%', originY: '40%' }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {leafPositions.map((p, i) => (
            <circle
              key={i}
              cx={p.x + 20}
              cy={p.y + 40}
              r={p.r}
              fill={i % 4 === 0 ? palette.accent : palette.leaf}
              opacity={0.85}
            />
          ))}
        </motion.g>

        {/* gentle highlights */}
        <circle cx="160" cy="110" r="6" fill="#ffffff" opacity="0.5" />
        <circle cx="220" cy="130" r="4" fill="#ffffff" opacity="0.4" />
      </svg>

      {total > 0 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-somang-stone bg-white/70 backdrop-blur px-3 py-1 rounded-full">
          {done} / {total}
        </div>
      )}
    </div>
  );
}
