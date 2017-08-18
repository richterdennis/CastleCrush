import ViewManager from './views/ViewManager';

window.CustleCrush = {};

CustleCrush.CONST = {
	PAGE: {
		TITLE: 'Custle Crush'
	},
	DEFAULTS: {
		VIEW: 'home'
	}
};

CustleCrush.ViewManager = new ViewManager(document.querySelector('main#view'));
