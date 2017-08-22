import BootState from './states/Boot'
import StageState from './states/Stage'

export default class Game extends Phaser.Game {
	constructor(parentElement) {
		super(1280, 720, Phaser.AUTO, parentElement);

		// Add states
		this.state.add('Boot', BootState, false);
		this.state.add('Stage', StageState, false)

		// Start boot state
		this.state.start('Stage');
	}
}
