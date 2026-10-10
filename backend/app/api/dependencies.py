import logging

from fastapi import Header, HTTPException, Request, status

from app.core.k8s import get_k8s_custom_api
from app.core.config import settings
from app.services.bus import ClusterEventBus
from app.services.chaos import ChaosService

logger = logging.getLogger(__name__)

def get_event_bus(request: Request) -> ClusterEventBus:
  return request.app.state.event_bus


def get_chaos_service() -> ChaosService:
  api = get_k8s_custom_api()
  return ChaosService(
      custom_api=api,
      namespace=settings.K8S_NAMESPACE,
      target_app=settings.TARGET_APP,
  )


def require_same_origin(
    request: Request,
    origin: str | None = Header(default=None),
) -> None:
    """
    Reject browser cross-site requests to destructive endpoints.
    
    - GET/HEAD/OPTIONS не проверяются (безопасные методы).
    - Запросы без Origin пропускаются (curl, тесты, non-browser клиенты).
    - Запросы с Origin сверяются с ожидаемым origin.
    """
    if request.method in ("GET", "HEAD", "OPTIONS"):
        return
    
    if origin is None:
        return
    
    forwarded_proto = request.headers.get("x-forwarded-proto", request.url.scheme)
    forwarded_host = request.headers.get(
        "x-forwarded-host",
        request.headers.get("host", ""),
    )
    expected_origin = f"{forwarded_proto}://{forwarded_host}"
    
    if origin.rstrip("/") != expected_origin.rstrip("/"):
        logger.warning(
            "Cross-origin rejected: origin=%s expected=%s path=%s ip=%s",
            origin,
            expected_origin,
            request.url.path,
            request.client.host if request.client else "unknown",
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cross-origin requests are not allowed",
        )