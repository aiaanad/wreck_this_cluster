import React, { useState, useRef, useEffect } from 'react';
import { playCarCrashSound } from '../../utils/audio';
import { RefreshCw, Code2, Flame } from 'lucide-react';

interface PrioraPageProps {
  onAttack: (action: 'pod-kill') => Promise<void>;
  onAttackError: (action: 'pod-kill', error: unknown) => void;
  onOpenManifest: (levelId: string) => void;
  onNext?: () => void;
}

export const PrioraPage: React.FC<PrioraPageProps> = ({
  onAttack,
  onAttackError,
  onOpenManifest,
}) => {
  const [driveProgress, setDriveProgress] = useState(0); // 0..100
  const [isHolding, setIsHolding] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);

  const holdIntervalRef = useRef<number | null>(null);
  const isCrashedRef = useRef(false);
  isCrashedRef.current = isCrashed;

  /* ---------- Hold logic ---------- */

  const startHold = () => {
    if (isCrashedRef.current) return;
    setIsHolding(true);

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = window.setInterval(() => {
      setDriveProgress((prev) => {
        const next = prev + 5.5;
        if (next >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          return 100;
        }
        return next;
      });
    }, 20);
  };

  const endHold = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // Unified pointer handlers (mouse + touch + pen) with pointer capture
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    startHold();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    endHold();
  };

  /* ---------- Crash ---------- */

  const triggerCrash = () => {
    setIsCrashed(true);
    setIsHolding(false);
    playCarCrashSound();
    void onAttack('pod-kill').catch((error) => onAttackError('pod-kill', error));
  };

  useEffect(() => {
    if (driveProgress >= 100 && !isCrashedRef.current) triggerCrash();
  }, [driveProgress]);

  const handleReset = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setIsCrashed(false);
    setDriveProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  /* ---------- Coordinates ---------- */
  // viewBox: 640 x 440, horizon at y=215, vanishing point (320,215)
  const podX = 320;
  const podY = 250;

  const t = driveProgress / 100;
  const carX = 140 + t * (podX - 140);
  const carY = 310 + t * (168 - 310);
  const carScale = 0.96 - t * (0.96 - 0.72);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden p-2 select-none sm:p-4">
      {/* ---------- HEADER ---------- */}
      <div className="relative z-10 shrink-0 border-b border-gray-800 pb-1.5 sm:pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="font-marker text-base leading-tight tracking-wide text-white sm:text-3xl">
              *2. PRIORA SIGKILL*
            </h2>
            <p className="mt-0.5 font-cursive text-[11px] font-bold leading-snug text-[#c81d25] sm:text-base">
              {isCrashed
                ? 'Под расплющен прямо под Приорой! SIGKILL доставлен.'
                : 'Зажал машину, глянул на дашборд — кластер переживает. С кем не бывает.'}
            </p>
          </div>
          <button
            onClick={() => onOpenManifest('priora')}
            className="flex shrink-0 items-center gap-1 rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono text-[10px] text-gray-300 shadow-sm transition-colors hover:bg-gray-700 sm:px-2.5 sm:text-[11px]"
            title="Открыть PodChaos (pod-kill) манифест"
          >
            <Code2 size={12} className="text-[#c81d25]" />
            <span>YAML</span>
          </button>
        </div>
      </div>

      {/* ---------- STAGE (fixed aspect ratio — ничего не обрезается) ---------- */}
      <div className="relative z-10 my-2 flex min-h-0 flex-1 items-center justify-center sm:my-3">
        <div
          className="relative aspect-[640/440] w-full max-w-full overflow-hidden rounded-md border border-gray-800 bg-[#111317] shadow-md sm:shadow-2xl"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg
            viewBox="0 0 640 440"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ touchAction: 'none' }}
          >
            <defs>
              <linearGradient id="skyGradSmooth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9fc1d8" />
                <stop offset="55%" stopColor="#c5dbe8" />
                <stop offset="100%" stopColor="#dce8ee" />
              </linearGradient>
              <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#485c40" />
                <stop offset="100%" stopColor="#31402c" />
              </linearGradient>
              <linearGradient id="asphaltGradSmooth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#696767" />
                <stop offset="40%" stopColor="#7a7676" />
                <stop offset="100%" stopColor="#8e8989" />
              </linearGradient>
              <linearGradient id="carPaintDirect" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2c3038" />
                <stop offset="30%" stopColor="#1a1d24" />
                <stop offset="100%" stopColor="#0d0f12" />
              </linearGradient>
              <linearGradient id="podEnFaceBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#48cae4" />
                <stop offset="30%" stopColor="#0096c7" />
                <stop offset="100%" stopColor="#023e8a" />
              </linearGradient>
              <radialGradient id="rearLightGlowDirect" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff0000" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#800000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* SKY */}
            <rect x="0" y="0" width="640" height="215" fill="url(#skyGradSmooth)" />

            {/* Clouds */}
            <g opacity="0.55">
              <ellipse cx="140" cy="62" rx="46" ry="13" fill="#ffffff" />
              <ellipse cx="175" cy="56" rx="30" ry="15" fill="#ffffff" />
              <ellipse cx="105" cy="68" rx="28" ry="10" fill="#ffffff" />
            </g>
            <g opacity="0.45">
              <ellipse cx="400" cy="98" rx="55" ry="13" fill="#ffffff" />
              <ellipse cx="445" cy="92" rx="35" ry="16" fill="#ffffff" />
              <ellipse cx="360" cy="104" rx="30" ry="10" fill="#ffffff" />
            </g>
            <circle cx="520" cy="70" r="28" fill="#f2c879" opacity="0.75" />

            {/* CITY SKYLINE — всё стоит на y=215 */}
            <path
              d="M 0 215 L 0 165 L 55 165 L 55 185 L 105 185 L 105 145 L 155 145 L 155 180 L 205 180 L 205 125 L 260 125 L 260 175 L 315 175 L 315 140 L 375 140 L 375 175 L 430 175 L 430 115 L 490 115 L 490 170 L 545 170 L 545 135 L 640 135 L 640 215 Z"
              fill="#243146"
              opacity="0.6"
            />

            {/* GROUND */}
            <rect x="0" y="215" width="640" height="225" fill="url(#groundGrad)" />

            {/* ROAD — vanishing point (320,215) */}
            <path
              d="M 320 215 L -40 440 L 680 440 Z"
              fill="url(#asphaltGradSmooth)"
              stroke="#5c5959"
              strokeWidth="1.2"
            />
            <path d="M 320 215 L -40 440 L -80 440 L 305 215 Z" fill="#3a4834" opacity="0.55" />
            <path d="M 320 215 L 680 440 L 720 440 L 335 215 Z" fill="#3a4834" opacity="0.55" />

            {/* Dashed centre line with perspective thickness */}
            <g stroke="#e8e2d0" strokeLinecap="round" opacity="0.55">
              <line x1="320" y1="228" x2="320" y2="236" strokeWidth="1" />
              <line x1="320" y1="248" x2="320" y2="258" strokeWidth="1.4" />
              <line x1="320" y1="272" x2="320" y2="284" strokeWidth="1.8" />
              <line x1="320" y1="300" x2="320" y2="314" strokeWidth="2.2" />
              <line x1="320" y1="332" x2="320" y2="348" strokeWidth="2.8" />
              <line x1="320" y1="368" x2="320" y2="386" strokeWidth="3.4" />
              <line x1="320" y1="408" x2="320" y2="428" strokeWidth="4" />
            </g>

            {/* POD */}
            <g transform={`translate(${podX}, ${podY})`}>
              {!isCrashed ? (
                <g>
                  <ellipse cx="-9" cy="3" rx="5" ry="2.5" fill="#023e8a" />
                  <ellipse cx="9" cy="3" rx="5" ry="2.5" fill="#023e8a" />
                  <rect x="-18" y="-29" width="36" height="31" rx="6.5" fill="url(#podEnFaceBody)" stroke="#0077b6" strokeWidth="1.2" />
                  <path d="M -15 -27 L 15 -27" stroke="#caf0f8" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                  <circle cx="-14" cy="-21" r="1.1" fill="#06d6a0" />
                  <circle cx="-14" cy="-16" r="1.1" fill="#c81d25" />
                  <circle cx="14" cy="-21" r="1.1" fill="#06d6a0" />
                  <circle cx="14" cy="-16" r="1.1" fill="#06d6a0" />

                  {/* Left eye */}
                  <ellipse cx="-6.5" cy="-13" rx="2.8" ry="5.2" fill="#03045e" />
                  <ellipse cx="-6.5" cy="-11" rx="1.8" ry="3.2" fill="#0096c7" />
                  <circle cx="-7.2" cy="-15" r="1.2" fill="#ffffff" />
                  <circle cx="-5.8" cy="-9" r="0.6" fill="#ffffff" />

                  {/* Right eye */}
                  <ellipse cx="6.5" cy="-13" rx="2.8" ry="5.2" fill="#03045e" />
                  <ellipse cx="6.5" cy="-11" rx="1.8" ry="3.2" fill="#0096c7" />
                  <circle cx="5.8" cy="-15" r="1.2" fill="#ffffff" />
                  <circle cx="7.2" cy="-9" r="0.6" fill="#ffffff" />

                  <ellipse cx="-11.5" cy="-7" rx="2.8" ry="1.6" fill="#ff4d6d" opacity="0.85" />
                  <ellipse cx="11.5" cy="-7" rx="2.8" ry="1.6" fill="#ff4d6d" opacity="0.85" />
                  <path d="M -3.5 -4 Q 0 -7 3.5 -4" stroke="#03045e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </g>
              ) : (
                <g transform="translate(0, 8)">
                  <ellipse cx="0" cy="2" rx="36" ry="8" fill="#023e8a" stroke="#0077b6" strokeWidth="1.2" />
                  <ellipse cx="0" cy="1" rx="30" ry="6.5" fill="#0096c7" />
                  <g stroke="#03045e" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="-14" y1="-2" x2="-8" y2="2" />
                    <line x1="-8" y1="-2" x2="-14" y2="2" />
                    <line x1="8" y1="-2" x2="14" y2="2" />
                    <line x1="14" y1="-2" x2="8" y2="2" />
                  </g>
                  <path d="M -3 2 C -3 9 -5 14 0 15 C 5 14 3 9 3 2 Z" fill="#ff4d6d" stroke="#c9184a" strokeWidth="1" />
                </g>
              )}
            </g>

            {/* LADA PRIORA */}
            <g
              transform={`translate(${carX}, ${carY}) scale(${carScale * 1.15}, ${carScale})`}
              className="transition-transform duration-75"
            >
              <ellipse cx="0" cy="148" rx="108" ry="13" fill="#000000" opacity="0.92" />

              {isHolding && (
                <g opacity="0.8" className="pointer-events-none">
                  <circle cx="2" cy="146" r="9" fill="#64748b" />
                  <circle cx="0" cy="156" r="14" fill="#94a3b8" />
                  <circle cx="-2" cy="168" r="18" fill="#cbd5e1" />
                </g>
              )}

              {/* Body */}
              <path
                d="M -88 135 C -96 122, -94 95, -82 82 C -70 68, -54 36, -40 24 C -28 16, 28 16, 40 24 C 54 36, 70 68, 82 82 C 94 95, 96 122, 88 135 C 82 142, 74 145, 54 145 L 50 130 C 46 124, 34 124, 32 130 L -32 130 C -34 124, -46 124, -50 130 L -54 145 C -74 145, -82 142, -88 135 Z"
                fill="url(#carPaintDirect)"
                stroke="#383d47"
                strokeWidth="2"
              />

              {/* Rear windshield */}
              <path d="M -36 26 C -26 20, 26 20, 36 26 L 62 72 C 58 75, -58 75, -62 72 Z" fill="#181c24" stroke="#2d3340" strokeWidth="1.5" />

              {/* Trunk */}
              <path d="M -76 80 C -68 77, 68 77, 76 80 L 72 104 C 68 108, -68 108, -72 104 Z" fill="#1a1d24" stroke="#2c313c" strokeWidth="1.2" />

              {/* Plate */}
              <g transform="translate(0, 102)">
                <rect x="-32" y="-8" width="64" height="16" fill="#ffffff" stroke="#1a1a1a" strokeWidth="1.2" rx="1.5" />
                <rect x="22" y="-6" width="7" height="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.4" />
                <line x1="22" y1="-2" x2="29" y2="-2" stroke="#0038a8" strokeWidth="1.4" />
                <line x1="22" y1="2" x2="29" y2="2" stroke="#d52b1e" strokeWidth="1.4" />
                <text x="-4" y="3.5" fill="#000000" fontSize="8.5" fontFamily="'Courier Prime', monospace" fontWeight="bold" letterSpacing="0.8" textAnchor="middle">
                  В777ОР
                </text>
              </g>

              {/* Taillights */}
              <g>
                <path d="M -80 88 L -50 88 C -48 100, -50 104, -52 106 L -82 106 C -84 100, -82 92, -80 88 Z" fill="#dc2626" stroke="#ef4444" strokeWidth="1" />
                <circle cx="-65" cy="98" r="12" fill="url(#rearLightGlowDirect)" opacity={isHolding ? '1' : '0.65'} />
              </g>
              <g>
                <path d="M 50 88 L 80 88 C 82 92, 84 100, 82 106 L 52 106 C 50 104, 48 100, 50 88 Z" fill="#dc2626" stroke="#ef4444" strokeWidth="1" />
                <circle cx="65" cy="98" r="12" fill="url(#rearLightGlowDirect)" opacity={isHolding ? '1' : '0.65'} />
              </g>

              {/* Bumper + tires */}
              <path d="M -92 120 C -92 112, 92 112, 92 120 L 86 140 C 82 146, -82 146, -86 140 Z" fill="#14161b" stroke="#262a33" strokeWidth="1.2" />
              <rect x="-94" y="122" width="24" height="28" rx="4" fill="#0a0a0c" stroke="#1f232b" strokeWidth="2" />
              <rect x="70" y="122" width="24" height="28" rx="4" fill="#0a0a0c" stroke="#1f232b" strokeWidth="2" />

              {/* Exhaust */}
              <ellipse cx="0" cy="142" rx="4.5" ry="3" fill="#9ca3af" stroke="#374151" strokeWidth="1" />
              <ellipse cx="0" cy="142" rx="3" ry="1.8" fill="#111827" />

              {/* Hint over car */}
              {!isHolding && !isCrashed && driveProgress === 0 && (
                <g transform="translate(0, -10)">
                  <rect x="-55" y="-12" width="110" height="18" rx="3" fill="#000000" stroke="#c81d25" strokeWidth="1" opacity="0.9" />
                  <text x="0" y="1" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    👆 ЗАЖМИ ПРИОРУ!
                  </text>
                </g>
              )}
            </g>
          </svg>

          {/* Crash banner */}
          {isCrashed && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-center justify-center gap-2 border-t-2 border-[#c81d25] bg-black/90 px-3 py-1.5 text-center font-mono text-[10px] text-red-400 sm:text-xs">
              <span>💥</span>
              <span>ПОД РАСПЛЮЩЕН ПРЯМО ПОД ПРИОРОЙ!</span>
            </div>
          )}
        </div>
      </div>

      {/* ---------- BIG HOLD BUTTON ---------- */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        disabled={isCrashed}
        className={`relative z-10 mx-auto flex w-full max-w-md shrink-0 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-typewriter text-xs font-bold uppercase tracking-wider transition-all select-none sm:text-sm ${
          isHolding
            ? 'border-[#c81d25] bg-[#c81d25]/30 text-white shadow-[0_0_24px_rgba(200,29,37,0.55)]'
            : 'border-[#c81d25]/60 bg-[#c81d25]/10 text-gray-100 hover:bg-[#c81d25]/20'
        } disabled:cursor-not-allowed disabled:opacity-40`}
        style={{ touchAction: 'none' }}
      >
        <Flame size={14} className={isHolding ? 'animate-pulse' : ''} />
        <span>
          {isHolding ? 'ДЕРЖИ...' : isCrashed ? 'ПОД РАЗДАВЛЕН' : 'ЗАЖМИ ЧТОБЫ РАЗОГНАТЬСЯ'}
        </span>
      </button>

      {/* ---------- FOOTER ---------- */}
      <div className="relative z-10 mt-2 flex shrink-0 items-center justify-between gap-2 border-t border-gray-800/80 pt-1.5">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded px-2 py-1 font-typewriter text-[10px] text-gray-400 transition-colors hover:bg-gray-800 hover:text-white sm:px-2.5 sm:text-xs"
        >
          <RefreshCw size={12} />
          <span>ОТКАТИТЬ ПРИОРУ НАЗАД</span>
        </button>
        <span className="hidden font-cursive text-[10px] text-gray-500 sm:inline sm:text-xs">
          Зажми кнопку или саму сцену
        </span>
      </div>
    </div>
  );
};