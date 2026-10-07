import { useEffect, type ReactNode } from 'react';

import { useAppStore } from '@/stores/app-store';

export function AppProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useAppStore.getState().hydrate();
  }, []);

  return children;
}

export const useApp = useAppStore;
