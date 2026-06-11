// Wishes localStorage 임시 저장 (Phase 1 - Supabase 통합 전)
// Phase 2에서 Supabase로 sync.

import type { Locale } from './i18n';

export type WishStatus = 'yellow' | 'blue' | 'green';

export interface WishNode {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  hint?: string;
  parentId?: string;
  status: WishStatus;
  estimateMinutes?: number;
  language: Locale;
  createdAt: string; // ISO
  completedAt?: string;
}

const KEY = 'somang-wishes-v1';

export function loadWishes(): WishNode[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishNode[];
  } catch {
    return [];
  }
}

export function saveWishes(wishes: WishNode[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(wishes));
  } catch {}
}

export function newId(): string {
  return 'w_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export interface TreeStats {
  total: number;
  done: number;
  inProgress: number;
  ratio: number; // 0..1
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export function computeStats(wishes: WishNode[]): TreeStats {
  const actions = wishes.filter((w) => w.level === 3);
  const total = actions.length;
  const done = actions.filter((a) => a.status === 'green').length;
  const inProgress = actions.filter((a) => a.status === 'blue').length;
  const ratio = total === 0 ? 0 : done / total;
  let season: TreeStats['season'] = 'spring';
  if (ratio >= 0.75) season = 'winter';
  else if (ratio >= 0.5) season = 'autumn';
  else if (ratio >= 0.25) season = 'summer';
  return { total, done, inProgress, ratio, season };
}
