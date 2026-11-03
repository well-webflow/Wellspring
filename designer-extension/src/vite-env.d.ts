/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dev only: treat the site as authorized and installed. See `lib/devMode.ts`. */
  readonly VITE_SKIP_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
