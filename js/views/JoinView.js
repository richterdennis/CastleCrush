import View from './View'

export default class JoinView extends View {
	constructor() {
		super();

		this.title = 'Join';
		this.templateUrl = 'templates/join';
	}

	afterInit() {
		this.scanner = new Instascan.Scanner({
			video: this.find('#scanner'),
			mirror: false
		});

		const clearCode = this.find('.clear-code');

		this.scanner.addListener('scan', function (content) {
			clearCode.value = content;
		});

		Instascan.Camera.getCameras()
			.then((cameras) => {
				const cameraSwitcher = this.find('.switch-camera');

				if(cameras.length > 0) {
					let i = 0;
					this.scanner.start(cameras[i++]);

					if(cameras.length > 1) {
						cameraSwitcher.addEventListener('click', () => {
							this.scanner.start(cameras[i++ % cameras.length]);
						});
					}
					else
						cameraSwitcher.style.display = 'none';
				}
				else {
					cameraSwitcher.style.display = 'none';
					console.error('No cameras found.');
				}
			})
			.catch(console.error);
	}

	join() {
		this.scanner.stop();
		const clearCode = this.find('.clear-code');
		CastleCrush.ViewManager.load('game');
	}
}
