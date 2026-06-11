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

        {/* 시즌별 디테일: 봄=꽃잎, 여름=빛, 가을=낙엽, 겨울=눈 */}
        {season === 'spring' && (
          <g>
            {[{x:135,y:185,d:1.2},{x:185,y:200,d:1.8},{x:230,y:175,d:2.6},{x:90,y:220,d:1.5},{x:280,y:250,d:2.1}].map((p,i) => (
              <motion.circle
                key={i}
                cx={p.x} cy={p.y} r={3}
                fill="#f4b8c0"
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 0.85 }}
                transition={{ duration: 2.4, delay: p.d, repeat: Infinity, repeatDelay: 4 }}
              />
            ))}
          </g>
        )}
        {season === 'summer' && (
          <g>
            <motion.circle
              cx={285} cy={45} r={20} fill="#fff4a3" opacity={0.7}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.circle
              cx={285} cy={45} r={32} fill="#fff4a3" opacity={0.3}
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </g>
        )}
        {season === 'autumn' && (
          <g>
            {[{x:120,y:200,d:0},{x:175,y:240,d:1.1},{x:240,y:220,d:0.6},{x:100,y:260,d:1.6},{x:260,y:270,d:0.3}].map((p,i) => (
              <motion.path
                key={i}
                d={`M ${p.x} ${p.y} q 3 -3 6 0 q -3 3 -6 0 z`}
                fill={i % 2 === 0 ? '#e89a4a' : '#d6553a'}
                initial={{ y: -250, x: -5, rotate: 0, opacity: 0 }}
                animate={{ y: 0, x: 0, rotate: 360, opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: 4, delay: p.d, repeat: Infinity, repeatDelay: 3 }}
              />
            ))}
          </g>
        )}
        {season === 'winter' && (
          <g>
            {[{x:80,y:120,d:0},{x:140,y:80,d:0.8},{x:200,y:160,d:1.4},{x:260,y:120,d:0.4},{x:50,y:200,d:2.0},{x:310,y:220,d:1.6}].map((p,i) => (
              <motion.circle
                key={i}
                cx={p.x} cy={p.y} r={2.5}
                fill="#ffffff"
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 100, opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: 6, delay: p.d, repeat: Infinity, repeatDelay: 2 }}
              />
            ))}
          </g>
        )}
      </svg>

      {total > 0 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-somang-stone bg-white/70 backdrop-blur px-3 py-1 rounded-full">
          {done} / {total}
        </div>
      )}
    </div>
  );
}
