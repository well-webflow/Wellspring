import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';

// Font Awesome's stylesheet is bundled from index.css, so stop the library injecting it at runtime.
// The App renders icons through react-fontawesome only, so it never needs <i> tags swapped for SVGs.
fontAwesomeConfig.autoAddCss = false;
fontAwesomeConfig.autoReplaceSvg = false;
fontAwesomeConfig.observeMutations = false;

// Production CSS is built by the Tailwind CLI (build-css.js) so it ships with a source map;
// Vite can only produce CSS source maps in dev.
if (import.meta.env.DEV) import('./index.css');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
