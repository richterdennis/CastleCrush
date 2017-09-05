export default class Player extends Phaser.Sprite {
	constructor(game, name, x = 0, y = 0) {
		super(game);

		Phaser.Sprite.call(this, game, x, y, 'tank');

		this.name = name;
		this.health = 10;
		this.power = 250;
		this.angle = 0;

		this.init();
	}

	init() {
		console.log(this.name + " was created");
	}

	toString() {
		return this.name + ', HP: ' + this.health;
	}
}