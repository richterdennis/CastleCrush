import { EVENTS } from '../../EventManager';
import PlayerSprite from '../Player.js'
import Bar from '../Bar.js'

const GAMESTATES = {
	WAITING: 'waiting',
	INPUT: 'input',
	INFLIGHT: 'inflight',
	CHECKSTATE: 'checkstate',
	BETWEENTURN: 'betweenturn',
	GAMEOVER: 'gameover'
};

const DIFFICULTY_WIND_MULTIPLIER = 50;
const GRAVITY = 500;
const SHOT_CANCEL_DISTANCE = 200;
const DEFAULT_DELAY = 1;

const DEBUG = true;
const DEBUGPHYSICS = false;

export default class Stage extends Phaser.State {

	preload() {
		var WebFontConfig = {

		    //  'active' means all requested fonts have finished loading
		    //  We set a 1 second delay before calling 'createText'.
		    //  For some reason if we don't the browser cannot render the text the first time it's created.
		    active: function() { console.log("Google Webfont loaded!"); },

		    //  The Google Fonts we want to load (specify as many as you like in the array)
		    google: {
		      families: ['Revalia']
		    }

		};
		// TODO: Fontloading
		this.load.script('webfont', 'http://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		// preload assets
		this.load.image('background', 'public/assets/background_sky.png');
		this.load.image('tank', 'public/assets/tanks_tankGrey_body5.png');
		this.load.image('castle_blue', 'public/assets/BurgBlau.png');
		this.load.image('castle_red', 'public/assets/BurgRot.png');
		this.load.image('turret', 'public/assets/Kanone.png');
		this.load.image('bullet', 'public/assets/cannonball.png');
		this.load.image('land', 'public/assets/land.png');
		this.load.image('landscape', 'public/assets/landscape.png');
		this.load.image('arrow', 'public/assets/tank_arrowFull.png');
		this.load.image('wheel', 'public/assets/Rad.png');

		this.load.audio('sound_shot', 'public/assets/shot.wav');
		this.load.audio('sound_explosion', 'public/assets/explosion.wav');

	}

	init() {
		this.eventsReceived = 0;
		this.gameActionListener = CastleCrush.EventManager.addEventListener(
			EVENTS.GAME_ACTION, (event) => {
				this.eventsReceived ++;

				console.log(event.action);
				if (this.gamestate === GAMESTATES.INPUT) 
				{
					if (event.action === 'shot')
					{
						console.log('Netzwerkschuss:');
	
						this.currentPlayer.shotAngle = event.angle;
						this.currentPlayer.shotPower = event.power;
						this.shooting();
					}
				}

			});

		this.gamestate = GAMESTATES.WAITING;

		this.background = null;
		this.bullet = null;
		this.land = null;
		this.arrow = null;

		this.blastRadius = 50;

		// Player shooting Power and angle bounds
		this.minPower = 300;
		this.maxPower = 1200;
		this.minAngle = -Math.PI;
		this.maxAngle = 0;

		// disable texture filtering
		this.game.renderer.renderSession.roundPixels = true;
		
		// TODO: Hardcoded values need to be changed to values received from server
		this.distanceFromSide = 300;
		this.distanceFromBottom = 300;
		this.players = []
		this.playerTurn = 0;
		this.currentPlayer;

		this.manager = CastleCrush.GameManager;
		this.options = {
			difficulty: this.manager.difficulty,
			players: [this.manager.player1, this.manager.player2]
		};
		console.log("Game started with options: \n", this.options);
		this.maxWindPower = Math.abs(this.options.difficulty) * DIFFICULTY_WIND_MULTIPLIER;

		// set Arcade physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = GRAVITY;
		this.physics.arcade.gravity.x = this.rnd.integerInRange(-this.maxWindPower, this.maxWindPower);
	}

	create() {
		console.log("Stage loaded.");

		// set background image and scale it to the screensize
		this.background = this.add.image(0,0,'landscape');
		this.background.height = this.world.height;
		this.background.width = this.world.width;

		// create a bullet and add physics to it.
		// bullet does not exist in game when created. Shooting the bullet will
		// set it to exist.
		this.bullet = this.add.sprite(this.world.centerX,this.world.centerY,
			'bullet');
		this.bullet.exists = false;
		this.bullet.anchor.setTo(0.5,0.5);
		this.bullet.scale.setTo(0.15);
		this.physics.arcade.enable(this.bullet);

		// DEBUG Create a FPS Counter in the top left corner
		this.fpsText = this.add.text(8, 8, '', { font: "24px Arial",
			fill: "#000000" });
		this.windText = this.add.text(8, 36, '', { font: "24px Arial",
			fill: "#000000" });
		this.debugText = this.add.text(8, 64, '', { font: "24px Arial",
			fill: "#000000" });
		

		// Creates land bitmap data, scales it relative to the world size and 
		// draws it on screen
		this.land = this.add.bitmapData(1920, 1080);
		this.land.draw('land');
		this.land.update();
		this.landScaling = this.world.width / this.land.width; // assumes 16:9

		// Convert to sprite to enable collision detection
		this.landSprite = this.add.sprite(0,0, this.land);
		this.landSprite.scale.setTo(this.landScaling);
		console.log("Added land with scaling: ", this.landScaling);
		
		// Indicator arrow
		this.arrow = this.add.image(0,10, 'arrow')
		this.arrow.anchor.setTo(1,0.5);
		this.arrow.scale.setTo(this.landScaling);
		this.arrow.angle = -90;
		this.arrow.exists = false;

		// Create the players and put them into position
		this.players = [
			new PlayerSprite(
				this.game,
				this.options.players[0], 
				this.distanceFromSide,
				this.world.height - this.distanceFromBottom,
				'castle_blue'
			),
			new PlayerSprite(
				this.game,
				this.options.players[1],
				this.world.width - this.distanceFromSide,
				this.world.height - this.distanceFromBottom,
				'castle_red',
				false
			)
		];
		this.players.forEach((player) => {
			player.scale.setTo(0.6 * this.landScaling);
			this.physics.arcade.enable(player);
			this.add.existing(player);
			player.body.setSize(player.castle.width, player.castle.height-110, 0, 110);
			player.body.allowGravity = false;
		})
		
		this.currentPlayer = this.players[0];

		// line display for touch controls
		this.lastState = false;
		this.pLine = new Phaser.Line();
		this.gLine = this.add.graphics(0,0);
		this.gLine.lineStyle(3, 0x0000ff, 1);

		var font = {
			font: "50px Wendy One",
			fill: "#FFFFFF" 
		};

		this.shotInfoText = this.add.text(-100, -100, '', font);
		this.shotInfoText.setShadow(2, 2, 'rgba(0,0,0,0.8)', 4);
		this.shotInfoText.anchor = new Phaser.Point(1,1);
		this.gameInfoText = this.add.text(this.world.centerX, this.world.height - 150, 'Hallo Welt', font);
		this.gameInfoText.setShadow(6, 6, 'rgba(0,0,0,0.8)', 4);
		this.gameInfoText.anchor = new Phaser.Point(0.5, 1);
		this.gameInfoText.fontSize = '84px';
		this.windInfoText = this.add.text(this.world.centerX, this.world.height -50, '<>wind: x m/s', font);
		this.windInfoText.setShadow(2, 2, 'rgba(0,0,0,0.8)', 4);
		this.windInfoText.anchor = new Phaser.Point(0.5, 1);

		this.healthBars = [	
			new Bar(this.game, this.players[0].x-150, this.world.height-100, 300, 20),
			new Bar(this.game, this.players[1].x-150, this.world.height-100, 300, 20)
		];

		this.healthBars.forEach((bar) => {
			this.add.existing(bar);
		});

		this.sound.volume = 0.05;
		this.sound.add('sound_shot');
		this.sound.add('sound_explosion');

		this.proceedToStateInSeconds(GAMESTATES.INPUT, 0, this.currentPlayer.name + " ist an der Reihe!");
		this.updateWindInfoText();
	}
	
	update() {
		if (DEBUG) {
			this.updateDebugText();
		}
		if (DEBUGPHYSICS)
		{
			this.game.debug.body(this.players[0]);
			this.game.debug.body(this.players[1]);
			this.game.debug.body(this.bullet);
		}
		switch (this.gamestate) {
			case GAMESTATES.WAITING:
				break;

			case GAMESTATES.INPUT:
				this.indicateCurrentPlayer();
				this.playerInput();
				break;

			case GAMESTATES.INFLIGHT:
				this.bulletVsLand();
				this.physics.arcade.overlap(this.bullet, this.players, this.bulletHitsCastle, null, this);
				break;

			case GAMESTATES.BETWEENTURN:
				// recalculate wind check gameoverstate
				this.physics.arcade.gravity.x = 0;//this.rnd.integerInRange(-this.maxWindPower, this.maxWindPower);
				this.playerTurn = (this.playerTurn + 1) % this.players.length;
				console.log('Next Player: ' + this.playerTurn);
				this.currentPlayer = this.players[this.playerTurn];
				this.updateWindInfoText();
				var text = this.currentPlayer.name + " ist an der Reihe!";
				this.proceedToStateInSeconds(GAMESTATES.INPUT, .5, text);
				break;

			case GAMESTATES.CHECKSTATE:
				if (this.players.every(p => p.isAlive()))
					this.gamestate = GAMESTATES.BETWEENTURN;
				else this.proceedToStateInSeconds(GAMESTATES.GAMEOVER, 3, "GAME OVER!");
				break;

			case GAMESTATES.GAMEOVER:
				console.log('Game Over');
				CastleCrush.EventManager.removeEventListener(
					EVENTS.GAME_ACTION,
					this.gameActionListener
				);
				this.state.start('Boot'); // TODO Change to Game Over Screen Stage
				break;
		}
	}

	playerInput() {
		var pointer = this.input.activePointer;

		if (pointer.isDown && !this.lastState) // Pointer went down
		{
			// set pointer start to current pointer position
			this.pLine.start = new Phaser.Point(pointer.x, pointer.y);
			console.log("Pointer just went down");
		}
		else if (pointer.isDown && this.lastState) // Pointer is down
		{
			console.log("Pointer held");

			this.pLine.end = new Phaser.Point(pointer.x, pointer.y);
			this.validShot = this.pLine.length > SHOT_CANCEL_DISTANCE 
				&& (this.pLine.angle >= this.minAngle && this.pLine.angle <= this.maxAngle);
			var lineColor = (this.validShot) ? 0x0000FF : 0xFF0000;

			this.gLine.clear();
			this.gLine.lineStyle(6, lineColor, 1);
			this.gLine.moveTo(this.pLine.start.x, this.pLine.start.y);
			this.gLine.lineTo(this.pLine.end.x, this.pLine.end.y);

			this.currentPlayer.shotAngle = this.math.clamp(this.pLine.angle, this.minAngle, this.maxAngle);
			this.currentPlayer.shotPower = this.math.clamp(this.pLine.length*1.5, this.minPower, this.maxPower);

			this.updateShotInfoDisplay();
		}
		else if(!pointer.isDown && this.lastState) // Pointer went up
		{
			this.gLine.clear();
			console.log("Pointer just went up");

			if (this.validShot && CastleCrush.CONST.CLIENT.ID === this.currentPlayer.player.device)
			{
				CastleCrush.EventManager.dispatch(EVENTS.GAME_ACTION, {
					roomid: CastleCrush.GameManager.roomid,
					action: 'shot',
					angle: this.currentPlayer.shotAngle,
					power: this.currentPlayer.shotPower
				});
				this.shooting();
			}
			this.shotInfoText.text = '';
		}
		this.lastState = pointer.isDown;
	}

	updateShotInfoDisplay() {
		this.shotInfoText.text = Math.round(Math.abs(this.math.radToDeg(this.currentPlayer.shotAngle)))
				+ "°, " + Math.round(this.currentPlayer.shotPower / this.maxPower * 100) + "%";
		var p = this.input.activePointer.position;
		this.shotInfoText.position = new Phaser.Point(p.x-25, p.y);
	}

	updateDebugText() {
		var fps = Math.round(1000 / this.time.elapsedMS);
		this.fpsText.text = 'FPS: ' + fps;

		this.windText.text = 'Wind: ' + this.physics.arcade.gravity.x;

		this.debugText.text = 'Current State: ' + this.gamestate + '\n';
		this.debugText.text += 'PLAYER DEBUG INFO:\n' + this.currentPlayer.toString();
		this.debugText.text += 'Cursor: ' + this.input.activePointer.position + '\n';
		this.debugText.text += 'Cursor Time: ' + this.input.activePointer.previousTapTime + '\n';
		this.debugText.text += 'Events R: ' + this.eventsReceived;
	}

	shooting() {

		// return if a bullet exists. Ensures that only a single bullet can exist.
		if (this.bullet.exists) {
			return;
		}
		this.bullet.reset(this.currentPlayer.turret.worldPosition.x, this.currentPlayer.turret.worldPosition.y);
		this.bullet.exists = true;

		console.log(this.currentPlayer.height);
		var p = new Phaser.Point(this.currentPlayer.x, this.currentPlayer.y-this.currentPlayer.height);

		// FIXME: direction
		var rotation = this.currentPlayer.shotAngle;
		console.log(this.currentPlayer.leftSide, 'rotation: ' + rotation);
		p.rotate(p.x, p.y, rotation, false, 0); // FIXME

		// Add a force to the bullet
		this.physics.arcade.velocityFromRotation(rotation, this.currentPlayer.shotPower,
			this.bullet.body.velocity);

		// And rotate the bullet towards its current velocity vector
		this.bullet.rotation = this.bullet.body.angle;

		this.sound.play('sound_shot');
		this.proceedToStateInSeconds(GAMESTATES.INFLIGHT, 0, '');
	}

	bulletHitsCastle(bullet, player) {
		var damage = 10; // TODO: dynamic damage values?
		var pIndex = this.players.indexOf(player);

		this.explode();
		this.removeBullet();
		player.takeDamage(damage);
		this.healthBars[pIndex].setValueTo(player.healthRatio());

		console.log(player.name + " was hit for " + damage + " damage!");
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
			this.arrow.y = 20;
			this.arrow.rotation = -Math.PI / 2;
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
			this.land.circle(x,y, this.blastRadius / this.landScaling, 'rgba(0,0,0,255)');
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
		this.sound.play('sound_explosion');
	}
	removeBullet() {
		console.log('bullet removed');
		this.bullet.exists = false;
		this.arrow.exists = false;
		this.gamestate = GAMESTATES.CHECKSTATE;
	}	

	proceedToState(nextState) {
		this.gamestate = nextState;
	}

	proceedToStateInSeconds(nextState, seconds, infoText = null) {
		console.log("proceeding to state " + nextState + " in " + seconds + " seconds.");
		if (infoText !== null) this.gameInfoText.text = infoText;

		this.gamestate = GAMESTATES.WAITING;
		if (seconds !== 0)
			this.time.events.add(Phaser.Timer.SECOND * seconds, this.proceedToState, this, nextState);
		else
			this.proceedToState(nextState);
	}

	indicateCurrentPlayer() {
		this.arrow.exists = true;
		this.arrow.x = this.currentPlayer.x;
		var sin = Math.sin(this.time.now/150)*20;
		this.arrow.y = this.currentPlayer.y-this.currentPlayer.height + sin - 90;
		this.arrow.rotation = Math.PI / 2;
	}

	updateWindInfoText() {
		var wind = this.physics.arcade.gravity.x;
		var noWind = wind === 0;
		var text = '';

		if (noWind) 
			text = 'Kein Wind';
		else {
			text = wind > 0 ? 'Westwind: ' : 'Ostwind: ';
			text += Number(Math.abs(wind) / 10).toFixed(1) + 'm/s';
		}
		this.windInfoText.text = text;
	}
}