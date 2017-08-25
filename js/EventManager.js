import helper from './helper'

/**
 * This class handles the event listeners and
 * provide a function to dispatch a event
 */
export default class EventManager {

	/**
	 * Default constructor
	 */
	constructor() {
		this.listener = {};
	}

	/**
	 * This function registers a listener for an event
	 *
	 * Sample:
	 *   CastleCrush.EventManager.addEventListener(EVENTS.START_GAME, handler);
	 *
	 * @param  {string}    eventType  The event type
	 * @param  {function}  listener   The listener
	 */
	addEventListener(eventType, listener) {
		if(!this.listener[eventType])
			this.listener[eventType] = [];

		this.listener[eventType].push(listener);
	}

	/**
	 * This function dispatches a event
	 *
	 * Sample:
	 *   CastleCrush.EventManager.dispatch(EVENTS.START_GAME, {});
	 *
	 * @param  {string}  eventType  The event type
	 * @param  {object}  event      The event
	 */
	dispatch(eventType, event) {
		if(!this.listener[eventType])
			return;

		event.type = eventType;
		event.uuid = helper.uuid();
		event.timestamp = Date.now();

		this.listener[eventType].forEach(listener => listener(event));
	}
}

/**
 * This constant represents the event types.
 *
 * To import it:
 *   import {EVENTS} from 'EventManager';
 *
 * @type {Object}
 */
const EVENTS = {
	START_ROOM: 'start_room',
	JOIN_ROOM:  'join_room',
	START_GAME: 'start_game',
};

export { EventManager, EVENTS };
