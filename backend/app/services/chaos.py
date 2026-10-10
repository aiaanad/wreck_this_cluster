import logging
import uuid
from typing import Any, Dict
from kubernetes import client

logger = logging.getLogger(__name__)


class ChaosService:

  def __init__(
      self,
      custom_api: client.CustomObjectsApi,
      namespace: str = "default",
      target_app: str = "chaos-app",
  ):
    self._api = custom_api
    self._namespace = namespace
    self._target_app = target_app

  def inject_pod_kill(self) -> None:
    chaos_name = f"priora-kill-{uuid.uuid4().hex[:6]}"
    manifest = {
        "apiVersion": "chaos-mesh.org/v1alpha1",
        "kind": "PodChaos",
        "metadata": {"name": chaos_name, "namespace": self._namespace},
        "spec": {
            "action": "pod-kill",
            "mode": "one",
            "selector": {
                "namespaces": [self._namespace],
                "labelSelectors": {"app": self._target_app},
            },
        },
    }
    self._apply_chaos("podchaoses", manifest)

  def inject_pod_failure(self, duration: str = "20s") -> None:
    chaos_name = f"pinata-fail-{uuid.uuid4().hex[:6]}"
    manifest = {
        "apiVersion": "chaos-mesh.org/v1alpha1",
        "kind": "PodChaos",
        "metadata": {"name": chaos_name, "namespace": self._namespace},
        "spec": {
            "action": "pod-failure",
            "mode": "one",
            "duration": duration,
            "selector": {
                "namespaces": [self._namespace],
                "labelSelectors": {"app": self._target_app},
            },
        },
    }
    self._apply_chaos("podchaoses", manifest)

  def inject_network_delay(
      self, latency: str = "1500ms", duration: str = "20s"
  ) -> None:
    chaos_name = f"slingshot-delay-{uuid.uuid4().hex[:6]}"
    manifest = {
        "apiVersion": "chaos-mesh.org/v1alpha1",
        "kind": "NetworkChaos",
        "metadata": {"name": chaos_name, "namespace": self._namespace},
        "spec": {
            "action": "delay",
            "mode": "all",
            "selector": {
                "namespaces": [self._namespace],
                "labelSelectors": {"app": self._target_app},
            },
            "delay": {
                "latency": latency,
                "correlation": "100",
                "jitter": "0ms",
            },
            "duration": duration,
        },
    }
    self._apply_chaos("networkchaoses", manifest)

  def _apply_chaos(self, plural: str, manifest: Dict[str, Any]) -> None:
    self._api.create_namespaced_custom_object(
        group="chaos-mesh.org",
        version="v1alpha1",
        namespace=self._namespace,
        plural=plural,
        body=manifest,
    )