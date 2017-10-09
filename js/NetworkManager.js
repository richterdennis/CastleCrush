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
	}

	async init() {
		const config = await fetch('config.client.json').then(r => r.json());
		this.connect(config);
	}

	connect(config) {
		this.state = 'connecting';

		const connectionAddress =
			config.server.protocol + '://' +
			config.server.host + ':' +
			config.server.port;

		this.connection = io(
			connectionAddress,
			{ rejectUnauthorized: false }
		);

		this.connection.on('connect', this.onopen.bind(this));
		this.connection.on('rejected', this.onerror.bind(this));
		this.connection.on('error', this.onerror.bind(this));
		this.connection.on('message', this.onmessage.bind(this));
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
		CastleCrush.ViewManager.showError(
			'You have a problem with your socket connection! ' +
			'Open the log for more information!'
		);
		this.logger.error('You have a problem with your socket connection!');
		this.logger.error('The error is:', error.message || error);
		throw error;
	}

	onmessage(data) {
		event = JSON.parse(data);

		this.logger.info('You received a message: ', event);
		CastleCrush.EventManager.dispatch(event.type, event, false);
	}

	send(event) {
		this.logger.info('You are sending a message: ', event);

		this.connection.emit('message', JSON.stringify(event));
	}
}
