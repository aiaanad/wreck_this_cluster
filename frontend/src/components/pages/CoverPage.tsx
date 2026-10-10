import React from 'react';
import { ArrowRight } from 'lucide-react';
import { playPageTurnSound } from '../../utils/audio';

interface CoverPageProps {
  onNext: () => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onNext }) => {
  const handleOpenZine = () => {
    playPageTurnSound();
    onNext();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start pt-12 sm:pt-16 p-6 select-none">
      {/* Background notebook cloth / binder texture with subtle stitching */}
      <div className="absolute inset-0 bg-[#0a0a0a] xerox-grit opacity-90 pointer-events-none" />

      {/* Main Cover Artwork: White Lined Paper taped down with yellow masking tape */}
      <button
        type="button"
        onClick={handleOpenZine}
        className="group relative z-10 w-3/4 max-w-[230px] cursor-pointer text-left transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#c81d25]"
      >
        {/* Yellow Masking Tape on all four borders */}
        {/* Top Tape */}
        <div className="absolute -top-2 left-4 right-4 h-4 masking-tape z-20 transform -rotate-1 rounded-sm shadow-xs" />
        {/* Bottom Tape */}
        <div className="absolute -bottom-2 left-4 right-4 h-4 masking-tape z-20 transform rotate-1 rounded-sm shadow-xs" />
        {/* Left Tape */}
        <div className="absolute -left-2 top-3 bottom-3 w-4 masking-tape z-20 transform rotate-1 rounded-sm shadow-xs" />
        {/* Right Tape */}
        <div className="absolute -right-2 top-3 bottom-3 w-4 masking-tape z-20 transform -rotate-1 rounded-sm shadow-xs" />

        {/* White Lined Paper Card (Only handwriting, matching user Image 1!) */}
        <div className="lined-paper px-4 py-8 border border-gray-300 shadow-xl relative z-10 flex flex-col items-center justify-center min-h-[170px]">
          {/* Handwritten Marker Text matching Image 1 top-left */}
          <div className="font-marker text-black text-center tracking-tight leading-[1.05] select-none">
            <div className="text-2xl sm:text-3xl font-black transform -rotate-2">
              WRECK
            </div>
            <div className="text-2xl sm:text-3xl font-black my-0.5 transform rotate-1">
              THIS
            </div>
            <div className="text-2xl sm:text-3xl font-black transform -rotate-1 flex items-center justify-center">
              <span>CLUSTER</span>
              <span className="text-[#c81d25] ml-0.5 text-3xl sm:text-4xl font-black">*</span>
            </div>
          </div>

          {/* Underline scratch doodle */}
          <svg className="w-28 h-2 mt-3 opacity-80" viewBox="0 0 100 8">
            <path
              d="M 2 4 Q 25 7 50 3 T 98 4"
              stroke="#0a0a0a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>

      {/* Bottom right forward arrow link to next page (single arrow linker, no text bar) */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={handleOpenZine}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.7)] transition-all border border-gray-400 group"
          title="Следующая страница"
          aria-label="Следующая страница"
        >
          <ArrowRight size={20} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
