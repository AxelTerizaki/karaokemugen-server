import { uuidRegexp } from '../lib/utils/constants';
import testJSON from 'is-valid-json';
import { check } from '../lib/utils/validators';
import {
	upsertInstance,
	upsertSessions,
	replaceFavorites,
	upsertPlayed,
	upsertRequests,
	wipeInstance} from '../dao/stats';
import logger from '../lib/utils/logger';
import { getAllKaras } from './kara';

const payloadConstraints = {
	'instance.instance_id': {presence: true, format: uuidRegexp},
	'instance.version': {presence: {allowEmpty: false }},
	'instance.config': {presence: {allowEmpty: false }},
	favorites: {favoritesValidator: true},
	viewcounts: {songItemValidator: true},
	requests: {songItemValidator: true},
	sessions: {sessionValidator: true}
};

export async function processStatsPayload(payload: any) {
	try {
		if (!testJSON(payload)) throw 'Syntax error in JSON data';

		// Payloads before version 3 are ignored
		if (payload.payloadVersion < 3) return;

		const validationErrors = check(payload, payloadConstraints);
		if (validationErrors) throw `Payload is not valid: ${JSON.stringify(validationErrors)}`;
		await wipeInstance(payload.instance.instance_id);
		await upsertInstance(payload.instance);
		await upsertSessions(payload.instance.instance_id, payload.sessions);
		await Promise.all([
			replaceFavorites(payload.instance.instance_id, payload.favorites),
			upsertPlayed(payload.viewcounts),
			upsertRequests(payload.requests)
		]);
		logger.info(`[Stats] Received payload from instance ${payload.instance.instance_id}`);
	} catch(err) {
		logger.error(`[Stats] Error with payload from ${payload.instance.instance_id} : ${err}`);
		logger.debug(`[Stats] Payload in error : ${JSON.stringify(payload,null,2)}`);
		throw err;
	}
}

export async function getFavoritesStats(filter: string, lang: string, from = 0, size = 0) {
	return await getAllKaras(filter, lang, from, size, 'favorited');
}

export async function getRequestedStats(filter: string, lang: string, from = 0, size = 0) {
	return await getAllKaras(filter, lang, from, size, 'requested');
}

export async function getPlayedStats(filter: string, lang: string, from = 0, size = 0) {
	return await getAllKaras(filter, lang, from, size, 'played');
}