import asyncio
import json
import logging
from typing import Any, Dict, Optional
from fastapi import WebSocket
from redis import asyncio as aioredis
from app.services.ws_manager import LocalWebSocketManager

logger = logging.getLogger(__name__)


class ClusterEventBus:
    """Фасад для распределенного Pub/Sub через Redis и локальных сокетов."""

    def __init__(self, redis_url: str, channel_name: str) -> None:
        self._redis_url = redis_url
        self._channel_name = channel_name
        self._history_key = f"{channel_name}:history"
        self._ws_manager = LocalWebSocketManager()

        self._redis: Optional[aioredis.Redis] = None
        self._pubsub: Optional[aioredis.client.PubSub] = None
        self._listener_task: Optional[asyncio.Task] = None

    async def start(self) -> None:
        self._redis = aioredis.from_url(self._redis_url, decode_responses=True)
        self._pubsub = self._redis.pubsub(ignore_subscribe_messages=True)
        await self._pubsub.subscribe(self._channel_name)

        self._listener_task = asyncio.create_task(
            self._listen_redis(), name="redis_pubsub_worker"
        )
        logger.info("ClusterEventBus started, listening to %s", self._channel_name)

    async def stop(self) -> None:
        if self._listener_task:
            self._listener_task.cancel()
            try:
                await self._listener_task
            except asyncio.CancelledError:
                pass

        if self._pubsub:
            await self._pubsub.unsubscribe(self._channel_name)
            await self._pubsub.close()

        if self._redis:
            await self._redis.close()

        await self._ws_manager.close_all()

        logger.info("ClusterEventBus stopped.")

    async def _listen_redis(self) -> None:
        try:
            async for raw_message in self._pubsub.listen():
                if raw_message and raw_message.get("type") == "message":
                    payload: Dict[str, Any] = json.loads(raw_message["data"])
                    await self._ws_manager.broadcast(payload)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.exception("Redis PubSub error: %s", e)

    async def register_client(self, websocket: WebSocket) -> None:
        await self._ws_manager.connect(websocket)

    def unregister_client(self, websocket: WebSocket) -> None:
        self._ws_manager.disconnect(websocket)

    async def publish(self, event_data: dict) -> None:
        if not self._redis:
            raise RuntimeError("ClusterEventBus is not running.")
        payload = json.dumps(event_data)
        pipeline = self._redis.pipeline()
        pipeline.rpush(self._history_key, payload)
        pipeline.ltrim(self._history_key, -100, -1)
        pipeline.publish(self._channel_name, payload)
        await pipeline.execute()

    async def recent_events(self) -> list[Dict[str, Any]]:
        if not self._redis:
            raise RuntimeError("ClusterEventBus is not running.")
        raw_events = await self._redis.lrange(self._history_key, 0, -1)
        return [json.loads(raw_event) for raw_event in raw_events]