# Payments and Admin Setup

## Supabase product catalog

Run `supabase/migrations/20261011000000_products.sql` in the Supabase SQL Editor. The migration creates and seeds the `products` table. Row-level security is enabled; browser clients receive no direct table access. Netlify Functions use the service-role key server-side.

## Netlify environment variables

In Netlify site settings, add these variables for the production deploy context:

- `PAYSTACK_SECRET_KEY`: Paystack secret key. Start with a test key and replace it with a live key only when ready to accept real payments.
- `ADMIN_PASSWORD`: a unique password of at least 8 characters. Longer is safer for a publicly reachable admin login.
- `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- `SUPABASE_URL`: copy the project URL from your Supabase project settings into Netlify. Do not paste its configured value into repository files.
- `SUPABASE_SERVICE_ROLE_KEY`: the Supabase service-role/secret key from the project API settings. Never use a `VITE_` prefix or put this key in browser code.

Netlify supplies the site `URL` automatically for the Paystack return URL. `SITE_URL` may be set for local Netlify CLI testing.

After saving variables, trigger a fresh Netlify deploy. Use the Paystack test environment first and complete a test payment before switching to live credentials.

## Secret handling and deploy checks

Keep configured environment values out of source code, setup documentation, and build output. The server-side variables above are read by Netlify Functions through `process.env`; do not expose passwords, signing secrets, or API keys through `VITE_` variables or browser code. Local `.env` files are already excluded by `.gitignore`.

If secrets scanning blocks a deploy, inspect the earlier scan messages for the matched variable names and file paths. The environment names in the resolved build configuration alone do not identify which values matched. Remove the matching configured values from those files and redeploy, rather than disabling scanning or excluding credential keys. If a password or API credential was committed or published, rotate it before redeploying.

## Local behavior

The Vite-only development server does not execute Netlify Functions. Run the site through `netlify dev` to test the payment and admin endpoints locally, with the variables above in a local environment file that is not committed. Product edits are saved to Supabase when its server-side variables are configured; the browser keeps a local fallback for browsing if the catalog endpoint is unavailable.
