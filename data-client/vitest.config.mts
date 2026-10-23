import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: "./wrangler.jsonc" },
				miniflare: {
					// Test-only values; real secrets live in Cloudflare (wrangler secret put).
					bindings: {
						WEBFLOW_CLIENT_SECRET: "test-client-secret",
						TOKEN_ENCRYPTION_KEY: "nxsryqSlMi3bqnxApLDFgL36Q1IfiQ3JLcLZx7Ap8LE=",
					},
				},
			},
		},
	},
});
