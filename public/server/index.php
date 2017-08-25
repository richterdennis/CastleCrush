<?php
// Change this port to a value you prefer, don't forget to tell the client
define('SOCKET_PORT', 9194);

// Include the beautiful SocketServer class
include 'SocketServer.class.php';

// Tell the client that the server starts and close the HTTP connection
ob_start();
echo 'Server is running...';
header('Connection: close');
header('Content-Length: '.ob_get_length());
ob_end_flush();
ob_flush();
flush();

// This is a room array to hold the clients in rooms
$rooms = array();

// This is the SocketServer implementation
$socketServer = new SocketServer(SOCKET_PORT);

// Get the message from the client and send it to all room mates
$socketServer->onmessage(function($encMessage, $client, $server) {
	$decMessage = json_decode($encMessage, true);

	switch($decMessage->type) {
		case 'start_room':
			$rooms[$decMessage->roomid] = array();

		case 'join_room':
			$rooms[$decMessage->roomid][] = $client;

		default:
			$server->broadcast($encMessage, $rooms[$decMessage->roomid]);
			break;

		case 'leave_room':
			$room = $rooms[$decMessage->roomid];
			unset($room[array_search($client, $room)]);
			$server->broadcast($encMessage, $room);
	}
});

// On disconnection: Remove client from room and inform other mates
$socketServer->ondisconnect(function($client, $server) {
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

$socketServer->start();
