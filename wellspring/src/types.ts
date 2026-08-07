export interface ResolvedUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	siteId: string;
}

export type AppEnv = {
	Bindings: Env;
	Variables: {
		user: ResolvedUser;
		accessToken: string;
	};
};
