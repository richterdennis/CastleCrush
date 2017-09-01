export default {
	uuid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	}),

	generateRand6: () => 'xxxxxx'.replace(/[x]/g, (c) => {
		const r = Math.random() * 16 | 0;
		return r.toString(16);
	})
}
