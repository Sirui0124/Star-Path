
import React from 'react';
import { EventOutcome, EventType } from '../types';
import { ArrowUp, ArrowDown, MessageCircle, User, Bell, ChevronRight, Hash, Sparkles, Zap } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  outcome: EventOutcome;
  eventType: EventType;
  context: { title: string, desc: string, options: string[], selectedIndex: number } | null;
  onClose: () => void;
  isAiGenerated?: boolean;
}

export const EventResultModal: React.FC<Props> = ({ outcome, eventType, context, onClose, isAiGenerated }) => {
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
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          <img 
            src={getBackgroundImage()} 
            alt="Event Background" 
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>

        {/* Content Layer - Scrollable Wrapper for Large Fonts/Overflow */}
        <div className="relative z-10 h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col min-h-full p-5 md:p-6">
              
              {/* --- TOP SECTION: CONTEXT --- */}
              <div className="flex flex-col gap-1 mb-4">
                 <div className="flex items-center gap-2 mb-1 opacity-80 shrink-0">
                    <span className="text-[10px] md:text-xs font-bold text-white tracking-[0.2em] uppercase border border-white/30 px-2 py-0.5 rounded-sm">Event Log</span>
                 </div>

                 {/* Original Event Title - Reduced size to text-base/text-lg */}
                 <h2 className="text-base md:text-lg font-black text-white drop-shadow-md leading-none mb-2 md:mb-3 shrink-0">
                    {context?.title || "事件回溯"}
                 </h2>

                 {/* Brief Description - Limited to 3 lines with ellipsis */}
                 <p className="text-sm md:text-base text-gray-200 line-clamp-3 leading-relaxed opacity-95 mb-3 shrink-0 font-medium">
                    {context?.desc}
                 </p>

                 {/* Options List - Compact */}
                 <div className="flex flex-col gap-2 shrink-0">
                    {context?.options.map((opt, idx) => {
                      const isSelected = idx === context.selectedIndex;
                      return (
                        <div 
                          key={idx} 
                          className={`
                            px-3 py-2 rounded-lg text-sm md:text-base font-bold border backdrop-blur-md transition-all flex items-center gap-2 transform-gpu
                            ${isSelected 
                              ? 'bg-white/20 border-yellow-300/50 text-white shadow-sm' 
                              : 'bg-black/20 border-white/10 text-gray-300' 
                            }
                          `}
                        >
                          <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'}`}></div>
                          <span className={`${isSelected ? 'text-yellow-100' : ''} line-clamp-1`}>{opt}</span>
                          {isSelected && <span className="ml-auto text-yellow-300 text-[10px] shrink-0 font-black">YOU</span>}
                        </div>
                      );
                    })}
                 </div>
              </div>

              {/* --- BOTTOM SECTION: RESULT CARD (Pushed to bottom) --- */}
              <div className="mt-auto flex flex-col gap-3 shrink-0">
                 
                 {/* Unified Glass Pane for Results */}
                 <div className="bg-slate-900/60 backdrop-blur-xl border border-white/30 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col gap-3 md:gap-4 transform-gpu will-change-transform">
                    
                    {/* 1. Narrative Quote */}
                    <div className="relative text-center px-1">
                        <div className="text-base md:text-lg font-bold text-white leading-relaxed drop-shadow-sm max-h-24 overflow-y-auto scrollbar-hide">
                           “{narrative}”
                        </div>
                    </div>

                    {/* 2. Stat Changes Grid */}
                    {statChanges.length > 0 && (
                      <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center py-1 border-t border-white/10 border-b">
                         {statChanges.map(([key, val]) => {
                            const isPositive = (val as number) > 0;
                            const nameMap: any = { vocal: 'Vocal', dance: 'Dance', looks: '颜值', eq: '情商', ethics: '道德', health: '健康', fans: '粉丝', votes: '票数', dream: '梦想' };
                            return (
                              <div key={key} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] md:text-xs font-black border shadow-sm ${
                                 isPositive 
                                 ? 'bg-green-400/20 text-green-100 border-green-300/30' 
                                 : 'bg-red-400/20 text-red-100 border-red-300/30'
                              }`}>
                                 {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                 <span>{nameMap[key] || key}</span>
                                 <span>{Math.abs(val as number)}</span>
                              </div>
                            );
                         })}
                      </div>
                    )}

                    {/* 3. Social Feedback (Embedded) */}
                    <div className="mt-0.5 relative">
                       {/* AI Status Badge - Absolute Positioned or Flex embedded */}
                       <div className="absolute top-1 right-1 z-10">
                          {isAiGenerated ? (
                             <div className="text-[10px] text-purple-400 bg-purple-900/20 px-1.5 rounded-full border border-purple-500/30 flex items-center gap-0.5" title="AI命运观测中">
                                <Sparkles size={8} className="animate-pulse" /> AI
                             </div>
                          ) : (
                             <div className="text-[10px] text-slate-400 bg-slate-800/50 px-1.5 rounded-full border border-slate-600/30 flex items-center gap-0.5" title="基础模式运行">
                                <Zap size={8} /> 
                             </div>
                          )}
                       </div>

                       {socialType === 'WECHAT' && (
                         <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-lg shadow-sm">
                            <div className="bg-green-500 text-white p-1 rounded-full shrink-0 mt-0.5"><MessageCircle size={12} /></div>
                            <div className="min-w-0 pr-4">
                               <div className="text-[10px] md:text-xs font-bold text-gray-500 mb-0.5">{socialSender}</div>
                               <div className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2">{socialContent}</div>
                            </div>
                         </div>
                       )}

                       {socialType === 'WEIBO' && (
                         <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-lg shadow-sm">
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 border border-orange-200 mt-0.5"><User size={12} /></div>
                            <div className="min-w-0 pr-4">
                               <div className="text-[10px] md:text-xs font-bold text-orange-800 mb-0.5">{socialSender}</div>
                               <div className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2">{socialContent}</div>
                            </div>
                         </div>
                       )}
                       
                       {socialType === 'SYSTEM' && (
                          <div className="flex items-center gap-2 bg-blue-900/40 p-2.5 rounded-lg border border-blue-500/30">
                             <Bell size={14} className="text-blue-200 shrink-0"/>
                             <div className="text-xs md:text-sm text-blue-100 font-bold leading-tight pr-4">{socialContent}</div>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Continue Button */}
                 <button 
                    onClick={onClose}
                    className="group w-full bg-white hover:bg-gray-100 text-gray-900 py-3.5 md:py-4 rounded-xl font-black text-base transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    继续前行 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
