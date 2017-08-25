export default class EventManager {
	constructor() {
		this.listener = {};
	}

	addEventListener(eventType, listener) {
		if(!this.listener[eventType])
			this.listener[eventType] = [];

		this.listener[eventType].push(listener);
	}

	dispatch(eventType, event) {
		if(!this.listener[eventType])
			return;

		this.listener[eventType].forEach(listener => listener(event));
	}
}

const EVENTS = {
	START_ROOM: 'start_room',
	JOIN_ROOM:  'join_room',
	START_GAME: 'start_game',
};

export { EventManager, EVENTS };
