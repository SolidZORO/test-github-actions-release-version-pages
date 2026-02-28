import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const packageJsonPath = resolve(rootDir, "package.json");
const indexHtmlTemplatePath = resolve(rootDir, "index.html");
const buildDirPath = resolve(rootDir, "build");
const buildVersionJsonPath = resolve(buildDirPath, "version.json");
const buildIndexHtmlPath = resolve(buildDirPath, "index.html");

function getGitHash() {
  try {
    return execSync("git rev-parse --short=7 HEAD", {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "unknown-hash";
  }
}

function getPackageVersion() {
  try {
    const raw = readFileSync(packageJsonPath, "utf8");
    const parsed = JSON.parse(raw);
    return typeof parsed.version === "string" ? parsed.version : "unknown-version";
  } catch {
    return "unknown-version";
  }
}

function ensureBuildDir() {
  mkdirSync(buildDirPath, { recursive: true });
}

function writeVersionJson(meta) {
  writeFileSync(buildVersionJsonPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
}

function writeBuildIndexHtml(meta) {
  const html = readFileSync(indexHtmlTemplatePath, "utf8");
  const jsonPayload = JSON.stringify(meta, null, 2);
  const scriptTagRegex =
    /<script id="app-version-json" type="application\/json">[\s\S]*?<\/script>/;
  const nextScriptTag = `<script id="app-version-json" type="application/json">\n${jsonPayload}\n    </script>`;

  if (!scriptTagRegex.test(html)) {
    throw new Error('Missing <script id="app-version-json" type="application/json"> in index.html');
  }

  const nextHtml = html.replace(scriptTagRegex, nextScriptTag);
  writeFileSync(buildIndexHtmlPath, nextHtml, "utf8");
}

const meta = {
  version: getPackageVersion(),
  gitHash: getGitHash()
};

ensureBuildDir();
writeVersionJson(meta);
writeBuildIndexHtml(meta);
