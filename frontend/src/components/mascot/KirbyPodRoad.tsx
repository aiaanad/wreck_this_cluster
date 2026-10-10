import React from 'react';

interface KirbyPodRoadProps {
  isSquished?: boolean;
  size?: number;
  className?: string;
}

export const KirbyPodRoad: React.FC<KirbyPodRoadProps> = ({
  isSquished = false,
  size = 46,
  className = '',
}) => {
  if (isSquished) {
    // Flattened pancake pod on the road surface
    return (
      <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
        <svg
          width={size * 1.6}
          height={size * 0.75}
          viewBox="0 0 120 60"
          className="overflow-visible"
        >
          {/* Black tire tread contact mark on asphalt */}
          <ellipse cx="60" cy="38" rx="55" ry="16" fill="#111317" opacity="0.8" />
          {/* Flat squished blue chassis */}
          <ellipse cx="60" cy="35" rx="50" ry="14" fill="#023e8a" stroke="#0077b6" strokeWidth="1.5" />
          <ellipse cx="58" cy="33" rx="44" ry="11" fill="#0096c7" />

          {/* Left X eye */}
          <line x1="38" y1="28" x2="48" y2="38" stroke="#03045e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="48" y1="28" x2="38" y2="38" stroke="#03045e" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right X eye */}
          <line x1="68" y1="28" x2="78" y2="38" stroke="#03045e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="28" x2="68" y2="38" stroke="#03045e" strokeWidth="2.5" strokeLinecap="round" />

          {/* Blush */}
          <ellipse cx="32" cy="36" rx="6" ry="2.5" fill="#ff4d6d" opacity="0.8" />
          <ellipse cx="84" cy="36" rx="6" ry="2.5" fill="#ff4d6d" opacity="0.8" />

          {/* Limp tongue hanging out on asphalt */}
          <path
            d="M 54 36 C 54 44, 52 54, 58 56 C 64 57, 66 48, 64 36 Z"
            fill="#ff4d6d"
            stroke="#c9184a"
            strokeWidth="1.2"
          />
          <line x1="58" y1="38" x2="58" y2="52" stroke="#c9184a" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Eye-level / perspective front view of Kirby Pod standing on road
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        width={size}
        height={size * 1.15}
        viewBox="0 0 100 115"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="podRoadFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#48cae4" />
            <stop offset="40%" stopColor="#0096c7" />
            <stop offset="100%" stopColor="#0077b6" />
          </linearGradient>

          <linearGradient id="podRoadTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#90e0ef" />
            <stop offset="100%" stopColor="#48cae4" />
          </linearGradient>

          <linearGradient id="podRoadSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#023e8a" />
            <stop offset="100%" stopColor="#03045e" />
          </linearGradient>
        </defs>

        {/* Contact Shadow on the Asphalt (Grounds the pod firmly on the road!) */}
        <ellipse cx="50" cy="106" rx="42" ry="7" fill="#1e2229" opacity="0.85" />
        <ellipse cx="50" cy="105" rx="36" ry="5" fill="#0f1115" opacity="0.95" />

        {/* CUBE IN ROAD PERSPECTIVE (Eye-level, slight 3D top/side) */}
        {/* Top Face (Viewed from slight angle) */}
        <polygon
          points="20,24 50,14 80,24 50,34"
          fill="url(#podRoadTop)"
          stroke="#caf0f8"
          strokeWidth="1.2"
        />

        {/* Right Side Face */}
        <polygon
          points="80,24 50,34 50,102 80,92"
          fill="url(#podRoadSide)"
          stroke="#0077b6"
          strokeWidth="1"
        />

        {/* Left Side Face */}
        <polygon
          points="20,24 50,34 50,102 20,92"
          fill="url(#podRoadFront)"
          stroke="#0096c7"
          strokeWidth="1.2"
        />

        {/* Cooling Vents & Server Modules on top (Strictly no text!) */}
        <line x1="38" y1="23" x2="48" y2="20" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
        <line x1="44" y1="26" x2="54" y2="23" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
        <line x1="50" y1="29" x2="60" y2="26" stroke="#ffffff" strokeWidth="1" opacity="0.7" />

        {/* Side Face Server bays & RJ45 ports (No text!) */}
        <rect x="56" y="44" width="18" height="5" fill="#012a4a" stroke="#00b4d8" strokeWidth="0.7" />
        <rect x="56" y="55" width="18" height="5" fill="#012a4a" stroke="#00b4d8" strokeWidth="0.7" />
        <rect x="56" y="66" width="18" height="5" fill="#012a4a" stroke="#00b4d8" strokeWidth="0.7" />
        {/* Blinking mini LED */}
        <circle cx="71" cy="46.5" r="1.2" fill="#06d6a0" />
        <circle cx="71" cy="57.5" r="1.2" fill="#c81d25" />

        {/* FRONT-FACING KIRBY FACE (Looking nervously back at car) */}
        {/* Left Eye */}
        <ellipse cx="32" cy="54" rx="4" ry="7.5" fill="#03045e" stroke="#0077b6" strokeWidth="0.8" />
        <ellipse cx="32" cy="56" rx="2.8" ry="4.5" fill="#0096c7" />
        <ellipse cx="31.2" cy="51" rx="1.8" ry="3" fill="#ffffff" />
        <circle cx="33.5" cy="58" r="0.9" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="44" cy="58" rx="4" ry="7.5" fill="#03045e" stroke="#0077b6" strokeWidth="0.8" />
        <ellipse cx="44" cy="60" rx="2.8" ry="4.5" fill="#0096c7" />
        <ellipse cx="43.2" cy="55" rx="1.8" ry="3" fill="#ffffff" />
        <circle cx="45.5" cy="62" r="0.9" fill="#ffffff" />

        {/* Blushing cheeks */}
        <ellipse cx="26" cy="64" rx="3.5" ry="2" fill="#ff4d6d" opacity="0.85" />
        <ellipse cx="48" cy="68" rx="3.5" ry="2" fill="#ff4d6d" opacity="0.85" />

        {/* Nervous trembling mouth */}
        <path
          d="M 35 68 Q 38 65 41 68"
          stroke="#03045e"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
