'use client';
import { useEffect, useMemo, useState } from 'react';
import Tree from '@/components/Tree';
import WishForm from '@/components/WishForm';
import ActionList from '@/components/ActionList';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import AuthChip from '@/components/AuthChip';
import NicknameModal from '@/components/NicknameModal';
import SeasonToast from '@/components/SeasonToast';
import InterstitialAd from '@/components/InterstitialAd';
import AdSlot from '@/components/AdSlot';
import DonateButton from '@/components/DonateButton';
import ShareCard from '@/components/ShareCard';
import Footer from '@/components/Footer';
import { computeStats, loadWishes, newId, saveWishes, type WishNode } from '@/lib/storage';
import { useAuth } from '@/lib/AuthProvider';
import { fetchUserWishes, updateWishStatus } from '@/lib/wishes-sync';
import type { Locale, Messages } from '@/lib/i18n';

interface Props {
  locale: Locale;
  msgs: Messages;
}

export default function HomeClient({ locale, msgs }: Props) {
  const [wishes, setWishes] = useState<WishNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingResult, setPendingResult] = useState<any | null>(null);
  const { user, profile } = useAuth();
  const adFree = Boolean(profile?.ad_free_until && new Date(profile.ad_free_until) > new Date());

  // Initial load: prefer DB if logged in, else localStorage
  useEffect(() => {
    if (user) {
      fetchUserWishes().then((db) => {
        if (db.length > 0) setWishes(db);
        else setWishes(loadWishes());
      }).catch(() => setWishes(loadWishes()));
    } else {
      setWishes(loadWishes());
    }
  }, [user]);

  useEffect(() => {
    saveWishes(wishes);
  }, [wishes]);

  const actions = useMemo(() => wishes.filter((w) => w.level === 3), [wishes]);
  const stats = useMemo(() => computeStats(wishes), [wishes]);

  const seasonLabel = {
    spring: msgs.home.season_label_spring,
    summer: msgs.home.season_label_summer,
    autumn: msgs.home.season_label_autumn,
    winter: msgs.home.season_label_winter,
  }[stats.season];

  async function handleDecompose(level1: string, level2: string) {
    if (!level1 || !level2) {
      setError(msgs.errors.missing_fields);
      return;
    }
    setError(null);
    setFallbackNotice(false);
    setLoading(true);
    try {
      const res = await fetch('/api/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level1, level2, locale }),
      });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      data._level1 = level1;
      data._level2 = level2;
      setPendingResult(data);
      setShowInterstitial(true);
    } catch (e) {
      setError(msgs.errors.ai_failed);
    } finally {
      setLoading(false);
    }
  }

  function applyResult() {
    if (!pendingResult) return;
    const data = pendingResult;
    const now = new Date().toISOString();
    const lvl1: WishNode = {
      id: newId(),
      level: 1,
      title: data._level1,
      status: 'yellow',
      language: locale,
      createdAt: now,
    };
    const lvl2: WishNode = {
      id: newId(),
      level: 2,
      title: data._level2,
      parentId: lvl1.id,
      status: 'yellow',
      language: locale,
      createdAt: now,
    };
    const newActions: WishNode[] = (data.actions ?? []).map((a: any) => ({
      id: newId(),
      level: 3 as const,
      title: a.title,
      hint: a.hint,
      parentId: lvl2.id,
      status: 'yellow' as const,
      estimateMinutes: a.estimateMinutes,
      language: locale,
      createdAt: now,
    }));
    setWishes((prev) => [...prev, lvl1, lvl2, ...newActions]);
    setSummary(data.summary ?? null);
    setEncouragement(data.encouragement ?? null);
    if (data.source === 'fallback') setFallbackNotice(true);
    setPendingResult(null);
    setShowInterstitial(false);
  }

  function changeStatus(id: string, next: 'yellow' | 'blue' | 'green') {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: next,
              completedAt: next === 'green' ? new Date().toISOString() : undefined,
            }
          : w,
      ),
    );
    if (user) {
      updateWishStatus(id, next).catch(() => {});
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 max-w-5xl mx-auto">
      {/* Top bar */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-somang-bark">
            {msgs.common.brand}
          </h1>
          <p className="text-xs text-somang-stone opacity-80">{msgs.common.brand_tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <DonateButton msgs={msgs} />
          <AuthChip msgs={msgs} />
          <LocaleSwitcher current={locale} />
        </div>
      </header>

      {/* Tree section */}
      <section className="paper rounded-3xl bg-gradient-to-b from-white/50 to-somang-cream/30 border border-somang-mist p-4 sm:p-8 shadow-sm">
        <div className="text-center mb-2">
          <div className="text-xs uppercase tracking-widest text-somang-stone">
            {seasonLabel} · {stats.done}/{stats.total}
          </div>
        </div>
        <Tree season={stats.season} total={stats.total} done={stats.done} />
      </section>

      {/* Hero copy when empty */}
      {wishes.length === 0 && (
        <section className="mt-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-somang-bark leading-snug">
            {msgs.home.hero_title_a}
            <br />
            {msgs.home.hero_title_b}
          </h2>
          <p className="mt-3 text-sm text-somang-stone max-w-md mx-auto leading-relaxed">
            {msgs.home.hero_sub}
          </p>
        </section>
      )}

      {/* Wish form */}
      <section className="mt-8">
        <WishForm msgs={msgs} onSubmit={handleDecompose} loading={loading} />
        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}
        {fallbackNotice && (
          <p className="mt-3 text-center text-xs text-somang-stone opacity-80">
            {msgs.errors.fallback_notice}
          </p>
        )}
      </section>

      {/* Summary + encouragement (rich result page rule: 500자+ 다층) */}
      {summary && (
        <section className="mt-8 max-w-2xl mx-auto rounded-2xl bg-somang-cream/60 border border-somang-mist p-5">
          <div className="text-xs uppercase tracking-widest text-somang-stone mb-2">AI</div>
          <p className="text-somang-ink leading-relaxed">{summary}</p>
          {encouragement && (
            <p className="mt-3 text-sm text-somang-bark italic">{encouragement}</p>
          )}
        </section>
      )}

      {/* Action post-its */}
      {actions.length > 0 && (
        <section className="mt-10">
          <ActionList
            msgs={msgs}
            actions={actions}
            onStart={(id) => changeStatus(id, 'blue')}
            onComplete={(id) => changeStatus(id, 'green')}
            onReopen={(id) => changeStatus(id, 'yellow')}
          />
        </section>
      )}

      {/* Share card */}
      {actions.length > 0 && (
        <ShareCard
          msgs={msgs}
          nickname={profile?.nickname ?? '소망지기'}
          stats={stats}
        />
      )}

      {/* 결과 하단 광고 (자연 전환점 - 영구 룰 OK) */}
      {actions.length > 0 && !adFree && (
        <div className="mt-10">
          <AdSlot placement="result-bottom" />
        </div>
      )}

      {/* 결과 직전 인터스티셜 */}
      {showInterstitial && (
        <InterstitialAd msgs={msgs} adFree={adFree} onComplete={applyResult} />
      )}

      {/* 닉네임 자동 모달 (로그인 시 미설정 사용자) */}
      <NicknameModal msgs={msgs} />

      {/* 계절 변화 토스트 */}
      <SeasonToast msgs={msgs} season={stats.season} />

      {/* Features when empty */}
      {wishes.length === 0 && (
        <section className="mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { t: msgs.home.feature1_title, s: msgs.home.feature1_sub, emoji: '🌳' },
            { t: msgs.home.feature2_title, s: msgs.home.feature2_sub, emoji: '🍃' },
            { t: msgs.home.feature3_title, s: msgs.home.feature3_sub, emoji: '🟡' },
          ].map((f) => (
            <div key={f.t} className="bg-white/60 rounded-2xl p-4 border border-somang-mist text-center">
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="font-semibold text-somang-bark text-sm">{f.t}</div>
              <div className="text-xs text-somang-stone mt-1 leading-snug">{f.s}</div>
            </div>
          ))}
        </section>
      )}

      <Footer msgs={msgs} />
    </main>
  );
}
