import {publishInstance, getInstance} from '../services/shortener';
import { Router } from 'express';
import { Locales } from 'locale';
import { isIPv6 } from 'net';

export default function ShortenerController(router: Router) {
	router.route('/shortener')
		.get(async (req, res) => {
			try {
				const ret = await getInstance(req.headers['x-forwarded-for'] as string);
				if (ret) {
					if (isIPv6(req.headers['x-forwarded-for'] as string) && ret.ip6) {
						res.redirect(`http://[${ret.ip6}]:${ret.local_port}`);
					} else {
						res.redirect(`http://${ret.local_ip4}:${ret.local_port}`);
					}
				} else {
					const locale = new Locales(req.headers['accept-language'], 'en');
					const supported_languages = new Locales(['fr', 'en']);
					res.redirect(`/static/shortener/notfound.${locale.best(supported_languages)}.html`);
				}
			} catch(err) {
				res.status(500).json(err);
			}
		})
		.post(async (req, res) => {
			try {
				await publishInstance(req.headers['x-forwarded-for'] as string, req.body);
				res.status(200).send('Update OK');
			} catch(err) {
				res.status(500).send(err);
			}
		});
}
