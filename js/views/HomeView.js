import View from './View'

export default class HomeView extends View {
	constructor() {
		super();

		this.templateUrl = "templates/home";
	}

	start() {
		console.log('start');
	}

	join() {
		console.log('join');
	}
}
