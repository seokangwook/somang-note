'use client';
import type { Messages } from '@/lib/i18n';
import type { TreeStats } from '@/lib/storage';

interface Props {
  msgs: Messages;
  stats: TreeStats;
  encouragement?: string | null;
}

// AI 분해 직후 표시되는 인사이트 카드. 결과 페이지 다층 콘텐츠 룰 (500자+) 강화.
export default function InsightCard({ msgs, stats, encouragement }: Props) {
  if (stats.total === 0) return null;

  const ratio = Math.round(stats.ratio * 100);
  const seasonLabel = {
    spring: msgs.home.season_label_spring,
    summer: msgs.home.season_label_summer,
    autumn: msgs.home.season_label_autumn,
    winter: msgs.home.season_label_winter,
  }[stats.season];
  const seasonIcon = { spring: '🌸', summer: '🌿', autumn: '🍂', winter: '❄️' }[stats.season];

  return (
    <div className="mt-6 max-w-2xl mx-auto bg-gradient-to-br from-somang-cream/70 to-white/40 backdrop-blur rounded-2xl p-5 border border-somang-mist">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-somang-stone">{msgs.tree.stat_total}</div>
          <div className="text-2xl font-bold text-somang-bark">{stats.total}</div>
        </div>
        <div>
          <div className="text-xs text-somang-stone">{msgs.tree.stat_progress}</div>
          <div className="text-2xl font-bold text-somang-bark">{stats.inProgress}</div>
        </div>
        <div>
          <div className="text-xs text-somang-stone">{msgs.tree.stat_done}</div>
          <div className="text-2xl font-bold text-somang-bark">{stats.done}</div>
        </div>
      </div>
      <div className="mt-3 h-2 bg-somang-mist/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-somang-leaf to-somang-sun rounded-full transition-all"
          style={{ width: `${ratio}%` }}
          aria-label={`${ratio}%`}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-somang-stone">
          {seasonIcon} {seasonLabel}
        </div>
        <div className="text-xs text-somang-bark font-semibold">{ratio}%</div>
      </div>
      {encouragement && (
        <div className="mt-4 pt-3 border-t border-somang-mist/60 text-sm text-somang-bark italic text-center">
          {encouragement}
        </div>
      )}
    </div>
  );
}
