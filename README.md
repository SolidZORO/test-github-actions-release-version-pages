# test-github-actions-release-version-pages

Minimal TypeScript smoke test for release pages.

## Run

```bash
yarn install
yarn build
yarn serve
```

Open: http://127.0.0.1:3000

The page reads:
- `version` + `git hash` from build-time generated metadata

## Serve

```bash
yarn serve
```

Use custom port:

```bash
yarn serve -l 4173
```

Notes:
- This requires running through an HTTP server (not `file://`).
- `yarn build` runs `scripts/generate-version.mjs`, which:
  - generates `build/version.json`
  - generates `build/index.html` and injects `<script type="application/json" id="app-version-json">...</script>`

## Version Scripts

```bash
yarn versionup          # patch
yarn versionup:minor
yarn versionup:major
yarn versionup:init
yarn versionup:hotfix <version>
yarn push-alltags
```

## GitHub Pages Release

- Workflow file: `.github/workflows/release-pages.yml`
- Trigger: push tag `v*` (example: `v1.2.3`)
- Output URLs:
  - `/releases/v1.2.3/`
  - `/releases/latest/`
