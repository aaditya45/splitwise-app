# Splitwise Mobile

An Expo Router app for shared group expenses, member management, and settlement tracking.

## Setup

1. Install dependencies declared in `package.json` and locked in `package-lock.json` with `npm install`.
2. Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_API_URL` to the backend base URL.
3. Start the app with `npx expo start`.

The backend guide uses port `8088`. When testing on a physical phone, use your development computer's LAN IP address instead of `localhost`, and make sure the phone and computer are on the same network. Android emulators may use their host-loopback address. The app intentionally has no baked-in API host.

`EXPO_PUBLIC_CURRENCY_CODE` optionally sets the display currency; it defaults to `INR`. Expo public environment variables are included in the app bundle, so do not put secrets in them.

## App Flows

- Register and sign in; mobile auth sessions are stored with Expo SecureStore.
- Create groups, open groups by ID, add registered users by ID, and view group members.
- Add expenses, select participants and a split type, and view expense splits.
- View pending settlements or a group summary; debtors can mark pending settlements as paid.
- The backend contract does not define a list-my-groups endpoint. Groups are saved on this device after creation or explicit ID lookup.

## Backend Coverage

| Contract endpoint                                   | App flow                          |
| --------------------------------------------------- | --------------------------------- |
| `POST /api/auth/register`                           | Create account                    |
| `POST /api/auth/login`                              | Sign in                           |
| `POST /api/groups`                                  | Create group                      |
| `GET /api/groups/{groupId}`                         | Open group and load its members   |
| `POST /api/groups/{groupId}/members/{userId}`       | Add a registered member           |
| `POST /api/expenses`                                | Add a group expense               |
| `GET /api/expenses/{expenseId}`                     | View expense and split details    |
| `GET /api/expenses/group/{groupId}`                 | Load group and home activity      |
| `GET /api/settlements/group/{groupId}/user/pending` | Load pending settlements          |
| `GET /api/settlements/group/{groupId}/summary`      | Load the group settlement summary |
| `POST /api/settlements/{settlementId}/pay`          | Mark a debtor's payment as paid   |

The API base URL is in `src/constants/config.ts`, requests are centralized in `src/lib/api.ts`, app state is managed by Zustand in `src/stores/app-store.ts`, and visual tokens are centralized in `src/constants/theme.ts`.

## Checks

- `npx expo lint`
- `npx tsc --noEmit`
