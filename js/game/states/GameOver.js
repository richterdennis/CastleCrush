export default class GameOver extends Phaser.State {
preload() {

	this.load.image('bg', 'public/assets/landscape.png');
	this.load.image('cb', 'public/assets/BurgBlau.png');
	this.load.image('cr', 'public/assets/BurgRot.png');
    this.load.spritesheet('rain', 'public/assets/rain.png', 17, 17);
    this.load.image('exit', 'public/assets/exit.png');
    this.load.image('konfettiRed', 'public/assets/KonfettiRot.png');
    this.load.image('konfettiBlue', 'public/assets/KonfettiBlau.png');
    this.load.image('konfettiYellow', 'public/assets/KonfettiGelb.png');

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
	this.winnerText = this.add.text(this.world.centerX, this.world.height - 100, this.name + ' hat gewonnen!', font);
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
	emitter.makeParticles(['konfettiRed', 'konfettiBlue', 'konfettiYellow']);
	emitter.minParticleScale = 0.3;
	emitter.maxParticleScale = 0.3;
	emitter.setYSpeed(125, 750);
	emitter.setXSpeed(-125, 125);
	emitter.minRotation = -90;
	emitter.maxRotation = 95;

	// Emitter Starten
	emitter.start(false, 1600, 5, 0);
}

// OnClick Function deklarieren. TO DO: index.js aufrufen
actionOnClick(){
		this.game.state.start("Stage", true);
    }
}