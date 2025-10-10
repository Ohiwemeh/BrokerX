# Repo-specific Copilot instructions for `broker`

This file gives concise, actionable guidance for AI coding agents working in this repository.

What this project is
- A minimal React + Vite front-end template (single-page app).
- Entry points: `index.html` → `src/main.jsx` → `src/App.jsx`.
- Build tooling: Vite for dev server, build, and preview. ESLint configured with `npm run lint`.

Quick commands (Windows PowerShell)

- Start dev server with HMR:

```powershell
npm run dev
```

- Build production bundle:

```powershell
npm run build
```

- Preview a production build locally:

```powershell
npm run preview
```

- Run ESLint across the project:

```powershell
npm run lint
```

Key files to inspect when making changes
- `package.json` — scripts and dependencies. Use this for adding scripts or devDependencies.
- `vite.config.js` — Vite plugin configuration (React plugin enabled).
- `index.html` — app root and module entry for dev and prod.
- `src/main.jsx` — React renderer and root mounting (`createRoot`).
- `src/App.jsx` — main example component, shows use of local and public assets (`./assets/react.svg`, `/vite.svg`).
- `src/*.css` — styling used by components.

Project conventions and patterns
- ESM modules (`type: "module"` in `package.json`); prefer `import`/`export`.
- Public assets served from `public/` (e.g., `/vite.svg`) and regular source assets under `src/assets/`.
- React strict mode is enabled in `src/main.jsx`.
- Keep components small and functional; follow the simple stateful pattern used in `src/App.jsx`.
- Use `@vitejs/plugin-react` via `vite.config.js` — avoid manual Babel toolchain edits unless necessary.

Examples to reference
- HMR: editing `src/App.jsx` updates the page during `npm run dev` (see the `count` button and the HMR hint in the component).
- Static public asset: `/vite.svg` referenced directly in `src/App.jsx`.
- Local asset import: `import reactLogo from './assets/react.svg'` in `src/App.jsx`.

Testing and linting
- There are no automated tests in the repo. The primary checks are manual dev-server verification and `npm run lint` for code style.
- When adding tests, prefer lightweight frameworks (Jest, Vitest) and wire a `test` script into `package.json`.

When editing or adding files
- Update `package.json` scripts for any new developer workflow commands.
- Keep `type: "module"` (ESM) unless converting the whole repo to CommonJS.
- If adding new assets to `public/`, reference them as `/yourfile.ext` in code; assets placed in `src` should be imported.

Integration and external dependencies
- Core runtime deps: `react`, `react-dom`.
- Dev-time tools: `vite`, `@vitejs/plugin-react`, `eslint` and related plugins.
- Vite is pinned via an `overrides` entry to `rolldown-vite@7.1.14` in `package.json` — preserve this unless you know the reason for the override.

Common pitfalls and how to handle them
- ESM errors: ensure imports use file extensions where required by Node/Vite (the template already uses `.jsx` extensions in imports).
- Asset paths: `/vite.svg` is served from `public/` at root; using `./assets/...` works only for files in `src`.
- HMR not updating: usually fixed by restarting `npm run dev`.

How to propose changes
- Small UI or dev-tooling changes: open a PR with updated files and include a short repro of the change (e.g., which page to open, which component to edit to reproduce HMR).
- Large upgrades (Vite, React compiler): include a migration plan and CI-proof steps (local build, lint pass, and manual smoke test).

If you need more context
- Start with `src/main.jsx` and `src/App.jsx` to understand rendering and asset usage.
- Review `package.json` scripts to see developer workflows.

---
Please review this draft and tell me if you want more detail on any area (tests, CI, or component patterns).