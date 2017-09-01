import { EVENTS } from '../EventManager';

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

		const qrCode = this.find('.qr-code');
		const clearCode = this.find('.clear-code');

		this.scanner.addListener('scan', function (content) {
			const path = content.split('#')[1];
			if(path && path.startsWith('/join')) {
				const code = path.split('/')[2];
				if(code) {
					qrCode.classList.remove('error');
					qrCode.classList.add('success');
					return clearCode.value = code;
				}
			}

			qrCode.classList.remove('success');
			qrCode.classList.add('error');
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

		CastleCrush.EventManager.addEventListener(EVENTS.START_GAME, (event) => {
			CastleCrush.ViewManager.load('game');
		});

		const clearCode = this.find('.clear-code');
		this.joinGame(clearCode.value);
	}

	joinGame(code) {
		const nickname = this.find('.nickname').value;
		const [roomid, position] = code.split('-');
		CastleCrush.EventManager.dispatch(EVENTS.JOIN_ROOM, {
			roomid: roomid.toUpperCase(),
			position,
			nickname
		});
	}
}
