import Logger from './Logger';

/**
 * The NetworkManager handles the socket connection and
 * dispatches receiving events
 */
export default class NetworkManager {

	/**
	 * Default constructor
	 */
	constructor() {
		this.logger = Logger.create({
			prefix: '[NETWORK]'
		});

		this.connectCounter = 0;
	}

	async init() {
		this.ckeckConfigExists();
		this.connect();
	}

	ckeckConfigExists() {
		if(CastleCrush.CONFIG) return true;

		throw new Error('CONFIG is missing! Please set the correct path ' +
		                                      'or create one in the root folder!');
	}

	connect() {
		this.state = 'connecting';

		this.connectCounter++;
		this.connection = new WebSocket(CastleCrush.CONFIG.SOCKET_ADDRESS);

		this.connection.onopen = this.onopen.bind(this);
		this.connection.onerror = this.onerror.bind(this);
		this.connection.onmessage = this.onmessage.bind(this);
	}

	onopen() {
		this.logger.info('You are successfully connected to the socket server!');
		this.state = 'connected';
	}

	/**
	 * [onerror description]
	 *
	 * @param  {[type]}  error  [description]
	 */
	onerror(error) {
		if(
		  this.state == 'connecting' &&
		  this.connection.readyState === 3 &&
		  this.connectCounter < 5
		) {
			this.logger.warn('Server is not running! Attempt to start it');
			fetch(CastleCrush.CONFIG.SERVER_START_ADDRESS)
				.then(res => res.text())
				.then(res => {
					this.logger.info('Server says: ', res);
					this.logger.info('Connecting again!');
					this.connect();
				})
				.catch(error => {
					CastleCrush.ViewManager.showError(
						'Can not connect to socket server! ' +
						'Open the log for more information!'
					);
					this.logger.error('Can not start socket server!');
					this.logger.error(
						'Maybe the SERVER_START_ADDRESS is not correct:',
						CastleCrush.CONFIG.SERVER_START_ADDRESS
					);
					this.logger.error('The error is:', error.message);
					throw error;
				});
		}
		else {
			CastleCrush.ViewManager.showError(
				'You have a problem with your socket connection! ' +
				'Open the log for more information!'
			);
			this.logger.error('You have a problem with your socket connection!');
			this.logger.error('The error is:', error.message || error);
			throw error;
		}
	}

	onmessage(event) {
		event = JSON.parse(event.data);
		this.logger.info('You received a message: ', event);
		CastleCrush.EventManager.dispatch(event.type, event, false);
	}

	send(data) {
		this.logger.info('You are sending a message: ', data);

		this.connection.send(JSON.stringify(data));
	}
}
