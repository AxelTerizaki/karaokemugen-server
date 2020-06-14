import logger from './lib/utils/logger';
import express from 'express';
import {resolve} from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import adminController from './controllers/admin';
import authController from './controllers/auth';
import KServerController from './controllers/karaserv';
import KImportController from './controllers/karaimport';
import statsController from './controllers/stats';
import shortenerController from './controllers/shortener';
import userController from './controllers/user';
import favoritesController from './controllers/favorites';
import {configurePassport} from './lib/utils/passport_manager';
import {getConfig, resolvedPathAvatars, resolvedPathPreviews, resolvedPathRepos} from './lib/utils/config';
import range from 'express-range';
import vhost from 'vhost';
//import {getInstanceRoom} from './dao/proxy'; For KM instances hosting
import {createServer} from 'http';
import helmet from 'helmet';
import compression from 'compression';
import { getState } from './utils/state';
import { initWS } from './lib/utils/ws';
import {startKMExplorer} from "./services/kmexplorer";

/**
 * Starting express which will serve our app.
 * Serving this app means it has to be built beforehand.
 */
export function initFrontend(listenPort: number) {

	const conf = getConfig();
	const state = getState();
	const app = express();
	const API = express();
	const KMExplorer = express();
	const Shortener = express();
	const KMServer = express();
	const APILocater = express();

	app.set('trust proxy', (ip: string) => {
		return ip === '127.0.0.1' ||
			ip === '::ffff:127.0.0.1';
	});
	app.use(helmet());
	app.use(compression());
	app.use(bodyParser.json({limit: '1000mb'})); // support json encoded bodies
	app.use(bodyParser.urlencoded({
		limit: '1000mb',
		extended: true
	})); // support encoded bodies

	app.use(passport.initialize());
	configurePassport();
	// Server allows resuming file downloads :
	app.use(range());
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept, Key');
		req.method === 'OPTIONS'
			? res.json()
			: next();
	});
	// API Locater
	APILocater.get('/whereIsMyAPI', (_, res) => {
		res.status(200).json(conf.API);
	});

	//KMServer
	// If static serve is enabled, we're serving all files from KMServer instead of Apache/nginx
	if (state.opt.staticServe) {
		app.use(vhost(`${conf.API.Host}`, API));
		KMServer.use('/downloads/karaokes', express.static(resolvedPathRepos('Karas')[0]));
		KMServer.use('/downloads/lyrics', express.static(resolvedPathRepos('Lyrics')[0]));
		KMServer.use('/downloads/medias', express.static(resolvedPathRepos('Medias')[0]));
		KMServer.use('/downloads/series', express.static(resolvedPathRepos('Series')[0]));
		KMServer.use('/downloads/tags', express.static(resolvedPathRepos('Tags')[0]));
	}

	// API router
	app.use(vhost(`${conf.API.Host}`, API));
	API.use('/api', api());
	if (conf.Users.Enabled) API.use('/avatars', express.static(resolvedPathAvatars()));
	if (conf.Shortener.Enabled) {
		app.use(vhost(`${conf.API.Host}`, Shortener));
		Shortener.get('/', (_, res) => {
			res.redirect('/api/shortener');
			return;
		});
	}
	// KMExplorer
	if (conf.KaraExplorer.Enabled) {
		app.use(vhost(`${conf.KaraExplorer.Host}`, APILocater));
		app.use(vhost(`${conf.KaraExplorer.Host}`, KMExplorer));

		KMExplorer.use('/previews', express.static(resolvedPathPreviews()));

		startKMExplorer().then(nuxt => {
			KMExplorer.use(nuxt.render);
		});
	}
	if (conf.API.Host !== conf.KaraExplorer.Host && conf.KaraExplorer.Path && conf.KaraExplorer.Path !== '/') {
		KMExplorer.get('/', (_, res) => {
			res.redirect(conf.KaraExplorer.Path);
		});
	}

	// Load static assets from static folder (mostly error pages)
	app.use('/static', express.static(resolve(state.appPath, 'static')));

	/** Disabled code for KM Rooms
	app.use(vhost(`*.${conf.Frontend.Host}`, getKMRoom), proxy(redirectKMRoom, {
		memoizeHost: false
	}));
	*/


	// The "catchall" handler: for any request that doesn't
	// match one above, send a 404 page.
	app.get('*', (_, res) => res.status(404).sendFile(resolve(state.appPath, 'static/404.html')));

	const port = listenPort;
	const server = createServer(app);
	initWS(server);
	server.listen(port, () => logger.info(`[App] App listening on ${port}`));
}

function api() {
	const apiRouter = express.Router();
	const conf = getConfig();
	// Adding admin routes
	adminController(apiRouter);
	// Adding KaraServ routes
	KServerController(apiRouter);
	if (conf.KaraExplorer.Import) KImportController(apiRouter);
	// Shortener/kara.moe route
	if (conf.Shortener.Enabled) shortenerController(apiRouter);
	// Stats
	if (conf.Stats.Enabled) statsController(apiRouter);
	// Online Mode for KM App
	if (conf.Users.Enabled) {
		userController(apiRouter);
		favoritesController(apiRouter);
		authController(apiRouter);
	}
	return apiRouter;
}

/* This code is disabled until we get to host our own KM Apps on this server code
function getKMRoom(_req: any, _res: Response, next: any) {

	const instance = getInstanceRoom(req.vhost[0]);
    if (!instance) {
        res.status(404).send('No room exists by this name');
    } else {
        req.KMAppPort = instance.port;
        next();
	}
	next();
}

function redirectKMRoom(req: any) {
	return `http://localhost:${req.KMAppPort}`;
}
*/