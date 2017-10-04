import { EVENTS } from '../EventManager';

import View from './View';

export default class WaitView extends View {
	constructor() {
		super();

		this.title = 'Wait';
		this.templateUrl = 'templates/wait';
	}

	setPlayer(playerId) {
		this.playerId = playerId;
	}

	ready() {
		const nickname = this.find('.nickname').value;
		CastleCrush.EventManager.dispatch(EVENTS.READY, {
			roomid: CastleCrush.GameManager.roomid,
			nickname: nickname,
			playerId: this.playerId
		});
		this.find('#wait').classList.add('ready');
	}
	
	back(){
		return () => {
			CastleCrush.ViewManager.load('home');
		}
	}
}
