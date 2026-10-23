#!/usr/bin/env node
import { readFileSync, statSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// Checks the artifacts you actually upload: bundle.zip and sourcemaps.zip.
// Fails the build if either one would trip review.
const BUNDLE = 'bundle.zip';
const MAPS = 'sourcemaps.zip';
const MAX_BUNDLE_BYTES = 5 * 1024 * 1024;

const failures = [];
const fail = (msg) => failures.push(msg);

const list = (zip) =>
  execSync(`unzip -Z1 ${zip}`, { encoding: 'utf-8' })
    .split('\n')
    .filter((f) => f && !f.endsWith('/'));
const read = (zip, file) => execSync(`unzip -p ${zip} '${file}'`, { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });

for (const zip of [BUNDLE, MAPS]) if (!existsSync(zip)) fail(`${zip} is missing`);
if (failures.length === 0) {
  const files = list(BUNDLE);
  // Generated code that review needs to trace back to source: scripts and stylesheets
  const codeFiles = files.filter((f) => f.endsWith('.js') || f.endsWith('.css'));

  // Size limit enforced at upload
  const size = statSync(BUNDLE).size;
  if (size > MAX_BUNDLE_BYTES) fail(`bundle.zip is ${(size / 1024 / 1024).toFixed(2)}MB (limit 5MB)`);

  // Source maps belong in the private upload only
  files.filter((f) => f.endsWith('.map')).forEach((f) => fail(`bundle.zip contains source map ${f}`));

  // Exactly one manifest, with the required fields and no CLI telemetry
  const manifests = files.filter((f) => f.endsWith('webflow.json'));
  if (manifests.length !== 1 || manifests[0] !== 'webflow.json') {
    fail(`expected exactly one webflow.json at the bundle root, found: ${manifests.join(', ') || 'none'}`);
  } else {
    const manifest = JSON.parse(read(BUNDLE, 'webflow.json'));
    const source = JSON.parse(readFileSync('webflow.json', 'utf-8'));
    if (!manifest.name) fail('bundled webflow.json has no name');
    if (manifest.name !== source.name) fail(`bundled name "${manifest.name}" differs from source "${source.name}"`);
    if (manifest.apiVersion !== '2') fail(`bundled apiVersion is "${manifest.apiVersion}", expected "2"`);
    if (manifest.publicDir !== 'dist') fail(`bundled publicDir is "${manifest.publicDir}", expected "dist"`);
    if (manifest.telemetry) fail('bundled webflow.json still has a telemetry block');
  }

  // Patterns review scanners flag. Bare "http://localhost" is allowed because react-router
  // uses it as a URL-parsing fallback; a localhost port means a dev server leaked in.
  const banned = [
    [/\beval\(/, 'eval('],
    [/new Function\(/, 'new Function('],
    [/localhost:\d+/, 'localhost with a port'],
    [/127\.0\.0\.1/, '127.0.0.1'],
    [/ngrok|trycloudflare\.com|loca\.lt/, 'tunnel hostname'],
    [/sourceMappingURL=/, 'sourceMappingURL comment'],
  ];
  for (const f of [...codeFiles, ...files.filter((f) => f.endsWith('.html'))]) {
    const text = read(BUNDLE, f);
    for (const [re, label] of banned) if (re.test(text)) fail(`${f} contains ${label}`);
  }

  // Review needs the manifest and lockfile from this build, matching what's on disk now
  const reviewFiles = list(MAPS);
  for (const f of ['package.json', 'package-lock.json']) {
    if (!reviewFiles.includes(f)) fail(`sourcemaps.zip is missing ${f}`);
    else if (read(MAPS, f) !== readFileSync(f, 'utf-8')) fail(`${f} in sourcemaps.zip differs from the one on disk; rebuild`);
  }

  // Every bundled JS and CSS file needs its map, from this same build
  const mapFiles = new Set(reviewFiles.filter((f) => f.endsWith('.map')));
  for (const code of codeFiles) {
    const map = `${code}.map`;
    if (!mapFiles.has(map)) {
      fail(`sourcemaps.zip has no ${map}`);
      continue;
    }
    const { version, file } = JSON.parse(read(MAPS, map));
    if (version !== 3) fail(`${map} is not a version-3 source map`);
    if (file && !code.endsWith(file)) fail(`${map} describes "${file}", not ${code}`);
  }
  for (const map of mapFiles) {
    if (!files.includes(map.replace(/\.map$/, ''))) fail(`sourcemaps.zip has ${map} with no matching file in bundle.zip`);
  }

  if (failures.length === 0) {
    console.log(`✓ bundle.zip verified: ${files.length} files, ${(size / 1024 / 1024).toFixed(2)}MB, no source maps`);
    console.log(`✓ sourcemaps.zip verified: ${mapFiles.size} maps matching the bundled JS and CSS`);
  }
}

if (failures.length > 0) {
  console.error('✗ Bundle verification failed:');
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
