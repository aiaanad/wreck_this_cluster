export interface ChaosExperimentConfig {
  id: string;
  name: string;
  title: string;
  kind: 'PodChaos' | 'NetworkChaos';
  action: string;
  targetNode: string;
  yaml: string;
  fastApiCode: string;
}

export const CHAOS_EXPERIMENTS: Record<string, ChaosExperimentConfig> = {
  pinata: {
    id: 'pinata',
    name: 'pod-failure-pinata',
    title: 'Level 1: Pod Failure (Пиньята)',
    kind: 'PodChaos',
    action: 'pod-failure',
    targetNode: 'mws-worker-node-01',
    yaml: `apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: kirby-pod-pinata-failure
  namespace: chaos-testing
  labels:
    app.kubernetes.io/component: chaos-mesh
    cluster.mws/node: mws-worker-node-01
spec:
  action: pod-failure
  mode: one
  duration: '60s'
  selector:
    namespaces:
      - production-workloads
    labelSelectors:
      app: kirby-party-pod
      edition: dark-zine
    nodeSelectors:
      kubernetes.io/hostname: mws-worker-node-01`,
    fastApiCode: `@app.post("/api/attack/pod-failure")
async def trigger_pod_failure(payload: ChaosTriggerRequest):
    """
    Создает PodChaos эксперимент (pod-failure) на ноде mws-worker-node-01
    с использованием официальной библиотеки kubernetes-client.
    """
    custom_api = client.CustomObjectsApi(k8s_client)
    manifest = {
        "apiVersion": "chaos-mesh.org/v1alpha1",
        "kind": "PodChaos",
        "metadata": {
            "name": f"kirby-pod-pinata-{uuid.uuid4().hex[:6]}",
            "namespace": "chaos-testing"
        },
        "spec": {
            "action": "pod-failure",
            "mode": "one",
            "duration": "60s",
            "selector": {
                "namespaces": ["production-workloads"],
                "labelSelectors": {"app": "kirby-party-pod"}
            }
        }
    }
    response = custom_api.create_namespaced_custom_object(
        group="chaos-mesh.org",
        version="v1alpha1",
        namespace="chaos-testing",
        plural="podchaos",
        body=manifest
    )
    return {"status": "injected", "chaos_id": response["metadata"]["name"]}`,
  },
  priora: {
    id: 'priora',
    name: 'priora-sigkill',
    title: 'Level 2: Pod Kill (Приора SIGKILL)',
    kind: 'PodChaos',
    action: 'pod-kill',
    targetNode: 'mws-worker-node-02',
    yaml: `apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: priora-sigkill-crash
  namespace: chaos-testing
  labels:
    speed.kmh: '180'
    license.plate: 'B777OP777'
    cluster.mws/node: mws-worker-node-02
spec:
  action: pod-kill
  mode: fixed-count
  value: '1'
  gracePeriod: 0
  selector:
    namespaces:
      - production-workloads
    labelSelectors:
      app: kirby-auth-service
    nodeSelectors:
      kubernetes.io/hostname: mws-worker-node-02`,
    fastApiCode: `@app.post("/api/attack/pod-kill")
async def trigger_priora_sigkill(payload: PrioraKillRequest):
    """
    Экстренный SIGKILL пода через Chaos Mesh (gracePeriod=0).
    Имитирует мгновенное столкновение и завершение процесса с кодом 137.
    """
    custom_api = client.CustomObjectsApi(k8s_client)
    manifest = {
        "apiVersion": "chaos-mesh.org/v1alpha1",
        "kind": "PodChaos",
        "metadata": {
            "name": f"priora-sigkill-{int(time.time())}",
            "namespace": "chaos-testing",
            "annotations": {"chaos.driver": "lada-priora-777"}
        },
        "spec": {
            "action": "pod-kill",
            "mode": "one",
            "gracePeriod": 0,
            "selector": {
                "namespaces": ["production-workloads"],
                "labelSelectors": {"app": "kirby-auth-service"}
            }
        }
    }
    res = custom_api.create_namespaced_custom_object(
        group="chaos-mesh.org",
        version="v1alpha1",
        namespace="chaos-testing",
        plural="podchaos",
        body=manifest
    )
    return {"status": "killed", "exit_code": 137, "resource": res["metadata"]["name"]}`,
  },
  slingshot: {
    id: 'slingshot',
    name: 'network-delay-slingshot',
    title: 'Level 3: Network Delay / Loss (Рогатка)',
    kind: 'NetworkChaos',
    action: 'delay',
    targetNode: 'mws-worker-node-03',
    yaml: `apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: pigeon-network-delay
  namespace: chaos-testing
  labels:
    tool: slingshot-stone
    cluster.mws/node: mws-worker-node-03
spec:
  action: delay
  mode: all
  selector:
    namespaces:
      - production-workloads
    labelSelectors:
      app: kirby-packet-router
  delay:
    latency: '450ms'
    jitter: '50ms'
    correlation: '25'
  direction: to`,
    fastApiCode: `@app.post("/api/attack/network-delay")
async def inject_network_delay(latency: str = "450ms", jitter: str = "50ms"):
    """
    Инжектирует сетевую задержку NetworkChaos в TCP пакеты.
    Пакеты не теряются безвозвратно, но время RTT увеличивается на 450мс.
    """
    custom_api = client.CustomObjectsApi(k8s_client)
    manifest = {
        "apiVersion": "chaos-mesh.org/v1alpha1",
        "kind": "NetworkChaos",
        "metadata": {
            "name": f"pigeon-delay-{uuid.uuid4().hex[:6]}",
            "namespace": "chaos-testing"
        },
        "spec": {
            "action": "delay",
            "mode": "all",
            "selector": {"namespaces": ["production-workloads"]},
            "delay": {"latency": latency, "jitter": jitter},
            "direction": "to"
        }
    }
    return custom_api.create_namespaced_custom_object(
        group="chaos-mesh.org",
        version="v1alpha1",
        namespace="chaos-testing",
        plural="networkchaos",
        body=manifest
    )`,
  },
};
