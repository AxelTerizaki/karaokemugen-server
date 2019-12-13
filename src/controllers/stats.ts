import {getRequestedStats, getFavoritesStats, getPlayedStats, processStatsPayload} from '../services/stats';
import { Router } from 'express';
import { getLang } from './middlewares/lang';

export default function statsController(router: Router) {
	router.post('/stats', async (req, res) => {
		try {
			await processStatsPayload(req.body);
			res.status(200).json('Stats payload accepted');
		} catch(err) {
			res.status(500).json(`Error while processing stats payload : ${err}`);
		}
	});
	/*
	router.get('/stats/instances', async (_, res) => {
		try {
			res.status(200).json(await getInstanceStats());
		} catch(err) {
			res.status(500).json(`Error while retrieving instance Stats : ${err}`);
		}
	});
	*/
	router.get('/stats/played', getLang, async (req: any, res) => {
		try {
			res.status(200).json(await getPlayedStats(req.query.filter, req.lang, req.query.from, req.query.size));
		} catch(err) {
			res.status(500).json(`Error while retrieving played stats : ${err}`);
		}
	});
	router.get('/stats/favorites', getLang, async (req: any, res) => {
		try {
			res.status(200).json(await getFavoritesStats(req.query.filter, req.lang, req.query.from, req.query.size));
		} catch(err) {
			res.status(500).json(`Error while retrieving favorites : ${err}`);
		}
	});
	router.get('/stats/requested', getLang, async (req: any, res) => {
		try {
			res.status(200).json(await getRequestedStats(req.query.filter, req.lang, req.query.from, req.query.size));
		} catch(err) {
			res.status(500).json(`Error while retrieving requested stats : ${err}`);
		}
	});
}
