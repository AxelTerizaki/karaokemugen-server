import EventEmmiter from 'events';
import axios from 'axios';
import { parseJwt } from './tools';

let logInfos;

if (!logInfos) {
	const token = window.localStorage.getItem('kmToken');
	if (token) {
		logInfos = parseJwt(token);
		logInfos.token = token;
	} else {
		logInfos = undefined;
	}
}

class Store extends EventEmmiter {
	getLogInfos() {
		return logInfos;
	}

	setLogInfo(token) {
		logInfos = parseJwt(token);
		window.localStorage.setItem('kmToken', token);
		logInfos.token = token;
		axios.defaults.headers.common['authorization'] = localStorage.getItem('kmToken');
		store.emitChange('loginUpdated');
	}

	logOut() {
		window.localStorage.removeItem('kmToken');
		logInfos = undefined;
		axios.defaults.headers.common['authorization'] = null;
		store.emitChange('loginOut');
	}
}
const store = new Store();
export default store;