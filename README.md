# Card Database Site (Vercel)

Structure:
- `public/index.html`  static front end
- `api/cards.js`, `api/filters.js`  serverless functions (Postgres queries)
- `lib/db.js`  shared connection pool

Deploy steps: see the chat instructions. Short version:
1. Make sure your Postgres is reachable from the internet (Neon, Supabase, Vercel/Neon, Railway, etc.).
2. Push this folder to GitHub, import it in Vercel.
3. Add env vars DATABASE_URL (and CARDS_TABLE if needed), then deploy.

Local testing: `npm i -g vercel`, `npm install`, `vercel dev`.
