CraftLedger — Exclusive Creator Content Platform
===============================================

[cloudflarebutton]

CraftLedger is a premium, non-adult, creator-first platform that enables experts to publish gated educational content, sell digital goods, and receive recurring subscription revenue plus one-time token-based tips. This repository contains a production-grade, visually polished frontend built on a Cloudflare Workers template with a mocked Phase‑1 backend and a Durable Object-friendly pattern for later phases.

Key features
------------

- Beautiful, mobile-first UI built with shadcn/ui and Tailwind CSS
- Creator-centric workflows: content library, scheduling, subscription tiers
- Token-based tipping system (virtual currency) and token wallet UI (mocked)
- Creator dashboard: balance, top gifters, content management, payout requests (mocked)
- Subscriber flows: subscribe, purchase tokens (mocked), view gated content (mocked)
- Mocked analytics and charts for creator insights (Phase 1)
- Cloudflare Durable Object patterns and Hono worker routes included for Phase 2+

Tech stack
----------

- React 18, React Router v6
- TypeScript
- Tailwind CSS (v3) + tailwindcss-animate
- shadcn/ui components (preinstalled under src/components/ui)
- Framer Motion (micro-interactions)
- lucide-react (icons)
- sonner (toasts)
- Zustand (local UI state)
- @tanstack/react-query (data fetching patterns)
- react-hook-form (forms)
- recharts (analytics)
- date-fns (dates)
- clsx + tailwind-merge, react-select, react-intersection-observer
- Hono (Cloudflare worker routes)
- Cloudflare Durable Objects helper (GlobalDurableObject pattern)

Repository layout (important)
-----------------------------

- src/ — React app, pages, layout and shadcn/ui composition
  - src/pages/HomePage.tsx — Overwritten landing page (primary entry)
  - src/pages/DemoPage.tsx — Demo / playground
  - src/components/layout/AppLayout.tsx — App shell + sidebar
  - src/components/ui/* — shadcn UI primitives (do not rewrite these)
- shared/
  - shared/mock-data.ts — Phase 1 mock data (creators, content, tiers, tokens)
  - shared/types.ts — shared API types
- worker/
  - worker/index.ts — Worker entry (do NOT modify)
  - worker/core-utils.ts — Durable Object helpers (do NOT modify)
  - worker/entities.ts — IndexedEntity examples / seed data
  - worker/user-routes.ts — Add server routes here (safe to extend)
- wrangler.jsonc — Cloudflare bindings & DO configuration (do NOT modify)

Quickstart — Development (bun)
------------------------------

This project prefers bun for local setup. Ensure bun is installed on your machine (https://bun.sh).

1. Install dependencies
   - bun install

   The project includes a small bootstrap script (.bootstrap.js). If it needs to run manually:
   - bun .bootstrap.js

2. Start the dev server
   - bun run dev
   - Open http://localhost:3000 in your browser

3. Build (production)
   - bun run build

4. Preview the production build
   - bun run preview

Available npm scripts (package.json)
- dev — vite dev server (configured for 0.0.0.0 host)
- build — vite build
- preview — build + vite preview
- lint — run eslint
- deploy — build + wrangler deploy (requires wrangler to be installed and configured)
- cf-typegen — wrangler types (generate Cloudflare types)

Working with the mock API (Phase 1)
-----------------------------------

- Frontend calls `/api/*` endpoints via src/lib/api-client.ts. Phase 1 uses the mock routes exposed by worker/user-routes.ts and shared/mock-data.ts.
- For additional frontend-only features that require server behavior, extend shared/mock-data.ts and/or src/lib/api-client.ts fallbacks.
- Later phases will replace the mocked endpoints with persistent Durable Object-backed routes.

Cloudflare deployment
---------------------

[cloudflarebutton]

This project is preconfigured to target Cloudflare Workers with a Global Durable Object binding.

1. Install wrangler (if you haven't):
   - npm i -g wrangler@latest
   - or follow Cloudflare's docs for alternative install methods

2. Authenticate with Cloudflare:
   - wrangler login

3. (Optional) Generate CF types:
   - bun run cf-typegen

4. Deploy:
   - bun run build
   - wrangler deploy

Notes:
- Do NOT edit wrangler.jsonc, worker/index.ts or worker/core-utils.ts — these files are intentionally locked and required for the Durable Object pattern to work.
- The durable object binding is declared in wrangler.jsonc under the name GlobalDurableObject. Keep this name when building new server code that interacts with the DO.

Architecture & extension points
-------------------------------

- worker/core-utils.ts exports a GlobalDurableObject class and an IndexedEntity/Entity abstraction that makes it straightforward to add new persistent entities while using a single Durable Object instance as the backing store.
- Add worker routes in worker/user-routes.ts using the provided Entity helpers (see existing examples for UserEntity and ChatBoardEntity).
- Frontend calls should use src/lib/api-client.ts which expects ApiResponse<T> format. This works consistently with the worker helper ok()/bad()/notFound() helpers.

Important development rules & caveats
------------------------------------

To keep the app stable and avoid runtime errors:

- React infinite-loop prevention
  - NEVER call state setters during render. Update state inside event handlers or useEffect with proper dependencies.
  - Every useEffect must include a dependency array. Guard side effects (e.g., only run if a required value is present).
  - Stabilize object/array dependencies with useMemo/useCallback.

- Zustand rules (very important)
  - Always select primitives only: useStore(s => s.value). Do NOT use object-literal selectors (useStore(s => ({ a: s.a }))) or call methods in selectors.
  - Do NOT call useStore() with no selector — this reads the whole store and may cause crashes.
  - For computed/derived values, select the primitives and compute via useMemo in your component.

- File restrictions
  - DO NOT modify the following files: wrangler.jsonc, worker/index.ts, worker/core-utils.ts, package.json scripts that manage deployments. Changing these can break the Cloudflare deployment or DO storage.
  - shadcn/ui components are preinstalled under src/components/ui — compose them, do not rewrite them.

- Styling & UI non-negotiables
  - All page content must be wrapped in the root grid:

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        {/* content */}
      </div>
    </div>

  - Use shadcn/ui components for inputs, buttons, cards, sheets, etc. Follow Tailwind utilities and spacing rules from tailwind.config.js.

Contributing
------------

Contributions are welcome. Please follow these guidelines:

- Open an issue to discuss significant changes before implementing.
- Follow existing code style (TypeScript + React + shadcn/ui composition).
- Keep UI changes mobile-first and ensure components remain accessible (keyboard, aria attributes).
- Run linting before submitting a PR:
  - bun run lint

Security & content policy
-------------------------

- CraftLedger is explicitly designed for non-adult, professional, and educational content. Ensure all seeded demo content and future data adhere to the non-adult policy.
- No real payment integrations are present in this repository. All payment flows are mocked for Phase 1 and must be replaced with secure, audited payment integrations in subsequent phases.

Troubleshooting
---------------

- "Maximum update depth exceeded" — search for setState calls in render or useEffect without proper deps; fix by moving updates to effects or handlers.
- Zustand-related re-render issues — ensure selectors are primitive-only.
- If you need to reset the mock Durable Object seed data locally, clear storage used by Cloudflare Workers Dev or update shared/mock-data.ts.

Further reading & roadmap
-------------------------

- Phase 1 (this repository): Stunning frontend foundation, mocked data, polished UX.
- Phase 2: Mocked monetization flows, client token accounting, react-query integration.
- Phase 3: Durable Object persistence, secure content gating endpoints.
- Phase 4: Payment simulation, payout workflows, export/reporting and final production polish.

License
-------

This repository does not include a license file by default. Add one (for example, MIT) as appropriate for your project.

Contact
-------

For questions about architecture or Cloudflare Workers patterns used in this project, open an issue or contact the maintainers through the repository channels.