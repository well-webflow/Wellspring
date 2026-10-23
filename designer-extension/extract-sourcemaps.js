#!/usr/bin/env node
import { readdirSync, rmSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

// Source maps go to Webflow through the submission form's private upload, never inside bundle.zip.
// Move every .map out of dist/ into sourcemaps.zip, keeping paths relative to dist/ so they line up
// with the files in the bundle (e.g. assets/index-abc123.js.map). Review also needs the manifest
// and lockfile this build was installed from, so those go in at the zip root.
const distDir = 'dist';
const outZip = 'sourcemaps.zip';
const manifests = ['package.json', 'package-lock.json'];

const findMaps = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findMaps(path);
    return entry.name.endsWith('.map') ? [path] : [];
  });

const maps = findMaps(distDir).map((path) => relative(distDir, path));
if (maps.length === 0) {
  console.error('✗ No source maps found in dist/. Is build.sourcemap enabled in vite.config.ts?');
  process.exit(1);
}

const missing = manifests.filter((f) => !existsSync(f));
if (missing.length > 0) {
  console.error(`✗ Missing ${missing.join(', ')}. Run npm install so the build has a lockfile.`);
  process.exit(1);
}

if (existsSync(outZip)) rmSync(outZip);
execSync(`zip -q ../${outZip} ${maps.map((m) => `'${m}'`).join(' ')}`, { cwd: distDir });
execSync(`zip -q ${outZip} ${manifests.join(' ')}`);
maps.forEach((m) => rmSync(join(distDir, m)));

console.log(`✓ Moved ${maps.length} source map(s) from dist/ into ${outZip}, with ${manifests.join(' and ')}`);
