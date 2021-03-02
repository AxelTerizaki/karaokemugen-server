import { Nuxt, Builder } from 'nuxt';
import { NuxtConfig } from '../utils/default_settings';
import logger from '../lib/utils/logger';
import {getConfig} from '../lib/utils/config';
import merge from 'lodash.merge';
import { supportedFiles } from '../lib/utils/constants';
import { sentryDSN } from '../utils/constants';

function generateConfig(production: boolean = false) {
	const conf = getConfig();
	const autoGeneratedConfig = {
		dev: production ? false:process.env.NODE_ENV !== 'production',
		env: {
			LIVE_URL: conf.KaraExplorer.LiveURL,
			KM_IMPORT: conf.KaraExplorer.Import,
			IN_PROGRESS_SONGS_LIST: conf.KaraExplorer.InProgressSongsList,
			BASE_LICENSE_NAME: conf.BaseLicense.Name,
			BASE_LICENSE_LINK: conf.BaseLicense.Link,
			SUPPORTED_LYRICS: supportedFiles.lyrics,
			SUPPORTED_MEDIAS: [].concat(supportedFiles.video, supportedFiles.audio),
			API_HOST: conf.API.Host,
			EXPLORER_HOST: conf.KaraExplorer.Host,
			EXPLORER_TAGLINE: conf.KaraExplorer.Tagline,
			BASE_URL: `http${conf.KaraExplorer.Secure?'s':''}://${conf.KaraExplorer.Host}${
				(production || conf.API.Port === 443 || conf.API.Port === 80)?'':`:${conf.Frontend.Port}`}${conf.KaraExplorer.Path}`
		},
		router: {
			base: conf.KaraExplorer.Path
		},
		axios: {
			baseURL: `http${conf.API.Secure?'s':''}://${conf.API.Host}${
				(production || conf.API.Port === 443 || conf.API.Port === 80)?'':`:${conf.API.Port}`}/`,
			https: conf.API.Secure
		},
		i18n: {
			baseUrl: `http${conf.KaraExplorer.Secure?'s':''}://${conf.KaraExplorer.Host}${
				(production || conf.API.Port === 443 || conf.API.Port === 80)?'':`:${conf.Frontend.Port}`}${conf.KaraExplorer.Path}`
		},
		sentry: {
			disabled: Boolean(process.env.SENTRY_TEST),
			dsn: process.env.SENTRY_DSN || sentryDSN
		},
		pwa: {
			workbox: {
				enabled: production ? true:process.env.NODE_ENV !== 'production'
			}
		},
		head: {
			meta: [
				{ charset: 'utf-8' },
				{ hid: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
				{ hid: 'twitter:site', name: 'twitter:site', content: '@KaraokeMugen' },
				{ hid: 'twitter:title', name: 'twitter:title', content: conf.KaraExplorer.Tagline },
				{ hid: 'description', name: 'description', content: conf.KaraExplorer.Tagline },
				{ hid: 'theme-color', name: 'theme-color', content: '#375a7f' },
				{ hid: 'og:title', property: 'og:title', content: conf.KaraExplorer.Host },
				{ hid: 'og:description', property: 'og:description', content: conf.KaraExplorer.Tagline },
				{ hid: 'og:type', property: 'og:type', content: 'website' },
				{ hid: 'og:image', property: 'og:image', content: 'https://lab.shelter.moe/karaokemugen/main/-/raw/master/Resources/banniere/banner-website-2021b.png' },
				{ hid: 'author', name: 'author', content: 'Karaoke Mugen contributors' }
			],
			link: [
				{ rel: 'author', href: `/${conf.KaraExplorer.Path}/humans.txt` }
			]
		}
	};
	const overrideNuxt = conf.KaraExplorer.NuxtOverrides;

	return merge(NuxtConfig, autoGeneratedConfig, overrideNuxt);
}

export async function buildKMExplorer() {
	const NuxtConfig = generateConfig(true);
	logger.debug('Building Nuxt with config', {service: 'KMExplorer', obj: NuxtConfig});
	const nuxt = new Nuxt(NuxtConfig);
	await nuxt.ready();
	const builder = new Builder(nuxt);
	await builder.build();
}

export async function startKMExplorer() {
	const NuxtConfig = generateConfig();
	logger.debug('Starting Nuxt with config', {service: 'KMExplorer', obj: NuxtConfig});
	const nuxt = new Nuxt(NuxtConfig);
	await nuxt.ready();
	if (NuxtConfig.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	}
	return nuxt;
}
