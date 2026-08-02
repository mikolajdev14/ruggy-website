# Security configuration

The application now fails closed for administrator authorization. A Supabase
user is allowed into the panel only when one of these conditions is true:

1. `user.app_metadata.role` is `admin`.
2. `user.app_metadata.is_admin` is `true`.
3. The user id is listed in `RUGGY_ADMIN_USER_IDS`.
4. The email is listed in `RUGGY_ADMIN_EMAILS`.

Set at least one administrator in the production environment before deploying.
Do not use `user_metadata` for this because users can change it themselves.

Apply `supabase/migrations/20260802_security_hardening.sql` to the production
Supabase project. Confirm that `bookings` and `booking-reference-images` cannot
be read by anonymous or authenticated clients, while active catalog data still
loads publicly.

The production deployment must set `NEXT_PUBLIC_SITE_URL` or
`NEXT_PUBLIC_APP_URL` to the exact HTTPS origin used by the shop. Stripe return
URLs reject every other origin.

Recommended checks after deployment:

1. Anonymous Supabase access cannot select from `bookings`.
2. An authenticated user without an admin role cannot open `/admin/dashboard`.
3. An administrator can open the panel and receive signed image URLs that expire.
4. A checkout request with an untrusted `Origin` is rejected.
5. The Stripe webhook accepts only valid signatures.
6. `npm audit --omit=dev` reports no high severity findings.
