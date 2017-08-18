import View from './View'

export default class HomeView extends View {
	constructor() {
		super();

		this.templateUrl = "templates/home";
	}

	join() {
		CustleCrush.ViewManager.load('join');
	}

	start() {
		console.log('start');
	}
}
