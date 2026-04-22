# UI task test suite

Template for UI tasks: **unit tests** (Vitest + Testing Library) and **E2E** (Playwright). Dependencies and the Playwright browser are installed at test run time; add `package-lock.json` (and use `npm ci` in `test.sh`) if you need reproducible installs.

**This task:** The agent implements the React app under `/app`. The Docker image seeds `/app/src/companyData.js` and `/app/public/*.svg`. Playwright starts the Vite dev server from `/app`, and Vitest imports `/app/src/App.jsx` directly for fast DOM contract checks.

## Layout

- **`unit/`** — Vitest specs (`*.spec.ts`). Framework-agnostic DOM tests by default; add `@testing-library/react` or `@testing-library/vue` for component tests.
- **`e2e/`** — Playwright specs. Start the app via `webServer` in `playwright.config.ts` (e.g. your dev server from `/app`).

## Commands

```bash
npm run test       # Unit tests (Vitest)
npm run test:e2e    # E2E tests (Playwright; starts webServer automatically)
```

## For React or Vue

- **React:** Add `@testing-library/react` and `@testing-library/jest-dom`; write component tests in `unit/` that render React components.
- **Vue:** Add `@testing-library/vue` and `@testing-library/jest-dom`; write component tests in `unit/` that mount Vue components.

## E2E and your app

In `playwright.config.ts`, set `webServer` to your app:

```ts
webServer: {
  command: "npm run dev",
  cwd: "/app",
  url: "http://localhost:3000",
  reuseExistingServer: false,
  timeout: 60_000,
},
```

Then update `e2e/*.spec.ts` to assert on your app’s behavior.
