import { Config } from '../types/config';

// Karaoke Mugen default configuration file

// this file is overwritten during updates, editing is ill-advised .
// you can change the default settings by using config.yml to bypass the default value .
export const defaults: Config = {
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
		Repositories: [
			{
				Name: 'Local',
				Enabled: true,
				Online: false,
				Path: {
					Karas: ['data/karaokes'],
					Lyrics: ['data/lyrics'],
					Medias: ['data/medias'],
					Series: ['data/series'],
					Tags: ['data/tags']
				}
			}
		],
		Path: {
			Temp: 'temp',
			Import: 'inbox',
			Avatars: 'avatars',
			Previews: 'previews',
		}
	},
	Shortener: {
		Enabled: true,
		ExpireTimeDays: 1
	},
	BaseLicense: {
		Name: null,
		Link: null
	},
	Frontend: {
		Port: 1350,
		SeriesLanguageMode: 3
	},
	Users: {
		Enabled: true
	},
	Stats: {
		Enabled: true
	},
	API: {
		Secure: true,
		Host: 'localhost',
		Port: 1350
	},
	KaraExplorer: {
		Enabled: true,
		Host: 'localhost',
		Path: '/base/',
		LiveURL: 'https://live.karaokes.moe',
		MediaLinks: true,
		Import: true,
		Secure: true
	},
	Gitlab: {
		IssueTemplate: {
			Import: {
				Title: '[Inbox] $kara',
				Labels: ['to integrate'],
				Description: `
A new karaoke has been sent to the Karaoke Mugen team inbox. Please integrate it as soon as possible if it meets the required quality criteria.


The files (.kara, video, .ass and serial if necessary) are present in the following location of your FTP account: kmpublic / inbox


# Karaoke data


**File** : $file


**Author(s)** : $author


**Title** : $title


**Series** : $series


**Type** : $type$order


**Language** : $lang


**Year** : $year


**Singer(s)** : $singer


**Tag(s)** : Misc: $tags - Famillies: $families - Genres: $genres - Platforms: $platforms - Origins: $origins


**Songwriter(s)** : $songwriter


**Creator(s)** : $creator


**Group(s)** : $groups


**Duration** : $duration


**Comment** : $comment`
			},
			Suggestion: {
				Title: '[Suggestion] $serie - $title',
				Labels: ['suggestion'],
				Description: `
# Karaoke suggestion


**Issue author** : $username


**Title** : $title


**Series** : $serie


**Type** : $type


**Link** : $link`
			},
			Edit: {
				Title: '[Correction] $kara',
				Labels: ['to integrate'],
				Description: `
A proposal to modify a karaoke has been sent. You will find all the new files in the inbox.


# Karaoke data


**File** : $file


**New subtitle?**: $newSub


**New media?**: $newVideo


**Author(s)** : $author


**Title** : $title


**Series** : $series


**Type** : $type$order


**Language** : $lang


**Year** : $year


**Singer(s)** : $singer


**Tag(s)** : Misc: $tags - Famillies: $families - Genres: $genres - Platforms: $platforms - Origins: $origins


**Songwriter(s)** : $songwriter


**Creator(s)** : $creator


**Group(s)** : $groups


**Duration** : $duration


**Comment** : $comment`
			},
			KaraProblem: {
				Quality: {
					Title: '[Media issue] $kara',
					Labels: ['video quality'],
					Description: `
# Media issue


**Issue author** : $username


**Comment** : $comment`
				},
				Time: {
					Title: '[Time] $kara',
					Labels: ['time'],
					Description: `
# Poorly timed / defective karaoke


**Issue author** : $username


**Comment** : $comment`
				}
			},
		}
	},
	Mail: {
		Enabled: false
	},
	Online: {
		Stats: false,
		ErrorTracking: true,
	}
};

export const configConstraints = {
	'App.JwtSecret': { presence: {allowEmpty: false}},
	'App.InstanceID': { presence: {allowEmpty: false}},
	'Database.prod.user': { presence: {allowEmpty: false}},
	'Database.prod.password': { presence: true },
	'Database.prod.host': { presence: {allowEmpty: false}},
	'Database.prod.database': { presence: {allowEmpty: false}},
	'System.Binaries.ffmpeg': { presence: {allowEmpty: false}},
	'Shortener.ExpireTimeDays': { numericality: { greaterThan: 0 }},
	'Frontend.Port': { numericality: true}
};

export let NuxtConfig = {
	mode: 'universal',
	dev: false,

	env: {
		LIVE_URL: false
	},
	/*
    ** Nuxt.js dev-modules
    */
	buildModules: [
		'@nuxt/typescript-build'
	],

	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		// Doc: https://nuxt-community.github.io/nuxt-i18n
		'nuxt-i18n',
		['nuxt-buefy', { materialDesignIcons: false }]
	],

	plugins: [
		'~/plugins/icons.js',
		{src: '~/plugins/vuex-persist.js', ssr: false}
	],

	axios: {
		baseURL: 'http://localhost:1350',
		https: false
	},

	router: {
		base: '/base/'
	},

	css: [
		{src: '~/assets/main.scss', lang: 'scss'},
		'@fortawesome/fontawesome-svg-core/styles.css'
	],

	i18n: {
		locales: [
			{
				code: 'eng',
				name: 'English',
				iso: 'en',
				file: 'eng.ts'
			},
			{
				code: 'fre',
				name: 'Français',
				iso: 'fr',
				file: 'fre.ts'
			}
		],
		baseUrl: 'http://localhost:1350/base',
		seo: true,
		lazy: true,
		defaultLocale: 'fre',
		strategy: 'no_prefix',
		langDir: 'lang/',
		vuex: false
	},

	modulesDir: ['../node_modules/'],
	rootDir: 'kmexplorer/'
};