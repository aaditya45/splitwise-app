import { Redirect } from 'expo-router';

import { AuthScreen } from '@/features/auth/components/auth-screen';
import { LoadingView, ScreenFrame } from '@/components/ui';
import { useApp } from '@/providers/app-provider';

export default function IndexRoute() {
  const { loading, session } = useApp();
  if (loading) return <ScreenFrame><LoadingView label="Opening Splitwise" /></ScreenFrame>;
  if (session) return <Redirect href="/groups" />;
  return <AuthScreen />;
}
