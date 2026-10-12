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
spec:
  action: pod-failure
  mode: one
  duration: '20s'
  selector:
    namespaces:
      - chaos-testing
    labelSelectors:
      app: chaos-app`,
    fastApiCode: `@app.post("/api/play/attack/pod-failure")
async def trigger_pod_failure(
    data: LogRequest,
    chaos: ChaosService = Depends(get_chaos_service),
):
    chaos.inject_pod_failure(duration="20s")`,
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
spec:
  action: pod-kill
  mode: one
  duration: '30s'
  selector:
    namespaces:
      - chaos-testing
    labelSelectors:
      app: chaos-app`,
    fastApiCode: `@app.post("/api/play/attack/pod-kill")
async def trigger_pod_kill(
    data: LogRequest,
    chaos: ChaosService = Depends(get_chaos_service),
):
    chaos.inject_pod_kill()`,
  },
  slingshot: {
    id: 'slingshot',
    name: 'network-delay-slingshot',
    title: 'Level 3: Network Delay / Loss (Рогатка)',
    kind: 'NetworkChaos',
    action: 'network-delay',
    targetNode: 'mws-worker-node-03',
    yaml: `apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: pigeon-network-delay
  namespace: chaos-testing
spec:
  action: delay
  mode: all
  selector:
    namespaces:
      - chaos-testing
    labelSelectors:
      app: chaos-app
  delay:
    latency: '1500ms'
    correlation: '100'
    jitter: '0ms'
  duration: '20s'`,
    fastApiCode: `@app.post("/api/play/attack/network-delay")
async def trigger_network_delay(
    data: LogRequest,
    chaos: ChaosService = Depends(get_chaos_service),
):
    chaos.inject_network_delay(latency="1500ms", duration="20s")`,
  },
};
