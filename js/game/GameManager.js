import { EVENTS } from '../EventManager';

export default class GameManager {
	constructor() {
		this.state = 'initial';

		this.roomid = null;
		this.difficulty = -1;
		this.autoRestart = null;
		this.player1 = null;
		this.player2 = null;

		CastleCrush.EventManager.addEventListener(EVENTS.START_ROOM, (event) => {
			this.roomid = event.roomid;
			this.difficulty = event.difficulty;
			this.autoRestart = event.autoRestart;

			this.state = 'inroom';
		});

		CastleCrush.EventManager.addEventListener(EVENTS.JOIN_ROOM, (event) => {
			this.roomid = event.roomid;

			this.state = 'inroom';
		});

		CastleCrush.EventManager.addEventListener(EVENTS.START_GAME, (event) => {
			this.difficulty = event.difficulty;
			this.autoRestart = event.autoRestart;
			this.player1 = event.player1;
			this.player2 = event.player2;

			this.state = 'ingame';
		});
	}
}
