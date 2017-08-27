import EventManager from './EventManager';
import NetworkManager from './NetworkManager';
import ViewManager from './views/ViewManager';

window.CastleCrush = window.CastleCrush || {};

CastleCrush.CONST = {
	PAGE: {
		TITLE: 'Castle Crush'
	},
	DEFAULTS: {
		VIEW: 'home'
	}
};

CastleCrush.EventManager = new EventManager();
CastleCrush.NetworkManager = new NetworkManager();
CastleCrush.ViewManager = new ViewManager(document.querySelector('main#view'));
