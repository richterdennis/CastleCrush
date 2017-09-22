export default class Player extends Phaser.Sprite {
	constructor(game, name, x = 0, y = 0, key, leftSide = true, localPlayer = true) {
		super(game);
		this.castle = new Phaser.Sprite(game, 0, 0, key);
		this.castle.anchor.setTo(0.5, 1)

		Phaser.Sprite.call(this, game, x, y);
		this.resizeFrame(game, this.castle.width, this.castle.height);
		this.width = this.castle.width;
		this.height = this.castle.height;

		this.name = name;
		this.health = 30;
		this.maxHealth = this.health;
		this.shotAngle = -Math.PI / 2;
		this.shotPower = 400;
		this.leftSide = leftSide;
		this.isLocalPlayer = localPlayer;

		// add turret and wheel
		this.turret = new Phaser.Sprite(game, 0,-this.height+60, 'turret');
		this.wheel = new Phaser.Sprite(game,-50,-this.height+60, 'wheel');
		this.addChild(this.turret);
		this.addChild(this.wheel);
		this.addChild(this.castle);
		this.children.forEach(child => {
			game.physics.arcade.enable(child);
			child.body.allowGravity = false;
		});
		this.turret.anchor.setTo(0.5, 0.5);

		this.anchor.setTo(0.5, 1);
		if (!leftSide)
			this.scale.x *= -1;

		this.init();
	}

	init() {
		console.log(this.name + " was created");
		console.log(this.turret);
	}

	update() {
		this.turret.rotation = this.shotAngle;
	}

	takeDamage(damage) {
		this.health = this.game.math.clamp(this.health - damage, 0, this.maxHealth);
		return this.health;
	}

	isAlive() {
		return this.health > 0;
	}

	healthRatio() {
		return this.health / this.maxHealth;
	}

	toString() {
		let text = ''
		text += 'name: ' + this.name + '\n';
		text += 'health: ' + this.health + '\n';
		text += 'shotAngle: ' + this.game.math.radToDeg(this.shotAngle) + '\n';
		text += 'shotPower: ' + this.shotPower + '\n';
		return text;
	}
}