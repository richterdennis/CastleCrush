export default class Player extends Phaser.Sprite {
	constructor(game, name, x = 0, y = 0, leftSide = true, localPlayer = true) {
		super(game);

		Phaser.Sprite.call(this, game, x, y, 'tank');

		this.name = name;
		this.health = 10;
		this.shotAngle = -90;
		this.shotPower = 400;
		this.leftSide = leftSide;
		this.localPlayer = localPlayer;

		this.anchor.setTo(0.5, 1);
		if (!leftSide)
			this.scale.x *= -1;

		this.init();
	}

	init() {
		console.log(this.name + " was created");
	}

	toString() {
		let text = ''
		text += 'name: ' + this.name + '\n';
		text += 'health: ' + this.health + '\n';
		text += 'shotAngle: ' + this.shotAngle + '\n';
		text += 'shotPower: ' + this.shotPower + '\n';
		return text;
	}
}