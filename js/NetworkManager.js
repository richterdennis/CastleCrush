// Outsource these config to a config.json
const CONFIG = {
	SERVER_START_ADDRESS: 'http://localhost/CastleCrush/dist/public/server/index.php',
	SOCKET_ADDRESS: 'ws://localhost:9194/'
};

/**
 * The NetworkManager handles the socket connection and
 * dispatches receiving events
 */
export default class NetworkManager {

	/**
	 * Default constructor
	 */
	constructor() {
		this.connect();
	}

	connect() {
		this.state = 'connecting';

		this.connection = new WebSocket(CONFIG.SOCKET_ADDRESS);

		this.connection.onopen = this.onopen.bind(this);
		this.connection.onerror = this.onerror.bind(this);
		this.connection.onmessage = this.onmessage.bind(this);
	}

	onopen() {
		console.info('[NETWORK] You are successfully connected to the socket server!');
		this.state = 'connected';
	}

	/**
	 * [onerror description]
	 *
	 * @param  {[type]}  error  [description]
	 */
	onerror(error) {
		if(this.state == 'connecting' && this.connection.readyState === 3) {
			console.warn('[NETWORK] Server is not running! Attempt to start it');
			fetch(CONFIG.SERVER_START_ADDRESS)
				.then(res => res.text())
				.then(res => {
					console.info('[NETWORK] Server says: ', res);
					console.info('[NETWORK] Connecting again!');
					this.connect();
				})
				.catch(error => {
					console.error('[NETWORK] Can not start socket server!');
					console.error('[NETWORK] Maybe the SERVER_START_ADDRESS is not correct:', CONFIG.SERVER_START_ADDRESS);
					console.error('[NETWORK] The error is:', error.message);
					console.error(error);
				});
		}
		else {
			console.error('[NETWORK] You have a problem with your socket connection!');
			console.error('[NETWORK] The error is:', error.message);
			console.error(error);
		}
	}

	onmessage(event) {
		console.info('[NETWORK] You received a message: ', event.data);

		event = JSON.parse(event.data);
		CastleCrush.EventManager.dispatch(event.type, event, false);
	}

	send(data) {
		console.info('[NETWORK] You are sending a message: ', JSON.stringify(data));

		this.connection.send(JSON.stringify(data));
	}
}
