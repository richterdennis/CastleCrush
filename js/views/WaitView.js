import { EVENTS } from '../EventManager';

import View from './View';

export default class WaitView extends View {
	constructor() {
		super();

		this.title = 'Wait';
		this.templateUrl = 'templates/wait';
	}

	afterInit() {
		CastleCrush.EventManager.addEventListener(EVENTS.START_GAME, (event) => {
			CastleCrush.ViewManager.load('game');
		});
	}

	ready() {
		const nickname = this.find('.nickname').value;
		CastleCrush.EventManager.dispatch(EVENTS.READY, {
			roomid: CastleCrush.GameManager.roomid,
			nickname: nickname
		});
		this.find('#wait').classList.add('ready');
	}
}
