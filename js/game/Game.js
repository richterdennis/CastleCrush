import BootState from './states/Boot'

export default class Game extends Phaser.Game {
	constructor(parentElement) {
		super(800, 600, Phaser.AUTO, parentElement);

		// Add states
		this.state.add('Boot', BootState, false);

		// Start boot state
		this.state.start('Boot');
	}
}
