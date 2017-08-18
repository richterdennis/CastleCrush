import HomeView from './HomeView';
import JoinView from './JoinView';
import StartView from './StartView';
import GameView from './GameView';

import NotfoundView from './NotfoundView';

export default class ViewManager {
	constructor(target) {
		this.target = target;

		// Register all known views
		this.home = new HomeView();
		this.join = new JoinView();
		this.start = new StartView();
		this.game = new GameView();

		this.not_found = new NotfoundView();

		// Init URL bar and history
		this.init();
	}

	init() {
		if(location.hash == '')
			location.hash = '/';

		// Load the view given in the URL
		this.load(location.hash.substr(2), true);

		// Check history back and forward to load the correct view
		window.addEventListener('popstate', event => {
		  this.load(location.hash.substr(2), true);
		});
	}

	load(viewName = '', nohistory = false) {

		// Check if view exists
		if(!this[viewName || CustleCrush.CONST.DEFAULTS.VIEW])
			viewName = 'not_found';

		// Init the new view (load template etc.)
		this[viewName || CustleCrush.CONST.DEFAULTS.VIEW].init().then(view => {

			// Create the page title
			const title = CustleCrush.CONST.PAGE.TITLE
			  + (view.title ? ` - ${view.title}` : '');

			// Push the new view to the URL and the history
			if(!nohistory)
				history.pushState(null, title, `#/${viewName}`);

			// Set the page title
			document.title = title;

			// Remove the old view
			while(this.target.firstChild) {
				this.target.removeChild(this.target.firstChild);
			}

			// Load the view
			view.show(this.target);
		});
	}
}
