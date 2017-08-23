export default class Stage extends Phaser.State {
	init() {
		this.background = null;
		this.bullet = null;
		this.castle = null;
		this.cannon = null;

		// Player shooting Power and angle bounds
		this.minPower = 100;
		this.maxPower = 1000;
		this.minAngle = 10;
		this.maxAngle = 90

		// disable texture filtering
		this.game.renderer.renderSession.roundPixels = true;

		// set Arcade physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 200;


		// TODO: figure out a way to set target FPS to 30
		this.time.advancedTiming = true;
		this.time.desiredFps = 30;
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

		// create a bullet and add physics to it.
		// bullet does not exist in game when created. Shooting the bullet will
		// set it to exist.
		this.bullet = this.add.sprite(this.world.centerX,this.world.centerY,
			'bullet');
		this.bullet.exists = false;
		this.physics.arcade.enable(this.bullet);

		// create the 'castle'
		this.castle = this.add.sprite(50,this.world.height,'tank');
		this.castle.anchor.setTo(0.5,1);

		// create the cannon
		this.cannon = this.add.sprite(50, this.castle.y-this.castle.height,
			'turret');
		this.cannon.anchor.setTo(0,0.5);

		// DEBUG Create a FPS Counter in the top left corner
		this.fpsText = this.add.text(8, 8, 'FPS: 0', { font: "12px Arial",
			fill: "#ffffff" });
		this.powerText = this.add.text(8, 24, 'Power: 100', { font: "12px Arial",
			fill: "#ffffff" });
		this.angleText = this.add.text(8, 40, 'Angle: 10', { font: "12px Arial",
			fill: "#ffffff" });

		this.power = this.minPower;
		this.cannon.angle = -this.minAngle;
	}
	
	update() {
		this.playerInput();
		this.updateDebugText();
	}

	playerInput() {
		// TODO: Change to touch controls
		if (this.input.keyboard.isDown(Phaser.Keyboard.W) && 
			this.cannon.angle > -this.maxAngle) {
			this.cannon.angle -= 1;
		}
		else if (this.input.keyboard.isDown(Phaser.Keyboard.S) && 
			this.cannon.angle < -this.minAngle) {
			this.cannon.angle += 1;
		}
		if (this.input.keyboard.isDown(Phaser.Keyboard.D) && 
			this.power < this.maxPower) {
			this.power += 10;
		}
		else if (this.input.keyboard.isDown(Phaser.Keyboard.A) && 
			this.power > this.minPower) {
			this.power -= 10;
		}

		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.shooting();
		}
	}
	updateDebugText() {
		var fps = Math.round(1000 / this.time.elapsedMS);
		this.fpsText.text = 'FPS: ' + fps;

		this.powerText.text = 'Power: ' + this.power;
		this.angleText.text = 'Angle: ' + -this.cannon.angle;
	}

	shooting() {

		// return if a bullet exists. Ensures that only a single bullet can exist.
		if (this.bullet.exists) {
			//return;
		}
		this.bullet.reset(this.cannon.x, this.cannon.y);
		this.bullet.exists = true;

		var p = new Phaser.Point(this.cannon.x, this.cannon.y);
		p.rotate(p.x, p.y, this.cannon.rotation, false, this.cannon.width);

		this.physics.arcade.velocityFromRotation(this.cannon.rotation, this.power, this.bullet.body.velocity);
	}
	
}