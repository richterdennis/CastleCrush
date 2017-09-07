import HomeView from './HomeView';
import JoinView from './JoinView';
import StartView from './StartView';
import RoomView from './RoomView';
import WaitView from './WaitView';
import GameView from './GameView';

import NotfoundView from './NotfoundView';

export default class ViewManager {
	constructor() {
		this.viewWrapper = document.querySelector('main#view');
		this.errorWrapper = document.querySelector('aside#errorview');

		// Register all known views
		this.home = new HomeView();
		this.join = new JoinView();
		this.start = new StartView();
		this.room = new RoomView();
		this.wait = new WaitView();
		this.game = new GameView();

		this.not_found = new NotfoundView();
	}

	init() {
		if(location.hash == '')
			location.hash = '/';

		// Load the view given in the URL
		this.load(location.hash.substr(2).split('/')[0], true);

		// Check history back and forward to load the correct view
		window.addEventListener('popstate', event => {
		  this.load(location.hash.substr(2).split('/')[0], true);
		});
	}

	load(viewName = '', nohistory = false) {

		// Check if view exists
		if(!this[viewName || CastleCrush.CONST.DEFAULTS.VIEW])
			viewName = 'not_found';

		// Init the new view (load template etc.)
		this[viewName || CastleCrush.CONST.DEFAULTS.VIEW].init(this).then(view => {
			if(!view) return false;

			// Create the page title
			const title = CastleCrush.CONST.PAGE.TITLE
			  + (view.title ? ` - ${view.title}` : '');

			// Push the new view to the URL and the history
			if(!nohistory)
				history.pushState(null, title, `#/${viewName}`);

			// Set the page title
			document.title = title;

			// Remove the old view
			while(this.viewWrapper.firstChild) {
				this.viewWrapper.removeChild(this.viewWrapper.firstChild);
			}

			// Load the view
			view.show(this.viewWrapper);
		});
	}

	showError(error) {
		const errorEl = document.createElement('div');
		errorEl.classList.value = 'alert alert-danger';
		errorEl.innerHTML = error.message || error;
		errorEl.addEventListener('click', () => errorEl.remove());

		this.errorWrapper.appendChild(errorEl);
	}
}
