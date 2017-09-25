export default class GameOver extends Phaser.State {
	preload() {
		this.load.image('bg', 'public/assets/landscape.png');
		this.load.image('gameover', 'public/assets/gameover.png');
		this.load.image('playagain', 'public/assets/play.png');}
 
  	create(){
  		console.log("GameOver loaded.");
                // Hintergrundbild hinzufügen
		var bg = this.game.add.image(0,0, "bg");

                // GameOver-Bild anzeigen
  		var gameOverTitle = this.game.add.sprite(160,200,"gameover");
		gameOverTitle.anchor.setTo(0.5,0.5);

                // Play Again Button anzeigen
		var playagainButton = this.game.add.button(160,320,"playagain",this.playTheGame,this);
		playagainButton.anchor.setTo(0.5,0.5);
 
	}
		
	
	playTheGame(){
                // Wurde der Schalter gedrück, wird das Spiel neu gestartet
		this.game.state.start("Stage");
	}
}