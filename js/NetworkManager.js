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
		console.log('WebSocket Open');
	}

  onerror(error) {
  	if(this.state == 'connecting' && this.connection.readyState === 3) {
  		console.warn('Server is not running! Attempt to start it');
  		fetch(CONFIG.SERVER_START_ADDRESS)
  		  .then(res => res.text())
  		  .then(res => {
  		  	console.info('Server says: ', res);
  		  	console.info('Connecting again!');
  		  	this.connect();
  		  })
  		  .catch(console.error);
  	}

  	else
			console.log('WebSocket Error: ', error);
  }

  onmessage(event) {
  	event = JSON.parse(event.data);
  	CastleCrush.EventManager.dispatch(event.type, event);
		console.log('WebSocket Message: ', event);
  }

  send(data) {
  	this.connection.send(JSON.stringify(data));
  }
}
