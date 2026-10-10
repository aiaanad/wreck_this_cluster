from datetime import datetime
import logging
import uuid
from typing import Any, Dict

logger = logging.getLogger("audit")


def create_audit_event(username: str, action: str, badge: str) -> Dict[str, Any]:
  payload = {
      "id": uuid.uuid4().hex[:8],
      "timestamp": datetime.now().strftime("%H:%M:%S"),
      "username": username,
      "action": action,
      "badge": badge,
  }
  logger.info(
      "audit_event_created",
      extra={"event_id": payload["id"], "badge": badge},
  )
  return payload