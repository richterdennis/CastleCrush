// Import config
const config = require('./config.json');

// Import modules
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const socket = require('socket.io');

// Create static file handler
const handler = express();
handler.use(express.static('dist'));

// Create server
let server = null;
if(config.secure) {
	server = https.createServer({
		key: fs.readFileSync(config.key),
		cert: fs.readFileSync(config.cert),
	}, handler);
}
else {
	server = http.createServer(handler);
}

// Create socket.io instance
const io = socket(server);

// The web socket stuff
io.on('connect', (client) => {
	client.on('message', (data) => {
		event = JSON.parse(data);
		console.log(event.roomid, event.type, event.sender);

		if(!event.sender)
			return client.emit('error', 'The following param is missing: "sender"');

		if(!event.roomid)
			return client.emit('error', 'The following param is missing: "roomid"');

		switch(event.type) {
			case 'start_room':
			case 'join_room':
				client.join(event.roomid);

			default:
				client.to(event.roomid).emit('message', data);
				break;

			case 'leave_room':
				client.leave(event.roomid);
				client.to(event.roomid).emit('message', data);
		}
	});

	client.on('disconnect', () => {
		io.emit('message', JSON.stringify({
			type: 'leave_room_unexpected'
		}));
	});
});

// Listen on port config.port
server.listen(config.port, () => {
	console.log('Server listening on port: ' + config.port)
});
