import { EVENTS } from '../EventManager';

import View from './View'

export default class RoomView extends View {
	constructor() {
		super();

		this.title = 'Room';
		this.templateUrl = 'templates/room';
	}

	afterInit() {
		const roomId = CastleCrush.GameManager.roomid;
		const joinUrl = location.href.split('#')[0] + '#/join/';

		const players = [{
			id: 1,
			uuid: null,
			nickname: null,
			ready: false,
			joined: false
		}, {
			id: 2,
			uuid: null,
			nickname: null,
			ready: false,
			joined: false
		}];

		players.forEach(player => {
			const joinArea = this.find(`.join-area:nth-child(${player.id})`);
			const qrCodeHolder = joinArea.querySelector('.code-holder');
			const clearCode = joinArea.querySelector('.clear-code');

			new QRCode(qrCodeHolder, `${joinUrl}${roomId}-${player.id}`);
			clearCode.value = `${roomId}-${player.id}`;
		});

		CastleCrush.EventManager.addEventListener(EVENTS.JOIN_ROOM, (event) => {
			if(!players[event.position-1]) return;

			const player = players[event.position-1];
			if(player.joined) return;

			player.uuid = event.sender;
			player.joined = true;

			const joinArea = this.find(`.join-area:nth-child(${player.id})`);
			joinArea.classList.add('joined');

			CastleCrush.EventManager.addEventListener(EVENTS.READY, (event) => {
				if(player.uuid !== event.sender) return;

				player.ready = true;
				player.nickname = event.nickname;

				if(players.every(player => player.ready)) {
					CastleCrush.EventManager.dispatch(EVENTS.START_GAME, {
						roomid: CastleCrush.GameManager.roomid,
						difficulty: CastleCrush.GameManager.difficulty,
						autoRestart: CastleCrush.GameManager.autoRestart,
						player1: players[0],
						player2: players[1],
					});
					CastleCrush.ViewManager.load('game');
				}
			});

		});
	}

	joinLeft() {
		CastleCrush.EventManager.dispatch(EVENTS.JOIN_ROOM, {
			roomid: CastleCrush.GameManager.roomid,
			position: 1
		});

		this.showWaitView(1);
	}

	joinRight() {
		CastleCrush.EventManager.dispatch(EVENTS.JOIN_ROOM, {
			roomid: CastleCrush.GameManager.roomid,
			position: 2
		});

		this.showWaitView(2);
	}

	showWaitView(playerId) {
		const joinArea = this.find(`.join-area:nth-child(${playerId})`);
		while(joinArea.firstChild) joinArea.firstChild.remove();
		CastleCrush.ViewManager.wait.init(this).then(view => view.show(joinArea));
	}

	schließen() {
		window.close();
	}

	zurueck() {
		CastleCrush.ViewManager.load('start');
	}
}
