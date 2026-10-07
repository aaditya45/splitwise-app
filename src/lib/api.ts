import { API_BASE_URL } from "@/constants/config";
import type {
    AuthResponse,
    CreateExpenseRequest,
    Expense,
    Group,
    Settlement,
    SettlementSummary,
} from "@/types/api";

interface RequestOptions {
  token?: string;
  body?: unknown;
  method?: "GET" | "POST";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "Set EXPO_PUBLIC_API_URL to your backend address before connecting.",
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body === undefined
          ? {}
          : { "Content-Type": "application/json" }),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...(options.body === undefined
        ? {}
        : { body: JSON.stringify(options.body) }),
    });
  } catch {
    throw new Error(
      `Could not reach ${API_BASE_URL}. Check the API URL and that your device can access the backend.`,
    );
  }

  let payload: unknown;
  try {
    const responseText = await response.text();
    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText);
      } catch {
        payload = responseText.trim();
      }
    }
  } catch {
    payload = undefined;
  }

  const envelope = isRecord(payload) ? payload : undefined;
  if (!response.ok || envelope?.success === false) {
    const bodyMessage =
      typeof envelope?.message === "string"
        ? envelope.message
        : typeof envelope?.error === "string"
          ? envelope.error
          : typeof payload === "string" &&
              payload.length < 300 &&
              !payload.includes("<html")
            ? payload
            : undefined;
    const operation = `${options.method ?? "GET"} ${path}`;
    throw new Error(
      bodyMessage
        ? `${bodyMessage} (${response.status})`
        : `${operation} failed with HTTP ${response.status}.`,
    );
  }

  if (envelope && "data" in envelope) {
    return envelope.data as T;
  }
  return payload as T;
}

export const api = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => request<AuthResponse>("/api/auth/register", { method: "POST", body }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body }),
  createGroup: async (
    token: string,
    body: { name: string; description?: string; groupImage?: string },
  ) => {
    const group = await request<Group>("/api/groups", {
      method: "POST",
      token,
      body,
    });
    if (!isRecord(group) || typeof group.groupId !== "number") {
      throw new Error(
        "Group creation returned successfully, but its response did not include a numeric groupId.",
      );
    }
    return group as Group;
  },
  getGroupsByUserId: async (token: string, userId: number) => {
    const result = await request<unknown>(`/api/groups/${userId}`, { token });
    const groups = Array.isArray(result)
      ? result
      : isRecord(result) && Array.isArray(result.groups)
        ? result.groups
        : null;
    if (!groups) {
      throw new Error(
        `GET /api/groups/${userId} did not return a list of groups.`,
      );
    }
    return groups.filter(
      (group): group is Group =>
        isRecord(group) &&
        typeof group.groupId === "number" &&
        typeof group.name === "string",
    );
  },
  addMember: (token: string, groupId: number, userId: number) =>
    request<unknown>(`/api/groups/${groupId}/members/${userId}`, {
      method: "POST",
      token,
    }),
  createExpense: (token: string, body: CreateExpenseRequest) =>
    request<Expense>("/api/expenses", { method: "POST", token, body }),
  getExpense: (token: string, expenseId: number) =>
    request<Expense>(`/api/expenses/${expenseId}`, { token }),
  getGroupExpenses: (token: string, groupId: number) =>
    request<Expense[]>(`/api/expenses/group/${groupId}`, { token }),
  getPendingSettlements: (token: string, groupId: number) =>
    request<Settlement[]>(`/api/settlements/group/${groupId}/user/pending`, {
      token,
    }),
  getSettlementSummary: (token: string, groupId: number) =>
    request<Settlement[] | SettlementSummary>(
      `/api/settlements/group/${groupId}/summary`,
      { token },
    ),
  paySettlement: (token: string, settlementId: number) =>
    request<Settlement>(`/api/settlements/${settlementId}/pay`, {
      method: "POST",
      token,
    }),
};
