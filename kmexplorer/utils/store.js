import axios from 'axios';
import { parseJwt } from './tools';
import EventSystem from './eventSystem';

class Store {
	constructor() {
		const logInfos = JSON.parse(window.localStorage.getItem('kmToken'));
		if (logInfos) {
			// console.log(logInfos);
			this.logInfos = parseJwt(logInfos.token);
			this.logInfos.token = logInfos.token;
			// console.log(this.logInfos);
		} else {
			this.logInfos = undefined;
		}
	}

	getLogInfos() {
		return this.logInfos;
	}

	isLoggedIn() {
		return !!this.logInfos?.username;
	}

	setLogInfo(logInfo) {
		this.logInfos = parseJwt(logInfo.token);
		this.logInfos.token = logInfo.token;
		window.localStorage.setItem('kmToken', JSON.stringify(logInfo));
		axios.defaults.headers.common['authorization'] = localStorage.getItem('kmToken');
		EventSystem.publish('loginUpdated', this.logInfos);
	}

	logOut() {
		window.localStorage.removeItem('kmToken');
		this.logInfos = undefined;
		axios.defaults.headers.common['authorization'] = null;
		EventSystem.publish('loginUpdated', this.logInfos);
	}
}
export default Store;