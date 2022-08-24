import React from 'react';
import ReactDOM from 'react-dom/client';
import { SocketProvider } from 'socket-io-hooks';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<SocketProvider url='http://localhost:3000'>
			<App />
		</SocketProvider>
	</React.StrictMode>
);
