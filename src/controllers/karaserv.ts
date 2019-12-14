import {getLang} from './middlewares/lang';
import {getBaseStats, getKara, getAllKaras, getAllYears, newKaraIssue} from '../services/kara';
import {getTags} from '../services/tag';
import {getAllSeries} from '../services/series';
import {getSettings} from '../lib/dao/database';
import { Router } from 'express';
import {getConfig} from '../lib/utils/config';
import { postSuggestionToKaraBase } from "../services/gitlab";

export default function KSController(router: Router) {
	router.route('/karas/lastUpdate')
		.get(async (_, res) => {
			try {
				const settings: any = await getSettings();
				res.send(settings.lastGeneration);
			} catch(err) {
				res.status(500).json(err);
			}
		});

	router.route('/karas')
		.get(getLang, async (req: any, res) => {
			try {
				const karas = await getAllKaras(req.query.filter,req.lang, req.query.from, req.query.size);
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/stats')
		.get(async (_, res) => {
			try {
				res.json(await getBaseStats());
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/search')
		.post(getLang, async (req: any, res) => {
			try {
				const karas = await getAllKaras(req.body.filter, req.lang , req.body.from, req.body.size, 'search', req.body.q, req.body.compare, req.body.localKaras);
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		})
		.get(getLang, async (req: any, res) => {
			try {
				const karas = await getAllKaras(req.query.filter, req.lang, req.query.from, req.query.size, 'search', req.query.q);
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/:kid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
		.get(getLang, async (req: any, res) => {
			try {
				const kara = await getKara(req.query.filter,req.lang, req.query.from, req.query.size, 'kid', req.params.kid);
				res.json(kara);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/:kid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
		.get(getLang, async (req: any, res) => {
			try {
				const kara = await getKara(req.query.filter,req.lang, req.query.from, req.query.size, 'kid', req.params.kid);
				res.json(kara);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/:kid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/problem')
		.post(getLang, async (req: any, res) => {
			try {
				await newKaraIssue(req.params.kid, req.body.type, req.body.message, req.body.author);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/recent')
		.get(getLang, async (req: any, res) => {
			try {
				const karas = await getAllKaras(req.query.filter,req.lang, req.query.from, req.query.size,'recent');
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/tags/:tagtype([0-9]+)')
		.get(getLang, async (req: any, res) => {
			try {
				const tags = await getTags({filter: req.query.filter, type: req.params.tagtype, from: req.query.from, size: req.query.size});
				res.json(tags);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/tags')
		.get(getLang, async (req: any, res) => {
			try {
				const tags = await getTags(({filter: req.query.filter, type: null, from: req.query.from, size: req.query.size}));
				res.json(tags);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/series')
		.get(getLang, async (req: any, res) => {
			try {
				const series = await getAllSeries(req.query.filter, req.lang, req.query.from, req.query.size);
				res.json(series);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/years')
		.get(async (_, res) => {
			try {
				const years = await getAllYears();
				res.json(years);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/suggest')
		.post(async (req, res) => {
			try {
				if (getConfig().Gitlab.Enabled) {
					const url = await postSuggestionToKaraBase(req.body.karaName, req.body.username, req.body.series, req.body.link);
					res.json({issueURL: url});
				} else {
					res.status(403).json('Gitlab is not enabled');
				}
			} catch(err) {
				res.status(500).json(err);
			}
		});

	router.route('/settings')
		.get(async (_, res) => {
			return res.json({config: {
				Gitlab: {
						Enabled: getConfig().Gitlab.Enabled
					}
				}
			});
		});
}
