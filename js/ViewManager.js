import HomeView from './views/HomeView'

export default class ViewManager {
	constructor(target) {
		this.target = target;

		this.home = new HomeView();
	}

	load(viewName) {
		this[viewName].init().then(view => view.show(this.target));
	}
}
