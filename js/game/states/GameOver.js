export default class GameOver extends Phaser.State {
preload() {

	this.load.image('bg', 'public/assets/landscape.png');
	this.load.image('cb', 'public/assets/BurgBlau.png');
	this.load.image('cr', 'public/assets/BurgRot.png');
    this.load.spritesheet('rain', 'public/assets/rain.png', 17, 17);
    this.load.image('exit', 'public/assets/exit.png');

}

create() {
	// Font einlesen
	var font = {
			font: "50px Wendy One",
			fill: "#FFFFFF" 
		};

 	// Hintergrund einfügen, sowie Breite und Höhe einstellen
	this.background = this.add.image(0,0,'bg');
	this.background.height = this.world.height;
	this.background.width = this.world.width;

	// "Game Over"-Schriftzug einfügen, Schatten und Anchor einstellen
	this.gameOverText = this.add.text(this.world.centerX, 350, 'GAME OVER!', font);
	this.gameOverText.fontSize = '240px'
	this.gameOverText.setShadow(2, 2, 'rgba(0,0,0,0.8)', 4);
	this.gameOverText.anchor = new Phaser.Point(0.5, 1);

	// Exit Button
	// TO DO: Auf index.js verlinken
	this.button = this.add.button(1810, 50, 'exit', this.actionOnClick, this, 2, 1, 0);

	// Gewinner präsentieren, Schatten einstellen
	this.winnerText = this.add.text(this.world.centerX, this.world.height - 100, this.winner + ' hat gewonnen!', font);
	this.winnerText.setShadow(2, 2, 'rgba(0,0,0,0.8)', 4);
	this.winnerText.anchor = new Phaser.Point(0.5, 1);

	// Winner überprüfen und die jeweilige Burg als Sieger präsentieren
	if (this.winner == 'Rot'){
	this.redWinner =  this.add.image(this.world.centerX - 200, 500,'cr');
	this.redWinner.height = 400;
	this.redWinner.width = 400;
	}
	else if (this.winner == 'Blau'){
	this.blueWinner =  this.add.image(this.world.centerX - 200, 500,'cb');
	this.blueWinner.height = 400;
	this.blueWinner.width = 400;
	}
	else{
	this.blueWinner =  this.add.image((this.world.centerX/2), 500,'cb');
	this.blueWinner.height = 400;
	this.blueWinner.width = 400;
	this.redWinner =  this.add.image(((this.world.centerX/2)*3), 500,'cr');
	this.redWinner.height = 400;
	this.redWinner.width = 400;
	}

	// Emitter erstellen
 	var emitter = this.add.emitter(this.world.centerX, 0, 400);

 	// Emitter auf Weltbreite einstellen, Particle aus den Assets laden und Einstellungen festlegen
	emitter.width = this.world.width;
	emitter.makeParticles('rain');
	emitter.minParticleScale = 1;
	emitter.maxParticleScale = 3;
	emitter.setYSpeed(5, 25);
	emitter.setXSpeed(-5, 5);
	emitter.minRotation = 0;
	emitter.maxRotation = 0;

	// Emitter Starten
	emitter.start(false, 1600, 5, 0);
}

// OnClick Function deklarieren. TO DO: index.js aufrufen
actionOnClick(){
		this.game.state.start("Stage", true);
    }
}