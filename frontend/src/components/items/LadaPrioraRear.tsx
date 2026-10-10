import React from 'react';

interface LadaPrioraRearProps {
  isAccelerating?: boolean;
  isIdling?: boolean;
  className?: string;
}

export const LadaPrioraRear: React.FC<LadaPrioraRearProps> = ({
  isAccelerating = false,
  isIdling = true,
  className = '',
}) => {
  return (
    <div
      className={`relative aspect-[220/170] w-full max-w-[220px] select-none ${isIdling && !isAccelerating ? 'animate-car-idle' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 240 180"
        className="w-full h-full filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.85)] overflow-visible"
      >
        <defs>
          {/* Black metallic paint gradient */}
          <linearGradient id="prioraBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c3038" />
            <stop offset="25%" stopColor="#1a1d24" />
            <stop offset="70%" stopColor="#0d0f12" />
            <stop offset="100%" stopColor="#17191e" />
          </linearGradient>

          {/* Rear windshield dark tinted glass */}
          <linearGradient id="rearGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#555d6b" />
            <stop offset="35%" stopColor="#242830" />
            <stop offset="100%" stopColor="#111317" />
          </linearGradient>

          {/* Taillights Ruby Red Glow */}
          <radialGradient id="taillightGlowRear" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#800000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="rimGradRear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>

        {/* Lowered Chassis Shadow (Underglow onto asphalt) */}
        <ellipse cx="120" cy="162" rx="105" ry="14" fill="#000000" opacity="0.95" />

        {/* Exhaust Smoke when accelerating */}
        {isAccelerating && (
          <g opacity="0.8" className="animate-pulse">
            <circle cx="122" cy="160" r="10" fill="#64748b" filter="blur(3px)" />
            <circle cx="120" cy="172" r="16" fill="#94a3b8" filter="blur(5px)" />
            <circle cx="118" cy="186" r="22" fill="#cbd5e1" filter="blur(7px)" />
          </g>
        )}

        {/* LADA PRIORA REAR VIEW (Matches user drawing image.png exactly!) */}
        {/* Main Body Silhouette seen from behind */}
        <path
          d="
            M 42 148
            C 34 135, 36 108, 48 94
            C 58 80, 72 48, 85 36
            C 95 28, 145 28, 155 36
            C 168 48, 182 80, 192 94
            C 204 108, 206 135, 198 148
            C 192 155, 185 158, 168 158
            L 165 142
            C 162 135, 150 135, 148 142
            L 92 142
            C 90 135, 78 135, 75 142
            L 72 158
            C 55 158, 48 155, 42 148
            Z
          "
          fill="url(#prioraBodyGrad)"
          stroke="#383d47"
          strokeWidth="1.8"
        />

        {/* Rear Windshield Glass (Trapezoid sloping down) */}
        <path
          d="
            M 88 38
            C 96 32, 144 32, 152 38
            L 174 84
            C 170 87, 70 87, 66 84
            Z
          "
          fill="url(#rearGlassGrad)"
          stroke="#1f232b"
          strokeWidth="1.5"
        />

        {/* Rear Windshield Defroster Lines */}
        <g stroke="#3a3f4d" strokeWidth="0.8" opacity="0.6">
          <line x1="72" y1="52" x2="168" y2="52" />
          <line x1="70" y1="62" x2="170" y2="62" />
          <line x1="68" y1="72" x2="172" y2="72" />
        </g>

        {/* Trunk Deck Lid (Priora sedan horizontal trunk line) */}
        <path
          d="
            M 52 92
            C 58 89, 182 89, 188 92
            L 185 116
            C 182 120, 58 120, 55 116
            Z
          "
          fill="#1c1f26"
          stroke="#2d323d"
          strokeWidth="1.2"
        />

        {/* Priora Trunk Lip / Subtle Spoiler */}
        <path
          d="M 58 92 Q 120 90 182 92"
          stroke="#474f5e"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Chrome Trunk Handle / Lada Badge */}
        <ellipse cx="120" cy="98" rx="7" ry="3.5" fill="#9ca3af" stroke="#ffffff" strokeWidth="0.8" />
        <ellipse cx="120" cy="98" rx="4" ry="2" fill="#1f242d" />

        {/* Russian License Plate: В 777 ОР 777 (Centered between taillights) */}
        <g transform="translate(120, 114)">
          <rect
            x="-30"
            y="-8"
            width="60"
            height="16"
            fill="#ffffff"
            stroke="#1a1a1a"
            strokeWidth="1.2"
            rx="1.5"
          />
          {/* Russian flag icon */}
          <rect x="20" y="-6" width="7" height="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.4" />
          <line x1="20" y1="-2" x2="27" y2="-2" stroke="#0038a8" strokeWidth="1.4" />
          <line x1="20" y1="2" x2="27" y2="2" stroke="#d52b1e" strokeWidth="1.4" />
          <text
            x="23.5"
            y="5"
            fill="#000000"
            fontSize="4"
            fontFamily="sans-serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            RUS
          </text>
          {/* Plate Number */}
          <text
            x="-4"
            y="3.5"
            fill="#000000"
            fontSize="8.5"
            fontFamily="'Courier Prime', monospace"
            fontWeight="bold"
            letterSpacing="0.8"
            textAnchor="middle"
          >
            В777ОР 777
          </text>
        </g>

        {/* TAILLIGHTS (Left & Right Priora Taillights - Exact match to sketch!) */}
        {/* Left Taillight */}
        <g>
          <path
            d="
              M 48 100
              L 76 100
              C 78 112, 76 116, 74 118
              L 46 118
              C 44 112, 46 104, 48 100
              Z
            "
            fill="#dc2626"
            stroke="#ef4444"
            strokeWidth="1"
          />
          {/* Inner amber turn section */}
          <rect x="58" y="104" width="8" height="8" fill="#f59e0b" opacity="0.8" />
          <circle cx="62" cy="110" r="14" fill="url(#taillightGlowRear)" opacity={isAccelerating ? '1' : '0.65'} />
        </g>

        {/* Right Taillight */}
        <g>
          <path
            d="
              M 164 100
              L 192 100
              C 194 104, 196 112, 194 118
              L 166 118
              C 164 116, 162 112, 164 100
              Z
            "
            fill="#dc2626"
            stroke="#ef4444"
            strokeWidth="1"
          />
          <rect x="174" y="104" width="8" height="8" fill="#f59e0b" opacity="0.8" />
          <circle cx="178" cy="110" r="14" fill="url(#taillightGlowRear)" opacity={isAccelerating ? '1' : '0.65'} />
        </g>

        {/* Rear Lower Bumper */}
        <path
          d="
            M 38 132
            C 38 124, 202 124, 202 132
            L 198 152
            C 194 158, 46 158, 42 152
            Z
          "
          fill="#14161b"
          stroke="#262a33"
          strokeWidth="1.2"
        />

        {/* Lower Bumper Red Reflectors */}
        <rect x="54" y="140" width="16" height="4" fill="#c81d25" rx="1" />
        <rect x="170" y="140" width="16" height="4" fill="#c81d25" rx="1" />

        {/* WIDE LOWERED REAR TIRES (Hugging asphalt with negative camber) */}
        {/* Left Tire */}
        <g>
          <rect x="36" y="132" width="22" height="30" rx="4" fill="#0d0e11" stroke="#1f232b" strokeWidth="2" />
          <ellipse cx="47" cy="147" rx="6" ry="10" fill="url(#rimGradRear)" stroke="#9ca3af" strokeWidth="0.8" />
        </g>

        {/* Right Tire */}
        <g>
          <rect x="182" y="132" width="22" height="30" rx="4" fill="#0d0e11" stroke="#1f232b" strokeWidth="2" />
          <ellipse cx="193" cy="147" rx="6" ry="10" fill="url(#rimGradRear)" stroke="#9ca3af" strokeWidth="0.8" />
        </g>

        {/* Chrome Exhaust Pipe in the middle/left */}
        <ellipse cx="120" cy="154" rx="5" ry="3.5" fill="#9ca3af" stroke="#374151" strokeWidth="1" />
        <ellipse cx="120" cy="154" rx="3.5" ry="2" fill="#111827" />

        {/* Driver side mirror sliver on left & right */}
        <polygon points="46,90 32,84 34,92 46,94" fill="#1f242d" stroke="#374151" strokeWidth="0.8" />
        <polygon points="194,90 208,84 206,92 194,94" fill="#1f242d" stroke="#374151" strokeWidth="0.8" />
      </svg>
    </div>
  );
};
