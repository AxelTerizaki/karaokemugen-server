import {cleanupInstances, upsertInstance, selectInstance} from '../dao/shortener';
import logger from 'winston';
import {getConfig} from '../lib/utils/config';
import { InstanceData } from '../types/shortener';
import {isIPv6} from 'net';

export async function publishInstance(ip: string, data: InstanceData) {
	try {
		// Find cheaters; people who will publish for others IPs
		if ((data?.IP6 && data?.IP4) && // Couche de compatibilité pour les clients KM qui n'ont pas ffe3272f
		(ip !== data?.IP6 && ip !== data?.IP4)) {
			logger.debug(`[Shortener] ${ip} is pretending to be ${JSON.stringify([data?.IP4, data?.IP6])} with ${JSON.stringify(data)}!`);
			return false;
		}
		const currentDate = new Date();
		logger.debug(`[Shortener] Received publish request from ${ip} with ${JSON.stringify(data)}`);
		const instance = await selectInstance(ip);
		logger.debug(`[Shortener] Instance(s) found : ${JSON.stringify(instance)}`);
		if (isIPv6(ip)) {
			await upsertInstance({
				instance_id: data.IID,
				remote_ip4: data?.IP4, // Imaginons que qqun soit assez fou pour vivre avec que la V6 en 2020
				date: currentDate,
				local_ip4: data?.localIP4 ? data.localIP4:data.localIP, // Couche de compatibilité pour les cliens KM qui n'ont pas ffe3272f
				local_port: data.localPort,
				ip6_prefix: data.IP6Prefix,
				ip6: ip
			});
		} else {
			await upsertInstance({
				instance_id: data.IID,
				remote_ip4: ip,
				date: currentDate,
				local_ip4: data.localIP4 ? data.localIP4:data.localIP, // Couche de compatibilité pour les cliens KM qui n'ont pas ffe3272f
				local_port: data.localPort,
				ip6_prefix: data?.IP6Prefix || 'fe80::/56',
				ip6: data?.IP6 || 'fe80::1' // Assume default addresses to avoid some disasters
			});
		}
	} catch(err) {
		logger.error(`[Shortener] Failed to publish instance : ${err}`);
		throw err;
	}
}

export async function getInstance(ip: string) {
	logger.debug(`[Shortener] Received get request from ${ip}`);
	const instance = await selectInstance(ip);
	logger.debug(`[Shortener] Found instance data ${JSON.stringify(instance)}`);
	if (instance.length > 0) return instance[0];
	return false;
}

export async function initShortener() {
	setInterval(cleanInstances, 60 * 60 * 1000 * 24 * getConfig().Shortener.ExpireTimeDays);
	await cleanInstances();
}

async function cleanInstances() {
	// Unflag online accounts from database if they expired
	try {
		const date = new Date();
		date.setDate(date.getDate() - getConfig().Shortener.ExpireTimeDays);
		await cleanupInstances(date);
		logger.info('[Shortener] Cleaned up expired instances');
	} catch(err) {
		logger.error(`[Shortener] Expiring instances failed (better luck next time) : ${err}`);
	}
}