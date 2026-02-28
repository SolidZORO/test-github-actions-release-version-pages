"use strict";
const appTitle = document.getElementById('app-title');
const appMeta = document.getElementById('app-meta');
const FALLBACK_META = {
    version: 'unknown-version',
    gitHash: 'unknown-hash'
};
function normalizeMeta(raw) {
    if (!raw || typeof raw !== 'object')
        return null;
    const candidate = raw;
    if (typeof candidate.version !== 'string')
        return null;
    if (typeof candidate.gitHash !== 'string')
        return null;
    return {
        version: candidate.version || FALLBACK_META.version,
        gitHash: candidate.gitHash || FALLBACK_META.gitHash
    };
}
function readMetaFromScriptTag() {
    const script = document.getElementById('app-version-json');
    if (!(script instanceof HTMLScriptElement))
        return null;
    try {
        return normalizeMeta(JSON.parse(script.textContent ?? ''));
    }
    catch {
        return null;
    }
}
async function readMetaFromFile() {
    try {
        const response = await fetch('./version.json', { cache: 'no-store' });
        if (!response.ok)
            return null;
        const raw = (await response.json());
        return normalizeMeta(raw);
    }
    catch {
        return null;
    }
}
async function render() {
    if (!appTitle || !appMeta)
        return;
    const meta = readMetaFromScriptTag() ?? (await readMetaFromFile()) ?? FALLBACK_META;
    const finalVersion = meta.version;
    const finalHash = meta.gitHash;
    appTitle.textContent = `Version ${finalVersion}`;
    appMeta.textContent = `Git hash: ${finalHash}`;
}
void render();
console.log('0xFF02');
