# Hermes Hub Backend Setup

Hermes Hub now has a NestJS backend foundation designed for the closed beta marketplace loop:

Expo / React Native / Expo Web -> NestJS REST API -> Supabase PostgreSQL + PostGIS.

Supabase Auth is used for user identity. The Expo app signs users in with Supabase, receives a Supabase JWT, and sends that JWT to NestJS as a Bearer token for protected endpoints. The Supabase service-role key must only be used by the backend.

## 1. Create a Supabase Project

Create a Supabase project for Hermes Hub and collect:

- Project URL
- anon public key
- service-role key
- database connection string

Keep the service-role key out of the Expo app.

## 2. Configure Environment Variables

Backend:

```bash
cp backend/.env.example backend/.env
```

Fill:

```bash
PORT=3000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
ENABLE_BETA_ADMIN_ENDPOINTS=true
BETA_ADMIN_TOKEN=
```

Frontend:

```bash
cp .env.example .env
```

Fill:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_USE_MOCK_API=false
```

Use `EXPO_PUBLIC_USE_MOCK_API=true` only when you intentionally want the old local mock mode.

## 3. Install Dependencies

```bash
npm install
npm run backend:install
```

## 4. Enable PostGIS and Run Migrations

The initial migration enables `postgis` and creates the marketplace schema, indexes, enums, RLS policies, and storage buckets.

```bash
npm run build --prefix backend
npm run migrate --prefix backend
```

If your hosted database blocks extension creation from the connection user, enable PostGIS in the Supabase SQL editor first:

```sql
create extension if not exists postgis;
```

Then rerun the migration.

## 5. Seed Ibadan Beta Businesses

Seed roughly 30 fictional Ibadan businesses across Beauty, Food, Fashion, Events, Tech, Home, Repairs, Cleaning, Wellness, Learning, and Automotive.

```bash
npm run seed --prefix backend
```

Seed data is for beta testing only. Replace with approved real businesses before public launch.

## 6. Configure Supabase Auth

In Supabase Auth settings:

- Add your Expo Web URL to allowed redirect URLs.
- Decide whether email confirmation is enabled for closed beta.
- If email confirmation is enabled, signup will create the account and ask the user to confirm before signing in.
- If email confirmation is disabled, signup can create a session immediately.

## 7. Configure Supabase Storage

The migration creates public buckets:

- `business-images`
- `avatars`

The migration also creates a private bucket:

- `business-documents`

For the current beta, seeded businesses use remote image URLs. Before real onboarding, add signed upload flows and storage policies for `business-documents`; verification documents must not be publicly readable.

## 8. Start NestJS

```bash
npm run backend:dev
```

The API runs on `http://localhost:3000` by default.

Beta booking status changes require both a valid Supabase user token and the backend-only `x-hermes-admin-token` header matching `BETA_ADMIN_TOKEN`.

## 9. Start Expo

```bash
npm install
npx expo start
```

For iPhone testing, make sure `EXPO_PUBLIC_API_URL` points to a URL your phone can reach. `localhost` on the phone is the phone itself, not your Mac. Use your Mac LAN IP or a tunnel for device testing.

## 10. Run Expo Web

```bash
npx expo start --web
```

Test browser refresh and back/forward behavior after login.

## 11. Useful Checks

```bash
npm run typecheck
npm run typecheck --prefix backend
npm test --prefix backend
npx expo install --check
```

End-to-end API testing requires a configured Supabase project and populated environment files.
