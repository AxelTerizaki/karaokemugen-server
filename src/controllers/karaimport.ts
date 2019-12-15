import {createKara, editKara} from '../services/kara_import';
import multer from 'multer';
import {getConfig} from '../lib/utils/config';
import {resolve} from 'path';
import { Router } from 'express';
import { getState } from '../utils/state';

export default function KIController(router: Router) {
	const conf = getConfig();
	let upload = multer({ dest: resolve(getState().dataPath,conf.System.Path.Temp)});

	router.post('/karas', async (req, res) => {
		try {
			const url = await createKara(req.body);
			res.status(200).send(url || '');
		} catch(err) {
			res.status(500).send(`Error while generating kara : ${err}`);
		}
	});
	router.put('/karas/:kid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})',  async (req: any, res: any) => {
		try {
			const url = await editKara(req.body);
			res.status(200).send(url || '');
		} catch(err) {
			res.status(500).send(`Error while editing kara: ${err}`);
		}
	});
	router.post('/karas/importfile', upload.single('file'), (req, res) => {
		res.status(200).send(JSON.stringify(req.file));
	});
}