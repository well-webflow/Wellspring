/**
 * Dev-only escape hatch for the authorization gate.
 *
 * Creating a waterfall is gated on the site being authorized and the Waterfall script
 * being registered, neither of which can be completed in a Webflow test environment.
 * With `VITE_SKIP_AUTH=true` in `.env`, the Designer treats the site as authorized and
 * installed, so waterfalls can be created and edited while working on the extension.
 *
 * This cannot reach a published bundle: `import.meta.env.DEV` is false in every
 * `vite build`, so the variable has no effect outside `npm run dev`.
 */
export const SKIP_AUTH = import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true';

if (SKIP_AUTH) {
  console.warn(
    '[Wellspring] VITE_SKIP_AUTH is on: this site is treated as authorized and installed. ' +
      'Nothing is registered on the site, so sliders will not run on the published site — ' +
      'add the Waterfall script to the site manually to test that.'
  );
}
