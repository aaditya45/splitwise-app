import type { ReactNode } from 'react';

import { LoadingView, ScreenFrame } from '@/components/ui/primitives';
import { useApp } from '@/providers/app-provider';

export function ProtectedScreen({ children }: { children: ReactNode }) {
  const { loading, session } = useApp();
  if (loading) return <ScreenFrame><LoadingView label="Restoring your session" /></ScreenFrame>;
  if (!session) return null;
  return children;
}
