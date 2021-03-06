export interface State {
	appPath?: string,
	dataPath?: string,
	resourcePath?: string,
	originalAppPath?: string,
	EngineDefaultLocale?: string,
	electron?: any,
	os?: string,
	osHost?: string,
	wsLogNamespace?: string,
	isTest?: boolean,
	version?: {
		number?: string,
		name?: string,
		sha?: string,
	},
	binPath?: {
		ffmpeg?: string,
	},
	opt?: {
		generateDB?: boolean,
		reset?: boolean,
		strict?: boolean,
		noMedia?: boolean,
		profiling?: boolean,
		sql?: boolean,
		validate?: boolean,
		debug?: boolean,
		staticServe?: boolean
	}
}
