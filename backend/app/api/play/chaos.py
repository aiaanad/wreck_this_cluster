import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_chaos_service, get_event_bus, require_same_origin
from app.metrics import chaos_attacks_total
from app.schemas.logs import AttackResponse, LogRequest
from app.services.audit import create_audit_event
from app.services.bus import ClusterEventBus
from app.services.chaos import ChaosService


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/play/attack", tags=["Chaos Attacks"])
play_dependencies = [Depends(require_same_origin)]


@router.post(
    "/pod-kill",
    response_model=AttackResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=play_dependencies,
)
async def trigger_pod_kill(
    data: LogRequest,
    chaos: ChaosService = Depends(get_chaos_service),
    bus: ClusterEventBus = Depends(get_event_bus),
):
  try:
    chaos.inject_pod_kill()
    event = create_audit_event(
        data.username, "Приора сбила под (SIGKILL 137)", "KILL"
    )
    await bus.publish(event)
    chaos_attacks_total.labels(type="pod_kill").inc()
    return AttackResponse(message="Под уничтожен!")
  except Exception as e:
    logger.exception("Failed to trigger pod-kill: %s", e)
    raise HTTPException(
        status_code=500, detail="Ошибка вызова Chaos Mesh: pod-kill"
    )


@router.post(
    "/pod-failure",
    response_model=AttackResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=play_dependencies,
)
async def trigger_pod_failure(
    data: LogRequest,
    chaos: ChaosService = Depends(get_chaos_service),
    bus: ClusterEventBus = Depends(get_event_bus),
):
  try:
    chaos.inject_pod_failure(duration="20s")
    event = create_audit_event(
        data.username, "Пиньята взорвана. Отказ пода на 20 сек", "FAILURE"
    )
    await bus.publish(event)
    chaos_attacks_total.labels(type="pod_failure").inc()
    return AttackResponse(message="Под переведен в отказ!")
  except Exception as e:
    logger.exception("Failed to trigger pod-failure: %s", e)
    raise HTTPException(
        status_code=500, detail="Ошибка вызова Chaos Mesh: pod-failure"
    )


@router.post(
    "/network-delay",
    response_model=AttackResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=play_dependencies,
)
async def trigger_network_delay(
    data: LogRequest,
    chaos: ChaosService = Depends(get_chaos_service),
    bus: ClusterEventBus = Depends(get_event_bus),
):
  try:
    chaos.inject_network_delay(latency="1500ms", duration="20s")
    event = create_audit_event(
        data.username, "Попадание из рогатки. Задержка сети +1.5s", "DELAY"
    )
    await bus.publish(event)
    chaos_attacks_total.labels(type="network_delay").inc()
    return AttackResponse(message="Сеть замедлена!")
  except Exception as e:
    logger.exception("Failed to trigger network-delay: %s", e)
    raise HTTPException(
        status_code=500, detail="Ошибка вызова Chaos Mesh: network-delay"
    )