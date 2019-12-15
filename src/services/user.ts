import {createHash} from 'crypto';
import {updateUser, updateUserPassword, insertUser, selectUser, selectAllUsers, deleteUser} from '../dao/user';
import logger from '../lib/utils/logger';
import {getConfig, resolvedPathAvatars} from '../lib/utils/config';
import {asyncReadDir, asyncExists, asyncUnlink, asyncMove, detectFileType} from '../lib/utils/files';
import uuidV4 from 'uuid/v4';
import {resolve} from 'path';
import {has as hasLang} from 'langs';
import { getState } from '../utils/state';
import { User, Token } from '../lib/types/user';
import { sendMail } from '../utils/mailer';
import randomstring from 'randomstring';

const passwordResetRequests = new Map();

export async function resetPasswordRequest(username: string) {
	const user = await findUserByName(username);
	if (!user) throw 'User unknown';
	if (!user.email) throw 'User has no configured mail. Ask server admin for a password reset';
	const requestCode = uuidV4();
	passwordResetRequests.set(username, {
		code: requestCode,
		date: +(new Date().getTime() / 1000).toFixed(0)
	});
	sendMail('Karaoke Mugen Password Reset',`
	Hello ${username},

	You (or someone) requested a password reset for your account at ${getConfig().Frontend.Host}.

	Please click the following link to get a new, randomized password sent to your mail account :

	https://${getConfig().Frontend.Host}/api/users/${username}/resetpassword/${requestCode}

	This link will expire in two hours.
	`,
	username,
	user.email);
};

export async function resetPassword(username: string, requestCode: string) {
	const request = passwordResetRequests.get(username);
	if (!request) throw 'No request';
	if (request.code !== requestCode) throw 'Wrong code';
	const user = await findUserByName(username);
	if (!user) throw 'User unknown';
	const newPassword = randomstring.generate(12);
	await changePassword(username, newPassword);
	passwordResetRequests.delete(username);
	sendMail('Karaoke Mugen Password has been reset',`
	Hello ${username},

	You (or someone) requested a password reset for your account at ${getConfig().Frontend.Host}.

	Your password has been reset to the following :
	${newPassword}

	Please login using a Karaoke Mugen Application and change it to something else.

	`,
	username,
	user.email);
}

export async function initUsers() {
	cleanupAvatars();
	setInterval(cleanupAvatars, 60 * 60 * 1000);
	setInterval(cleanupPasswordResetRequests, 60 * 1000);
}

function cleanupPasswordResetRequests() {
	const now = +(new Date().getTime() / 1000).toFixed(0);
	passwordResetRequests.forEach((user: string, request: any) => {
		if ((request.date + (60 * 60 * 2)) < now ) passwordResetRequests.delete(user);
	});
}

async function cleanupAvatars() {
	// This is done because updating avatars generate a new name for the file. So unused avatar files are now cleaned up.
	const users = await getAllUsers();
	const avatars = [];
	for (const user of users) {
		if (!avatars.includes(user.avatar_file)) avatars.push(user.avatar_file);
	}
	const conf = getConfig();
	const avatarPath = resolve(getState().dataPath, conf.System.Path.Avatars);
	const avatarFiles = await asyncReadDir(avatarPath);
	for (const file of avatarFiles) {
		if (!avatars.includes(file) && file !== 'blank.png') asyncUnlink(resolve(avatarPath, file));
	}
}

export function hashPassword(password: string) {
	const hash = createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

export async function findUserByName(username: string, opts: any = {}) {
	const user = await selectUser('pk_login', username);
	if (!user) return false;
	if (opts.public) {
		delete user.password;
		delete user.email;
	}
	return user;
}

export async function removeUser(username: string) {
	return await deleteUser(username);
}

export async function getAllUsers(opts: any = {}) {
	const users = await selectAllUsers();
	if (!opts.public) return users;
	for (const index in users) {
		delete users[index].password;
		delete users[index].email;
	}
	return users;
}

export function checkPassword(user: User,password: string) {
	return user.password === hashPassword(password);
}

export async function createUser(user: User, opts: any = {}) {
	user.nickname = user.nickname || user.login;
	user.avatar_file = user.avatar_file || 'blank.png';
	user.bio = user.bio || null;
	user.url = user.url || null;
	user.email = user.email || null;
	opts.admin ? user.type = 2 : user.type = 1;
	if (!user.password) throw { code: 'USER_EMPTY_PASSWORD'};
	if (!user.login) throw { code: 'USER_EMPTY_LOGIN'};
	// Check if login or nickname already exists.
	if (await selectUser('pk_login',user.login) || await selectUser('nickname', user.login)) {
		logger.error(`[User] User/nickname ${user.login} already exists, cannot create it`);
		throw { code: 'USER_ALREADY_EXISTS', data: {username: user.login}};
	}
	user.password = hashPassword(user.password);
	try {
		await insertUser(user);
	} catch (err) {
		logger.error(`[User] Unable to create user ${user.login} : ${err}`);
		throw ({ code: 'USER_CREATION_ERROR', data: err});
	}
}

async function replaceAvatar(oldImageFile: string, avatar: Express.Multer.File) {
	try {
		const fileType = await detectFileType(avatar.path);
		if (fileType !== 'jpg' &&
				fileType !== 'gif' &&
				fileType !== 'png') {
			throw 'Wrong avatar file type';
		}
		// Construct the name of the new avatar file with its ID and filetype.
		const newAvatarFile = `${uuidV4()}.${fileType}`;
		const avatarPath = resolve(resolvedPathAvatars());
		const newAvatarPath = resolve(avatarPath, newAvatarFile);
		const oldAvatarPath = resolve(avatarPath, oldImageFile);
		if (await asyncExists(oldAvatarPath) &&
			oldImageFile !== 'blank.png') await asyncUnlink(oldAvatarPath);
		await asyncMove(avatar.path, newAvatarPath);
		return newAvatarFile;
	} catch (err) {
		logger.error(`[User] Unable to replace avatar ${oldImageFile} with ${avatar.path} : ${err}`);
		throw err;
	}
}

export async function changePassword(username: string, password: string) {
	password = hashPassword(password);
	return await updateUserPassword(username, password);
}

export async function editUser(username: string, user: User, avatar: Express.Multer.File, token: Token) {
	try {
		const currentUser = await findUserByName(username);
		if (!currentUser) throw 'User unknown';
		user.login = username;
		if (!user.type) user.type = currentUser.type;
		if (!user.bio) user.bio = null;
		if (!user.url) user.url = null;
		if (!user.email) user.email = null;
		if (token.username !== currentUser.login && token.role !== 'admin') throw 'Only admins can edit another user';
		if (user.type !== currentUser.type && token.role !== 'admin') throw 'Only admins can change a user\'s type';
		// Check if login already exists.
		if (!user.series_lang_mode) user.series_lang_mode = -1;
		if (user.series_lang_mode < -1 || user.series_lang_mode > 4) throw 'Invalid series_lang_mode';
		if (user.main_series_lang && !hasLang('2B', user.main_series_lang)) throw `main_series_lang is not a valid ISO639-2B code (received ${user.main_series_lang})`;
		if (user.fallback_series_lang && !hasLang('2B', user.fallback_series_lang)) throw `fallback_series_lang is not a valid ISO639-2B code (received ${user.fallback_series_lang})`;

		if (currentUser.nickname !== user.nickname && await await selectUser('nickname', user.nickname)) throw 'Nickname already exists';
		if (user.password) {
			user.password = hashPassword(user.password);
			await updateUserPassword(user.login, user.password);
		}
		if (avatar) {
			// If a new avatar was sent, it is contained in the avatar object
			// Let's move it to the avatar user directory and update avatar info in
			// database
			user.avatar_file = await replaceAvatar(currentUser.avatar_file, avatar);
		} else {
			user.avatar_file = currentUser.avatar_file;
		}
		await updateUser(user);
		logger.debug(`[User] ${username} (${user.nickname}) profile updated`);
		return user;
	} catch (err) {
		logger.error(`[User] Failed to update ${username}'s profile : ${err}`);
		throw {
			message: err,
			data: user.nickname
		};
	}
}
