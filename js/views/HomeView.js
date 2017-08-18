import View from './View'

export default class HomeView extends View {
	constructor() {
		super();

		this.title = 'Home';
		this.templateUrl = 'templates/home';
	}

	join() {
		CustleCrush.ViewManager.load('join');
	}

	start() {
		CustleCrush.ViewManager.load('start');
	}
}
