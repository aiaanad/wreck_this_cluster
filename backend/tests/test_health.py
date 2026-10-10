from unittest.mock import AsyncMock, MagicMock
import pytest
from httpx import ASGITransport, AsyncClient
from main import app


@pytest.fixture
def mock_event_bus():
    """Фикстура для имитации фасада EventBus и Redis."""
    bus = MagicMock()
    bus._redis = AsyncMock()
    return bus


@pytest.mark.asyncio
async def test_liveness_check():
    """Liveness всегда возвращает 200 OK."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/healthz")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_readiness_check_success(mock_event_bus):
    """Readiness возвращает 200, если Redis ответил PONG."""
    mock_event_bus._redis.ping.return_value = True
    app.state.event_bus = mock_event_bus

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/readyz")
        assert response.status_code == 200
        assert response.json() == {"status": "ready", "redis": "connected"}


@pytest.mark.asyncio
async def test_readiness_check_redis_down(mock_event_bus):
    """Readiness возвращает 503, если Redis упал."""
    mock_event_bus._redis.ping.side_effect = ConnectionError("Connection refused")
    app.state.event_bus = mock_event_bus

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/readyz")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "unhealthy"
        assert data["reason"] == "Redis unreachable"