
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col relative animate-fade-in-up border-2 border-white/20 min-h-[500px]">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getBackgroundImage()} 
            alt="Event Background" 
            className="w-full h-full object-cover"
          />
          {/* Gradient: Light top to show image, White bottom for content */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/95"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full">
          
          {/* Header - Floating Narrative Pill */}
          <div className="p-6 pt-12 text-center">
             <div className="text-5xl mb-6 animate-bounce drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">✨</div>
             
             <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/60 shadow-xl inline-block max-w-[90%]">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{narrative}</h3>
             </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-end gap-4 pb-8">
            {/* Social Feedback */}
            <div className="animate-fade-in-up delay-100">
               {socialType === 'WECHAT' && (
                 <div className="bg-white/70 backdrop-blur-md p-3 rounded-lg border border-gray-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-200/50 pb-1">
                       <div className="bg-green-500 text-white p-1 rounded-full"><MessageCircle size={12} /></div>
                       <span className="text-xs font-bold text-gray-700">{socialSender}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg text-sm text-gray-900 shadow-inner inline-block relative ml-1 border border-gray-200">
                       {socialContent}
                       <div className="absolute top-2 -left-1.5 w-3 h-3 bg-gray-50 transform rotate-45 border-l border-b border-gray-200"></div>
                    </div>
                 </div>
               )}

               {socialType === 'WEIBO' && (
                 <div className="bg-white/95 backdrop-blur-md p-3 rounded-lg border border-orange-100 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200 shadow-inner">
                         <User size={16} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-orange-900">{socialSender}</span>
                          <span className="text-[10px] text-gray-500">刚刚 来自 iPhone客户端</span>
                       </div>
                    </div>
                    <div className="text-sm text-gray-800 pl-10 leading-relaxed font-medium">
                       {socialContent}
                    </div>
                 </div>
               )}
               
               {socialType === 'SYSTEM' && (
                  <div className="bg-blue-50/95 backdrop-blur-md p-4 rounded-lg border border-blue-200 flex items-center gap-3 shadow-lg">
                     <div className="text-blue-500 bg-blue-100 p-1.5 rounded-full"><Bell size={18} /></div>
                     <div className="text-sm text-blue-900 font-bold">{socialContent}</div>
                  </div>
               )}
            </div>

            {/* Stat Changes */}
            {statChanges.length > 0 && (
               <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-white/60 shadow-md animate-fade-in-up delay-200">
                  <h4 className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <div className="w-1 h-3 bg-gray-500 rounded-full"></div>
                    属性变更
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {statChanges.map(([key, val]) => {
                        const isPositive = (val as number) > 0;
                        const nameMap: any = { vocal: 'Vocal', dance: 'Dance', looks: '颜值', eq: '情商', morale: '道德', health: '健康', fans: '粉丝', votes: '票数', dream: '梦想' };
                        return (
                          <div key={key} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${
                             isPositive 
                             ? 'bg-green-100/80 text-green-800 border-green-200' 
                             : 'bg-red-100/80 text-red-800 border-red-200'
                          }`}>
                             {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-xl hover:shadow-2xl w-full flex items-center justify-center gap-2 group mt-2"
            >
              继续前行 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
