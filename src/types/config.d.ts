import { Repository } from '../lib/types/repo';

export interface Config {
	App: {
		JwtSecret?: string,
		InstanceID?: string,
	},
	BaseLicense: {
		Name: string
		Link: string
	}
	Frontend: {
		Port: number
		SeriesLanguageMode: number
	}
	API: {
		Secure: boolean
		Host: string
		Port: number
	}
  	Users: {
		Enabled: boolean
	}
	Stats: {
		Enabled: boolean,
	}
	Shortener: {
		Enabled: boolean
		ExpireTimeDays: number
	}
  	KaraExplorer: {
		Enabled: boolean
		Host: string
		Path: string
		LiveURL: string
		MediaLinks: boolean
		Import: true
		Secure: boolean
		NuxtOverrides?: any
	}
	Gitlab?: {
		Enabled?: boolean,
		Host?: string,
		Token?: string,
		ProjectID?: number,
		IssueTemplate?: {
			Import?: GitlabTemplate
			Suggestion?: GitlabTemplate
			Edit?: GitlabTemplate
			KaraProblem?: {
				Quality?: GitlabTemplate,
				Time?: GitlabTemplate
			}
		}
	}
	System: {
		Binaries: {
			ffmpeg: {
				OSX: string,
				Linux: string,
				Windows: string
			}
		},
		Repositories: Repository[]
		Path: {
			Karas?: string,
			Series?: string,
			Tags?: string,
			Medias?: string,
			Lyrics?: string,
			Temp?: string,
			Previews?: string,
			Avatars?: string,
			Import?: string,
			Jingles?: string[],
			Backgrounds?: string[],
			Intros?: string[],
			Outros?: string[],
			Encores?: string[],
			Sponsors?: string[]
		}
	},
	Database: {
		'sql-file'?: boolean,
		defaultEnv?: string,
		prod: {
			driver?: string,
			host?: string,
			port?: number,
			user?: string,
			password?: string,
			superuser?: string,
			superuserPassword?: string,
			schema?: string,
			database?: string,
			bundledPostgresBinary?: boolean
		}
	},
	Mail: {
		Enabled: boolean,
		Host?: string,
		Port?: number,
		Secure?: boolean,
		User?: string,
		Password?: string,
		From?: string,
		FromMail?: string
	},
	Online: {
		Stats?: boolean,
		ErrorTracking?: boolean,
	}
}

export interface BinariesConfig {
	ffmpeg: string
}

interface GitlabTemplate {
	Description?: string,
	Title?: string,
	Labels?: string[]
}
