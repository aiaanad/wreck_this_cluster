import logging
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_event_bus
from app.services.bus import ClusterEventBus

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/play/logs", tags=["Logs & Audit"])


@router.get("", response_model=list[dict])
async def list_logs(
    bus: ClusterEventBus = Depends(get_event_bus),
):
    """Return the recent audit history stored in Redis."""
    try:
        return await bus.recent_events()
    except Exception as exc:
        logger.exception("Failed to load audit history: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Журнал событий временно недоступен",
        )

