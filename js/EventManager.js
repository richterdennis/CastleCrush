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
	 * @param  {string}   eventType  The event type
	 * @param  {object}   event      The event
	 * @param  {boolean}  doSend     Should the event send over network
	 */
	dispatch(eventType, event, doSend = true) {
		event.type      = event.type      || eventType;
		event.sender    = event.sender    || CastleCrush.CONST.CLIENT.ID;
		event.uuid      = event.uuid      || helper.uuid();
		event.timestamp = event.timestamp || Date.now();

		if(this.listener[eventType])
			this.listener[eventType].forEach(listener => listener(event));

		if([
		 	EVENTS.START_ROOM,
		 	EVENTS.JOIN_ROOM,
		 	EVENTS.LEAVE_ROOM,
		 	EVENTS.START_GAME,
		 	EVENTS.GAME_ACTION
		].includes(eventType) && doSend)
			CastleCrush.NetworkManager.send(event);
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
	START_ROOM:  'start_room',
	JOIN_ROOM:   'join_room',
	LEAVE_ROOM:  'leave_room',
	START_GAME:  'start_game',
	GAME_ACTION: 'game_action'
};

export { EventManager, EVENTS };
