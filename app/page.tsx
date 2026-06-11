// 루트는 기본 locale(ko)로 리다이렉트
import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/lib/i18n';

export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`);
}
