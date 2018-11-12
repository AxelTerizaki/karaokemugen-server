import {cleanupInstances, insertInstance, updateInstance, selectInstance} from '../_dao/shortener';
import logger from 'winston';

export async function publishInstance(ip, data) {
	const currentDate = new Date();
	logger.debug(`[Shortener] Received publish request from ${ip} with ${JSON.stringify(data)}`);
	const instance = await selectInstance(ip);
	logger.debug(`[Shortener] Instance found : ${JSON.stringify(instance)}`);
	if (instance.length > 0) {
		await updateInstance({
			instance_id: data.IID,
			remote_ip: ip,
			date: currentDate,
			local_ip: data.localIP,
			local_port: data.localPort
		});
		return true;
	} else {
		await insertInstance({
			instance_id: data.IID,
			remote_ip: ip,
			date: currentDate,
			local_ip: data.localIP,
			local_port: data.localPort
		});
		return true;
	}
}

export async function getInstance(ip) {
	logger.debug(`[Shortener] Received get request from ${ip}`);
	const instance = await selectInstance(ip);
	logger.debug(`[Shortener] Found instance data ${JSON.stringify(instance)}`);
	if (instance.length > 0) return instance[0];
	return false;
}

async function initShortener() {
	setInterval(cleanInstances, 60 * 1000 * 1000 * 24 * getConfig().Shortener.ExpireTimeDays);
}

async function cleanInstances() {
	// Unflag online accounts from database if they expired
	try {
		await cleanupInstances(getConfig().Shortener.ExpireTime);
	} catch(err) {
		logger.error(`[Shortener] Expiring instances failed (better luck next time) : ${err}`);
	}
}