import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: true,
		preflightContinue: true,
	},
});

io.on('connection', socket => {
	socket.on('PING', (message: string) => {
		socket.emit('PONG', `${message} [response from server] [${Date.now()}]`);
	});
});

httpServer.listen(3000, () => {
	console.log('listening on *:3000');
});
