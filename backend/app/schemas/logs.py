from typing import Literal

from pydantic import BaseModel, Field

BadgeType = Literal["KILL", "DELAY", "FAILURE", "INFO"]

class LogRequest(BaseModel):
  username: str = Field(
      min_length=2,
      max_length=25,
      pattern=r"^[\w .@-]+$",
      description="Имя пользователя",
  )
  action: str = Field(
      min_length=2,
      max_length=120,
      pattern=r"^[^\x00-\x1f\x7f]+$",
      description="Описание действия",
  )
  badge: BadgeType = Field(default="INFO")

  model_config = {"str_strip_whitespace": True}


class AttackResponse(BaseModel):
  status: str = "success"
  message: str