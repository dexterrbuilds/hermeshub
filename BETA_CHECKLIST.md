# Hermes Hub Closed Beta Checklist

This checklist separates frontend polish from real marketplace readiness.

## Implemented Foundation

- Expo client can use Supabase Auth for signup, login, logout, session restoration, and forgot password.
- NestJS verifies Supabase JWTs on protected endpoints.
- PostgreSQL schema covers profiles, addresses, categories, businesses, locations, images, hours, services, availability, favorites, bookings, booking history, reviews, and verification records.
- PostGIS-backed nearby business endpoint exists.
- Search endpoint covers business names, descriptions, taglines, categories, service names, and areas.
- Booking creation writes real database bookings and booking history.
- Orders read real database bookings for the authenticated user.
- Booking status transitions are validated and beta-admin gated with a backend-only token.
- Completed bookings can be reviewed once by the booking owner.
- Favorites are account-backed through the API and optimistic in the UI.
- Mock mode remains available through `EXPO_PUBLIC_USE_MOCK_API=true`.

## Must Be Done Before Inviting Real Testers

- Create Supabase project and fill backend/frontend env files.
- Run migrations and seed data on the Supabase database.
- Confirm RLS policies in Supabase against anon and authenticated users.
- Configure Supabase Auth redirect URLs for Expo Web and mobile deep links.
- Decide whether closed beta uses email confirmation.
- Replace or approve all seeded business copy/images for beta use.
- Test signup, login, logout, session restoration, and password reset on iPhone and web.
- Test search, nearby, business detail, service selection, booking creation, orders, tracking, completion, review submission, and favorites with real API data.
- Set `EXPO_PUBLIC_API_URL` to a phone-reachable URL for physical device testing.
- Add basic monitoring/logging for the NestJS API.
- Deploy the NestJS API somewhere stable for testers.

## Beta Operational Needs

- A way for Hermes operators to approve or verify beta businesses.
- A beta-only process for changing booking statuses until a merchant portal exists, using `PATCH /bookings/:id/status` with `x-hermes-admin-token`.
- A support channel for failed bookings, wrong listings, and unsafe content reports.
- A small tester feedback form or support inbox wired from the Profile feedback entry.
- A simple incident log for authentication, booking, and data bugs.

## Must Not Ship Publicly Yet

- No real payment collection is implemented.
- No merchant onboarding portal exists.
- No admin moderation UI exists.
- No production notification system exists.
- No geolocation consent/privacy copy has been finalized.
- No image upload moderation flow exists.
- No abuse prevention beyond basic auth, validation, RLS, and rate limiting.
- No full audit logging for admin/beta status changes.

## Recommended Public Launch Requirements

- Merchant/business portal for profiles, services, pricing, hours, availability, bookings, and reviews.
- Admin console for business approval, verification, categories, reports, disputes, reviews, support, and suspensions.
- Production payments architecture for Nigeria, likely Paystack or Flutterwave through the backend.
- Push notifications through Expo Push Notifications plus email/SMS for critical booking events.
- PostGIS-backed location ranking and reliable fallback for denied location permission.
- Storage upload pipeline using Supabase Storage or Cloudinary/S3-compatible storage.
- Analytics provider integration through the existing analytics abstraction.
- Error monitoring, uptime checks, backups, and migration rollback process.
- Security review covering auth, RLS, service-role usage, CORS, rate limiting, and data privacy.
