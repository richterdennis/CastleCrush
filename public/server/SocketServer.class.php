<?php
/**
 * This class provides a connectible socket
 */
class SocketServer {

	/**
	 * This is the server socket
	 *
	 * @var  [socket]
	 */
	private $socket;

	/**
	 * The socket state
	 *
	 * @var  [string]
	 */
	private $state;

	/**
	 * This holds the client connections
	 *
	 * @var  [array]
	 */
	private $clients;

	/**
	 * This holds the onconnect handler
	 *
	 * @var  [array]
	 */
	private $connectListener;

	/**
	 * This holds the onmessage handler
	 *
	 * @var  [array]
	 */
	private $messageListener;

	/**
	 * This holds the ondisconnect handler
	 *
	 * @var  [array]
	 */
	private $disconnectListener;

	/**
	 * This constructs the SocketServer
	 *
	 * @param  [number]  $port           The server port
	 * @param  [number]  $maxSocketLive  The maximum socket live time in seconds
	 */
	public function __construct($port, $maxSocketLive = 600) {
		// Create TCP/IP stream socket
		$this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		socket_set_option($this->socket, SOL_SOCKET, SO_REUSEADDR, 1);

		// bind socket to specified port and listen
		socket_bind($this->socket, 0, $port);
		socket_listen($this->socket);

		$this->maxSocketLive = $maxSocketLive;
		$this->state = 'born';
		$this->clients = array();
		$this->connectListener = array();
		$this->messageListener = array();
		$this->disconnectListener = array();
	}

	/**
	 * This starts the server
	 *
	 * @param  [function]  $onconnect     This is called after a client is connected
	 * @param  [function]  $onmessage     This is called on an incoming message
	 * @param  [function]  $ondisconnect  This is called after a client is disconnected
	 */
	public function start(
		$onconnect = null,
		$onmessage = null,
		$ondisconnect = null
	) {
		if($onconnect != null)
			$this->connectListener[] = $onconnect;

		if($onmessage != null)
			$this->messageListener[] = $onmessage;

		if($ondisconnect != null)
			$this->disconnectListener[] = $ondisconnect;

		// handling for maximum time, socket is open
		$this->socketDieTime = time() + $this->maxSocketLive;
		$this->state = 'alive';

		// override max execution time from php.ini
		set_time_limit($this->maxSocketLive);

		while($this->state == 'alive' && time() < $this->socketDieTime) {
			$this->checkIsNewClient();
			$this->checkMsgOrDisconnect();
		}

		socket_close($this->socket);
		$this->state = 'dead';
	}

	/**
	 * This refreshes the maximum socket live and resets the stop timer
	 *
	 * @param  [number]  $maxSocketLive  The maximum socket live time in seconds
	 */
	public function refreshSocketDieTime($maxSocketLive = null) {
		if($maxSocketLive == null)
			$maxSocketLive = $this->maxSocketLive;

		$this->socketDieTime = time() + $maxSocketLive;
		set_time_limit($maxSocketLive);
	}

	/**
	 * This stops the server
	 */
	public function stop() {
		$this->state = 'dieing';
	}

	/**
	 * This registers a handler that would be called on client connect
	 *
	 * @param  [function]  $connectHandler  The handler function
	 */
	public function onconnect($connectHandler) {
		$this->connectListener[] = $connectHandler;
	}

	/**
	 * This registers a handler that would be called on client message
	 *
	 * @param  [function]  $messageHandler  The handler function
	 */
	public function onmessage($messageHandler) {
		$this->messageListener[] = $messageHandler;
	}

	/**
	 * This registers a handler that would be called on client disconnect
	 *
	 * @param  [function]  $disconnectHandler  The handler function
	 */
	public function ondisconnect($disconnectHandler) {
		$this->disconnectListener[] = $disconnectHandler;
	}

	/**
	 * This dispatches a connect event
	 *
	 * @param  [socket]  $client  The client socket
	 */
	private function dispatchConnect($client) {
		foreach($this->connectListener as $handler) {
			$handler($client, $this);
		}
	}

	/**
	 * This dispatches a message event
	 *
	 * @param  [type]  $message  The message
	 * @param  [type]  $client   The client socket
	 */
	private function dispatchMessage($message, $client) {
		foreach($this->messageListener as $handler) {
			$handler($message, $client, $this);
		}
	}

	/**
	 * This dispatches a disconnect event
	 *
	 * @param  [type]  $client   The client socket
	 */
	private function dispatchDisconnect($client) {
		foreach($this->disconnectListener as $handler) {
			$handler($client, $this);
		}
	}

	/**
	 * This sends a message to a client
	 *
	 * @param  [string]  $msg     The message
	 * @param  [socket]  $client  The client
	 */
	public function sendMessage($msg, $client) {
		$msg = SocketServer::mask($msg);
		socket_write($client, $msg, strlen($msg));
	}

	/**
	 * This sends a message to many clients
	 *
	 * @param  [tring]  $msg      The message
	 * @param  [array]  $clients  The clients
	 */
	public function broadcast($msg, $clients = null) {
		if($clients == null)
			$clients = $this->clients;

		$msg = SocketServer::mask($msg);
		foreach($clients as $client) {
			socket_write($client, $msg, strlen($msg));
		}
	}

	/**
	 * This checks if the server socked has change
	 */
	private function checkIsNewClient() {
		$changed = SocketServer::getChanged(array($this->socket));

		if(in_array($this->socket, $changed)) {
			$newClient = socket_accept($this->socket);
			$header = SocketServer::getHeader(socket_read($newClient, 1024));
			SocketServer::performHandshaking($header, $newClient);

			$this->clients[] = $newClient;
			$this->dispatchConnect($newClient);
		}
	}

	/**
	 * Get the sockets that has changed
	 *
	 * @param   [array]  $sockets  The sockets to check
	 * @return  [array]            The changed sockets
	 */
	private static function getChanged($sockets) {
		if(count($sockets) < 1)
			return array();

		$w = $e = null;
		socket_select($sockets, $w, $e, 0, 10);
		return $sockets;
	}

	/**
	 * This parses a header string
	 *
	 * @param   [string]  $headerString  The header string
	 * @return  [array]                  The parsed header
	 */
	private static function getHeader($headerString) {
		$header = array();
		$lines = preg_split("/\r\n/", $headerString);
		foreach($lines as $line) {
			$line = chop($line);
			if(preg_match('/\A(\S+): (.*)\z/', $line, $matches)) {
				$header[$matches[1]] = $matches[2];
			}
		}
		return $header;
	}

	/**
	 * This performs a handshake
	 *
	 * @param  [array]   $header  The header array
	 * @param  [socket]  $client  The client
	 */
	private static function performHandshaking($header, $client) {
		$secKey = $header['Sec-WebSocket-Key'];
		$secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));

		//hand shaking header
		$upgrade =
			"HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
			"Upgrade: websocket\r\n" .
			"Connection: Upgrade\r\n" .
			"Sec-WebSocket-Accept:$secAccept\r\n\r\n";

		socket_write($client, $upgrade, strlen($upgrade));
	}

	/**
	 * This check the clients for incoming messages or disconnections
	 */
	private function checkMsgOrDisconnect() {
		$changed = SocketServer::getChanged($this->clients);
		foreach($changed as $changedSocket) {
			switch ($this->checkSocket($changedSocket)) {
				case -1:
					$this->disconnect($changedSocket);
					break;

				case 0:
					$this->checkDisconnection($changedSocket);
					break;
			}
		}
	}

	/**
	 * This checks a socket for incoming messages or disconnection
	 *
	 * @param   [socket]    $changedSocket  The socket
	 * @return  [boolean]                   Message received?
	 */
	private function checkSocket($changedSocket) {
		$r = socket_recv($changedSocket, $buf, 1024, 0);
		if($r === 0 || strpos($buf, "\x88") === 0)
			return -1;

		if($r > 0) {
			$received = SocketServer::unmask($buf);
			$this->dispatchMessage($received, $changedSocket);
			return 1;
		}

		return 0;
	}

	/**
	 * This checks a socket for a disconnection
	 *
	 * @param  [socket]    $changedSocket  The socket
	 */
	private function checkDisconnection($changedSocket) {
		$buf = @socket_read($changedSocket, 1024, PHP_NORMAL_READ);
		if($buf === false) {
			$this->disconnect($changedSocket);
		}
	}

	private function disconnect($socket) {
		unset($this->clients[array_search($socket, $this->clients)]);
		$this->dispatchDisconnect($socket);
		socket_close($socket);
	}

	/**
	 * This unmasks a text
	 *
	 * @param   [string]  $text  The masked text
	 * @return  [string]         The unmasked text
	 */
	private static function unmask($text) {
		$length = ord($text[1]) & 127;
		if($length == 126) {
			$masks = substr($text, 4, 4);
			$data = substr($text, 8);
		}
		elseif($length == 127) {
			$masks = substr($text, 10, 4);
			$data = substr($text, 14);
		}
		else {
			$masks = substr($text, 2, 4);
			$data = substr($text, 6);
		}
		$text = "";
		for ($i = 0; $i < strlen($data); ++$i) {
			$text .= $data[$i] ^ $masks[$i%4];
		}
		return $text;
	}

	/**
	 * This masks a text
	 *
	 * @param   [string]  $text  The unmasked text
	 * @return  [string]         The masked text
	 */
	private static function mask($text) {
		$b1 = 0x80 | (0x1 & 0x0f);
		$length = strlen($text);

		if($length <= 125)
			$header = pack('CC', $b1, $length);
		elseif($length > 125 && $length < 65536)
			$header = pack('CCn', $b1, 126, $length);
		elseif($length >= 65536)
			$header = pack('CCNN', $b1, 127, $length);
		return $header.$text;
	}
}
