import helper from '../helper'
import { EVENTS } from '../EventManager';
import View from './View'
import WaitView from './WaitView';

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
			position: 1,
			id: null,
			nickname: null,
			ready: false,
			joined: false,
			device: null
		}, {
			position: 2,
			id: null,
			nickname: null,
			ready: false,
			joined: false,
			device: null
		}];

		players.forEach(player => {
			const joinArea = this.find(`.join-area:nth-child(${player.position})`);
			const qrCodeHolder = joinArea.querySelector('.code-holder');
			const clearCode = joinArea.querySelector('.clear-code');

			new QRCode(qrCodeHolder, `${joinUrl}${roomId}-${player.position}`);
			clearCode.value = `${roomId}-${player.position}`;
		});

		CastleCrush.EventManager.addEventListener(EVENTS.JOIN_ROOM, (event) => {
			if(!players[event.position-1]) return;

			const player = players[event.position-1];
			if(player.joined) return;

			player.id = event.playerId;
			player.joined = true;
			player.device = event.sender;

			const joinArea = this.find(`.join-area:nth-child(${player.position})`);
			joinArea.classList.add('joined');

			CastleCrush.EventManager.addEventListener(EVENTS.READY, (event) => {
				if(player.id !== event.playerId) return;

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
				}
			});

		});
	}

	joinLeft() {
		const playerId = helper.uuid();
		CastleCrush.EventManager.dispatch(EVENTS.JOIN_ROOM, {
			roomid: CastleCrush.GameManager.roomid,
			position: 1,
			playerId: playerId
		});

		this.showWaitView(1, playerId);
	}

	joinRight() {
		const playerId = helper.uuid();
		CastleCrush.EventManager.dispatch(EVENTS.JOIN_ROOM, {
			roomid: CastleCrush.GameManager.roomid,
			position: 2,
			playerId: playerId
		});

		this.showWaitView(2, playerId);
	}

	showWaitView(position, playerId) {
		const joinArea = this.find(`.join-area:nth-child(${position})`);
		while(joinArea.firstChild) joinArea.firstChild.remove();
		const waitView = new WaitView();
		waitView.setPlayer(playerId);
		waitView.init(this).then(view => view.show(joinArea));
	}
}
