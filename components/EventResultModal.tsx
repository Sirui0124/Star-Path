import React from 'react';
import { EventOutcome, EventType } from '../types';
import { ArrowUp, ArrowDown, MessageCircle, User, Bell } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  outcome: EventOutcome;
  eventType: EventType;
  onClose: () => void;
}

export const EventResultModal: React.FC<Props> = ({ outcome, eventType, onClose }) => {
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-transparent rounded-3xl shadow-2xl w-full max-w-[320px] overflow-hidden flex flex-col relative animate-fade-in-up border border-white/40 aspect-[1/1.15]">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img 
            src={getBackgroundImage()} 
            alt="Event Background" 
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay to ensure text contrast on glass - Reduced to 10% */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full justify-between p-5">
          
          {/* Header - Narrative - Aligned Start (Top) */}
          <div className="text-center flex-1 flex flex-col justify-start items-center pt-2">
             <div className="text-4xl mb-4 animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">✨</div>
             
             {/* Narrative Pill - Dark Glass Style with Quotes - Tuned Transparency */}
             <div className="relative w-full">
                <div className="bg-slate-900/20 backdrop-blur-md p-5 rounded-xl border border-white/10 text-white text-base font-bold leading-relaxed text-center shadow-inner relative">
                    <span className="absolute top-1 left-2 text-3xl text-white/40 font-serif leading-none">“</span>
                    <span className="relative z-10 px-2 block drop-shadow-md">{narrative}</span>
                    <span className="absolute -bottom-3 right-2 text-3xl text-white/40 font-serif leading-none">”</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Social Feedback - Increased Opacity */}
            <div className="animate-fade-in-up delay-100">
               {socialType === 'WECHAT' && (
                 <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-md">
                    <div className="flex items-center gap-2 mb-1.5 border-b border-gray-500/10 pb-1">
                       <div className="bg-green-500 text-white p-1 rounded-full shadow-sm"><MessageCircle size={10} /></div>
                       <span className="text-xs font-bold text-gray-800">{socialSender}</span>
                    </div>
                    <div className="bg-gray-50/50 p-2 rounded-xl text-xs text-gray-900 font-bold leading-relaxed shadow-inner">
                       {socialContent}
                    </div>
                 </div>
               )}

               {socialType === 'WEIBO' && (
                 <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-md">
                    <div className="flex items-center gap-2 mb-1.5">
                       <div className="w-6 h-6 rounded-full bg-orange-100/80 text-orange-600 flex items-center justify-center border border-orange-200 shadow-sm">
                         <User size={12} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900">{socialSender}</span>
                       </div>
                    </div>
                    <div className="text-xs text-gray-900 pl-8 leading-relaxed font-bold">
                       {socialContent}
                    </div>
                 </div>
               )}
               
               {socialType === 'SYSTEM' && (
                  <div className="bg-blue-50/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 flex items-center gap-3 shadow-md">
                     <div className="text-blue-600 bg-blue-100/50 p-1.5 rounded-full"><Bell size={14} /></div>
                     <div className="text-xs text-blue-900 font-bold leading-tight">{socialContent}</div>
                  </div>
               )}
            </div>

            {/* Stat Changes - Increased Opacity */}
            {statChanges.length > 0 && (
               <div className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 border border-white/50 shadow-md animate-fade-in-up delay-200">
                  <div className="flex flex-wrap gap-2 justify-center">
                     {statChanges.map(([key, val]) => {
                        const isPositive = (val as number) > 0;
                        const nameMap: any = { vocal: 'Vocal', dance: 'Dance', looks: '颜值', eq: '情商', ethics: '道德', health: '健康', fans: '粉丝', votes: '票数', dream: '梦想' };
                        return (
                          <div key={key} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black border shadow-sm ${
                             isPositive 
                             ? 'bg-green-100/50 text-green-900 border-green-200/50' 
                             : 'bg-red-100/50 text-red-900 border-red-200/50'
                          }`}>
                             {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                             <span>{nameMap[key] || key}</span>
                             <span>{Math.abs(val as number)}</span>
                          </div>
                        );
                     })}
                  </div>
               </div>
            )}

            <button 
              onClick={onClose}
              className="bg-white/90 hover:bg-white text-blue-900 font-black py-3.5 rounded-2xl transition-all shadow-lg backdrop-blur-md border border-white/50 w-full flex items-center justify-center gap-2 group text-sm active:scale-95 mt-1"
            >
              继续前行 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};