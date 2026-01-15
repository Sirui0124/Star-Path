
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col relative animate-fade-in-up border-2 border-white/20 min-h-[520px]">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getBackgroundImage()} 
            alt="Event Choice Background" 
            className="w-full h-full object-cover"
          />
          {/* Improved Gradient: Darker top for white text title contrast, white bottom for controls */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/95"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Top Section */}
          <div className="p-6 pt-8">
             {/* Tag */}
             <div className="flex items-center gap-2 mb-3">
                <div className="bg-white/90 backdrop-blur text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/50 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {event.type === 'SOCIAL' ? '社媒营业' : '突发事件'}
                </div>
             </div>
             
             {/* Title - Floating on image with shadow */}
             <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-6 tracking-wide leading-tight">
                {event.title}
             </h2>
             
             {/* Description Card - Key decision text with white glassmorphism */}
             <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-xl text-gray-900 font-medium leading-relaxed relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                {event.description}
             </div>
          </div>

          {/* Bottom Section - Options */}
          <div className="p-6 pb-8">
            <div className="space-y-3">
               {event.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOptionSelect(idx)}
                    disabled={isLoading}
                    className={`w-full p-4 font-bold rounded-xl text-left transition-all shadow-md hover:shadow-xl border backdrop-blur-sm group relative overflow-hidden ${
                      isLoading 
                      ? 'bg-gray-100/80 text-gray-400 cursor-wait' 
                      : 'bg-white/90 hover:bg-white text-blue-900 border-white/60 hover:scale-[1.02]'
                    }`}
                  >
                    <span className="relative z-10 flex justify-between items-center">
                        {isLoading ? '正在生成结果...' : opt.text}
                        {!isLoading && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">→</span>}
                    </span>
                  </button>
                ))}
            </div>

            {isLoading && (
              <div className="mt-4 text-center">
                 <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 backdrop-blur text-xs font-bold text-blue-600 animate-pulse border border-blue-100 shadow-sm">
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
