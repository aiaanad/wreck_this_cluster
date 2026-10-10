import asyncio
from typing import Set
from fastapi import WebSocket


class LocalWebSocketManager:
    def __init__(self) -> None:
        self._active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self._active_connections.discard(websocket)

    async def close_all(self) -> None:
        connections = list(self._active_connections)
        self._active_connections.clear()
        await asyncio.gather(
            *(connection.close(code=1001) for connection in connections),
            return_exceptions=True,
        )

    async def broadcast(self, message: dict) -> None:
        if not self._active_connections:
            return

        results = await asyncio.gather(
            *(conn.send_json(message) for conn in self._active_connections),
            return_exceptions=True,
        )

        for conn, result in zip(list(self._active_connections), results):
            if isinstance(result, Exception):
                self.disconnect(conn)