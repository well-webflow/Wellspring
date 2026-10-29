export interface ResolvedUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	siteId: string;
}

export type AppEnv = {
	// CORS_DEV_ORIGINS is only set in .dev.vars for local development
	Bindings: Env & { CORS_DEV_ORIGINS?: string };
	Variables: {
		user: ResolvedUser;
		accessToken: string;
	};
};
