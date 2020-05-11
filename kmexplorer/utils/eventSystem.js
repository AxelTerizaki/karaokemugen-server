// Based on https://gist.github.com/simonberger/13d3a416cdf3e72b5a46b031a9fb997d
class EventSystem {
	constructor() {
		this.queue = {};
	}

	publish(event, data) {

		let queue = this.queue[event];

		if (typeof queue === 'undefined') {
			return false;
		}

		/*while (queue.length > 0) {
			(queue.shift())(data);
		}*/

		for (let listener of queue) {
			listener(data);
		}

		return true;
	}

	subscribe(event, callback) {
		if (typeof this.queue[event] === 'undefined') {
			this.queue[event] = [];
		}

		this.queue[event].push(callback);
	}

	//  the callback parameter is optional. Without it the whole event will be removed, instead of
	// just one subscibtion. Enough for simple implementations
	unsubscribe(event, callback) {
		let queue = this.queue;

		if (typeof queue[event] !== 'undefined') {
			if (typeof callback === 'undefined') {
				delete queue[event];
			} else {
				this.queue[event] = queue[event].filter(function(sub) {
					return sub !== callback;
				})
			}
		}
	}
}

export default new EventSystem();