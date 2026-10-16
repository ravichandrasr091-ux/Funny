# Who's the Problem?

A responsive browser website for a chaotic friendship party game. It is a website, not a native mobile app; the layout is designed for phones and desktop browsers, and the React UI can be reused if a mobile app is built later.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Verify a production build with `npm run build`. Run automated checks with `npm test` and `npm run lint`.

## Website features

- Create a room, select a mode and rounds, choose a nickname/avatar, and get a short invite code.
- Join by code or invite URL in the same browser profile.
- Lobby, local demo seats, and host start confirmation.
- Most-likely voting with self-vote prevention, demo votes, stored round history, ties, and a final report.
- Local playable Roast, Guess Who, and Delulu Detector flows.
- Share, copy, and download a branded result image where the browser supports those features.
- Responsive navigation and mobile/desktop layouts.

## Question packs

The voting prompts live in `src/data/questionBank.json` as five tagged packs: 60 Friends, 60 Siblings, 60 Family, 60 Couples & Crushes, and 80 Brainrot & Memes. Each question has a stable ID and topic tags. `src/data/questionBank.ts` adds category metadata and selects a unique, shuffled set for each room while avoiding adjacent matching topics. The selected records are stored in the room and their IDs are tracked in `questionHistory` as rounds begin.

Run `npm run validate:questions` when editing packs. It checks category minimums, IDs, normalized exact duplicates, word counts, question text, tags, and the manual semantic review log; it also reports high lexical-overlap candidates for human review. Add plausibly similar prompts to `src/data/question-similarity-review.json` with a short resolution. The selection tests confirm no repeats and no adjacent identical topics.

## Demo-mode boundary

Without Supabase configuration, rooms, votes, and result cards live in `localStorage` in the current browser only. Demo seats are generated examples, not connected people. Opening an invite on another device does not synchronize game state. Result links likewise resolve only in the browser that created the result. The demo is not a multiplayer backend and has not had a security review.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the project URL and public anon key. Never put a service-role key in a `VITE_` variable.
3. Run `supabase/migrations/202610090001_initial_schema.sql` in the Supabase SQL editor or through the Supabase CLI.
4. The migration enables RLS and intentionally grants no direct client write policies. Before enabling real multiplayer, implement and deploy trusted Edge Functions/RPCs for room creation, joining, host controls, vote submission/reveal, and cleanup. Validate membership and room state inside those functions; do not trust hidden buttons or the anon key.
5. Add narrow read policies and Realtime publication rules that match those functions, then test with separate anonymous-auth sessions. The current UI remains in local demo mode; adding keys alone does not turn on cross-device sync.

Supabase Realtime and the JS client are included for the integration path, but the current browser UI does not yet call the backend. The schema is a security-oriented starting point, not a complete or reviewed production service.

## Deploy on GitHub Pages

The included `.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages whenever code is pushed to `main`. It runs tests, sets the repository base path, and adds an SPA fallback so direct links and refreshes on app routes work.

1. Create an empty GitHub repository. Do not add a README or license during repository creation.
2. From this project folder, initialize Git and push the website. Replace the uppercase placeholders with your GitHub username and repository name first:

```sh
git init -b main
git add .
git commit -m "Initial website"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

3. In the GitHub repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for “Deploy website to GitHub Pages” to complete. The site URL will be `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Later pushes to `main` deploy automatically. For a custom domain or a repository named `YOUR-USERNAME.github.io`, set the workflow's `VITE_BASE_PATH` to `/` before deploying. No Supabase credentials are needed for the local demo; it still does not synchronize rooms between devices.

For another static host, run `npm run build` and publish the generated `dist/` folder. Configure SPA fallback behavior so direct room links return `index.html`.

## Current limitations

- Cross-device multiplayer and Supabase Realtime wiring are not active yet.
- Demo rooms are browser-local and expire after 30 days when read.
- Guess Who and Delulu are local single-browser flows, not synchronized rounds; anonymity in the UI does not hide data from a future backend operator.
- Custom questions, category selection, host room deletion, server-side rate limiting, and automated cleanup require the trusted backend phase.
- Share result links are local to the browser that created them; downloaded cards can be shared anywhere.
- Image generation depends on browser support, and remote fonts may be unavailable offline.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
