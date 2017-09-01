import View from './View'

export default class RoomView extends View {
	constructor() {
		super();

		this.title = 'Room';
		this.templateUrl = 'templates/room';
	}

  afterInit() {
    const roomId = 'test';

    [1, 2].forEach(playerId => {
      const joinArea = this.find(`.join-area:nth-child(${playerId})`);
      const qrCodeHolder = joinArea.querySelector('.code-holder');
      const clearCode = joinArea.querySelector('.clear-code');

      new QRCode(qrCodeHolder, `${roomId}-${playerId}`);
      clearCode.value = `${roomId}-${playerId}`;
    });
  }

  joinLeft() {
    CastleCrush.ViewManager.load('game');
  }

  joinRight() {
    CastleCrush.ViewManager.load('game');
  }
}
