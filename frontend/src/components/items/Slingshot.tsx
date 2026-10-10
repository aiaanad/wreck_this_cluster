import React, { useState, useRef, useEffect } from 'react';

interface SlingshotProps {
  onFire: (velocity: { vx: number; vy: number }, origin: { x: number; y: number }) => void;
  disabled?: boolean;
}

export const Slingshot: React.FC<SlingshotProps> = ({
  onFire,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pouchPos, setPouchPos] = useState({ x: 100, y: 130 }); // relative to SVG (200x260)
  const defaultPos = { x: 100, y: 130 };

  const leftForkTip = { x: 42, y: 70 };
  const rightForkTip = { x: 158, y: 70 };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPulling(true);
    updatePouch(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const updatePouch = (e: React.PointerEvent | PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Convert to 0-200, 0-260 viewBox coords
    const x = ((clientX - rect.left) / rect.width) * 200;
    const y = ((clientY - rect.top) / rect.height) * 260;

    // Clamp pull range: pull downwards (y between 120 and 240, x between 40 and 160)
    const clampedX = Math.max(30, Math.min(170, x));
    const clampedY = Math.max(120, Math.min(240, y));

    setPouchPos({ x: clampedX, y: clampedY });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isPulling) {
        updatePouch(e);
      }
    };

    const handlePointerUp = () => {
      if (isPulling) {
        setIsPulling(false);
        // Calculate velocity based on pull vector
        const dx = defaultPos.x - pouchPos.x;
        const dy = defaultPos.y - pouchPos.y; // positive when pulled down (since y > default.y)
        const pullDistance = Math.hypot(dx, dy);

        if (pullDistance > 20 && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const origin = {
            x: rect.left + (pouchPos.x / 200) * rect.width,
            y: rect.top + (pouchPos.y / 260) * rect.height,
          };
          // Velocity shoots upwards
          const speed = Math.min(26, pullDistance * 0.32);
          const angle = Math.atan2(dy, dx);
          onFire(
            {
              vx: Math.cos(angle) * speed * 0.8,
              vy: -Math.abs(Math.sin(angle) * speed * 1.5) - 6,
            },
            origin
          );
        }

        setPouchPos(defaultPos);
      }
    };

    if (isPulling) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isPulling, pouchPos, onFire]);

  // Aiming dotted trajectory vector
  const aimVector = {
    dx: (defaultPos.x - pouchPos.x) * 2.8,
    dy: (defaultPos.y - pouchPos.y) * 4.2,
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative h-[150px] w-[140px] select-none touch-none sm:h-[165px] sm:w-[145px] ${disabled ? 'opacity-50' : 'cursor-grab active:cursor-grabbing'}`}
      style={{ touchAction: 'none' }}
    >
      <svg viewBox="0 0 200 260" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="slingshotWood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7f5539" />
            <stop offset="30%" stopColor="#b08968" />
            <stop offset="70%" stopColor="#ddb892" />
            <stop offset="100%" stopColor="#9c6644" />
          </linearGradient>

          <linearGradient id="rubberRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e63946" />
            <stop offset="50%" stopColor="#c81d25" />
            <stop offset="100%" stopColor="#9b111e" />
          </linearGradient>
        </defs>

        {/* AIMING DOTTED TRAJECTORY (Projects upwards when pulling) */}
        {isPulling && (
          <g>
            <line
              x1={pouchPos.x}
              y1={pouchPos.y}
              x2={pouchPos.x + aimVector.dx}
              y2={pouchPos.y + aimVector.dy}
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              opacity="0.8"
            />
            {/* Target Crosshair */}
            <circle
              cx={pouchPos.x + aimVector.dx}
              cy={pouchPos.y + aimVector.dy}
              r="8"
              stroke="#c81d25"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 3"
            />
            <circle cx={pouchPos.x + aimVector.dx} cy={pouchPos.y + aimVector.dy} r="2" fill="#c81d25" />
          </g>
        )}

        {/* BACK RUBBER BAND (Left tip to pouch) */}
        <line
          x1={leftForkTip.x}
          y1={leftForkTip.y}
          x2={pouchPos.x - 8}
          y2={pouchPos.y}
          stroke="url(#rubberRed)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* WOODEN SLINGSHOT FORK (Carved wood matching Image 1 bottom center & Image 3) */}
        <path
          d="
            M 100 255
            C 92 250, 90 190, 86 160
            C 76 130, 48 105, 42 70
            C 38 48, 56 46, 58 68
            C 62 90, 82 115, 96 135
            L 104 135
            C 118 115, 138 90, 142 68
            C 144 46, 162 48, 158 70
            C 152 105, 124 130, 114 160
            C 110 190, 108 250, 100 255
            Z
          "
          fill="url(#slingshotWood)"
          stroke="#4a2810"
          strokeWidth="2.5"
        />

        {/* Carved Folk Tribal Pattern on handle (matches photo!) */}
        <g stroke="#4a2810" strokeWidth="1.8" fill="none">
          <line x1="94" y1="175" x2="106" y2="175" />
          <line x1="93" y1="185" x2="107" y2="185" />
          {/* Diamond carvings */}
          <path d="M 100 192 L 106 200 L 100 208 L 94 200 Z" />
          <path d="M 100 212 L 106 220 L 100 228 L 94 220 Z" />
          <line x1="93" y1="235" x2="107" y2="235" />
        </g>

        {/* Red rubber wrap around fork tips */}
        <ellipse cx={leftForkTip.x + 6} cy={leftForkTip.y - 4} rx="9" ry="5" fill="#c81d25" stroke="#9b111e" strokeWidth="1" />
        <ellipse cx={rightForkTip.x - 6} cy={rightForkTip.y - 4} rx="9" ry="5" fill="#c81d25" stroke="#9b111e" strokeWidth="1" />

        {/* FRONT RUBBER BAND (Right tip to pouch) */}
        <line
          x1={rightForkTip.x}
          y1={rightForkTip.y}
          x2={pouchPos.x + 8}
          y2={pouchPos.y}
          stroke="url(#rubberRed)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* LEATHER POUCH WITH RIVER STONE */}
        {/* Leather patch */}
        <ellipse
          cx={pouchPos.x}
          cy={pouchPos.y}
          rx="18"
          ry="12"
          fill="#3e2723"
          stroke="#27160e"
          strokeWidth="1.5"
        />
        {/* Gray Stone in pouch */}
        <polygon
          points={`
            ${pouchPos.x - 8},${pouchPos.y - 4}
            ${pouchPos.x},${pouchPos.y - 9}
            ${pouchPos.x + 9},${pouchPos.y - 3}
            ${pouchPos.x + 7},${pouchPos.y + 6}
            ${pouchPos.x - 6},${pouchPos.y + 5}
          `}
          fill="#8d99ae"
          stroke="#4b5563"
          strokeWidth="1.2"
        />

        {/* Drag Hint text */}
        {!isPulling && (
          <text
            x="100"
            y="110"
            fill="#c81d25"
            fontSize="10"
            fontFamily="'Courier Prime', monospace"
            fontWeight="bold"
            textAnchor="middle"
            className="animate-pulse"
          >
            ▼ ТЯНИ НАЗАД
          </text>
        )}
      </svg>
    </div>
  );
};
