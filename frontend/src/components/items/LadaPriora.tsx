import React from 'react';

interface LadaPrioraProps {
  isAccelerating?: boolean;
  isIdling?: boolean;
  className?: string;
}

export const LadaPriora: React.FC<LadaPrioraProps> = ({
  isAccelerating = false,
  isIdling = true,
  className = '',
}) => {
  return (
    <div
      className={`relative aspect-[280/170] w-full max-w-[280px] select-none ${isIdling && !isAccelerating ? 'animate-car-idle' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 320 200"
        className="w-full h-full filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.9)] overflow-visible"
      >
        <defs>
          {/* Black body metallic paint gradient */}
          <linearGradient id="prioraBlack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2b2d42" />
            <stop offset="25%" stopColor="#1a1c22" />
            <stop offset="70%" stopColor="#0d0e11" />
            <stop offset="100%" stopColor="#16181d" />
          </linearGradient>

          <linearGradient id="glassTint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14151a" />
            <stop offset="100%" stopColor="#050608" />
          </linearGradient>

          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5e5e5" />
            <stop offset="50%" stopColor="#737373" />
            <stop offset="100%" stopColor="#262626" />
          </linearGradient>

          <radialGradient id="taillightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#800000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Underglow / Shadow (Stanced Lowered Car) */}
        <ellipse cx="160" cy="172" rx="140" ry="20" fill="#000000" opacity="0.85" />

        {/* Exhaust smoke when revving */}
        {isAccelerating && (
          <g opacity="0.75" className="animate-pulse">
            <circle cx="28" cy="165" r="14" fill="#6c757d" filter="blur(4px)" />
            <circle cx="12" cy="160" r="18" fill="#adb5bd" filter="blur(6px)" />
            <circle cx="-10" cy="155" r="24" fill="#dee2e6" filter="blur(8px)" />
          </g>
        )}

        {/* CAR BODY - 45-degree 3/4 Isometric Rear Angle of Lada Priora Sedan */}
        {/* Main Body Silhouette */}
        <path
          d="
            M 45 135
            C 40 120, 52 105, 80 98
            L 125 72
            C 140 62, 170 56, 210 58
            L 245 74
            C 270 85, 282 105, 285 125
            L 282 152
            C 280 162, 265 168, 240 168
            L 225 168
            C 222 152, 205 145, 190 148
            C 175 152, 172 166, 170 168
            L 95 168
            C 92 154, 76 146, 62 150
            C 50 154, 46 166, 44 168
            L 32 165
            C 25 158, 28 145, 45 135
            Z
          "
          fill="url(#prioraBlack)"
          stroke="#404552"
          strokeWidth="1.8"
        />

        {/* Roof & Rear Greenhouse / Pillars */}
        <path
          d="
            M 120 75
            L 142 42
            C 152 38, 190 38, 205 42
            L 240 76
            C 225 74, 150 72, 120 75
            Z
          "
          fill="#111317"
          stroke="#30343f"
          strokeWidth="1.2"
        />

        {/* Rear Windshield (Heavily Tinted) */}
        <polygon
          points="138,46 200,46 235,74 125,74"
          fill="url(#glassTint)"
          stroke="#1f232b"
          strokeWidth="1.2"
        />

        {/* Side Windows */}
        <path
          d="M 205 46 L 228 66 L 202 68 L 180 50 Z"
          fill="url(#glassTint)"
          stroke="#1f232b"
          strokeWidth="1"
        />

        {/* Trunk Lid & Priora Rear Contour */}
        <path
          d="
            M 48 104
            C 55 100, 75 96, 120 85
            L 125 130
            C 85 135, 55 138, 48 135
            Z
          "
          fill="#1b1c22"
          stroke="#2d303a"
          strokeWidth="1.2"
        />

        {/* Rear Trunk Bumper & Priora Trim */}
        <path
          d="M 42 125 L 120 120 L 122 145 L 40 148 Z"
          fill="#14151a"
          stroke="#262831"
          strokeWidth="1"
        />

        {/* Lada Priora Chrome Badge & Trunk Handle */}
        <ellipse cx="80" cy="122" rx="6" ry="3.5" fill="#a0a4b0" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="77" y1="122" x2="83" y2="122" stroke="#16181d" strokeWidth="1" />

        {/* Russian License Plate "В 777 ОР 777" (Exact match to Image 4!) */}
        <g transform="translate(78, 134) rotate(-3)">
          <rect
            x="-26"
            y="-7"
            width="52"
            height="14"
            fill="#ffffff"
            stroke="#1a1a1a"
            strokeWidth="1"
            rx="1"
          />
          {/* Russian Flag Mini Box on Plate */}
          <rect x="18" y="-5" width="6" height="10" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="0.5" />
          <line x1="18" y1="-2" x2="24" y2="-2" stroke="#0038a8" strokeWidth="1.2" />
          <line x1="18" y1="1" x2="24" y2="1" stroke="#d52b1e" strokeWidth="1.2" />
          <text
            x="21"
            y="4.5"
            fill="#000000"
            fontSize="4.5"
            fontFamily="sans-serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            RUS
          </text>
          {/* Plate Number */}
          <text
            x="-4"
            y="3.2"
            fill="#000000"
            fontSize="8"
            fontFamily="'Courier Prime', monospace"
            fontWeight="bold"
            letterSpacing="0.8"
            textAnchor="middle"
          >
            В777ОР 777
          </text>
        </g>

        {/* TAILLIGHTS (Left & Right Priora Taillights) */}
        {/* Left Taillight (Red + Amber + Reverse) */}
        <g>
          <path
            d="M 38 128 C 36 138, 40 148, 48 147 L 46 128 Z"
            fill="#d90429"
            stroke="#ff4d6d"
            strokeWidth="1"
          />
          <circle cx="43" cy="138" r="10" fill="url(#taillightGlow)" opacity={isAccelerating ? '1' : '0.6'} />
        </g>

        {/* Right Taillight */}
        <g>
          <path
            d="M 112 122 C 118 122, 126 132, 122 144 L 112 142 Z"
            fill="#d90429"
            stroke="#ff4d6d"
            strokeWidth="1"
          />
          <circle cx="118" cy="132" r="12" fill="url(#taillightGlow)" opacity={isAccelerating ? '1' : '0.6'} />
        </g>

        {/* Lower Bumper Red Reflector Strip */}
        <rect x="110" y="152" width="18" height="4" fill="#c81d25" rx="1" opacity="0.9" />

        {/* LOWERED WHEELS & DEEP DISH RIMS */}
        {/* Left Wheel (Tucked under stance fender) */}
        <g>
          <ellipse cx="60" cy="162" rx="17" ry="17" fill="#111111" stroke="#252525" strokeWidth="2" />
          <ellipse cx="60" cy="162" rx="11" ry="11" fill="url(#rimGrad)" stroke="#cccccc" strokeWidth="1" />
          {/* Wheel spokes */}
          <circle cx="60" cy="162" r="4" fill="#16181d" />
        </g>

        {/* Right Wheel (Tucked stance) */}
        <g>
          <ellipse cx="198" cy="158" rx="18" ry="18" fill="#111111" stroke="#252525" strokeWidth="2" />
          <ellipse cx="198" cy="158" rx="12" ry="12" fill="url(#rimGrad)" stroke="#cccccc" strokeWidth="1" />
          <circle cx="198" cy="158" r="4.5" fill="#16181d" />
        </g>

        {/* Twin Chrome Exhaust Pipe */}
        <ellipse cx="34" cy="158" rx="4" ry="2.5" fill="#e5e5e5" stroke="#333333" strokeWidth="1" />
        <ellipse cx="34" cy="158" rx="2.5" ry="1.5" fill="#111111" />
      </svg>
    </div>
  );
};
