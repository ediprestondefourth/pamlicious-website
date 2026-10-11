# Payments and Admin Setup

## Supabase product catalog

Run `supabase/migrations/20261011000000_products.sql` in the Supabase SQL Editor for project `pytmbpnggrmxzlkahbsw`. The migration creates and seeds the `products` table. Row-level security is enabled; browser clients receive no direct table access. Netlify Functions use the service-role key server-side.

## Netlify environment variables

In Netlify site settings, add these variables for the production deploy context:

- `PAYSTACK_SECRET_KEY`: Paystack secret key. Start with a test key and replace it with a live key only when ready to accept real payments.
- `ADMIN_PASSWORD`: a unique password of at least 8 characters. Longer is safer for a publicly reachable admin login.
- `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- `SUPABASE_URL`: `https://pytmbpnggrmxzlkahbsw.supabase.co`.
- `SUPABASE_SERVICE_ROLE_KEY`: the Supabase service-role/secret key from the project API settings. Never use a `VITE_` prefix or put this key in browser code.

Netlify supplies the site `URL` automatically for the Paystack return URL. `SITE_URL` may be set for local Netlify CLI testing.

After saving variables, trigger a fresh Netlify deploy. Use the Paystack test environment first and complete a test payment before switching to live credentials.

## Local behavior

The Vite-only development server does not execute Netlify Functions. Run the site through `netlify dev` to test the payment and admin endpoints locally, with the variables above in a local environment file that is not committed. Product edits are saved to Supabase when its server-side variables are configured; the browser keeps a local fallback for browsing if the catalog endpoint is unavailable.