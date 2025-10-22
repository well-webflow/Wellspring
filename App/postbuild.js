import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexPath = resolve(__dirname, 'dist', 'index.html');

// Fix asset paths for Webflow extension compatibility
// Webflow extensions load at dynamic paths, so we need relative paths
async function updateIndexHtml() {
  try {
    const data = await fs.readFile(indexPath, 'utf8');
    const result = data.replace(/="\/assets\//g, '="assets/');
    await fs.writeFile(indexPath, result, 'utf8');
    console.log('Successfully updated dist/index.html');
  } catch (err) {
    console.error('Error updating index.html:', err);
    process.exit(1);
  }
}

updateIndexHtml();
