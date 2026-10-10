from contextlib import asynccontextmanager
import logging
from logging.config import dictConfig

from fastapi import FastAPI
from prometheus_client import make_asgi_app

from app.core.config import settings
from app.metrics import registry
from app.services.bus import ClusterEventBus

from app.api.health import router as health_router
from app.api.play.chaos import router as chaos_router
from app.api.play.logs import router as logs_router
from app.api.websocket import router as ws_router


dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "class": "pythonjsonlogger.json.JsonFormatter",
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
        }
    },
    "handlers": {
        "default": {
            "class": "logging.StreamHandler",
            "formatter": "json",
            "stream": "ext://sys.stdout",
        }
    },
    "root": {"handlers": ["default"], "level": "INFO"},
})


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения."""
    bus = ClusterEventBus(
        redis_url=settings.REDIS_URL,
        channel_name=settings.CHANNEL_NAME,
    )
    await bus.start()
    app.state.event_bus = bus

    yield

    await bus.stop()


app = FastAPI(
    title="Wreck Cluster API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------
# Регистрация API-роутеров
# ---------------------------------------------------------

# 1. Prometheus metrics — на корне, для скрейпа внутри кластера
metrics_app = make_asgi_app(registry)
app.mount("/metrics", metrics_app)

# 2. Системные пробы k8s (/healthz, /readyz)
app.include_router(health_router)

# 3. WebSocket (/ws/logs)
app.include_router(ws_router)

# 4. Бизнес-логика API (/api/play/*, /api/ops/*)
app.include_router(chaos_router)
app.include_router(logs_router)