export default class Boot extends Phaser.State {
	preload() {
		this.load.image('logo', 'public/assets/phaser.png');
	}

	create() {
		const logo = this.add.sprite(
			this.world.centerX,
			this.world.centerY,
			'logo'
		);
		logo.anchor.setTo(0.5, 0.5);
	}
}
