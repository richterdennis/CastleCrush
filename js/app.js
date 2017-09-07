import helper from './helper';

import EventManager from './EventManager';
import NetworkManager from './NetworkManager';
import GameManager from './game/GameManager';
import ViewManager from './views/ViewManager';

window.CastleCrush = {};

CastleCrush.CONST = {
	CLIENT: {
		ID: helper.uuid()
	},
	PAGE: {
		TITLE: 'Castle Crush'
	},
	DEFAULTS: {
		VIEW: 'home'
	}
};

CastleCrush.EventManager = new EventManager();
CastleCrush.GameManager = new GameManager();
CastleCrush.ViewManager = new ViewManager();
CastleCrush.NetworkManager = new NetworkManager();
CastleCrush.NetworkManager
  .init()
  .catch(e => CastleCrush.ViewManager.showError(e));
