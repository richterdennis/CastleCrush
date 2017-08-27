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
		this.connect();
	}

	connect() {
		this.state = 'connecting';

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
		if(this.state == 'connecting' && this.connection.readyState === 3) {
			this.logger.warn('Server is not running! Attempt to start it');
			fetch(CastleCrush.CONFIG.SERVER_START_ADDRESS)
				.then(res => res.text())
				.then(res => {
					this.logger.info('Server says: ', res);
					this.logger.info('Connecting again!');
					this.connect();
				})
				.catch(error => {
					this.logger.error('Can not start socket server!');
					this.logger.error(
						'Maybe the SERVER_START_ADDRESS is not correct:',
						CastleCrush.CONFIG.SERVER_START_ADDRESS
					);
					this.logger.error('The error is:', error.message);
					console.error(error);
				});
		}
		else {
			this.logger.error('You have a problem with your socket connection!');
			this.logger.error('The error is:', error.message);
			console.error(error);
		}
	}

	onmessage(event) {
		this.logger.info('You received a message: ', event.data);

		event = JSON.parse(event.data);
		CastleCrush.EventManager.dispatch(event.type, event, false);
	}

	send(data) {
		this.logger.info('You are sending a message: ', JSON.stringify(data));

		this.connection.send(JSON.stringify(data));
	}
}
