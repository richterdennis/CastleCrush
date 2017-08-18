import HomeView from './HomeView';
import JoinView from './JoinView';

export default class ViewManager {
	constructor(target) {
		this.target = target;

		this.home = new HomeView();
		this.join = new JoinView();

		this.load('home');
	}

	load(viewName) {
		this[viewName].init().then(view => {

			// First remove all Childs
			while(this.target.firstChild) {
				this.target.removeChild(this.target.firstChild);
			}

			// Then load the view into it
			view.show(this.target);
		});
	}
}
