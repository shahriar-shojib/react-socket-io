import { useState } from 'react';
import { useSocketContext, useSocketEmit, useSocketEvent } from 'socket-io-hooks';
import './App.css';

function App() {
	const [message, setMessage] = useState('');

	const emit = useSocketEmit();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const message = new FormData(e.currentTarget).get('message') as string;

		emit('PING', message);
		e.currentTarget.reset();
	};

	useSocketEvent('PONG', (message: string) => {
		console.log('pong called');

		setMessage(message);
	});

	const { error, isConnected } = useSocketContext();

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (!isConnected) {
		return <div>Loading...</div>;
	}

	return (
		<div className='App'>
			<h1>socket message: {message}</h1>

			<form onSubmit={handleSubmit}>
				<label>enter a message to send to socket as ping</label>
				<input type='text' name='message' />
				<button>send</button>
			</form>
		</div>
	);
}

export default App;
