export default {
	save(data) {
		return new Promise(resolve => {
			window.chrome.storage.sync.set(data, resolve);
		});
	},
	get(key) {
		return new Promise(resolve => {
			window.chrome.storage.sync.get(key, resolve);
		});
	},
};
