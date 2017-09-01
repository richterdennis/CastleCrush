import View from './View'

export default class JoinView extends View {
	constructor() {
		super();

		this.title = 'Join';
		this.templateUrl = 'templates/join';
	}

	async init(ViewManager) {
		const params = location.hash.split('/');
		if(params.length == 3) {
			this.joinGame(params[2]);
			ViewManager.load('game');

			return false;
		}

		return await super.init();
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
		this.joinGame(clearCode.value);
		CastleCrush.ViewManager.load('game');
	}

	joinGame(code) {
		console.log(code);
	}
}
