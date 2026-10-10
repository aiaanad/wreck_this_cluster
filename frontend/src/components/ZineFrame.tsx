import React from 'react';
import { PageId, LogEntry } from '../types/chaos';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Code2 } from 'lucide-react';
import { playPageTurnSound, toggleSound, isSoundEnabled } from '../utils/audio';
import { TerminalLogs } from './TerminalLogs';

interface ZineFrameProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  onOpenManifestModal: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  children: React.ReactNode;
}

const PAGE_FLOW: PageId[] = ['cover', 'manual', 'pinata', 'priora', 'slingshot', 'contacts'];

export const ZineFrame: React.FC<ZineFrameProps> = ({
  currentPage,
  onPageChange,
  onOpenManifestModal,
  logs,
  onClearLogs,
  children,
}) => {
  const currentIndex = PAGE_FLOW.indexOf(currentPage);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < PAGE_FLOW.length - 1;

  const handlePrev = () => {
    if (canGoBack) {
      playPageTurnSound();
      onPageChange(PAGE_FLOW[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      playPageTurnSound();
      onPageChange(PAGE_FLOW[currentIndex + 1]);
    }
  };

  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-start overflow-hidden p-0 select-none sm:p-1">
      {/* Top Header Tab Bar matching user screenshots:
          WRECK THIS CLUSTER  |  WRECK THIS CLUSTER [DARK ZINE ED.] */}
      <div className="relative z-30 w-full max-w-md sm:max-w-xl flex items-center justify-between px-3 py-1.5 bg-[#121316] border border-gray-800 rounded-t-md text-xs shadow-md">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto py-0.5">
          <span className="font-mono text-white text-[11px] font-bold tracking-tight whitespace-nowrap">
            WRECK THIS CLUSTER
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Выключить звук' : 'Включить звук'}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} className="text-gray-600" />}
          </button>

          {/* K8S & FastAPI Architecture button */}
          <button
            onClick={onOpenManifestModal}
            title="Открыть Chaos Mesh манифесты и FastAPI код"
            className="flex items-center gap-1 text-[10px] font-mono bg-gray-800 hover:bg-gray-700 text-gray-200 px-2 py-0.5 rounded border border-gray-700 transition-colors"
          >
            <Code2 size={11} className="text-[#c81d25]" />
            <span className="hidden xs:inline">FastAPI/K8s</span>
          </button>
        </div>
      </div>

      {/* Main Notebook Container (Unified physical zine book) */}
      <div className="relative grid min-h-0 w-full max-w-md flex-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden border-x border-b border-gray-800 bg-[#0c0d10] shadow-md sm:max-w-xl sm:shadow-2xl">
        {/* Subtle white torn-paper edges on left and right */}
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-gray-200/15 via-transparent to-transparent pointer-events-none z-20" />
        <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-gray-200/15 via-transparent to-transparent pointer-events-none z-20" />

        {/* Ink splatter and xerox noise */}
        <div className="absolute inset-0 xerox-grit opacity-35 pointer-events-none z-10" />

        {/* Dynamic Page Content Slot (flex-1 min-h-0 takes remaining vertical space) */}
        <div className="relative z-10 min-h-0 w-full overflow-hidden flex flex-col">
          {children}
        </div>

        {/* Navigation button-bar (Sequentially stacked in autolayout above logs, NOT floating or overlapping!) */}
        {currentPage !== 'cover' && (
          <div className="relative z-20 w-full shrink-0 px-3 py-1.5 bg-[#14161b] border-t border-gray-800 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={!canGoBack}
              className="flex min-h-11 items-center gap-1 px-3 py-1 text-[11px] font-typewriter rounded bg-gray-800 text-gray-200 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={13} />
              <span>Назад</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoForward}
              className="flex min-h-11 items-center gap-1 px-3.5 py-1 text-[11px] font-typewriter rounded bg-white text-black hover:bg-gray-200 font-bold disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
            >
              <span>Вперед</span>
              <ChevronRight size={13} />
            </button>
          </div>
        )}

      </div>

      {/* Live logs follow the complete page instead of competing with its height. */}
      <div className="relative z-20 grid min-h-0 w-full max-w-md shrink-0 grid-rows-[auto_minmax(0,1fr)] sm:max-w-xl">
        <TerminalLogs
          logs={logs}
          onClearLogs={onClearLogs}
          onOpenManifest={onOpenManifestModal}
        />
      </div>
    </div>
  );
};
