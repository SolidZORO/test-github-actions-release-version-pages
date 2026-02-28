# test-github-actions-release-version-pages

这是一个最小可用的 GitHub Pages 版本发布示例项目。

目标：
- 使用 TypeScript 编译生成静态资源
- 在构建阶段写入当前仓库的 `version` 和 `git hash`
- 按 Git tag 自动发布到 GitHub Pages 的版本目录
- 自动创建 GitHub Release，并附带 URL 与构建产物

## 一、项目做了什么

- `src/index.ts`：页面逻辑，读取版本元信息并渲染到页面
- `scripts/generate-version.mjs`：构建时生成版本信息
- `build/`：构建产物目录（可直接部署）
- `.github/workflows/release-pages.yml`：发布 Pages + 上传 Release 资产

构建后会生成：
- `build/index.html`
- `build/index.js`
- `build/version.json`

其中 `index.html` 里会注入：
- `<script id="app-version-json" type="application/json">...</script>`

## 二、本地运行

安装依赖：

```bash
yarn install
```

构建：

```bash
yarn build
```

本地预览（默认 3000）：

```bash
yarn serve
```

自定义端口：

```bash
yarn serve -l 4173
```

访问地址：
- `http://127.0.0.1:3000`

## 三、版本号脚本

```bash
yarn versionup          # patch
yarn versionup:minor
yarn versionup:major
yarn versionup:init
yarn versionup:hotfix <version>
yarn push-alltags
```

说明：
- 这些命令基于 `standard-version`
- `yarn push-alltags` 只推 tag，不会替代 `git push`

## 四、首次启用 GitHub Pages（必须做）

如果没有这一步，即使 `gh-pages` 分支里有文件，线上仍会是 404。

1. 打开仓库 `Settings` -> `Pages`
2. `Build and deployment` 选择 `Deploy from a branch`
3. Branch 选择 `gh-pages`
4. Folder 选择 `/ (root)`
5. 保存并等待 1-5 分钟生效

建议同时检查：
- `Settings` -> `Actions` -> `General` -> `Workflow permissions`
- 需要允许 `Read and write permissions`（否则 workflow 可能无法写入 `gh-pages`）

## 五、发布流程（推荐）

1. 开发完成后提交代码并推送：

```bash
git add -A
git commit -m "feat: xxx"
git push
```

2. 生成版本并打 tag：

```bash
yarn versionup
```

3. 推送提交与 tag：

```bash
git push
yarn push-alltags
```

4. GitHub Actions 自动触发：
- workflow：`.github/workflows/release-pages.yml`
- 触发条件：push tag `v*`（例如 `v1.0.3`）

## 六、发布后你会得到什么

### 1) GitHub Pages 地址

- 指定版本：
  - `https://<owner>.github.io/<repo>/releases/v1.0.3/`
- 最新版本：
  - `https://<owner>.github.io/<repo>/releases/latest/`

### 2) GitHub Release 内容

Release 正文会包含：
- 当前版本 URL（`/releases/<tag>/`）
- Latest URL（`/releases/latest/`）

Release 资产会包含：
- `CHANGELOG-<tag>.md`
- `index_<tag>.html`
- `<pkg>_release_<tag>.zip`

## 七、Upload Release 的 Token 配置（建议）

为了稳定上传 Release 附件（zip/html/md），建议配置个人 PAT。

1. 创建 PAT：
- 地址：`https://github.com/settings/personal-access-tokens`
- 最小权限：`Contents` -> `Read and write`

2. 配置仓库 Secret：
- `Settings` -> `Secrets and variables` -> `Actions`
- 新增：`CI_GITHUB_TOKEN`

3. workflow 的 token 优先级：
- 优先：`CI_GITHUB_TOKEN`
- 回退：`GITHUB_TOKEN`

## 八、常见问题排查

### 1) 访问 `/releases/vx.y.z/` 是 404

按顺序检查：

1. 是否已完成「四、首次启用 GitHub Pages（必须做）」
2. `gh-pages` 分支是否存在 `releases/vx.y.z/index.html`
3. 是否刚部署完成（GitHub Pages 可能有缓存延迟，等 1-5 分钟）
4. URL 路径大小写是否完全一致

### 2) Action 没有触发

- 检查 tag 是否以 `v` 开头（例如 `v1.0.3`）
- 检查是否真的推送了 tag：

```bash
git tag
git push --tags
```

### 3) Release 资产上传失败

- 检查 `CI_GITHUB_TOKEN` 是否已配置
- 检查 PAT 权限是否是 `Contents: Read and write`

### 4) 本地打开 `file://.../index.html` 不显示

- 这是预期行为，必须通过 HTTP 服务访问
- 请用 `yarn serve`

## 九、手动触发发布（可选）

可在 Actions 页面手动运行 `Release Pages` workflow，输入：
- `release_tag`：例如 `v1.0.3`

适用于：
- 需要重发某个 tag
- 自动触发异常时手动补发
