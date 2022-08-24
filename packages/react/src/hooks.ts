import { useCallback, useContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext, SocketContextType } from './provider';

export type DefaultEventsMap = {
	[key: string]: (...args: any[]) => void;
};

export const useSocketContext = (): SocketContextType => {
	const context = useContext(SocketContext);

	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}

	return context;
};

export function createSocketHooks<
	IncomingEvents extends DefaultEventsMap = DefaultEventsMap,
	OutgoingEvents extends DefaultEventsMap = DefaultEventsMap
>() {
	const useSocket = (): Socket<IncomingEvents, OutgoingEvents> => {
		const { socket } = useSocketContext();
		return socket;
	};

	return {
		useSocketEvent: <Event extends keyof IncomingEvents>(
			event: Event,
			cb: (...args: Parameters<IncomingEvents[Event]>) => void
		) => {
			const socket = useSocket();
			const cbRef = useRef(cb);
			cbRef.current = cb;

			const actualCallback: any = useCallback((...args: any) => cbRef.current(...args), []);

			useEffect(() => {
				socket.on(event as any, actualCallback);

				return () => {
					socket.off(event as any, actualCallback);
				};
			}, [event, actualCallback, socket]);

			return {
				startListening: () => undefined,
				stopListening: () => undefined,
			};
		},
		useSocketEmit: () => {
			const socket = useSocket();

			return useCallback(
				<Event extends keyof OutgoingEvents>(
					event: Event,
					...args: Parameters<OutgoingEvents[Event]>
				) => {
					socket.emit(event as string, ...(args as any));
				},
				[socket]
			);
		},
		useSocket,
	};
}

type IncomingEvents = {
	PONG: (message: string) => void;
};

type OutgoingEvents = {
	PING: (message: string) => void;
};

export const { useSocketEmit, useSocketEvent, useSocket } = createSocketHooks<
	IncomingEvents,
	OutgoingEvents
>();
