
import React from 'react';
import { GameEvent } from '../types';
import { AlertCircle } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  event: GameEvent;
  onOptionSelect: (index: number) => void;
  isLoading: boolean;
  loadingTip?: string;
}

export const EventChoiceModal: React.FC<Props> = ({ event, onOptionSelect, isLoading, loadingTip }) => {

  const getBackgroundImage = () => {
    switch (event.type) {
      case 'SOCIAL': return STORY_IMAGES.event_social;
      case 'SHOW': return STORY_IMAGES.event_show;
      case 'RANDOM': 
      default: return STORY_IMAGES.event_random;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="bg-transparent rounded-3xl shadow-2xl w-full max-w-[340px] aspect-[5/8] max-h-[85vh] overflow-hidden flex flex-col relative border border-white/30">
        
        {/* Background Layer - Removed fade-in state */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          <img 
            src={getBackgroundImage()} 
            alt="Event Choice Background" 
            className="w-full h-full object-cover opacity-90"
          />
          {/* Enhanced gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
          
          {/* Top Section - Scrollable if text is massive */}
          <div className="flex flex-col justify-start pt-1 flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-2">
             {/* Tag */}
             <div className="flex items-center gap-2 mb-3 md:mb-4 shrink-0">
                <div className="bg-white/20 backdrop-blur-md text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1 shadow-sm uppercase tracking-wider">
                    <AlertCircle size={10} />
                    {event.type === 'SOCIAL' ? 'SOCIAL EVENT' : 'RANDOM EVENT'}
                </div>
             </div>
             
             {/* Title - Adaptive Size */}
             <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-md mb-2 md:mb-3 leading-tight tracking-wide shrink-0">
                {event.title}
             </h2>
             
             {/* Description Card - Improved glass rendering stability */}
             <div className="relative mt-1 mb-2 shrink-0">
                <div className="bg-black/30 backdrop-blur-md p-3 md:p-4 rounded-xl border-l-2 border-white/40 text-white text-xs md:text-sm font-medium leading-relaxed shadow-lg relative transform-gpu will-change-transform">
                    <span className="block drop-shadow-sm opacity-95">{event.description}</span>
                </div>
             </div>
          </div>

          {/* Bottom Section - Options (Fixed at bottom) */}
          <div className="pt-2 pb-2 shrink-0">
            <div className="space-y-2 md:space-y-3">
               {event.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOptionSelect(idx)}
                    disabled={isLoading}
                    className={`w-full p-3 md:p-4 text-xs md:text-sm font-bold rounded-xl text-left transition-all shadow-lg border backdrop-blur-md group relative overflow-hidden transform-gpu will-change-transform ${
                      isLoading 
                      ? 'bg-gray-100/80 text-gray-500 cursor-wait' 
                      : 'bg-white/90 hover:bg-white text-gray-900 border-white/60 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    <span className="relative z-10 flex justify-between items-center">
                        <span className="line-clamp-2 pr-1">{isLoading ? '正在生成...' : opt.text}</span>
                        {!isLoading && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 translate-x-[-5px] group-hover:translate-x-0 shrink-0">→</span>}
                    </span>
                  </button>
                ))}
            </div>

            {isLoading && (
              <div className="mt-4 text-center absolute bottom-8 left-0 right-0 pointer-events-none">
                 <div className="inline-block px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs font-bold text-white animate-pulse border border-white/20 shadow-lg">
                    ✨ {loadingTip}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
