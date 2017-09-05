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

		this.connection = io(
			'https://' + location.hostname + ':' + CastleCrush.CONFIG.SOCKET_PORT,
			{ rejectUnauthorized: false }
		);

		this.connection.on('connect', this.onopen.bind(this));
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
