import React from 'react';

export interface PigeonState {
  id: number;
  x: number; // percentage 0 to 100
  y: number; // pixels from top
  speed: number;
  direction: 1 | -1; // 1 = right, -1 = left
  isHit: boolean;
  fallY: number; // pixels dropped when hit
  packetType: string;
  pingDelay: number;
}

interface PigeonPacketProps {
  pigeon: PigeonState;
  className?: string;
}

export const PigeonPacket: React.FC<PigeonPacketProps> = ({ pigeon, className = '' }) => {
  const { direction, isHit, fallY, packetType, pingDelay } = pigeon;

  return (
    <div
      className={`absolute select-none pointer-events-none transition-transform ${className}`}
      style={{
        left: `${pigeon.x}%`,
        top: `${pigeon.y + fallY}px`,
        transform: `translate(-50%, -50%) scaleX(${direction}) ${
          isHit ? `rotate(${direction * 65}deg) scale(0.85)` : ''
        }`,
      }}
    >
      <div className="relative">
        {/* Victorian Engraving Pigeon SVG (compacted dimensions) */}
        <svg
          width="54"
          height="42"
          viewBox="0 0 100 80"
          className={`filter drop-shadow-[2px_3px_5px_rgba(0,0,0,0.8)] ${
            isHit ? 'opacity-80' : 'animate-pulse'
          }`}
        >
          <defs>
            <linearGradient id="pigeonFeather" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdfbf7" />
              <stop offset="50%" stopColor="#e5e5e5" />
              <stop offset="100%" stopColor="#c7c7c7" />
            </linearGradient>
          </defs>

          {/* Under-wing shadow */}
          <path
            d="M 50 40 Q 65 20 85 10 Q 75 35 60 48 Z"
            fill="#a3a3a3"
            stroke="#262626"
            strokeWidth="1.2"
          />

          {/* Pigeon Body (Victorian Etching Silhouette) */}
          <path
            d="
              M 20 45
              C 15 35, 25 22, 40 25
              C 50 20, 68 28, 75 42
              C 82 46, 92 48, 96 52
              L 75 58
              C 65 62, 50 64, 38 60
              C 26 56, 18 52, 20 45
              Z
            "
            fill="url(#pigeonFeather)"
            stroke="#1a1a1a"
            strokeWidth="1.8"
          />

          {/* Left Wing (Spread Wide) */}
          <path
            d="
              M 42 26
              C 38 8, 55 2, 65 0
              C 72 12, 68 26, 56 36
              Z
            "
            fill="url(#pigeonFeather)"
            stroke="#1a1a1a"
            strokeWidth="1.6"
          />

          {/* Engraving Crosshatch Lines (Woodcut texture) */}
          <g stroke="#404040" strokeWidth="0.8" fill="none" opacity="0.75">
            <line x1="48" y1="8" x2="54" y2="18" />
            <line x1="52" y1="6" x2="58" y2="16" />
            <line x1="56" y1="4" x2="62" y2="14" />
            <line x1="42" y1="38" x2="52" y2="44" />
            <line x1="45" y1="42" x2="55" y2="48" />
            <line x1="48" y1="46" x2="58" y2="52" />
          </g>

          {/* Beak & Head */}
          <polygon points="18,36 10,40 18,42" fill="#c81d25" stroke="#1a1a1a" strokeWidth="1" />

          {/* Eye */}
          {!isHit ? (
            <g>
              <circle cx="22" cy="36" r="2.8" fill="#c81d25" stroke="#1a1a1a" strokeWidth="0.8" />
              <circle cx="22" cy="36" r="1.2" fill="#ffffff" />
            </g>
          ) : (
            // Dead / Knocked out cross eye
            <g stroke="#c81d25" strokeWidth="2" strokeLinecap="round">
              <line x1="19" y1="33" x2="25" y2="39" />
              <line x1="25" y1="33" x2="19" y2="39" />
            </g>
          )}

          {/* Tiny TCP Packet envelope tied to pigeon's foot */}
          <g transform="translate(48, 56) rotate(10)">
            <rect x="0" y="0" width="16" height="11" fill="#fff" stroke="#1a1a1a" strokeWidth="1" rx="0.5" />
            <polygon points="0,0 8,6 16,0" fill="#f0f0f0" stroke="#1a1a1a" strokeWidth="0.8" />
            <line x1="0" y1="11" x2="6" y2="5" stroke="#737373" strokeWidth="0.6" />
            <line x1="16" y1="11" x2="10" y2="5" stroke="#737373" strokeWidth="0.6" />
          </g>
        </svg>

        {/* HIT DELAY POPUP: TCP Concept - Packets delivered with +450ms Latency */}
        {isHit && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 animate-bounce">
            <div className="bg-[#c81d25] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-white flex items-center gap-1">
              <span>+{pingDelay}ms</span>
              <span className="text-[8px] bg-black/40 px-1 py-0.2 rounded">RETRANSMIT</span>
            </div>
            <div className="text-[8px] font-typewriter text-red-300 text-center mt-0.5">
              TCP: Доставлен с задержкой!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
