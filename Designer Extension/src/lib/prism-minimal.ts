// Minimal Prism setup - core + markup language only, no plugins
// @ts-ignore - prism-core doesn't have type declarations
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';

// Re-export for use in components
export { Prism };
