import React from 'react';
import { ArrowRight, Flame, ShieldAlert } from 'lucide-react';
import { playPageTurnSound } from '../../utils/audio';

interface ManualPageProps {
  onNext: () => void;
}

export const ManualPage: React.FC<ManualPageProps> = ({ onNext }) => {
  const handleProceed = () => {
    playPageTurnSound();
    onNext();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 select-none overflow-y-auto">
      {/* Top Header Label */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <div>
          <h2 className="font-marker text-xl sm:text-2xl text-white tracking-wide">
            ИНСТРУКЦИЯ ХАОСА
          </h2>
        </div>
        <span className="font-typewriter text-xs text-gray-500 uppercase">
          PAGE 02 / 06
        </span>
      </div>

      {/* Main Tag Card: Torn dark paper sheet */}
      <div className="relative my-2 rounded-sm border border-gray-700/80 bg-[#121317] p-4 shadow-md sm:p-5 sm:shadow-2xl">
        {/* Masking tape on top right corner */}
        <div className="absolute -top-2 -right-3 w-16 h-5 masking-tape transform rotate-12 z-10" />

        {/* Title Stamped Text */}
        <div className="flex items-center justify-between mb-3 border-b border-dashed border-gray-800 pb-2">
          <span className="font-typewriter text-xs text-gray-400 font-bold uppercase tracking-wider">
            ПОЛЕВОЙ ПРОТОКОЛ
          </span>
          <span className="text-[10px] font-mono text-[#c81d25] border border-[#c81d25] px-1.5 py-0.2 rounded font-bold">
            CHAOS MESH READY
          </span>
        </div>

        {/* Typewriter Rules */}
        <div className="space-y-3 font-typewriter text-xs sm:text-[13px] text-gray-300 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-[#c81d25] font-bold">1.</span>
            <div>
              <strong className="text-white">Ломай:</strong>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Просто ломай. Смотри на дашборд и выпускай пар.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-[#c81d25] font-bold">4.</span>
            <div>
              <strong className="text-white">Смотри на восстановление:</strong>
              <p className="text-[#c81d25] font-bold text-[11px] mt-0.5">
                «Хороший кластер не избегает сбоя. Он возвращается в рабочее состояние.»
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="flex items-center justify-between pt-2">
        <span className="font-cursive text-gray-400 text-sm">
          логин сохранён. можно начинать.
        </span>
      </div>
    </div>
  );
};
