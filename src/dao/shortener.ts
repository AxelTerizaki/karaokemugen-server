import {db} from '../lib/dao/database';
import { ShortURLData } from '../types/shortener';
import { DBInstance } from '../types/database/shortener';
const sql = require('./sqls/shortener');

export async function selectInstance(ip: string): Promise<DBInstance[]> {
	const res = await db().query(sql.getInstance,[ip]);
	return res.rows;
}

export async function upsertInstance(data: ShortURLData) {
	// determine if it's a dualstack request or ip4/6
	if (data.ip6 && data.local_ip4) { // Dual-stack
		return await db().query(sql.upsertInstance.dual, [
			data.date,
			data.ip6_prefix,
			data.ip6,
			data.remote_ip4,
			data.local_ip4,
			data.local_port,
			data.instance_id
		]);
	} else if (data.ip6) { // IP6-only (so brave from him)
		return await db().query(sql.upsertInstance.ip6, [
			data.date,
			data.ip6_prefix,
			data.ip6,
			data.local_port,
			data.instance_id
		]);
	} else { // IP4-only
		return await db().query(sql.upsertInstance.ip4, [
			data.date,
			data.remote_ip4,
			data.local_ip4,
			data.local_port,
			data.instance_id
		]);
	}
}

export async function cleanupInstances(date: Date) {
	return await db().query(sql.cleanupInstances, [date]);
}