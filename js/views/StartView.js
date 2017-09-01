import helper from '../helper';
import { EVENTS } from '../EventManager';

import View from './View'

export default class StartView extends View {
	constructor() {
		super();

		this.title = 'Start';
		this.templateUrl = 'templates/start';
	}

	start() {
		const difficulty = this.find('#difficulty').value;
		const autoRestart = this.find('#auto-restart').checked;

		CastleCrush.EventManager.dispatch(EVENTS.START_ROOM, {
			roomid: helper.generateRand6(),
			difficulty: difficulty,
			autoRestart: autoRestart
		});

		CastleCrush.ViewManager.load('room');
	}
}
