export type PageId = 'cover' | 'manual' | 'pinata' | 'priora' | 'slingshot' | 'contacts';

export interface LogEntry {
  id: string;
  time: string;
  source: string;
  message: string;
  badge?: 'KILL' | 'DELAY' | 'FAILURE' | 'RESTORE' | 'INFO';
}

export interface MwsNode {
  name: string;
  ip: string;
  status: 'Ready' | 'Degraded' | 'ChaosInjected';
  activeExperiments: string[];
}

export interface ChaosMeshManifest {
  apiVersion: string;
  kind: 'PodChaos' | 'NetworkChaos' | 'StressChaos';
  metadata: {
    name: string;
    namespace: string;
    annotations?: Record<string, string>;
  };
  spec: Record<string, unknown>;
}
