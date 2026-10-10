import React, { useState } from 'react';
import { LogEntry } from '../types/chaos';
import { Terminal, ChevronDown, ChevronUp, Trash2, Code2 } from 'lucide-react';

interface TerminalLogsProps {
  logs: LogEntry[];
  onClearLogs?: () => void;
  onOpenManifest?: () => void;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({
  logs,
  onClearLogs,
  onOpenManifest,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full bg-[#121316]/95 border-t border-gray-700/80 shadow-[0_-4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all select-none">
      {/* Header bar styled like terminal carbon tape */}
      <div className="flex items-center justify-between gap-1 px-2 py-1 border-b border-gray-800 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <Terminal size={12} className="shrink-0 text-gray-400 sm:h-[13px] sm:w-[13px]" />
          <span className="truncate font-typewriter uppercase tracking-[0.04em] text-gray-200 font-bold text-[9px] sm:text-[11px] sm:tracking-wider">
            ЖУРНАЛ СОБЫТИЙ КЛАСТЕРА
          </span>
          <span className="hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest px-1 py-0.2 bg-black/40 rounded border border-gray-800 sm:inline">
            LIVE LOGS
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {onOpenManifest && (
            <button
              onClick={onOpenManifest}
              title="Открыть Chaos Mesh манифест и FastAPI код"
              className="flex min-h-11 items-center gap-1 rounded border border-gray-700 bg-gray-800/60 px-1 py-0.5 text-[9px] font-mono text-gray-400 transition-colors hover:bg-gray-700 hover:text-white sm:min-h-9 sm:px-1.5 sm:text-[10px]"
            >
              <Code2 size={11} className="text-[#c81d25]" />
              <span className="hidden sm:inline">YAML/API</span>
            </button>
          )}

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              title="Очистить лог"
              className="min-h-11 min-w-11 text-gray-400 hover:text-red-400 p-1 rounded hover:bg-gray-800 transition-colors sm:min-h-9 sm:min-w-9"
            >
              <Trash2 size={11} className="sm:h-3 sm:w-3" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Свернуть' : 'Развернуть'}
            className="min-h-11 min-w-11 text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors sm:min-h-9 sm:min-w-9"
          >
            {isExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {/* Log lines container */}
      <div
        className={`overflow-y-auto px-2 py-1.5 font-courier text-[10px] transition-all sm:px-3 sm:py-2 sm:text-[11px] ${
          isExpanded ? 'max-h-[min(22rem,38vh)]' : 'max-h-[min(7rem,18vh)] sm:max-h-[min(9rem,18vh)]'
        }`}
      >
        {logs.length > 0 && (
          logs.slice(isExpanded ? 0 : -5).map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-1 border-b border-gray-800/60 py-0.5 leading-tight last:border-b-0 sm:grid-cols-[5.4rem_minmax(0,1fr)_auto] sm:gap-2"
            >
              <span className="flex min-w-0 flex-col text-[9px] leading-tight text-gray-400 sm:text-[10px]">
                <span className="select-text">{entry.time}</span>
                <span className="truncate font-bold text-gray-300">{entry.source}</span>
              </span>
              <span
                className="line-clamp-1 min-w-0 select-text text-gray-200 sm:line-clamp-2"
                title={entry.message}
              >
                {entry.message}
              </span>
              {entry.badge && (
                <span
                  className={`text-[9px] font-bold px-1 py-0.2 rounded font-mono shrink-0 uppercase tracking-wider ${
                    entry.badge === 'KILL'
                      ? 'bg-[#c81d25] text-white shadow-[0_0_8px_rgba(200,29,37,0.5)]'
                      : entry.badge === 'DELAY'
                      ? 'bg-[#d97706] text-black font-extrabold'
                      : entry.badge === 'FAILURE'
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {entry.badge}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
