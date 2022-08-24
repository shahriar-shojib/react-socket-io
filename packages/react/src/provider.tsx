import { createContext, FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

export type SocketContextType = {
	socket: Socket;
	isConnected: boolean;
	error: Error | null;
	connect?: () => void;
	disconnect?: () => void;
	onConnectionRetry?: (socket: Socket) => void;
};

export const SocketContext = createContext<SocketContextType>(null as any);

type SocketProps = { socketIOOptions?: Partial<ManagerOptions & SocketOptions>; url: string };

export const SocketProvider: FC<PropsWithChildren<SocketProps>> = ({
	children,
	socketIOOptions,
	url,
}) => {
	const [socket, setSocket] = useState<Socket | undefined>(undefined);

	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const setConnected = useCallback(() => {
		setError(null);
		setIsConnected(true);
	}, []);

	const setDisconnected = useCallback(() => setIsConnected(false), []);
	const setErrorValue = useCallback((v: Error) => setError(v), []);

	useEffect(() => {
		const connectedSocket = io(url, socketIOOptions);

		setSocket(connectedSocket);

		connectedSocket.on('connect', setConnected);
		connectedSocket.on('connect_error', setErrorValue);
		connectedSocket.on('disconnect', setDisconnected);

		return () => {
			connectedSocket.off('connect', setConnected);
			connectedSocket.off('connect_error', setErrorValue);
			connectedSocket.off('disconnect', setDisconnected);
			connectedSocket.disconnect();

			setSocket(undefined);
		};
	}, [url, socketIOOptions, setConnected, setErrorValue, setDisconnected]);

	if (!socket) {
		return null;
	}

	return (
		<SocketContext.Provider value={{ error, isConnected, socket }}>
			{children}
		</SocketContext.Provider>
	);
};
