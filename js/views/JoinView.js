import View from './View'

export default class JoinView extends View {
	constructor() {
		super();

		this.title = 'Join';
		this.templateUrl = 'templates/join';
	}

  join() {
    CastleCrush.ViewManager.load('game');
  }
}
