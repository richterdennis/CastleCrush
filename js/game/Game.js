import BootState from './states/Boot'
import StageState from './states/Stage'

export default class Game extends Phaser.Game {
	constructor(parentElement) {
		super(1920, 1080, Phaser.AUTO, parentElement);

		this.preload();
	}

	preload() {

		// Add states
		this.state.add('Boot', BootState, false);
		this.state.add('Stage', StageState, false)

		// Start boot state
		this.state.start('Boot');
	}
}
