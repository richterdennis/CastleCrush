import BootState from './states/Boot'
import StageState from './states/Stage'
import GameOverState from './states/GameOver'

export default class Game extends Phaser.Game {
	constructor(parentElement) {
		super(1920, 1080, Phaser.AUTO, parentElement);
		this.startGame();
	}

	startGame() {

		// Add states
		this.state.add('Boot', BootState, false);
		this.state.add('Stage', StageState, false);
		this.state.add('GameOver', GameOverState, false)

		// Start boot state
		this.state.start('Boot');
	}
}
