import type { Messages } from '@/lib/i18n';

export default function Footer({ msgs }: { msgs: Messages }) {
  return (
    <footer className="mt-16 py-8 text-center text-xs text-somang-stone">
      <div className="font-semibold">{msgs.common.brand} · revely.company</div>
      <div className="mt-1 opacity-70">{msgs.common.brand_tagline}</div>
    </footer>
  );
}
