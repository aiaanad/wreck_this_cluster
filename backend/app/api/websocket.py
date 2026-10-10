from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.bus import ClusterEventBus

router = APIRouter()


def get_event_bus(websocket: WebSocket) -> ClusterEventBus:
    return websocket.app.state.event_bus


@router.websocket("/ws/logs")
async def websocket_logs_endpoint(websocket: WebSocket):
    bus: ClusterEventBus = get_event_bus(websocket)
    await bus.register_client(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        bus.unregister_client(websocket)