export default class Boot extends Phaser.State {
	preload() {
		this.load.image('logo', 'public/assets/phaser.png');

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.aspectRatio = 16/9;
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
