import React, { useState } from 'react';
import { CHAOS_EXPERIMENTS } from '../utils/chaosManifests';
import { X, Copy, Check, Terminal, Play } from 'lucide-react';

interface ChaosMeshModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLevel?: string;
  username: string;
  onSimulateFastApi?: (experimentId: string) => void;
}

export const ChaosMeshModal: React.FC<ChaosMeshModalProps> = ({
  isOpen,
  onClose,
  activeLevel = 'pinata',
  username,
  onSimulateFastApi,
}) => {
  const [selectedTab, setSelectedTab] = useState<'manifest' | 'fastapi'>('manifest');
  const [selectedExp, setSelectedExp] = useState<string>(
    ['pinata', 'priora', 'slingshot'].includes(activeLevel) ? activeLevel : 'pinata'
  );
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentExperiment = CHAOS_EXPERIMENTS[selectedExp] || CHAOS_EXPERIMENTS.pinata;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerApi = async () => {
    setSimulating(true);
    setApiResponse(null);

    const endpoint = `/api/play/attack/${currentExperiment.action}`;
    const badge = currentExperiment.id === 'priora'
      ? 'KILL'
      : currentExperiment.id === 'slingshot'
      ? 'DELAY'
      : 'FAILURE';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username || 'zine-ui',
          action: `${currentExperiment.title} activated`,
          badge,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || `HTTP ${response.status}`);
      }

      setSimulating(false);
      const res = {
        timestamp: new Date().toISOString(),
        fastapi_endpoint: endpoint,
        http_status: response.status,
        backend_response: payload,
      };
      setApiResponse(JSON.stringify(res, null, 2));
      if (onSimulateFastApi) {
        onSimulateFastApi(currentExperiment.id);
      }
    } catch (error) {
      setSimulating(false);
      setApiResponse(JSON.stringify({ endpoint, error: error instanceof Error ? error.message : 'Request failed' }, null, 2));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border-2 border-gray-700 bg-[#14161b] text-gray-200 shadow-md sm:shadow-2xl">
        {/* Header tape aesthetic */}
        <div className="bg-[#1e222b] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#c81d25] inline-block" />
            <h3 className="font-typewriter font-bold text-sm tracking-wide text-white uppercase">
              Chaos Mesh Manifests & Python FastAPI Backend
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Experiment Selector */}
        <div className="flex border-b border-gray-800 bg-[#0f1115] px-3 pt-2 gap-1 overflow-x-auto">
          {Object.values(CHAOS_EXPERIMENTS).map((exp) => (
            <button
              key={exp.id}
              onClick={() => {
                setSelectedExp(exp.id);
                setApiResponse(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-t transition-colors whitespace-nowrap ${
                selectedExp === exp.id
                  ? 'bg-[#1a1d24] text-white border-t-2 border-[#c81d25] font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {exp.title}
            </button>
          ))}
        </div>

        {/* Sub-tabs: manifest and controller source */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#171a21] border-b border-gray-800 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab('manifest')}
              className={`px-2.5 py-1 rounded font-mono transition-colors ${
                selectedTab === 'manifest' ? 'bg-[#c81d25] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📄 Kubernetes YAML
            </button>
            <button
              onClick={() => setSelectedTab('fastapi')}
              className={`px-2.5 py-1 rounded font-mono transition-colors ${
                selectedTab === 'fastapi' ? 'bg-[#c81d25] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              🐍 FastAPI Controller
            </button>
          </div>

          <button
            onClick={() =>
              handleCopy(
                selectedTab === 'manifest'
                  ? currentExperiment.yaml
                  : selectedTab === 'fastapi'
                  ? currentExperiment.fastApiCode
                  : currentExperiment.yaml
              )
            }
            className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[50dvh] overflow-y-auto bg-[#0b0c0f] p-4 font-mono text-xs">
          {selectedTab === 'manifest' && (
            <div>
              <div className="mb-2 text-[11px] text-gray-400 flex items-center justify-between">
                <span>Target selector: <strong className="text-emerald-400">app: chaos-app</strong></span>
                <span className="text-amber-400">CRD: {currentExperiment.kind} ({currentExperiment.action})</span>
              </div>
              <pre className="p-3 bg-[#13151b] rounded border border-gray-800 text-green-300/90 whitespace-pre overflow-x-auto leading-relaxed">
                {currentExperiment.yaml}
              </pre>
            </div>
          )}

          {selectedTab === 'fastapi' && (
            <div>
              <div className="mb-2 text-[11px] text-gray-400">
                Python FastAPI endpoint с использованием библиотеки <code>kubernetes.client.CustomObjectsApi</code>:
              </div>
              <pre className="p-3 bg-[#13151b] rounded border border-gray-800 text-cyan-300/90 whitespace-pre overflow-x-auto leading-relaxed">
                {currentExperiment.fastApiCode}
              </pre>
            </div>
          )}

        </div>

        {/* Live FastAPI Simulation trigger bar */}
        <div className="bg-[#121418] border-t border-gray-800 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Terminal size={14} className="text-[#c81d25]" />
              <span>Тестовый запрос в FastAPI эндпоинт:</span>
            </div>
            <button
              onClick={handleTriggerApi}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#c81d25] hover:bg-[#a6171e] text-white rounded text-xs font-mono font-bold transition-colors disabled:opacity-50"
            >
              <Play size={12} />
              <span>{simulating ? 'Применение CRD...' : 'Вызвать FastAPI API'}</span>
            </button>
          </div>

          {apiResponse && (
            <div className="p-2 bg-black rounded border border-gray-800 text-[10px] font-mono text-emerald-400 max-h-28 overflow-y-auto">
              <pre>{apiResponse}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
