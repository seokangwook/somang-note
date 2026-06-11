-- 소망노트 (Somang Note) — Supabase Schema
-- Auth + 통합 프로필(닉네임 공유) + 츄르 + wishes + tree_state
-- Supabase SQL Editor에서 실행

-- ============================================================================
-- 1) 통합 프로필 (전 앱 닉네임 공유 - feedback_unified_nickname 룰)
-- ============================================================================
-- 이미 다른 앱에서 만든 공통 schema가 있으면 그대로 사용. 여기서는 somang 전용 profile만 생성.
create table if not exists public.somang_profiles (
  uid           uuid primary key references auth.users(id) on delete cascade,
  nickname      text not null default '소망지기',
  chur_silver   integer not null default 0 check (chur_silver >= 0),
  chur_gold     integer not null default 0 check (chur_gold >= 0),
  ad_free_until timestamptz, -- 1년 답례 만료 시각
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.somang_profiles enable row level security;
create policy "somang_profiles_self_select" on somang_profiles for select using (auth.uid() = uid);
create policy "somang_profiles_self_update" on somang_profiles for update using (auth.uid() = uid);

-- ============================================================================
-- 2) Wishes — 1·2·3단계 트리 구조
-- ============================================================================
create table if not exists public.somang_wishes (
  id               uuid primary key default gen_random_uuid(),
  uid              uuid not null references auth.users(id) on delete cascade,
  level            smallint not null check (level in (1, 2, 3)),
  title            text not null,
  hint             text,
  parent_id        uuid references public.somang_wishes(id) on delete cascade,
  status           text not null default 'yellow' check (status in ('yellow', 'blue', 'green')),
  estimate_minutes integer check (estimate_minutes is null or estimate_minutes > 0),
  language         text not null default 'ko',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  completed_at     timestamptz
);

create index if not exists somang_wishes_uid_idx on public.somang_wishes (uid, created_at desc);
create index if not exists somang_wishes_parent_idx on public.somang_wishes (parent_id);

alter table public.somang_wishes enable row level security;
create policy "somang_wishes_self_select" on somang_wishes for select using (auth.uid() = uid);
create policy "somang_wishes_self_insert" on somang_wishes for insert with check (auth.uid() = uid);
create policy "somang_wishes_self_update" on somang_wishes for update using (auth.uid() = uid);
create policy "somang_wishes_self_delete" on somang_wishes for delete using (auth.uid() = uid);

-- ============================================================================
-- 3) Tree state — 사용자별 누적 통계 (계절 변화·스킨)
-- ============================================================================
create table if not exists public.somang_tree_state (
  uid              uuid primary key references auth.users(id) on delete cascade,
  season           text not null default 'spring' check (season in ('spring','summer','autumn','winter')),
  total_wishes     integer not null default 0,
  completed_wishes integer not null default 0,
  current_skin     text not null default 'default',
  updated_at       timestamptz default now()
);

alter table public.somang_tree_state enable row level security;
create policy "somang_tree_state_self_select" on somang_tree_state for select using (auth.uid() = uid);
create policy "somang_tree_state_self_upsert_ins" on somang_tree_state for insert with check (auth.uid() = uid);
create policy "somang_tree_state_self_upsert_upd" on somang_tree_state for update using (auth.uid() = uid);

-- ============================================================================
-- 4) 닉네임 설정 (1~12자, 공백/욕설 검증은 함수 안에서)
-- ============================================================================
create or replace function somang_set_nickname(p_nickname text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_trimmed text := trim(p_nickname);
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  if char_length(v_trimmed) < 1 or char_length(v_trimmed) > 12 then
    raise exception 'invalid_nickname';
  end if;
  insert into somang_profiles (uid, nickname) values (v_uid, v_trimmed)
  on conflict (uid) do update set nickname = v_trimmed, updated_at = now();
end;
$$;

-- ============================================================================
-- 5) 츄르 지급 (응원 결제 후 호출 — 일회성. 영구 무료 룰: 1년 광고 제거 답례만)
-- ============================================================================
create or replace function somang_grant_chur(p_tier text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_until timestamptz := now() + interval '365 days';
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  if p_tier not in ('silver', 'gold') then raise exception 'invalid_tier'; end if;

  insert into somang_profiles (uid, ad_free_until)
  values (v_uid, v_until)
  on conflict (uid) do update set
    chur_silver   = somang_profiles.chur_silver + case when p_tier = 'silver' then 1 else 0 end,
    chur_gold     = somang_profiles.chur_gold   + case when p_tier = 'gold'   then 1 else 0 end,
    ad_free_until = greatest(coalesce(somang_profiles.ad_free_until, now()), v_until),
    updated_at    = now();
end;
$$;

-- ============================================================================
-- 6) Tree state recompute (트리거)
-- ============================================================================
create or replace function somang_recompute_tree_state()
returns trigger
language plpgsql
as $$
declare
  v_uid uuid := coalesce(new.uid, old.uid);
  v_total integer;
  v_done integer;
  v_season text;
begin
  select count(*), count(*) filter (where status = 'green')
  into v_total, v_done
  from somang_wishes
  where uid = v_uid and level = 3;

  v_season := case
    when v_total = 0 then 'spring'
    when v_done::numeric / nullif(v_total, 0) >= 0.75 then 'winter'
    when v_done::numeric / nullif(v_total, 0) >= 0.5  then 'autumn'
    when v_done::numeric / nullif(v_total, 0) >= 0.25 then 'summer'
    else 'spring'
  end;

  insert into somang_tree_state (uid, season, total_wishes, completed_wishes, updated_at)
  values (v_uid, v_season, v_total, v_done, now())
  on conflict (uid) do update set
    season = excluded.season,
    total_wishes = excluded.total_wishes,
    completed_wishes = excluded.completed_wishes,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists somang_wishes_recompute on public.somang_wishes;
create trigger somang_wishes_recompute
after insert or update or delete on public.somang_wishes
for each row execute function somang_recompute_tree_state();

-- ============================================================================
-- 7) 프로필 조회
-- ============================================================================
create or replace function somang_get_profile()
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_uid    uuid := auth.uid();
  v_result jsonb;
begin
  if v_uid is null then return null; end if;
  select jsonb_build_object(
    'uid', uid,
    'nickname', nickname,
    'chur_silver', chur_silver,
    'chur_gold', chur_gold,
    'ad_free_until', ad_free_until
  ) into v_result from somang_profiles where uid = v_uid;
  return coalesce(v_result, jsonb_build_object('uid', v_uid));
end;
$$;
