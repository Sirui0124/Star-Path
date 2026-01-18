
import React from 'react';
import { EventOutcome, EventType } from '../types';
import { ArrowUp, ArrowDown, MessageCircle, User, Bell, ChevronRight, Hash } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  outcome: EventOutcome;
  eventType: EventType;
  context: { title: string, desc: string, options: string[], selectedIndex: number } | null;
  onClose: () => void;
}

export const EventResultModal: React.FC<Props> = ({ outcome, eventType, context, onClose }) => {
  const { narrative, changes, socialType, socialSender, socialContent } = outcome;
  
  // Format stats for display - Filter out hidden stats like sincerity
  const statChanges = Object.entries(changes).filter(([key, val]) => val !== 0 && key !== 'sincerity');

  const getBackgroundImage = () => {
    switch (eventType) {
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
            alt="Event Background" 
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
          
          {/* --- TOP SECTION: CONTEXT --- */}
          {/* Make this section flex-1 but allow it to shrink if needed */}
          <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide min-h-0 mb-2">
             <div className="flex items-center gap-2 mb-1 opacity-80 shrink-0">
                <span className="text-[9px] md:text-[10px] font-bold text-white tracking-[0.2em] uppercase border border-white/30 px-2 py-0.5 rounded-sm">Event Log</span>
             </div>

             {/* Original Event Title */}
             <h2 className="text-xl md:text-2xl font-black text-white drop-shadow-md leading-none mb-1 md:mb-2 shrink-0">
                {context?.title || "事件回溯"}
             </h2>

             {/* Brief Description */}
             <p className="text-[10px] md:text-xs text-gray-200 line-clamp-2 leading-relaxed opacity-90 mb-2 shrink-0">
                {context?.desc}
             </p>

             {/* Options List - Compact */}
             <div className="flex flex-col gap-1.5 shrink-0">
                {context?.options.map((opt, idx) => {
                  const isSelected = idx === context.selectedIndex;
                  return (
                    <div 
                      key={idx} 
                      className={`
                        px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold border backdrop-blur-md transition-all flex items-center gap-2 transform-gpu
                        ${isSelected 
                          ? 'bg-white/20 border-yellow-300/50 text-white shadow-sm' 
                          : 'bg-black/20 border-white/5 text-gray-400'
                        }
                      `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`}></div>
                      <span className={`${isSelected ? 'text-yellow-100' : ''} line-clamp-1`}>{opt}</span>
                      {isSelected && <span className="ml-auto text-yellow-300 text-[9px] shrink-0">YOU</span>}
                    </div>
                  );
                })}
             </div>
          </div>

          {/* --- BOTTOM SECTION: RESULT CARD --- */}
          {/* Fixed at bottom */}
          <div className="flex flex-col gap-3 shrink-0">
             
             {/* Unified Glass Pane for Results */}
             <div className="bg-slate-900/60 backdrop-blur-xl border border-white/30 rounded-2xl p-3 md:p-4 shadow-xl flex flex-col gap-2 md:gap-3 transform-gpu will-change-transform">
                
                {/* 1. Narrative Quote */}
                <div className="relative text-center px-1">
                    <div className="text-xs md:text-sm font-bold text-white leading-relaxed drop-shadow-sm font-serif italic max-h-16 overflow-y-auto scrollbar-hide">
                       “{narrative}”
                    </div>
                </div>

                {/* 2. Stat Changes Grid */}
                {statChanges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center py-1 border-t border-white/10 border-b">
                     {statChanges.map(([key, val]) => {
                        const isPositive = (val as number) > 0;
                        const nameMap: any = { vocal: 'Vocal', dance: 'Dance', looks: '颜值', eq: '情商', ethics: '道德', health: '健康', fans: '粉丝', votes: '票数', dream: '梦想' };
                        return (
                          <div key={key} className={`flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-black border shadow-sm ${
                             isPositive 
                             ? 'bg-green-400/20 text-green-100 border-green-300/30' 
                             : 'bg-red-400/20 text-red-100 border-red-300/30'
                          }`}>
                             {isPositive ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
                             <span>{nameMap[key] || key}</span>
                             <span>{Math.abs(val as number)}</span>
                          </div>
                        );
                     })}
                  </div>
                )}

                {/* 3. Social Feedback (Embedded) */}
                <div className="mt-0.5">
                   {socialType === 'WECHAT' && (
                     <div className="flex items-start gap-2 bg-white/90 p-2 rounded-lg shadow-sm">
                        <div className="bg-green-500 text-white p-1 rounded-full shrink-0 mt-0.5"><MessageCircle size={10} /></div>
                        <div className="min-w-0">
                           <div className="text-[9px] md:text-[10px] font-bold text-gray-500 mb-0.5">{socialSender}</div>
                           <div className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight line-clamp-2">{socialContent}</div>
                        </div>
                     </div>
                   )}

                   {socialType === 'WEIBO' && (
                     <div className="flex items-start gap-2 bg-white/90 p-2 rounded-lg shadow-sm">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 border border-orange-200 mt-0.5"><User size={10} /></div>
                        <div className="min-w-0">
                           <div className="text-[9px] md:text-[10px] font-bold text-orange-800 mb-0.5">{socialSender}</div>
                           <div className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight line-clamp-2">{socialContent}</div>
                        </div>
                     </div>
                   )}
                   
                   {socialType === 'SYSTEM' && (
                      <div className="flex items-center gap-2 bg-blue-900/40 p-2 rounded-lg border border-blue-500/30">
                         <Bell size={12} className="text-blue-200 shrink-0"/>
                         <div className="text-[10px] md:text-xs text-blue-100 font-bold leading-tight">{socialContent}</div>
                      </div>
                   )}
                </div>
             </div>

             {/* Continue Button */}
             <button 
                onClick={onClose}
                className="group w-full bg-white hover:bg-gray-100 text-gray-900 py-3 md:py-3.5 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                继续前行 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
