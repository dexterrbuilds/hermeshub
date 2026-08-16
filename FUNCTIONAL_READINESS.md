# Hermes Hub Functional Readiness

Current architecture: Expo client with service boundaries, NestJS REST API, Supabase Auth, Supabase PostgreSQL/PostGIS, and Supabase Storage-ready schema.

| Feature | Current State | Needed for Beta | Needed for Production |
|---|---|---|---|
| Authentication | Supabase Auth wired in Expo; persisted sessions; logout; password reset request; NestJS JWT guard. | Configure Supabase project, redirects, email-confirmation policy, and device-reachable API URL. | Harden auth flows, account recovery, account deletion, abuse controls, audit logs. |
| Users/profiles | `profiles` table and `/me/profile` get/update; profile row created on first backend profile read. | Add profile completion UX for phone/default area. | Full account settings, consent/privacy controls, identity verification where required. |
| Businesses | Database schema, seeded Ibadan businesses, search/detail/nearby APIs. | Replace seed-only businesses with approved beta listings. | Merchant onboarding, ownership, moderation, suspensions, business lifecycle. |
| Services/products | Schema and API-backed service detail/profile services. | Confirm each beta business has realistic services, prices, duration, lead time. | Merchant-managed catalog, availability, inventory/quote workflows. |
| Search | API-backed text/category/area/service search using PostgreSQL. | Tune relevance with real beta queries. | Ranking, synonyms, typo tolerance, analytics-driven relevance, possible search engine later. |
| Location | PostGIS nearby endpoint; Expo Location/browser geolocation client helper; manual fallback remains. | Test permission denied/granted on iPhone and web; refine default/manual area flow. | Production geospatial ranking, privacy copy, saved addresses, service radius rules. |
| Bookings | Protected create/list/detail/status endpoints; booking history; UI creates real bookings when API mode is on. | Validate end-to-end with Supabase; define beta operator status-update process. | Merchant acceptance, scheduling conflicts, cancellation policy, dispute handling. |
| Orders | UI reads API bookings for authenticated users; static orders remain only in mock mode. | Add better empty/error states for no live bookings in tracking. | Full order lifecycle, notifications, receipts, service evidence, support workflows. |
| Payments | Visual/mock wallet only. No real charge. | Keep booking unpaid or payment-pending in beta copy. | Backend-only Paystack/Flutterwave integration, reconciliation, refunds, payout model. |
| Reviews | Server enforces completed booking ownership and one review per booking; public business review reads exist. | Test completed-booking review path with live data. | Review moderation, reporting, fraud detection, response rights for businesses. |
| Favorites | API-backed favorites with optimistic UI; mock fallback remains. | Test persistence across mobile/web sessions. | Lists/collections, notifications, ranking personalization. |
| Notifications | UI placeholders only. | Manual tester communication is acceptable for first closed beta. | Expo push, email/SMS, notification preferences, delivery status events. |
| Images | Schema and Storage buckets; seeded businesses use remote URLs; frontend image fallback/fade exists. | Upload final beta business images or approve remote placeholders. | Storage policies, compression, moderation, signed upload flows if needed. |
| Business onboarding | Mock/local progressive UI exists through `businessApplicationService`; not API-backed yet. | Add NestJS endpoints and database tables for `business_applications`, `business_members`, and application status. | Full business signup, ownership, verification, corrections, lifecycle, and audit history. |
| Business document upload | UI/service boundary exists through `businessDocumentService`; uploads are simulated. | Add private Supabase Storage bucket, signed upload URLs, metadata table, file type/size validation. | Secure document retention, access controls, admin review, expiry, deletion, and compliance policy. |
| Verification | `verification_records` schema exists; business verification status UI is mock/local for applications. | Build admin review endpoints for approve/reject/request changes and connect status to businesses. | Admin workflows, evidence capture, expiry/review cycles, audit trail, risk-based requirements. |
| Business management | Lightweight beta dashboard UI exists; data is mock/local through `businessManagementService`. | Add business owner APIs for profile, services/products, availability, booking decisions, and status updates. | Business analytics, team roles, payouts, disputes, messaging, service quality controls. |
| Business booking management | Consumer bookings exist; business-side accept/reject/update flow is UI-planned but not backend-scoped by owner yet. | Add owner authorization and merchant/beta operator endpoints. | Merchant portal workflows, notifications, schedule conflict handling, cancellation policy. |
| Admin | No full admin UI; status update endpoint is beta-admin gated by backend env/token. | Create a simple operator workflow for status changes and verification updates. | Admin console for moderation, approvals, disputes, support, featured listings. |
| Analytics | Provider-neutral analytics abstraction exists. | Log locally or connect a beta analytics provider. | PostHog or equivalent, funnels, retention, search analytics, privacy-safe events. |
| Error monitoring | Not integrated. | Add API logs and basic crash/error monitoring before wider beta. | Sentry or equivalent across API, mobile, and web. |
| Backend | NestJS modules, DTO validation, guards, throttling, consistent error filter. | Deploy to a stable host; add environment-specific CORS. | CI/CD, observability, backups, security review, scaling plan. |
| Database | Reproducible migration and seed SQL; RLS policies included. | Run migration/seed in Supabase and verify policies manually. | Migration discipline, backups, rollback, least-privilege operational roles. |
| Security | No service-role key in frontend; JWT guard; DTO validation; RLS; basic rate limiting. | Confirm env separation and CORS; remove exposed debug/beta endpoints if not protected. | Pen test/security audit, stronger abuse prevention, admin auth, audit logging. |

## Current Closed-Beta Definition

Hermes is ready for a real closed-beta test only after a Supabase project is configured, migrations/seeds are applied, the NestJS API is deployed, and the complete marketplace loop is manually verified against live data.

The UI no longer needs to be rebuilt for that step. The remaining work is mostly integration, data operations, beta controls, and hardening.
