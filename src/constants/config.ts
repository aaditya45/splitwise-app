export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ?? "";
export const CURRENCY_CODE =
  process.env.EXPO_PUBLIC_CURRENCY_CODE?.trim() || "INR";
export const AUTH_STORAGE_KEY = "splitwise.session";
export const GROUPS_STORAGE_KEY = "splitwise.groups";
