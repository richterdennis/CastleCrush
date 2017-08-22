export default class Stage extends Phaser.State {
	init() {
		this.background = null;
		this.bullet = null;
		this.castle = null;
		this.cannon = null;

		// disable texture filtering
		this.game.renderer.renderSession.roundPixels = true;

		// set Arcade physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 200;
	}

	preload() {

		// preload assets
		this.load.image('background', 'public/assets/background_sky.png');
		this.load.image('tank', 'public/assets/tanks_tankGrey_body5.png');
		this.load.image('turret', 'public/assets/tanks_turret3.png');
		this.load.image('bullet', 'public/assets/tank_bullet2.png');
	}

	create() {
		console.log("Stage loaded.");

		// set background image and scale it to the screensize
		this.background = this.add.image(0,0,'background');
		this.background.height = this.world.height;
		this.background.width = this.world.width;

		// create a bullet and add physics
		this.bullet = this.add.sprite(this.world.centerX,this.world.centerY, 'bullet');
		// this.bullet.exists = false;
		this.physics.arcade.enable(this.bullet);

		// create the 'castle'
		this.castle = this.add.sprite(50,this.world.height,'tank');
		this.castle.anchor.setTo(0.5,1);

		// create the cannon
		this.cannon = this.add.sprite(50, this.castle.y-this.castle.height, 'turret');
		this.cannon.anchor.setTo(0,1);

	}
	
	update() {

	}
}