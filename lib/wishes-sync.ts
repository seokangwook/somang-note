// Wishes Supabase sync — user 로그인 시 localStorage ↔ DB 양방향 동기화.
// 로그인 안 한 사용자는 localStorage만 사용 (Phase 1 동작 유지).

import { getSupabaseBrowser } from './supabase';
import type { WishNode } from './storage';

interface DbWish {
  id: string;
  uid: string;
  level: 1 | 2 | 3;
  title: string;
  hint: string | null;
  parent_id: string | null;
  status: 'yellow' | 'blue' | 'green';
  estimate_minutes: number | null;
  language: string;
  created_at: string;
  completed_at: string | null;
}

function toNode(row: DbWish): WishNode {
  return {
    id: row.id,
    level: row.level,
    title: row.title,
    hint: row.hint ?? undefined,
    parentId: row.parent_id ?? undefined,
    status: row.status,
    estimateMinutes: row.estimate_minutes ?? undefined,
    language: row.language as WishNode['language'],
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
  };
}

export async function fetchUserWishes(): Promise<WishNode[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return [];
  const { data, error } = await sb
    .from('somang_wishes')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return [];
  return (data as DbWish[]).map(toNode);
}

export async function upsertWishes(wishes: WishNode[]): Promise<void> {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  const rows = wishes.map((w) => ({
    id: w.id.startsWith('w_') ? undefined : w.id, // local-only IDs let DB autogen
    uid: user.id,
    level: w.level,
    title: w.title,
    hint: w.hint ?? null,
    parent_id: w.parentId && !w.parentId.startsWith('w_') ? w.parentId : null,
    status: w.status,
    estimate_minutes: w.estimateMinutes ?? null,
    language: w.language,
    completed_at: w.completedAt ?? null,
  }));

  // PoC: simple upsert by id (caller controls)
  await sb.from('somang_wishes').upsert(rows);
}

export async function updateWishStatus(id: string, status: 'yellow' | 'blue' | 'green'): Promise<void> {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  await sb.from('somang_wishes').update({
    status,
    completed_at: status === 'green' ? new Date().toISOString() : null,
  }).eq('id', id);
}
