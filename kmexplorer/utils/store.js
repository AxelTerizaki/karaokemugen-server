import EventEmmiter from 'events';
import axios from 'axios';
import { parseJwt } from './tools';

class Store extends EventEmmiter {
	constructor() {
		super();
		const logInfos = JSON.parse(window.localStorage.getItem('kmToken'));
		if (logInfos) {
			console.log(logInfos);
			this.logInfos = parseJwt(logInfos.token);
			this.logInfos.token = logInfos.token;
			console.log(this.logInfos);
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
		this.logInfos.token = logInfos.token;
		window.localStorage.setItem('kmToken', JSON.stringify(logInfo));
		axios.defaults.headers.common['authorization'] = localStorage.getItem('kmToken');
		this.emit('loginUpdated');
	}

	logOut() {
		window.localStorage.removeItem('kmToken');
		this.logInfos = undefined;
		axios.defaults.headers.common['authorization'] = null;
		this.emit('loginOut');
	}
}
export default Store;