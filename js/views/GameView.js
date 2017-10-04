import View from './View';
import Game from '../game/Game';

export default class GameView extends View {
	constructor() {
		super();

		this.title = 'Game';
		this.templateUrl = 'templates/game';
	}

	afterInit() {
		new Game(this.find('#game'));
	}

	back(){
		return null;
	}
	
}
