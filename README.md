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
- GitHub Release body contains:
  - `/releases/<tag>/` URL
  - `/releases/latest/` URL
- GitHub Release assets include:
  - `CHANGELOG-<tag>.md`
  - `index_<tag>.html`
  - `<pkg>_release_<tag>.zip`

### 发布/上传 Upload Release

- 为了上传 Release 附件（zip/html/md），建议使用 PAT：
  - 创建地址: https://github.com/settings/personal-access-tokens
  - 权限最小化: `Contents` -> `Read and write`
- 将 token 配置为仓库 Secret:
  - `Settings` -> `Secrets and variables` -> `Actions`
  - 新增 `CI_GITHUB_TOKEN`
- Workflow 会优先使用 `CI_GITHUB_TOKEN`，未配置时才回退到默认 `GITHUB_TOKEN`。
