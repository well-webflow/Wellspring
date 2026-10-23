#!/usr/bin/env node
import { readFileSync, writeFileSync, rmSync } from 'fs';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import { isAbsolute, relative, resolve } from 'path';

// Vite only writes CSS source maps in dev, so production CSS is built here with the Tailwind CLI,
// which emits a version-3 map back to src/index.css. Run after vite build: vite.config.ts links
// ./assets/app.css into index.html, and this script swaps in the hashed file name.
const input = 'src/index.css';
const assetsDir = 'dist/assets';
const htmlPath = 'dist/index.html';
const tmpCss = `${assetsDir}/app.css`;
const tmpMap = `${tmpCss}.map`;

execSync(`npx tailwindcss -i ${input} -o ${tmpCss} --minify --map ${tmpMap}`, { stdio: 'inherit' });

// The bundle ships hidden maps, so drop the CLI's sourceMappingURL comment
const css = readFileSync(tmpCss, 'utf-8').replace(/\n?\/\*# sourceMappingURL=[^*]*\*\/\s*$/, '\n');
const name = `index-${createHash('sha256').update(css).digest('base64url').slice(0, 8)}.css`;

// Sources come out as machine-specific paths; make them relative to the map, like the JS maps
const map = JSON.parse(readFileSync(tmpMap, 'utf-8'));
map.file = name;
map.sources = map.sources.map((s) => {
  const abs = isAbsolute(s) ? s : resolve('/', s);
  return relative(resolve(assetsDir), abs);
});

const html = readFileSync(htmlPath, 'utf-8');
if (!html.includes('./assets/app.css')) {
  console.error('✗ dist/index.html has no ./assets/app.css link. Is productionStylesheet() in vite.config.ts?');
  process.exit(1);
}

writeFileSync(`${assetsDir}/${name}`, css);
writeFileSync(`${assetsDir}/${name}.map`, JSON.stringify(map));
writeFileSync(htmlPath, html.replace('./assets/app.css', `./assets/${name}`));
rmSync(tmpCss);
rmSync(tmpMap);

console.log(`✓ Built ${name} with a source map (${map.sources.join(', ')})`);
