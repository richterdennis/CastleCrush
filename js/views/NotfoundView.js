import View from './View'

export default class NotfoundView extends View {
	constructor() {
		super();

		this.title = '404';
		this.templateUrl = 'templates/404';
	}
	
	back(){
		return () => {
			CastleCrush.ViewManager.load('home');
		}
	}
}
