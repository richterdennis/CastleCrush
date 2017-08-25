import EventManager from './EventManager';
import ViewManager from './views/ViewManager';

window.CastleCrush = {};

CastleCrush.CONST = {
	PAGE: {
		TITLE: 'Castle Crush'
	},
	DEFAULTS: {
		VIEW: 'home'
	}
};

CastleCrush.EventManager = new EventManager();
CastleCrush.ViewManager = new ViewManager(document.querySelector('main#view'));
