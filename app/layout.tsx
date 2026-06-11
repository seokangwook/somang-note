import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/AuthProvider';
import SwRegister from './sw-register';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: '소망노트 · Somang Note',
  description: '막연한 꿈을 오늘의 한 걸음으로. 나무가 자라는 나만의 비전보드.',
  manifest: '/manifest.json',
  openGraph: {
    title: '소망노트 — 막연한 꿈을 오늘의 한 걸음으로',
    description: 'AI가 큰 꿈을 오늘 할 일로 분해해 드려요. 나무가 자라는 나만의 비전보드.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#fdf7ec',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* AdSense 스크립트 (수동 AdSlot에서만 사용. 자동 광고 X — 영구 룰) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4128588337803742"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
        <SwRegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
