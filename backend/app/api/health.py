import asyncio
import logging
from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Health"])


@router.get("/healthz", status_code=status.HTTP_200_OK)
async def liveness():
    """Liveness probe: процесс запущен и event loop не завис."""
    return {"status": "ok"}


@router.get("/readyz")
async def readiness(request: Request):
    """Readiness probe: приложение готово принимать трафик (проверка Redis)."""
    event_bus = getattr(request.app.state, "event_bus", None)

    # Проверяем, инициализирован ли фасад и подключен ли Redis
    if not event_bus or not event_bus._redis:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "reason": "EventBus/Redis not initialized"},
        )

    try:
        # Пингуем Redis с жестким таймаутом
        async with asyncio.timeout(2):
            pong = await event_bus._redis.ping()
        if not pong:
            raise ConnectionError("Redis ping failed")
        return {"status": "ready", "redis": "connected"}
    except Exception as exc:
        logger.warning("Readiness probe failed: %s", exc)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "reason": "Redis unreachable"},
        )