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
			joined: false
		}, {
			id: 2,
			uuid: null,
			nickname: null,
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
			player.uuid = event.sender;
			player.nickname = event.nickname;
			player.joined = true;

			const joinArea = this.find(`.join-area:nth-child(${player.id})`);
			joinArea.classList.add('joined');

			if(players.every(player => player.joined)) {
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
	}

	joinLeft() {
		CastleCrush.EventManager.dispatch(EVENTS.JOIN_ROOM, {
			roomid: CastleCrush.GameManager.roomid,
			position: 1
		});
	}

	joinRight() {
		CastleCrush.EventManager.dispatch(EVENTS.JOIN_ROOM, {
			roomid: CastleCrush.GameManager.roomid,
			position: 2
		});
	}
}
