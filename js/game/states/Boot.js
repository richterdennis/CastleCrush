export default class Boot extends Phaser.State {
	preload() {
		this.load.image('logo', 'public/assets/phaser.png');

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.aspectRatio = 16/9;

		// TODO: figure out a way to set target FPS to 30
		this.time.advancedTiming = true;
		this.time.desiredFps = 30;
	}

	create() {

		console.log('Bootstate loaded');
		const logo = this.add.sprite(
			this.world.centerX,
			this.world.centerY,
			'logo'
		);
		logo.anchor.setTo(0.5, 0.5);

		this.state.start('Stage');
	}
}
