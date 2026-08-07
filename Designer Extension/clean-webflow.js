#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { execSync } from 'child_process';

// Clean source webflow.json
const configPath = './webflow.json';
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

if (config.telemetry) {
  delete config.telemetry;
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  console.log('✓ Cleaned telemetry from source webflow.json');
}

// Clean bundle.zip if it exists
if (existsSync('bundle.zip')) {
  console.log('✓ Cleaning telemetry from bundle.zip...');

  // Extract bundle
  execSync('unzip -o bundle.zip -d temp-bundle', { stdio: 'ignore' });

  // Clean webflow.json in bundle
  const bundleConfigPath = 'temp-bundle/webflow.json';
  const bundleConfig = JSON.parse(readFileSync(bundleConfigPath, 'utf-8'));
  delete bundleConfig.telemetry;
  writeFileSync(bundleConfigPath, JSON.stringify(bundleConfig, null, 2) + '\n');

  // Recreate bundle
  rmSync('bundle.zip');
  execSync('cd temp-bundle && zip -r ../bundle.zip . -x "*.DS_Store"', { stdio: 'ignore' });

  // Cleanup
  rmSync('temp-bundle', { recursive: true, force: true });

  console.log('✓ Bundle cleaned successfully');
}
