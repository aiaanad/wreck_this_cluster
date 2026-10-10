import React from 'react';

interface BaseballBatProps {
  isSwinging?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BaseballBat: React.FC<BaseballBatProps> = ({
  isSwinging = false,
  className = '',
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[clamp(11rem,45vw,16.25rem)] min-h-11 w-[clamp(4rem,18vw,5.625rem)] cursor-pointer transition-transform select-none focus-visible:ring-2 focus-visible:ring-[#c81d25] ${
        isSwinging ? 'animate-bat-swing' : 'hover:rotate-3'
      } ${className}`}
      title="Нажми, чтобы ударить битой!"
      aria-label="Ударить битой"
    >
      <svg
        viewBox="0 0 100 300"
        className="w-full h-full filter drop-shadow-[4px_6px_8px_rgba(0,0,0,0.7)]"
      >
        <defs>
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8d5b32" />
            <stop offset="25%" stopColor="#cfa170" />
            <stop offset="60%" stopColor="#e9c49a" />
            <stop offset="85%" stopColor="#cfa170" />
            <stop offset="100%" stopColor="#7a4b24" />
          </linearGradient>

          <linearGradient id="handleWrap" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2b2d42" />
            <stop offset="50%" stopColor="#4a4e69" />
            <stop offset="100%" stopColor="#22223b" />
          </linearGradient>
        </defs>

        {/* Bat Silhouette */}
        {/* Barrel top: wide rounded dome, tapering down to handle, knob at the bottom */}
        <path
          d="
            M 36 25
            C 36 10, 64 10, 64 25
            L 60 140
            C 58 175, 54 210, 52 245
            L 52 270
            C 58 273, 58 285, 50 286
            C 42 285, 42 273, 48 270
            L 48 245
            C 46 210, 42 175, 40 140
            Z
          "
          fill="url(#woodGrad)"
          stroke="#4a2c11"
          strokeWidth="2.5"
        />

        {/* Realistic wood grain lines */}
        <path d="M 44 35 Q 46 100 45 150" stroke="#a06d3b" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M 52 30 Q 54 90 53 140" stroke="#fceade" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 58 40 Q 56 110 57 155" stroke="#7a4b24" strokeWidth="1.2" fill="none" opacity="0.7" />

        {/* Handle grip tape wrap */}
        <g stroke="#1a1c22" strokeWidth="2" fill="none">
          <line x1="47" y1="215" x2="53" y2="220" />
          <line x1="48" y1="225" x2="52" y2="230" />
          <line x1="48" y1="235" x2="52" y2="240" />
          <line x1="48" y1="245" x2="52" y2="250" />
          <line x1="48" y1="255" x2="52" y2="260" />
          <line x1="48" y1="265" x2="52" y2="270" />
        </g>

        {/* Copper / brass ring at the knob base */}
        <ellipse cx="50" cy="275" rx="5" ry="2" fill="#d4a373" stroke="#8b5e34" strokeWidth="1" />
        <circle cx="50" cy="285" r="3.5" fill="#583115" />

        {/* Motion whoosh line when swinging */}
        {isSwinging && (
          <path
            d="M 15 40 Q -10 120 20 210"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="12 8"
            fill="none"
            opacity="0.8"
          />
        )}
      </svg>
    </button>
  );
};
