import React from 'react';

interface KirbyPodProps {
  variant?: 'normal' | 'pinata' | 'sad' | 'squished' | 'knocked';
  damageLevel?: number; // 0 to 5 for pinata
  size?: number; // base pixel size
  className?: string;
  isHit?: boolean;
}

export const KirbyPod: React.FC<KirbyPodProps> = ({
  variant = 'normal',
  damageLevel = 0,
  size = 220,
  className = '',
  isHit = false,
}) => {
  const isPinata = variant === 'pinata';
  const isSquished = variant === 'squished';
  const isSad = variant === 'sad';
  const isKnocked = variant === 'knocked';

  if (isSquished) {
    // Flattened pancake pod on the road after Priora run-over
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg
          width={size * 1.3}
          height={size * 0.55}
          viewBox="0 0 260 110"
          className="filter drop-shadow-md"
        >
          {/* Flat tire marks / puddle */}
          <ellipse cx="130" cy="65" rx="115" ry="32" fill="#050505" opacity="0.6" />
          <ellipse cx="130" cy="62" rx="105" ry="28" fill="#1b4965" stroke="#62b6cb" strokeWidth="2.5" />
          <ellipse cx="126" cy="58" rx="90" ry="22" fill="#205477" />

          {/* Squished details */}
          <path d="M 45 60 Q 60 48 85 54" stroke="#62b6cb" strokeWidth="3" fill="none" />
          <path d="M 170 54 Q 195 48 215 60" stroke="#62b6cb" strokeWidth="3" fill="none" />

          {/* X Eyes */}
          <g stroke="#091b29" strokeWidth="5" strokeLinecap="round">
            {/* Left X */}
            <line x1="85" y1="48" x2="105" y2="64" />
            <line x1="105" y1="48" x2="85" y2="64" />
            {/* Right X */}
            <line x1="155" y1="48" x2="175" y2="64" />
            <line x1="175" y1="48" x2="155" y2="64" />
          </g>

          {/* Drooping blush */}
          <ellipse cx="75" cy="65" rx="12" ry="5" fill="#ff70a6" opacity="0.8" />
          <ellipse cx="185" cy="65" rx="12" ry="5" fill="#ff70a6" opacity="0.8" />

          {/* Flattened mouth with limp pink tongue hanging out */}
          <path d="M 115 62 Q 130 68 145 62" stroke="#091b29" strokeWidth="4" fill="none" />
          {/* Limp tongue dripping onto road */}
          <path
            d="M 122 64 C 122 75, 118 92, 128 96 C 138 98, 142 86, 138 64 Z"
            fill="#ff4d6d"
            stroke="#c9184a"
            strokeWidth="2"
          />
          <path d="M 129 68 L 129 90" stroke="#c9184a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block select-none transition-transform duration-100 ${
        isHit ? 'scale-95 translate-x-2' : ''
      } ${className}`}
    >
      <svg
        width={size}
        height={isPinata ? size * 1.35 : size * 1.15}
        viewBox={isPinata ? '0 -70 200 270' : '0 0 200 230'}
        className="overflow-visible"
      >
        <defs>
          {/* Gradients for crisp isometric cube shading */}
          <linearGradient id="topFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#48cae4" />
            <stop offset="100%" stopColor="#0096c7" />
          </linearGradient>

          <linearGradient id="leftFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077b6" />
            <stop offset="100%" stopColor="#023e8a" />
          </linearGradient>

          <linearGradient id="rightFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0096c7" />
            <stop offset="100%" stopColor="#03045e" />
          </linearGradient>

          <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b08968" />
            <stop offset="50%" stopColor="#ddb892" />
            <stop offset="100%" stopColor="#7f5539" />
          </linearGradient>
        </defs>

        {/* Rope for suspended piñata - connected exactly by coordinates to top vertex (100, 40) */}
        {isPinata && (
          <g>
            <line
              x1="100"
              y1="-70"
              x2="100"
              y2="40"
              stroke="#a77a52"
              strokeWidth="6"
              strokeDasharray="5 2"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="-70"
              x2="100"
              y2="40"
              stroke="#78502d"
              strokeWidth="2"
              strokeDasharray="2 3"
            />
            {/* Knot & ring firmly fastened to the exact top vertex (100, 40) */}
            <ellipse cx="100" cy="38" rx="8" ry="5.5" fill="#78502d" stroke="#d4a373" strokeWidth="2" />
            <circle cx="100" cy="38" r="2.5" fill="#3d2411" />
          </g>
        )}

        {/* Shadow underneath only when grounded, NOT when hanging as suspended pinata! */}
        {!isPinata && (
          <ellipse
            cx="100"
            cy={192}
            rx={65}
            ry={18}
            fill="#000000"
            opacity="0.55"
          />
        )}

        {/* ISOMETRIC CUBE BASE */}
        {/* Cube Center Point is (100, 115) */}
        {/* Top Face: (100, 40) - (165, 75) - (100, 112) - (35, 75) */}
        <polygon
          points="100,40 165,75 100,112 35,75"
          fill="url(#topFaceGrad)"
          stroke="#90e0ef"
          strokeWidth="2.5"
        />

        {/* Left Side Face (Technical Server Modules): (35, 75) - (100, 112) - (100, 185) - (35, 148) */}
        <polygon
          points="35,75 100,112 100,185 35,148"
          fill="url(#leftFaceGrad)"
          stroke="#0077b6"
          strokeWidth="2"
        />

        {/* Right Front Face (Kirby Face & Server Modules): (100, 112) - (165, 75) - (165, 148) - (100, 185) */}
        <polygon
          points="100,112 165,75 165,148 100,185"
          fill="url(#rightFaceGrad)"
          stroke="#0096c7"
          strokeWidth="2"
        />

        {/* TECHNICAL DETAILS (GEARS, RACK SLOTS, PORTS - STRICTLY NO TEXT) */}
        {/* Top Face Modules */}
        <g opacity="0.75" stroke="#caf0f8" strokeWidth="1.5" fill="none">
          <line x1="56" y1="63" x2="122" y2="99" />
          <line x1="78" y1="51" x2="144" y2="87" />
          {/* Isometric cooling vents */}
          <line x1="88" y1="52" x2="108" y2="63" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="94" y1="57" x2="114" y2="68" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="100" y1="62" x2="120" y2="73" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* Left Face Technical Rack & Gear Modules (No text!) */}
        <g opacity="0.85">
          {/* Server rack bays */}
          <polygon points="42,88 92,117 92,130 42,101" fill="#012a4a" stroke="#00b4d8" strokeWidth="1" />
          <polygon points="42,106 92,135 92,148 42,119" fill="#012a4a" stroke="#00b4d8" strokeWidth="1" />
          <polygon points="42,124 92,153 92,166 42,137" fill="#012a4a" stroke="#00b4d8" strokeWidth="1" />

          {/* Modular RJ45 / Port slots */}
          <rect x="46" y="94" width="6" height="5" transform="matrix(0.866 0.5 -0.5 0.866 28 -28)" fill="#000" stroke="#00f5d4" strokeWidth="0.8" />
          <rect x="58" y="101" width="6" height="5" transform="matrix(0.866 0.5 -0.5 0.866 28 -28)" fill="#000" stroke="#00f5d4" strokeWidth="0.8" />
          <rect x="70" y="108" width="6" height="5" transform="matrix(0.866 0.5 -0.5 0.866 28 -28)" fill="#000" stroke="#00f5d4" strokeWidth="0.8" />

          {/* Blinking status LEDs (green/ruby) */}
          <circle cx="86" cy="122" r="1.8" fill="#06d6a0" />
          <circle cx="86" cy="140" r="1.8" fill="#c81d25" />
          <circle cx="86" cy="158" r="1.8" fill="#06d6a0" />

          {/* Mechanical Gear icon on left face */}
          <g transform="translate(62, 142) scale(0.65)" stroke="#64dfdf" strokeWidth="1.2" fill="none">
            <circle cx="10" cy="10" r="5" />
            <circle cx="10" cy="10" r="2" fill="#64dfdf" />
            <line x1="10" y1="2" x2="10" y2="4" strokeWidth="2.5" />
            <line x1="10" y1="16" x2="10" y2="18" strokeWidth="2.5" />
            <line x1="2" y1="10" x2="4" y2="10" strokeWidth="2.5" />
            <line x1="16" y1="10" x2="18" y2="10" strokeWidth="2.5" />
          </g>
        </g>

        {/* RIGHT FRONT FACE: KIRBY EXPRESSIONS (Solidly anchored on right face, NO floating!) */}
        {!isKnocked ? (
          <g>
            {/* Left Eye (Anchor: x=120, y=126) */}
            {isSad ? (
              <g>
                <path d="M 115 125 Q 121 120 127 125" stroke="#03045e" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <circle cx="121" cy="127" r="4.5" fill="#03045e" />
                <circle cx="122" cy="126" r="1.5" fill="#fff" />
                {/* Tear drop */}
                <path d="M 121 132 Q 119 138 121 140 Q 123 138 121 132" fill="#90e0ef" />
              </g>
            ) : (
              <g>
                <ellipse cx="121" cy="125" rx="5.5" ry="9.5" fill="#03045e" stroke="#0077b6" strokeWidth="1" transform="rotate(-15 121 125)" />
                <ellipse cx="121" cy="128" rx="4" ry="5.5" fill="#0096c7" transform="rotate(-15 121 128)" />
                <ellipse cx="120" cy="120" rx="2.5" ry="4" fill="#ffffff" transform="rotate(-15 120 120)" />
                <circle cx="123" cy="130" r="1.2" fill="#ffffff" />
              </g>
            )}

            {/* Right Eye (Anchor: x=148, y=110) */}
            {isSad ? (
              <g>
                <path d="M 143 109 Q 149 104 155 109" stroke="#03045e" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <circle cx="149" cy="111" r="4.5" fill="#03045e" />
                <circle cx="150" cy="110" r="1.5" fill="#fff" />
              </g>
            ) : (
              <g>
                <ellipse cx="148" cy="109" rx="5.5" ry="9.5" fill="#03045e" stroke="#0077b6" strokeWidth="1" transform="rotate(-15 148 109)" />
                <ellipse cx="148" cy="112" rx="4" ry="5.5" fill="#0096c7" transform="rotate(-15 148 112)" />
                <ellipse cx="147" cy="104" rx="2.5" ry="4" fill="#ffffff" transform="rotate(-15 147 104)" />
                <circle cx="150" cy="114" r="1.2" fill="#ffffff" />
              </g>
            )}

            {/* Rosy Pink Cheeks (Blushing) */}
            <ellipse
              cx="114"
              cy="135"
              rx="6"
              ry="3.5"
              fill="#ff4d6d"
              opacity="0.85"
              transform="rotate(-20 114 135)"
            />
            <ellipse
              cx="156"
              cy="116"
              rx="6"
              ry="3.5"
              fill="#ff4d6d"
              opacity="0.85"
              transform="rotate(-20 156 116)"
            />

            {/* Cute Kirby mouth */}
            {isSad ? (
              <path
                d="M 130 126 Q 134 121 139 123"
                stroke="#03045e"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M 130 123 Q 134 131 140 127"
                stroke="#03045e"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="#c9184a"
              />
            )}
          </g>
        ) : (
          // Knocked out expression (Cross eyes firmly on face)
          <g stroke="#03045e" strokeWidth="3" strokeLinecap="round">
            <line x1="115" y1="120" x2="127" y2="132" />
            <line x1="127" y1="120" x2="115" y2="132" />

            <line x1="142" y1="104" x2="154" y2="116" />
            <line x1="154" y1="104" x2="142" y2="116" />

            {/* Dizzy mouth */}
            <path d="M 129 130 Q 135 125 141 129" fill="none" strokeWidth="2.5" />
          </g>
        )}

        {/* PIÑATA FLUFFY TISSUE PAPER FRINGE OVERLAY */}
        {isPinata && (
          <g className="pointer-events-none">
            {/* Rows of tissue paper fringe squares matching Party Pod reference */}
            {Array.from({ length: 9 }).map((_, rowIndex) => {
              const yBase = 60 + rowIndex * 14;
              return Array.from({ length: 11 }).map((_, colIndex) => {
                const xBase = 32 + colIndex * 13;
                const colors = ['#00b4d8', '#48cae4', '#90e0ef', '#0077b6', '#023e8a'];
                const color = colors[(rowIndex + colIndex) % colors.length];
                const jitter = (rowIndex * 7 + colIndex * 3) % 4 - 2;
                const isDamaged = damageLevel * 2 > (colIndex + rowIndex) / 2;

                if (isDamaged) return null; // Fringe fell off from bat hits!

                return (
                  <path
                    key={`fringe-${rowIndex}-${colIndex}`}
                    d={`M ${xBase} ${yBase + jitter} l 5 -3 l 6 4 l -2 7 l -8 1 z`}
                    fill={color}
                    opacity="0.9"
                    stroke="#0096c7"
                    strokeWidth="0.4"
                  />
                );
              });
            })}

            {/* Bottom hanging party ribbons / streamers */}
            <g>
              <path
                d="M 50 160 C 45 185, 55 205, 48 230"
                stroke="#00b4d8"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 75 175 C 80 195, 70 215, 78 235"
                stroke="#48cae4"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 100 185 C 95 205, 105 220, 98 240"
                stroke="#90e0ef"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 125 175 C 130 195, 120 215, 128 232"
                stroke="#0077b6"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 150 155 C 155 180, 145 200, 152 225"
                stroke="#023e8a"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
