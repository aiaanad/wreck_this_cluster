import os
import logging

logger = logging.getLogger(__name__)


class Settings:
    APP_ENV: str = os.getenv("APP_ENV", "development")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")
    CHANNEL_NAME: str = os.getenv("CHANNEL_NAME", "cluster_logs")
    K8S_NAMESPACE: str = os.getenv("K8S_NAMESPACE", "chaos-testing")
    TARGET_APP: str = os.getenv("TARGET_APP", "chaos-app")
    APP_ORIGINS: str = os.getenv("APP_ORIGINS", "http://localhost:5173")
    
    @property
    def app_origins_list(self) -> list[str]:
        return [o.strip() for o in self.APP_ORIGINS.split(",") if o.strip()]
    
    def log_safe(self) -> None:
        """Логируем конфиг без секретов."""
        safe_redis = self.REDIS_URL.split("@")[-1] if "@" in self.REDIS_URL else self.REDIS_URL
        logger.info(
            "Settings: env=%s redis_host=%s namespace=%s target=%s origins=%s",
            self.APP_ENV,
            safe_redis,
            self.K8S_NAMESPACE,
            self.TARGET_APP,
            self.APP_ORIGINS,
        )


settings = Settings()
settings.log_safe()