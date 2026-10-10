/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PageId, LogEntry } from './types/chaos';
import { ZineFrame } from './components/ZineFrame';
import { CoverPage } from './components/pages/CoverPage';
import { ManualPage } from './components/pages/ManualPage';
import { PinataPage } from './components/pages/PinataPage';
import { PrioraPage } from './components/pages/PrioraPage';
import { SlingshotPage } from './components/pages/SlingshotPage';
import { ContactsPage } from './components/pages/ContactsPage';
import { ChaosMeshModal } from './components/ChaosMeshModal';

const USERNAME_STORAGE_KEY = 'wreck-this-cluster-username';
type ChaosAction = 'pod-failure' | 'pod-kill' | 'network-delay';

function getStoredUsername(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(USERNAME_STORAGE_KEY) || '';
}

export const App: React.FC = () => {
  const [username, setUsername] = useState(getStoredUsername);
  const [loginDraft, setLoginDraft] = useState(getStoredUsername);
  const [loginOpen, setLoginOpen] = useState(!getStoredUsername());
  const [currentPage, setCurrentPage] = useState<PageId>('cover');
  const [manifestModalOpen, setManifestModalOpen] = useState(false);
  const [activeManifestLevel, setActiveManifestLevel] = useState<string>('pinata');

  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    let disposed = false;
    const mapBackendLog = (payload: {
      id: string;
      timestamp: string;
      username: string;
      action: string;
      badge: LogEntry['badge'];
    }): LogEntry => ({
      id: payload.id,
      time: payload.timestamp,
      source: `@${payload.username}`,
      message: payload.action,
      badge: payload.badge,
    });
    const isPublicLog = (payload: Parameters<typeof mapBackendLog>[0]) =>
      !payload.action.startsWith('Выбран ');

    const loadHistory = async () => {
      try {
        const response = await fetch('/api/play/logs');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const history = (await response.json()) as Parameters<typeof mapBackendLog>[0][];
        if (!disposed) {
          const historyLogs = history.filter(isPublicLog).map(mapBackendLog);
          setLogs((previous) => {
            const historyIds = new Set(historyLogs.map((log) => log.id));
            return [...historyLogs, ...previous.filter((log) => !historyIds.has(log.id))];
          });
        }
      } catch {
        // The live UI remains available while the backend is offline.
      }
    };

    void loadHistory();
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws/logs`);

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data) as Parameters<typeof mapBackendLog>[0];
      if (!isPublicLog(payload)) return;
      setLogs((previous) => {
        if (previous.some((log) => log.id === payload.id)) return previous;
        return [...previous, mapBackendLog(payload)];
      });
    };

    return () => socket.close();
  }, []);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextUsername = loginDraft.trim();
    if (nextUsername.length < 2) return;

    window.localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
    setUsername(nextUsername);
    setLoginOpen(false);
  };

  const triggerAttack = async (action: ChaosAction) => {
    const badges: Record<ChaosAction, 'FAILURE' | 'KILL' | 'DELAY'> = {
      'pod-failure': 'FAILURE',
      'pod-kill': 'KILL',
      'network-delay': 'DELAY',
    };
    const response = await fetch(`/api/play/attack/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username || 'zine-ui',
        action: `Interactive level triggered: ${action}`,
        badge: badges[action],
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.detail || `HTTP ${response.status}`);
    }
  };

  const reportAttackError = (action: ChaosAction, error: unknown) => {
    console.error(`Chaos Mesh request failed (${action})`, error);
  };

  const handleOpenManifest = (levelId?: string) => {
    if (levelId) {
      setActiveManifestLevel(levelId);
    } else {
      // Default to current page
      if (['pinata', 'priora', 'slingshot'].includes(currentPage)) {
        setActiveManifestLevel(currentPage);
      }
    }
    setManifestModalOpen(true);
  };

  const handleRestart = () => {
    setCurrentPage('cover');
  };

  const handlePageChange = (page: PageId) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#0a0a0a] text-white flex flex-col justify-between">
      {/* Background dark zine ambiance texture */}
      <div className="absolute inset-0 bg-[#0a0a0a] xerox-grit opacity-90 pointer-events-none" />

      {/* Main Zine Notebook Area */}
      <div className="relative z-10 min-h-0 flex-1 overflow-hidden p-2 sm:p-4">
        <ZineFrame
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onOpenManifestModal={() => handleOpenManifest()}
          logs={logs}
          onClearLogs={() => setLogs([])}
        >
          {currentPage === 'cover' && (
            <CoverPage onNext={() => handlePageChange('manual')} />
          )}

          {currentPage === 'manual' && (
            <ManualPage onNext={() => handlePageChange('pinata')} />
          )}

          {currentPage === 'pinata' && (
            <PinataPage
              onAttack={triggerAttack}
              onAttackError={reportAttackError}
              onOpenManifest={handleOpenManifest}
              onNext={() => handlePageChange('priora')}
            />
          )}

          {currentPage === 'priora' && (
            <PrioraPage
              onAttack={triggerAttack}
              onAttackError={reportAttackError}
              onOpenManifest={handleOpenManifest}
              onNext={() => handlePageChange('slingshot')}
            />
          )}

          {currentPage === 'slingshot' && (
            <SlingshotPage
              onAttack={triggerAttack}
              onAttackError={reportAttackError}
              onOpenManifest={handleOpenManifest}
              onNext={() => handlePageChange('contacts')}
            />
          )}

          {currentPage === 'contacts' && (
            <ContactsPage
              onRestart={handleRestart}
              onOpenManifest={() => handleOpenManifest('pinata')}
            />
          )}
        </ZineFrame>
      </div>

      {/* Chaos Mesh & Python FastAPI Architecture Modal */}
      <ChaosMeshModal
        isOpen={manifestModalOpen}
        onClose={() => setManifestModalOpen(false)}
        activeLevel={activeManifestLevel}
        username={username}
      />

      {loginOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm border-2 border-[#c81d25] bg-[#111317] p-5 shadow-md sm:shadow-2xl"
          >
            <p className="font-typewriter text-[11px] uppercase tracking-[0.18em] text-[#c81d25]">
              ACCESS LOG / OPERATOR
            </p>
            <h2 className="mt-2 font-marker text-3xl text-white">Как тебя записать?</h2>
            <p className="mt-2 font-typewriter text-xs leading-relaxed text-gray-400">
              Логин сохранится в браузере и будет использоваться в живом журнале атак.
            </p>
            <label className="mt-5 block font-typewriter text-xs text-gray-300" htmlFor="operator-name">
              Логин
            </label>
            <input
              id="operator-name"
              autoFocus
              value={loginDraft}
              onChange={(event) => setLoginDraft(event.target.value)}
              minLength={2}
              maxLength={25}
              placeholder="например, ayaana"
              className="mt-2 w-full border border-gray-600 bg-black px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#c81d25]"
            />
            <button
              type="submit"
              className="mt-4 w-full bg-[#c81d25] px-4 py-2 font-typewriter text-xs font-bold uppercase text-white transition-colors hover:bg-[#a6171e]"
            >
              Войти в журнал
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
