# 🐾 AniQuest

AniQuest is a local-first Singapore wildlife learning app. It helps people recognise animals, learn safe observation habits, and check source-linked conservation information.

## 🌿 What it includes

- **94 animal profiles**: 61 birds, 19 mammals, 10 reptiles, and 4 amphibians.
- **591 learning questions**: 27 practice questions and six guided checks for every animal profile.
- 🧭 Guided animal journeys with before-and-after checks.
- 🦉 Source-linked recognition, habitat, behaviour, conservation, and safe-viewing information.
- 🖼️ Credited real animal photographs. The interface preserves the full animal image without cropping.
- 🎲 Random sourced wildlife facts.
- 🧠 Adaptive practice review for missed or hinted questions.
- 📈 Browser-saved XP, answers, learning records, badges, and progress views.
- 🗓️ Singapore wildlife calendar, dated animal events, and individual or monthly `.ics` calendar export.
- 📰 Curated Singapore wildlife news with source links.
- 🐔 A junglefowl and domestic-chicken comparison guide.
- 🎨 Classic and Pixelated themes with light, dark, density, and palette controls.

## 🚀 Run locally

### Windows

1. Install Node.js 22.13 or later.
2. Double-click [Start-AniQuest.cmd](Start-AniQuest.cmd).
3. Open <http://127.0.0.1:5173> if the browser does not open.

Keep the command window open while you use the app. Press `Ctrl+C` to stop it.

### Development

```sh
npm ci
npm run dev:local
```

Open <http://127.0.0.1:5173>.

### Production-style local build

```sh
npm run build:local
npm start
```

`npm start` serves the built app on the local machine. It does not need a cloud account, API key, or remote database.

## 🧰 Tech stack

| Area | Technology |
| --- | --- |
| Language | TypeScript, JavaScript, CSS, HTML |
| User interface | React 19, React DOM, Base UI, Radix UI, shadcn/ui |
| Build tool | Vite 8 and VINext |
| Styling | Tailwind CSS, PostCSS, CSS custom properties |
| Charts | Recharts |
| Icons | Lucide React and Unicode wildlife emoji |
| Forms and validation | React Hook Form, Zod, Hookform Resolvers |
| Data and server source | Next.js, Drizzle ORM, Drizzle Kit, Cloudflare Vite plugin, Wrangler |
| Local runtime | Node.js 22+ and a dependency-free Node local server |
| Tests | Node.js test runner and Vite server-side module loading |

The default local edition uses browser storage for learning progress. The server project remains separate for sign-in, protected administration, and shared persistence.

## ✅ Checks

Run these from the project folder:

```sh
npm run typecheck:local
npm run build:local
npm run content:check
npm run test:local-server
node --test --test-concurrency=1 tests/*.test.mjs
```

The local server tests check local startup, static assets, path traversal protection, and host-header handling. Windows can skip the symbolic-link test when the account cannot create symlinks.

## 📚 Content and source rules

- Keep Singapore claims linked to a source.
- Keep confirmed event dates separate from seasonal patterns.
- Do not claim a local conservation category without matching evidence.
- Do not use profile photos to confirm a user sighting.
- Do not crop an animal out of its reference photograph.
- Every new profile must enter `SINGAPORE_SPECIES`, have a credited photograph, and receive six guided checks.

Useful files:

| Task | File |
| --- | --- |
| Species records and filters | [app/species-data.ts](app/species-data.ts) |
| Full profile content | [app/species-profiles.ts](app/species-profiles.ts) |
| Added bird profiles | [app/full-bird-profiles.json](app/full-bird-profiles.json) |
| Guided lessons | [app/species-lessons.ts](app/species-lessons.ts) |
| Quiz bank | [app/quiz-data.ts](app/quiz-data.ts) |
| Event data and ICS exports | [app/animal-events-data.ts](app/animal-events-data.ts) |
| Calendar interface | [app/animal-events-calendar.tsx](app/animal-events-calendar.tsx) |
| Photo credits | [app/profile-photos.ts](app/profile-photos.ts) |
| Project rules | [AGENTS.md](AGENTS.md) |

## 🔒 Local-first behaviour

AniQuest runs locally by default. It does not send learning progress to a remote service in local mode. Clearing browser data removes local learning progress.

Do not publish content, deploy the app, or push changes without explicit approval.

## 📄 Licence and photo credits

Animal records link to their factual sources. Reference photographs retain their published credit and licence data where available. Check each photo caption before reuse outside AniQuest.
