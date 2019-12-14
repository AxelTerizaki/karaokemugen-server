// Karaoke Mugen default configuration file

// this file is overwritten during updates, editing is ill-advised .
// you can change the default settings by using config.ini to bypass the default value .
export const defaults = {
	App: {
		JwtSecret: 'Change me',
		InstanceID: 'Change me',
	},
	Database: {
		'sql-file': true,
		defaultEnv: 'prod',
		prod: {
			driver: 'pg',
			user: 'karaokemugen_server',
			password: 'musubi',
			host: 'localhost',
			port: 5432,
			database: 'karaokemugen_server',
			schema: 'public'
		}
	},
	System: {
		Binaries: {
			ffmpeg: {
				Linux: '/usr/bin/ffmpeg',
				Windows: 'ffmpeg.exe',
				OSX: 'ffmpeg'
			}
		},
		Path: {
			Karas: ['data/karaokes'],
			Lyrics: ['data/lyrics'],
			Medias: ['data/medias'],
			Series: ['data/series'],
			Tags: ['data/tags'],
			Temp: 'temp',
			Import: 'inbox',
			Avatars: 'avatars',
			Previews: 'previews',
		}
	},
	Shortener: {
		ExpireTimeDays: 1
	},
	Frontend: {
		Port: 1350,
		Host: 'localhost',
		SeriesLanguageMode: 3
	},
	KaraExplorer: {
		Api: 'http://localhost',
		Port: 1351,
		Path: '/base'
	},
	Gitlab: {
		IssueTemplate: {
			Import: {
				Labels: []
			},
			Suggestion: {
				Labels: []
			},
			Edit: {
				Labels: []
			},
			KaraProblem: {
				Labels: []
			},
		}
	},
	Mail: {
		Enabled: false
	}
};

export const configConstraints = {
	'App.JwtSecret': { presence: {allowEmpty: false}},
	'App.InstanceID': { presence: {allowEmpty: false}},
	'Database.prod.user': { presence: {allowEmpty: false}},
	'Database.prod.password': { presence: true },
	'Database.prod.host': { presence: {allowEmpty: false}},
	'Database.prod.database': { presence: {allowEmpty: false}},
	'System.Path.Karas': { arrayValidator: true },
	'System.Path.Lyrics': { arrayValidator: true },
	'System.Path.Medias': { arrayValidator: true },
	'System.Path.Series': { arrayValidator: true },
	'System.Path.Temp': { presence: {allowEmpty: false}},
	'System.Path.Import': { presence: {allowEmpty: false}},
	'System.Binaries.ffmpeg': { presence: {allowEmpty: false}},
	'Shortener.ExpireTimeDays': { numericality: { greaterThan: 0 }},
	'Frontend.Host': { presence: { allowEmpty: false } },
	'Frontend.Port': { numericality: true}
};
