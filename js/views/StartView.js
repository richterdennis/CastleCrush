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

    CastleCrush.ViewManager.load('room');
  }
}
