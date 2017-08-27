<?php
// Change this port to a value you prefer, don't forget to tell the client
define('SOCKET_PORT', 9194);

// Include the beautiful SocketServer class
include 'SocketServer.class.php';

// This is a room array to hold the clients in rooms
$rooms = array();

// This is the SocketServer implementation
$socketServer = new SocketServer(SOCKET_PORT);

// Get the message from the client and send it to all room mates
$socketServer->onmessage(function($encMessage, $client, $server) {
	global $rooms;

	$server->refreshSocketDieTime();
	$decMessage = json_decode($encMessage);

	if(!isset($decMessage->roomid)) {
		$server->sendMessage('You forgot the roomid!', $client);
		return;
	}

	switch($decMessage->type) {
		case 'start_room':
			$rooms[$decMessage->roomid] = array();

		case 'join_room':
			if(isset($rooms[$decMessage->roomid]))
				$rooms[$decMessage->roomid][] = $client;

			else {
				$server->sendMessage('The room does not exist!', $client);
				break;
			}

		default:
			if(isset($rooms[$decMessage->roomid]))
				$server->broadcast($encMessage, $rooms[$decMessage->roomid]);

			else
				$server->sendMessage('The room does not exist!', $client);

			break;

		case 'leave_room':
			$room = $rooms[$decMessage->roomid];
			unset($room[array_search($client, $room)]);
			$server->broadcast($encMessage, $room);
	}
});

// On disconnection: Remove client from room and inform other mates
$socketServer->ondisconnect(function($client, $server) {
	global $rooms;

	foreach ($rooms as $room) {
		$i = array_search($client, $room);
		if($i !== false) {
			unset($room[$i]);
			$server->broadcast(json_encode(array(
				'type' => 'leave_room_unexpected'
			)), $room);
			break;
		}
	}
});

// Tell the client that the server starts and close the HTTP connection
ob_start();
header('Access-Control-Allow-Origin: *');
echo 'Server is running...';
header('Connection: close');
header('Content-Length: '.ob_get_length());
ob_end_flush();
ob_flush();
flush();

// Then start the server
$socketServer->start();
