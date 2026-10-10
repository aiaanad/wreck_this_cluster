import pytest
from app.services.audit import create_audit_event
from app.services.bus import ClusterEventBus
from app.services.ws_manager import LocalWebSocketManager
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_audit_event_generation():
    event = create_audit_event(username="tester", action="drop pod", badge="KILL")
    assert "id" in event
    assert len(event["id"]) == 8
    assert event["username"] == "tester"
    assert event["badge"] == "KILL"

@pytest.mark.asyncio
async def test_ws_manager_parallel_broadcast():
    manager = LocalWebSocketManager()
    ws1 = AsyncMock()
    ws2 = AsyncMock()

    await manager.connect(ws1)
    await manager.connect(ws2)
    assert len(manager._active_connections) == 2

    payload = {"message": "ping"}
    await manager.broadcast(payload)

    ws1.send_json.assert_awaited_once_with(payload)
    ws2.send_json.assert_awaited_once_with(payload)