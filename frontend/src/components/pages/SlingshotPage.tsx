import React, { useState, useEffect, useRef } from 'react';
import { Slingshot } from '../items/Slingshot';
import { PigeonPacket, PigeonState } from '../items/PigeonPacket';
import { playSlingshotReleaseSound, playPigeonHitSound } from '../../utils/audio';
import { RefreshCw, Code2, ArrowRight, Wifi } from 'lucide-react';

interface SlingshotPageProps {
  onAttack: (action: 'network-delay') => Promise<void>;
  onAttackError: (action: 'network-delay', error: unknown) => void;
  onOpenManifest: (levelId: string) => void;
  onNext: () => void;
}

interface StoneData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

export const SlingshotPage: React.FC<SlingshotPageProps> = ({
  onAttack,
  onAttackError,
  onOpenManifest,
  onNext,
}) => {
  const skyRef = useRef<HTMLDivElement>(null);
  const [clusterLatency, setClusterLatency] = useState(14);
  const [hitCount, setHitCount] = useState(0);
  const networkAttackSentRef = useRef(false);

  // 6 Victorian engraving pigeons flying higher in the sky
  const [pigeons, setPigeons] = useState<PigeonState[]>([
    { id: 1, x: 18, y: 14, speed: 0.22, direction: 1, isHit: false, fallY: 0, packetType: 'TCP: SYN', pingDelay: 450 },
    { id: 2, x: 72, y: 32, speed: 0.25, direction: -1, isHit: false, fallY: 0, packetType: 'TCP: ACK', pingDelay: 450 },
    { id: 3, x: 38, y: 50, speed: 0.18, direction: 1, isHit: false, fallY: 0, packetType: 'HTTP: /api', pingDelay: 450 },
    { id: 4, x: 82, y: 66, speed: 0.28, direction: -1, isHit: false, fallY: 0, packetType: 'gRPC: Auth', pingDelay: 450 },
    { id: 5, x: 15, y: 22, speed: 0.20, direction: 1, isHit: false, fallY: 0, packetType: 'DNS: query', pingDelay: 450 },
    { id: 6, x: 55, y: 40, speed: 0.24, direction: 1, isHit: false, fallY: 0, packetType: 'TCP: PUSH', pingDelay: 450 },
  ]);

  const [stone, setStone] = useState<StoneData | null>(null);
  const stoneRef = useRef<StoneData | null>(null);
  const pigeonsRef = useRef<PigeonState[]>(pigeons);
  pigeonsRef.current = pigeons;

  // Pigeon horizontal flight animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPigeons((prev) =>
        prev.map((p) => {
          if (p.isHit) {
            const nextFallY = p.fallY < 260 ? p.fallY + 8 : p.fallY;
            return { ...p, fallY: nextFallY };
          }

          let nextX = p.x + p.speed * p.direction;
          let nextDir = p.direction;

          if (nextX > 92) {
            nextX = 92;
            nextDir = -1;
          } else if (nextX < 8) {
            nextX = 8;
            nextDir = 1;
          }

          return { ...p, x: nextX, direction: nextDir };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Stone projectile flight & collision detection loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const currentStone = stoneRef.current;
      if (currentStone && currentStone.active && skyRef.current) {
        const rect = skyRef.current.getBoundingClientRect();
        const nextX = currentStone.x + currentStone.vx;
        const nextY = currentStone.y + currentStone.vy;
        const nextVy = currentStone.vy + 0.32; // gravity

        const hitPigeonPackets: string[] = [];

        // Check collision with pigeons
        const updatedPigeons = pigeonsRef.current.map((pigeon) => {
          if (pigeon.isHit) return pigeon;

          const pigPxX = (pigeon.x / 100) * rect.width;
          const pigPxY = pigeon.y;
          const dist = Math.hypot(nextX - pigPxX, nextY - pigPxY);

          if (dist < 32) {
            hitPigeonPackets.push(pigeon.packetType);
            return { ...pigeon, isHit: true };
          }
          return pigeon;
        });

        if (hitPigeonPackets.length > 0) {
          playPigeonHitSound();
          setPigeons(updatedPigeons);
          setClusterLatency((prev) => prev + 450);
          setHitCount((prev) => Math.min(6, prev + hitPigeonPackets.length));
          if (!networkAttackSentRef.current) {
            networkAttackSentRef.current = true;
            void onAttack('network-delay').catch((error) => onAttackError('network-delay', error));
          }

        }

        // Check bounds
        if (
          hitPigeonPackets.length > 0 ||
          nextY > rect.height ||
          nextY < -30 ||
          nextX < -20 ||
          nextX > rect.width + 20
        ) {
          stoneRef.current = null;
          setStone(null);
        } else {
          const nextStoneData = {
            ...currentStone,
            x: nextX,
            y: nextY,
            vy: nextVy,
          };
          stoneRef.current = nextStoneData;
          setStone(nextStoneData);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [onAttack, onAttackError]);

  const handleSlingshotFire = (
    velocity: { vx: number; vy: number },
    origin: { x: number; y: number }
  ) => {
    playSlingshotReleaseSound();
    if (!skyRef.current) return;
    const rect = skyRef.current.getBoundingClientRect();

    const newStone = {
      x: origin.x - rect.left,
      y: origin.y - rect.top,
      vx: velocity.vx,
      vy: velocity.vy,
      active: true,
    };
    stoneRef.current = newStone;
    setStone(newStone);
  };

  const handleReset = () => {
    setPigeons([
      { id: 1, x: 18, y: 14, speed: 0.22, direction: 1, isHit: false, fallY: 0, packetType: 'TCP: SYN', pingDelay: 450 },
      { id: 2, x: 72, y: 32, speed: 0.25, direction: -1, isHit: false, fallY: 0, packetType: 'TCP: ACK', pingDelay: 450 },
      { id: 3, x: 38, y: 50, speed: 0.18, direction: 1, isHit: false, fallY: 0, packetType: 'HTTP: /api', pingDelay: 450 },
      { id: 4, x: 82, y: 66, speed: 0.28, direction: -1, isHit: false, fallY: 0, packetType: 'gRPC: Auth', pingDelay: 450 },
      { id: 5, x: 15, y: 22, speed: 0.20, direction: 1, isHit: false, fallY: 0, packetType: 'DNS: query', pingDelay: 450 },
      { id: 6, x: 55, y: 40, speed: 0.24, direction: 1, isHit: false, fallY: 0, packetType: 'TCP: PUSH', pingDelay: 450 },
    ]);
    setClusterLatency(14);
    setHitCount(0);
    networkAttackSentRef.current = false;
    stoneRef.current = null;
    setStone(null);
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col justify-between overflow-hidden p-3 select-none sm:p-5">
      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-2 border-b border-gray-800 pb-2">
        <div>
          <h2 className="font-marker text-xl sm:text-3xl text-white tracking-wide">
            *3. NETWORK LOSS*
          </h2>
          <div className="font-cursive text-xs sm:text-base text-[#c81d25] font-bold mt-0.5">
            Потяни за камень на рогатке и сбей голубей с TCP-пакетами!
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded border border-gray-800 bg-[#14161c] px-1.5 py-1 text-[10px] font-mono text-gray-400 sm:px-2 sm:text-[11px]">
            Сбито: <strong className="text-white">{hitCount}/6</strong>
          </div>
          <button
            onClick={() => onOpenManifest('slingshot')}
            className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-[11px] rounded border border-gray-700 transition-colors shadow-sm"
            title="Открыть NetworkChaos манифест"
          >
            <Code2 size={12} className="text-[#c81d25]" />
            <span>YAML</span>
          </button>
        </div>
      </div>

      {/* Sky Field: Dedicated generous height with ALL 6 pigeons prominently visible */}
      <div
        ref={skyRef}
        className="relative z-10 flex-1 my-1 rounded-md overflow-hidden border border-gray-800 shadow-xl bg-gradient-to-b from-[#0a0c10] via-[#12151c] to-[#1a1e27] min-h-[250px]"
      >
        <div className="absolute inset-0 xerox-grit opacity-30 pointer-events-none" />

        {/* 6 Victorian Pigeons flying in the upper sky */}
        {pigeons.map((pigeon) => (
          <PigeonPacket key={pigeon.id} pigeon={pigeon} className="scale-[0.78] sm:scale-100" />
        ))}

        {/* Flying Stone Projectile */}
        {stone && stone.active && (
          <div
            className="absolute w-3.5 h-3.5 bg-gray-300 border border-gray-600 rounded-full shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30"
            style={{ left: `${stone.x}px`, top: `${stone.y}px` }}
          />
        )}

        {/* Bottom Wooden Slingshot (Embedded neatly inside sky arena bottom) */}
        <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 scale-[0.72] origin-bottom sm:scale-100">
          <Slingshot onFire={handleSlingshotFire} />
        </div>
      </div>

      {/* Controls & Level Actions */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-t border-gray-800/80 pt-1">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-typewriter text-gray-400 transition-colors hover:bg-gray-800 hover:text-white sm:text-xs"
        >
          <RefreshCw size={12} />
          <span>СБРОСИТЬ ПОПАДАНИЯ</span>
        </button>
      </div>
    </div>
  );
};
