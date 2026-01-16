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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-transparent rounded-3xl shadow-2xl w-full max-w-[320px] overflow-hidden flex flex-col relative animate-fade-in-up border border-white/40 aspect-[1/1.15]">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img 
            src={getBackgroundImage()} 
            alt="Event Choice Background" 
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay to ensure text contrast on glass - Reduced to 10% */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full justify-between p-5">
          
          {/* Top Section - Aligned to Start (Top) instead of Center */}
          <div className="flex flex-col justify-start pt-2">
             {/* Tag */}
             <div className="flex items-center gap-2 mb-3">
                <div className="bg-white/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1 shadow-sm">
                    <AlertCircle size={10} />
                    {event.type === 'SOCIAL' ? '社媒营业' : '突发事件'}
                </div>
             </div>
             
             {/* Title */}
             <h2 className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 leading-tight tracking-wide">
                {event.title}
             </h2>
             
             {/* Description Card - Quote Style & Transparent Dark Glass - Tuned Transparency */}
             <div className="relative mt-2 mb-1">
                <div className="bg-slate-900/20 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white text-sm font-medium leading-relaxed text-center shadow-inner relative">
                    <span className="absolute top-1 left-2 text-3xl text-white/40 font-serif leading-none">“</span>
                    <span className="relative z-10 px-2 block drop-shadow-md">{event.description}</span>
                    <span className="absolute -bottom-3 right-2 text-3xl text-white/40 font-serif leading-none">”</span>
                </div>
             </div>
          </div>

          {/* Bottom Section - Options */}
          <div className="pt-2">
            <div className="space-y-2.5">
               {event.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOptionSelect(idx)}
                    disabled={isLoading}
                    className={`w-full p-3.5 text-sm font-bold rounded-xl text-left transition-all shadow-md border backdrop-blur-md group relative overflow-hidden ${
                      isLoading 
                      ? 'bg-gray-100/90 text-gray-500 cursor-wait' 
                      : 'bg-white/90 hover:bg-white text-gray-900 border-white/60 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    <span className="relative z-10 flex justify-between items-center drop-shadow-sm">
                        {isLoading ? '正在生成...' : opt.text}
                        {!isLoading && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-700">→</span>}
                    </span>
                  </button>
                ))}
            </div>

            {isLoading && (
              <div className="mt-3 text-center absolute bottom-5 left-0 right-0 pointer-events-none">
                 <div className="inline-block px-3 py-1 rounded-full bg-white/80 backdrop-blur text-[10px] font-bold text-blue-800 animate-pulse border border-white/40 shadow-sm">
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