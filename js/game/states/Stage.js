import Player from '../Player.js'

export default class Stage extends Phaser.State {
	init() {
		this.background = null;
		this.bullet = null;
		this.cannon = null;
		this.land = null;
		this.arrow = null;

		this.blastRadius = 15;

		// Player shooting Power and angle bounds
		this.minPower = 250;
		this.maxPower = 1000;
		this.minAngle = 10;
		this.maxAngle = 90;
		// this.minAngle = 0;
		// this.maxAngle = 360;

		// disable texture filtering
		this.game.renderer.renderSession.roundPixels = true;

		// set Arcade physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 300;
		this.physics.arcade.gravity.x = 0;

		
		// TODO: Hardcoded values need to be changed to values received from server
		this.distanceFromSide = 200;
		this.distanceFromBottom = 215;
		this.players = []
		this.playerTurn = 0;
		this.currentPlayer;

		this.gameStates = ['Input', 'Flight', 'Damage'];
		this.turnLengthInMS = 30000;

		this.manager = CastleCrush.GameManager;
		this.options = {
			difficulty: this.manager.difficulty,
			players: [this.manager.player1, this.manager.player2]
		};
		console.log("Game started with options: \n", this.options);

		this.maxWindPower = Math.abs(this.options.difficulty) * 50;
		console.log(this.maxWindPower);
	}

	preload() {

		// preload assets
		this.load.image('background', 'public/assets/background_sky.png');
		this.load.image('tank', 'public/assets/tanks_tankGrey_body5.png');
		this.load.image('turret', 'public/assets/tanks_turret3.png');
		this.load.image('bullet', 'public/assets/tank_bullet2.png');
		this.load.image('land', 'public/assets/land.png');
		this.load.image('arrow', 'public/assets/tank_arrowFull.png');
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
		this.bullet.anchor.setTo(1,0.5);
		this.physics.arcade.enable(this.bullet);

		// DEBUG Create a FPS Counter in the top left corner
		this.fpsText = this.add.text(8, 8, 'FPS: 0', { font: "12px Arial",
			fill: "#ffffff" });
		this.powerText = this.add.text(8, 24, 'Power: 100', { font: "12px Arial",
			fill: "#ffffff" });
		this.angleText = this.add.text(8, 40, 'Angle: 10', { font: "12px Arial",
			fill: "#ffffff" });
		this.debugText = this.add.text(8, 56, '', { font: "12px Arial",
			fill: "#ffffff" });

		// Creates land bitmap data, scales it relative to the world size and 
		// draws it on screen
		this.land = this.add.bitmapData(1920, 1080);
		this.land.draw('land');
		this.land.update();
		this.landScaling = this.world.width/ this.land.width; // assumes 16:9
		this.land.addToWorld(0,0,0,0, this.landScaling, this.landScaling);
		
		// Indicator arrow
		this.arrow = this.add.image(0,10, 'arrow')
		this.arrow.anchor.setTo(1,0.5);
		this.arrow.width = 0.5 * this.arrow.width;
		this.arrow.height = 0.5 * this.arrow.height;
		this.arrow.angle = -90;
		this.arrow.exists = false;

		// Create the players and put them into position
		this.players = [
			new Player(
				this.game,
				'Hans', this.distanceFromSide,
				this.world.height - this.distanceFromBottom
			),
			new Player(
				this.game,
				'Peter',
				this.world.width - this.distanceFromSide,
				this.world.height - this.distanceFromBottom, false
			)
		];
		this.add.existing(this.players[0]);
		this.add.existing(this.players[1]);
		
		this.currentPlayer = this.players[0];


		// TODO remove hardcoding and add cannon to Player Object
		// create the cannon
		this.cannon = this.add.sprite(this.players[0].x , this.players[0].y-this.players[0].height,
			'turret');
		this.cannon.anchor.setTo(-0.1, 0);

		// Initialize power and angle values as their minvalues
		this.power = this.minPower;
		this.cannon.angle = -this.minAngle;

	}
	
	update() {
		this.playerInput();
		this.updateDebugText();

		if (this.bullet.exists) {
			
			this.bulletVsLand();
		} 
	}

	playerInput() {
		// TODO: Change to touch controls
		if (this.input.keyboard.isDown(Phaser.Keyboard.W) && 
			this.currentPlayer.shotAngle > -this.maxAngle) {
			this.currentPlayer.shotAngle -= 1;
		}
		else if (this.input.keyboard.isDown(Phaser.Keyboard.S) && 
			this.currentPlayer.shotAngle < -this.minAngle) {
			this.currentPlayer.shotAngle += 1;
		}
		if (this.input.keyboard.isDown(Phaser.Keyboard.D) && 
			this.currentPlayer.shotPower < this.maxPower) {
			this.currentPlayer.shotPower += 10;
		}
		else if (this.input.keyboard.isDown(Phaser.Keyboard.A) && 
			this.shotPower > this.minPower) {
			this.shotPower -= 10;
		}

		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.shooting();
		}


	}
	updateDebugText() {
		var fps = Math.round(1000 / this.time.elapsedMS);
		this.fpsText.text = 'FPS: ' + fps;

		this.powerText.text = 'Power: ' + this.currentPlayer.shotPower;
		this.angleText.text = 'Angle: ' + -this.currentPlayer.shotAngle;
		this.debugText.text = 'current: ' + this.currentPlayer.toString();
	}

	shooting() {

		// return if a bullet exists. Ensures that only a single bullet can exist.
		if (this.bullet.exists) {
			return;
		}
		this.bullet.reset(this.currentPlayer.x, this.currentPlayer.y);
		this.bullet.exists = true;

		var p = new Phaser.Point(this.currentPlayer.x, this.currentPlayer.y);

		// FIXME: direction
		var rotation = this.math.degToRad(this.currentPlayer.shotAngle);
		console.log(this.currentPlayer.leftSide, 'c_rotation: ' + this.cannon.rotation + ', rotation: ' + rotation);
		p.rotate(p.x, p.y, this.cannon.rotation, false, this.cannon.width);

		// Add a force to the bullet
		this.physics.arcade.velocityFromRotation(rotation, this.power,
			this.bullet.body.velocity);

		// And rotate the bullet towards its current velocity vector
		this.bullet.rotation = this.bullet.body.angle;
	}

	bulletVsLand() {
		// if bullet flies offscreen destroy it and return out of this function
		if (this.bullet.x < 0 || this.bullet.x > this.game.world.width 
			|| this.bullet.y > this.game.height)
		{
   		this.removeBullet();
    		return;
		} // unless it flies above the sky show arrow to indicate horizontal position
		else if (this.bullet.y < -10) {
			this.arrow.exists = true;
			this.arrow.x = this.bullet.x;
		} // remove the indicator when the bullet reenters the screen
		else if (this.arrow.exists) this.arrow.exists = false;

		// Turn bullet towards its velocity's vector
		this.bullet.rotation = this.bullet.body.angle;

		// Get the rgba value of the land at the bullets current position
		var x = Math.floor(this.bullet.x / this.landScaling);
		var y = Math.floor(this.bullet.y / this.landScaling);
		var alpha = this.land.getPixel(x,y).a;
 
		if (alpha > 0) {
			// land is visible

			// Carve out a circular shape with set radius 
			this.land.blendDestinationOut();
			this.land.circle(x,y, 20 / this.landScaling, 'rgba(0,0,0,255)');
			this.land.blendReset();
			this.land.update();
			this.land.dirty = true;

			this.explode();
			this.removeBullet();
		}
	}
	
	explode() {
		let p = new Phaser.Point(this.bullet.x, this.bullet.y);
		console.log("Land was hit at: ", p);
	}
	removeBullet() {
		console.log('bullet removed');
		this.bullet.exists = false;
		this.arrow.exists = false;

		// TODO: Set next player as currentPlayer
		this.playerTurn = (this.playerTurn + 1) % this.players.length;
		console.log('Next Player: ' + this.playerTurn);
		this.currentPlayer = this.players[this.playerTurn];
	}

}