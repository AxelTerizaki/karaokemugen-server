/**
 * .kara files generation
 */

import logger from 'winston';
import {basename, resolve} from 'path';
import {getConfig, resolvedPathImport, resolvedPathTemp, resolvedPathRepos} from '../lib/utils/config';
import {duration} from '../lib/utils/date';
import { generateKara } from '../lib/services/kara_creation';
import { NewKara, Kara } from '../lib/types/kara';
import { gitlabPostNewIssue } from '../lib/services/gitlab';
import { asyncExists, asyncCopy, asyncUnlink } from '../lib/utils/files';

export async function editKara(kara: Kara): Promise<string> {
	let newKara: NewKara;
	try {
		const mediaFile = resolve(resolvedPathRepos('Medias')[0], kara.mediafile);
		const subFile = kara.subfile
			? resolve(resolvedPathRepos('Lyrics')[0], kara.subfile)
			: kara.subfile;
		// Removing useless data
		delete kara.karafile;
		// Copying already present files in temp directory to be worked on with by generateKara
		if (!kara.mediafile_orig) {
			kara.noNewVideo = true;
			kara.mediafile_orig = kara.mediafile;
			if (!await asyncExists(mediaFile)) throw `Mediafile ${mediaFile} does not exist! Check your base files or upload a new media`;
			await asyncCopy(mediaFile, resolve(resolvedPathTemp(), kara.mediafile), {overwrite: true});
		}
		if (!kara.subfile_orig) {
			kara.noNewSub = true;
			kara.subfile_orig = kara.subfile;
			if (kara.subfile) {
				if (!await asyncExists(subFile)) throw `Subfile ${subFile} does not exist! Check your base files or upload a new subfile`;
				await asyncCopy(subFile, resolve(resolvedPathTemp(), kara.subfile), {overwrite: true});
			}
		}
		// Treat files
		newKara = await generateKara(kara, resolvedPathImport(), resolvedPathImport(), resolvedPathImport());
		// Remove files if they're not new
		if (kara.noNewSub && newKara.data.subfile) asyncUnlink(resolve(resolvedPathImport(), newKara.data.subfile));
		if (kara.noNewVideo) {
			asyncUnlink(resolve(resolvedPathImport(), newKara.data.mediafile));
			newKara.data.mediaduration = 0;
		}

		// Post issue to gitlab
		const karaName = `${newKara.data.langs[0].name.toUpperCase()} - ${newKara.data.series[0]?.name || newKara.data.singers[0]?.name} - ${newKara.data.songtypes[0].name}${newKara.data.songorder || ''} - ${newKara.data.title}`;
		const conf = getConfig();
		let title = conf.Gitlab.IssueTemplate.Edit.Title || 'Edited kara: $kara';
		logger.debug('[GitLab] Kara: '+JSON.stringify(newKara.data, null, 2));
		title = title.replace('$kara', karaName);
		let desc = conf.Gitlab.IssueTemplate.Edit.Description || '';
		desc = desc.replace('$file', basename(newKara.file))
			.replace('$comment', kara.comment || '')
			.replace('$newSub', `${!newKara.data.noNewSub}`)
			.replace('$newVideo', `${!newKara.data.noNewVideo}`)
			.replace('$author', newKara.data.authors.map(t => t.name).join(', '))
			.replace('$title', newKara.data.title)
			.replace('$series', newKara.data.series.map(t => t.name).join(', '))
			.replace('$type', newKara.data.songtypes.map(t => t.name).join(', '))
			.replace('$order', (newKara.data.songorder && newKara.data.songorder.toString()) || '')
			.replace('$lang', newKara.data.langs.map(t => t.name).join(', '))
			.replace('$year', `${newKara.data.year}`)
			.replace('$singer', newKara.data.singers.map(t => t.name).join(', '))
			.replace('$tags', newKara.data.misc.map(t => t.name).join(', '))
			.replace('$songwriter', newKara.data.songwriters.map(t => t.name).join(', '))
			.replace('$creator', newKara.data.creators.map(t => t.name).join(', '))
			.replace('$groups', newKara.data.groups.map(t => t.name).join(', '))
			.replace('$families', newKara.data.families.map(t => t.name).join(', '))
			.replace('$genres', newKara.data.genres.map(t => t.name).join(', '))
			.replace('$platforms', newKara.data.platforms.map(t => t.name).join(', '))
			.replace('$origins', newKara.data.origins.map(t => t.name).join(', '))
			.replace('$duration', duration(newKara.data.mediaduration));
		try {
			if (conf.Gitlab.Enabled) return gitlabPostNewIssue(title, desc, conf.Gitlab.IssueTemplate.Edit.Labels);
		} catch(err) {
			logger.error(`[KaraImport] Call to Gitlab API failed : ${err}`);
		}


	} catch(err) {
		logger.error(`[KaraGen] Error while editing kara : ${err}`);
		throw err;
	}
}


export async function createKara(kara: Kara) {
	const conf = getConfig();
	let newKara: NewKara;
	kara.repository = conf.System.Repositories[0].Name;
	try {
		newKara = await generateKara(kara,
			resolvedPathImport(),
			resolvedPathImport(),
			resolvedPathImport()
		);
	} catch(err) {
		logger.error(`[KaraImport] Error importing kara : ${err}. Kara Data ${JSON.stringify(kara)}`);
		throw err;
	}
	const karaName = `${newKara.data.langs[0].name.toUpperCase()} - ${newKara.data.series[0]?.name || newKara.data.singers[0]?.name} - ${newKara.data.songtypes[0].name}${newKara.data.songorder || ''} - ${newKara.data.title}`;
	let title = conf.Gitlab.IssueTemplate.Import.Title || 'New kara: $kara';
	logger.debug('[GitLab] Kara: '+JSON.stringify(newKara.data, null, 2));
	title = title.replace('$kara', karaName);
	let desc = conf.Gitlab.IssueTemplate.Import.Description || '';
	desc = desc.replace('$file', basename(newKara.file))
		.replace('$comment', kara.comment || '')
		.replace('$author', newKara.data.authors.map(t => t.name).join(', '))
		.replace('$title', newKara.data.title)
		.replace('$series', newKara.data.series.map(t => t.name).join(', '))
		.replace('$type', newKara.data.songtypes.map(t => t.name).join(', '))
		.replace('$order', (newKara.data.songorder && newKara.data.songorder.toString()) || '')
		.replace('$lang', newKara.data.langs.map(t => t.name).join(', '))
		.replace('$year', `${newKara.data.year}`)
		.replace('$singer', newKara.data.singers.map(t => t.name).join(', '))
		.replace('$tags', newKara.data.misc.map(t => t.name).join(', '))
		.replace('$songwriter', newKara.data.songwriters.map(t => t.name).join(', '))
		.replace('$creator', newKara.data.creators.map(t => t.name).join(', '))
		.replace('$groups', newKara.data.groups.map(t => t.name).join(', '))
		.replace('$families', newKara.data.families.map(t => t.name).join(', '))
		.replace('$genres', newKara.data.genres.map(t => t.name).join(', '))
		.replace('$platforms', newKara.data.platforms.map(t => t.name).join(', '))
		.replace('$origins', newKara.data.origins.map(t => t.name).join(', '))
		.replace('$duration', duration(newKara.data.mediaduration));
	try {
		if (conf.Gitlab.Enabled) return gitlabPostNewIssue(title, desc, conf.Gitlab.IssueTemplate.Import.Labels);
	} catch(err) {
		logger.error(`[KaraImport] Call to Gitlab API failed : ${err}`);
	}
}
