import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { KirbyPod } from '../mascot/KirbyPod';
import { BaseballBat } from '../items/BaseballBat';
import { playBatHitSound, playBurstSound } from '../../utils/audio';
import { RefreshCw, Code2, ArrowRight } from 'lucide-react';

interface PinataPageProps {
  onAttack: (action: 'pod-failure') => Promise<void>;
  onAttackError: (action: 'pod-failure', error: unknown) => void;
  onOpenManifest: (levelId: string) => void;
  onNext: () => void;
}

export const PinataPage: React.FC<PinataPageProps> = ({
  onAttack,
  onAttackError,
  onOpenManifest,
  onNext,
}) => {
  const [hits, setHits] = useState(0);
  const [isSwinging, setIsSwinging] = useState(false);
  const [isSwaying, setIsSwaying] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const maxHits = 5;

  const handleStrike = () => {
    if (isDestroyed || isSwinging) return;

    const nextHits = hits + 1;
    setHits(nextHits);
    setIsSwinging(true);
    setIsSwaying(true);

    playBatHitSound();

    // Spawn slight blue tissue paper shreds on each hit
    confetti({
      particleCount: 18,
      spread: 60,
      origin: { x: 0.48, y: 0.46 },
      colors: ['#00b4d8', '#48cae4', '#90e0ef', '#0077b6'],
      shapes: ['square'],
      scalar: 0.85,
      ticks: 80,
      gravity: 1.2,
    });

    if (nextHits >= maxHits) {
      setTimeout(() => {
        setIsDestroyed(true);
        playBurstSound();

        // Massive party tissue paper explosion
        confetti({
          particleCount: 110,
          spread: 120,
          origin: { x: 0.48, y: 0.46 },
          colors: ['#00b4d8', '#48cae4', '#90e0ef', '#0077b6', '#023e8a', '#ffffff', '#c81d25'],
          shapes: ['square'],
          scalar: 1.2,
          gravity: 0.9,
          ticks: 200,
        });

        void onAttack('pod-failure').catch((error) => onAttackError('pod-failure', error));
      }, 250);
    }

    setTimeout(() => {
      setIsSwinging(false);
    }, 420);

    setTimeout(() => {
      setIsSwaying(false);
    }, 700);
  };

  const handleReset = () => {
    setHits(0);
    setIsDestroyed(false);
    setIsSwinging(false);
    setIsSwaying(false);
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col justify-between overflow-hidden p-3 select-none sm:p-6">
      {/* Background Chalk Sketches matching user Image 5 */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 320 480">
          {/* Chalk Pod Isometric Wireframe on the left */}
          <polygon points="40,130 70,115 100,130 70,145" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
          <polygon points="40,130 70,145 70,175 40,160" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
          <polygon points="70,145 100,130 100,160 70,175" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
          <text x="55" y="158" fill="#ffffff" fontSize="9" fontFamily="monospace">Pod</text>
          {/* Arrow from wireframe to center */}
          <path d="M 105 145 Q 125 155 135 170" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />

          {/* Topology graph nodes on right */}
          <circle cx="270" cy="220" r="5" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <circle cx="295" cy="200" r="4" stroke="#ffffff" strokeWidth="1.2" fill="none" />
          <circle cx="285" cy="250" r="6" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <line x1="270" y1="220" x2="295" y2="200" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="270" y1="220" x2="285" y2="250" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />

          {/* Chalk Skull doodle */}
          <circle cx="45" cy="400" r="8" stroke="#ffffff" strokeWidth="1.2" fill="none" />
          <circle cx="42" cy="399" r="1.5" fill="#ffffff" />
          <circle cx="48" cy="399" r="1.5" fill="#ffffff" />
          <line x1="41" y1="412" x2="49" y2="412" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Header matching Image 5: *1. POD PINATA* */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-2 border-b border-gray-800 pb-2">
        <div>
          <h2 className="font-marker text-xl sm:text-3xl text-white tracking-wide">
            *1. POD PINATA*
          </h2>
          <div className="font-cursive text-xs sm:text-base text-[#c81d25] font-bold mt-0.5">
            {isDestroyed
              ? 'Порог разрушения достигнут! Под уничтожен.'
              : 'Влупи битой и выбей всю дурь из пода.'}
          </div>
        </div>

        <button
          onClick={() => onOpenManifest('pinata')}
          className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-[11px] rounded border border-gray-700 transition-colors shadow-sm"
          title="Открыть PodChaos манифест"
        >
          <Code2 size={12} className="text-[#c81d25]" />
          <span>YAML</span>
        </button>
      </div>

      {/* Main Interactive Stage: Unified Hanging Pendulum attached to Ceiling */}
      <div className="relative z-10 min-h-0 flex-1 flex flex-col items-center justify-start overflow-hidden pt-1">
        {/* Ceiling Mount / Hook */}
        <div className="flex flex-col items-center z-10 shrink-0">
          <div className="w-16 h-2.5 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 rounded-b border-b border-gray-900 shadow-md flex items-center justify-between px-3">
            <div className="w-1 h-1 rounded-full bg-black" />
            <div className="w-1 h-1 rounded-full bg-black" />
          </div>
          {/* Iron Carabiner/Hook Ring */}
          <div className="w-3.5 h-4 border-2 border-gray-400 rounded-b-full -mt-0.5 shadow-xs" />
        </div>

        {/* Hanging Pendulum Assembly (Rope + Piñata connected seamlessly by coordinates) */}
        <button
          type="button"
          onClick={handleStrike}
          className={`relative -mt-1 flex origin-top scale-[0.78] cursor-pointer flex-col items-center bg-transparent p-0 transition-transform focus-visible:ring-2 focus-visible:ring-[#c81d25] sm:scale-100 ${
            isSwaying ? 'animate-pod-sway' : ''
          }`}
          style={{ transformOrigin: 'top center' }}
        >
          {!isDestroyed ? (
            <KirbyPod
              variant="pinata"
              damageLevel={hits}
              size={125}
              isHit={isSwinging}
            />
          ) : (
            <div className="flex flex-col items-center pt-2">
              {/* Snapped rope remnant hanging from ceiling */}
              <svg width="12" height="35" className="overflow-visible mb-3">
                <line
                  x1="6"
                  y1="0"
                  x2="6"
                  y2="25"
                  stroke="#a77a52"
                  strokeWidth="5"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                />
                <path d="M 4 25 L 2 32 M 6 25 L 6 34 M 8 25 L 10 31" stroke="#d4a373" strokeWidth="1.2" />
              </svg>

              <KirbyPod
                variant="knocked"
                size={110}
                className="transform rotate-12 filter grayscale"
              />
              <div className="mt-2 font-typewriter text-xs text-[#c81d25] font-bold border-2 border-[#c81d25] px-2.5 py-0.5 bg-black/80 shadow-lg rotate-2">
                POD_FAILURE_INJECTED
              </div>
            </div>
          )}
        </button>

        {/* Wooden Baseball Bat on the Right */}
        <div
          className="absolute bottom-2 right-0 z-20 origin-bottom-right scale-[0.68] cursor-pointer sm:bottom-8 sm:right-6 sm:scale-100"
        >
          <BaseballBat isSwinging={isSwinging} onClick={handleStrike} />
        </div>
      </div>

      {/* Level Reset Action */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-t border-gray-800/80 pt-1">
        <button
          onClick={handleReset}
          className="flex min-w-0 items-center gap-1.5 rounded px-2 py-1 text-[10px] font-typewriter text-gray-400 transition-colors hover:bg-gray-800 hover:text-white sm:px-2.5 sm:text-xs"
        >
          <RefreshCw size={12} />
          <span className="truncate">ПОВЕСИТЬ НОВУЮ ПИНЬЯТУ</span>
        </button>

      </div>
    </div>
  );
};
