import { create } from "zustand";

import { AUTH_STORAGE_KEY, GROUPS_STORAGE_KEY } from "@/constants/config";
import { api } from "@/lib/api";
import {
    getStoredValue,
    removeStoredValue,
    setStoredValue,
} from "@/lib/session-storage";
import type { AuthResponse, AuthUser, Group } from "@/types/api";

export interface AppSession {
  token: string;
  user: AuthUser;
}

interface AppStore {
  loading: boolean;
  session: AppSession | null;
  groups: Group[];
  groupsLoading: boolean;
  groupsError: string | null;
  hydrate: () => Promise<void>;
  loadGroups: () => Promise<Group[]>;
  login: (email: string, password: string) => Promise<void>;
  register: (values: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  rememberGroup: (group: Group) => Promise<void>;
}

let hydration: Promise<void> | null = null;

function toSession(response: AuthResponse): AppSession {
  return {
    token: response.token,
    user: {
      userId: response.userId,
      email: response.email,
      name: response.name,
    },
  };
}

function parseSession(value: string | null): AppSession | null {
  if (!value) return null;
  try {
    const candidate = JSON.parse(value) as Partial<AppSession>;
    if (
      typeof candidate.token === "string" &&
      typeof candidate.user?.userId === "number" &&
      typeof candidate.user.email === "string" &&
      typeof candidate.user.name === "string"
    ) {
      return candidate as AppSession;
    }
  } catch {
    return null;
  }
  return null;
}

function parseGroups(value: string | null): Group[] {
  if (!value) return [];
  try {
    const candidate: unknown = JSON.parse(value);
    if (!Array.isArray(candidate)) return [];
    return candidate.filter(
      (group): group is Group =>
        typeof group?.groupId === "number" && typeof group?.name === "string",
    );
  } catch {
    return [];
  }
}

export const useAppStore = create<AppStore>((set, get) => ({
  loading: true,
  session: null,
  groups: [],
  groupsLoading: false,
  groupsError: null,

  loadGroups: async () => {
    const session = get().session;
    if (!session) return [];

    set({ groupsLoading: true, groupsError: null });
    try {
      const groups = await api.getGroupsByUserId(
        session.token,
        session.user.userId,
      );
      if (get().session?.token !== session.token) return [];
      set({ groups });
      await setStoredValue(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      return groups;
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not load your groups.";
      set({ groupsError: message });
      throw cause;
    } finally {
      if (get().session?.token === session.token) {
        set({ groupsLoading: false });
      }
    }
  },

  hydrate: () => {
    if (hydration) return hydration;
    hydration = (async () => {
      try {
        const [storedSession, storedGroups] = await Promise.all([
          getStoredValue(AUTH_STORAGE_KEY),
          getStoredValue(GROUPS_STORAGE_KEY),
        ]);
        const session = parseSession(storedSession);
        set({ session, groups: parseGroups(storedGroups) });
        if (session)
          await get()
            .loadGroups()
            .catch(() => []);
      } catch {
        set({ session: null, groups: [] });
      } finally {
        set({ loading: false });
      }
    })();
    return hydration;
  },

  login: async (email, password) => {
    const response = await api.login({ email, password });
    const session = toSession(response);
    await setStoredValue(AUTH_STORAGE_KEY, JSON.stringify(session));
    set({ session, groups: [], groupsError: null });
    void get()
      .loadGroups()
      .catch(() => []);
  },

  register: async (values) => {
    const response = await api.register(values);
    const session = toSession(response);
    await setStoredValue(AUTH_STORAGE_KEY, JSON.stringify(session));
    set({ session, groups: [], groupsError: null });
    void get()
      .loadGroups()
      .catch(() => []);
  },

  logout: async () => {
    await Promise.allSettled([
      removeStoredValue(AUTH_STORAGE_KEY),
      removeStoredValue(GROUPS_STORAGE_KEY),
    ]);
    set({
      session: null,
      groups: [],
      groupsLoading: false,
      groupsError: null,
    });
  },

  rememberGroup: async (group) => {
    const groups = [
      group,
      ...get().groups.filter((item) => item.groupId !== group.groupId),
    ];
    set({ groups });
    await setStoredValue(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  },
}));
