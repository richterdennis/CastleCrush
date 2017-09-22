const LIGHTGRAY = 0x999999;
const RED = 0xFF0000;
const GRAY = 0x333333;

export default class Bar extends Phaser.Sprite {

	constructor(game, x, y, width, height) {
		super(game);
		Phaser.Sprite.call(this, game, x, y);

		this.g = game.add.graphics(x, y);
		this.value = 1;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.lifeWidth = new Phaser.Rectangle(0, 0, width, 0);
	}

	update() {
		this.g.clear();

		// background
		this.g.lineStyle(0, LIGHTGRAY, 0)
		this.g.beginFill(GRAY);
		this.g.drawRect(0, 0, this.width, this.height);
		this.g.endFill();

		// fill
		this.g.beginFill(RED);
		this.g.drawRect(0, 0, this.lifeWidth.width, this.height);
		this.g.endFill();

		// then draw the frame on top;
		this.g.lineStyle(3, LIGHTGRAY);
		this.g.drawRect(0,0, this.width, this.height);
	}

	setValueTo(value) {
		var newValue = this.game.math.clamp(value, 0, 1);
		this.value = value;
		console.log('value: ' + value);
		
		this.lerp = this.game.add.tween(this.lifeWidth).to( { width: newValue*this.width }, 300, Phaser.Easing.Linear.None, true);
	}
}