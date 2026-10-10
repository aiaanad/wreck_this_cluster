import React, { useState } from 'react';
import { RotateCcw, Download, Check, Code2, ExternalLink } from 'lucide-react';
import { playBurstSound } from '../../utils/audio';

interface ContactsPageProps {
  onRestart: () => void;
  onOpenManifest: () => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({
  onRestart,
  onOpenManifest,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadReport = () => {
    const report = `# WRECK THIS CLUSTER - Chaos Test Report
Дата проведения: ${new Date().toLocaleString()}
Кластер: mws-prod-edge-01 (MWS Kubernetes Cluster)
Статус: ALL PODS DESTROYED / CHAOS INJECTED

УРОВНИ ХАОСА:
1. Pod Failure (Пиньята):
   - Манифест: PodChaos (action: pod-failure)
   - Нода: mws-worker-node-01
   - Результат: Каркас пода разрушен с 5-го удара биты. Healthcheck упал.

2. Pod Kill (Приора SIGKILL):
   - Манифест: PodChaos (action: pod-kill, gracePeriod: 0)
   - Авто: Заниженная Lada Priora (Госномер В 777 ОР 777)
   - Результат: Мгновенное завершение процесса (Exit Code 137). Под расплющен.

3. Network Delay / Loss (Рогатка):
   - Манифест: NetworkChaos (action: delay, latency: 450ms)
   - Сетевые пакеты: Голуби RFC 793
   - Результат: TCP пакеты доставлены с задержкой +450ms.

БЭКЕНД:
   - FastAPI Python Controller + kubernetes.client.CustomObjectsApi
   - Инъекции в MWS кластер выполнены успешно.
`;
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'chaos_test_report.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleFullRestart = () => {
    playBurstSound();
    onRestart();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
      {/* Header Stamped Title matching Image 2: *КОНТАКТЫ* */}
      <div className="relative z-10 flex flex-col items-center pt-2 pb-1 text-center">
        <div className="border-2 border-white px-6 py-1.5 shadow-[2px_2px_0px_#c81d25]">
          <h2 className="font-typewriter font-black text-2xl sm:text-3xl text-white tracking-widest uppercase">
            *КОНТАКТЫ*
          </h2>
        </div>
        <span className="font-cursive text-base sm:text-lg text-gray-300 mt-1">
          Тестирование успешно завершено!
        </span>
      </div>

      {/* Perforated Receipt Card (Matches Image 2 exactly!) */}
      <div className="relative z-10 my-2 bg-[#14151a] border-2 border-dashed border-gray-600 p-5 rounded-sm shadow-xl font-courier text-xs sm:text-[13px] leading-relaxed">
        {/* Corner tape */}
        <div className="absolute -top-3 -right-3 w-16 h-6 masking-tape transform rotate-6 z-10" />

        <div className="grid gap-2 text-gray-300">
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-2 border-b border-gray-800 pb-1 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
            <span className="text-gray-500 font-bold">AUTHOR:</span>
            <span className="min-w-0 break-words text-right font-bold text-white">Danilova Ayaana</span>
          </div>

          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-2 border-b border-gray-800 pb-1 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
            <span className="text-gray-500 font-bold">GITHUB:</span>
            <a
              href="https://github.com/aiaanad/wreck_this_cluster"
              target="_blank"
              rel="noreferrer"
              className="flex min-w-0 items-start justify-end gap-1 break-all text-right text-cyan-400 underline decoration-cyan-400/40 underline-offset-2"
            >
              <span className="min-w-0">github.com/aiaanad/wreck_this_cluster</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-2 border-b border-gray-800 pb-1 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
            <span className="text-gray-500 font-bold">TG:</span>
            <span className="break-all text-right text-cyan-400">@mwernon</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col items-center gap-3 pt-2">
        {/* Big Ruby Red Border Button matching Image 2: НАЧАТЬ ИГРУ СНОВА */}
        <button
          onClick={handleFullRestart}
          className="w-full max-w-sm py-3.5 px-4 bg-[#c81d25] hover:bg-[#a6171e] text-white font-typewriter font-black text-sm uppercase tracking-widest rounded shadow-[0_0_15px_rgba(200,29,37,0.5)] border-2 border-white transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          <span>НАЧАТЬ ИГРУ СНОВА</span>
        </button>

        {/* Secondary Utility Actions */}
        <div className="flex w-full max-w-sm flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center">
          <button
            onClick={onOpenManifest}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-[11px] font-mono text-gray-300 transition-colors hover:bg-gray-700"
          >
            <Code2 size={12} className="text-[#c81d25]" />
            <span>Манифесты K8s</span>
          </button>
        </div>
      </div>
    </div>
  );
};
