import logging
from kubernetes import client, config

logger = logging.getLogger(__name__)


def get_k8s_custom_api() -> client.CustomObjectsApi:
  try:
    # Для работы внутри Pod в K8s
    config.load_incluster_config()  
  except config.ConfigException:
    # Для локальной разработки через ~/.kube/config
    config.load_kube_config()  
  return client.CustomObjectsApi()