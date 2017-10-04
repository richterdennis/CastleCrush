import View from './View'

export default class HomeView extends View {
	constructor() {
		super();

		this.title = 'Home';
		this.templateUrl = 'templates/home';
	}

	join() {
		CastleCrush.ViewManager.load('join');
	}

	start() {
		CastleCrush.ViewManager.load('start');
	}

	back(){
		return null;
	}
}
