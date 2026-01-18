
import React from 'react';
import { Sparkles, Zap, TrendingUp, BookOpen } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  onStart: () => void;
  onOpenCollection: () => void;
}

export const GameIntroModal: React.FC<Props> = ({ onStart, onOpenCollection }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans h-[100dvh]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-gray-100">
         <img 
            src={STORY_IMAGES.setup_bg} 
            alt="bg" 
            className="w-full h-full object-cover opacity-100" 
         />
         <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Top Right Collection Button */}
      <div className="absolute top-4 right-4 z-20">
        <button 
            onClick={onOpenCollection} 
            className="flex items-center gap-1 px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-full transition text-sm font-medium border border-white/40 text-purple-900 shadow-sm backdrop-blur-md"
        >
            <BookOpen size={16} /> 我的卡册
        </button>
      </div>

      {/* Main Card - Flex Column for Responsiveness */}
      <div className="relative z-10 w-full max-w-sm bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
            {/* Title Section */}
            <div className="text-center mb-8 mt-2">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wider mb-3 drop-shadow-sm">
                 欢迎踏上星途
               </h2>
               <div className="w-10 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto shadow-sm"></div>
               <p className="text-gray-800 text-sm mt-4 font-bold drop-shadow-sm">
                 原来TA当年面对的，是这样的选择...
               </p>
            </div>

            {/* Feature List */}
            <div className="space-y-6 md:space-y-8 mb-4 px-1">
               {/* Step 1 */}
               <div className="flex gap-4 items-start group">
                  <div className="text-blue-600 mt-0.5 bg-blue-50/80 p-2 rounded-lg shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                     <Sparkles size={18} strokeWidth={2} />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 drop-shadow-sm">随机机遇</h3>
                     <p className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed">
                        每季度<span className="text-gray-900 font-black">随机事件</span>，每一次选择是内心的声音，也是命运的转折。
                     </p>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="flex gap-4 items-start group">
                  <div className="text-purple-600 mt-0.5 bg-purple-50/80 p-2 rounded-lg shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                     <Zap size={18} strokeWidth={2} />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 drop-shadow-sm">行动规划</h3>
                     <p className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed">
                        合理分配<span className="text-gray-900 font-black">行动点 (AP)</span>，在训练与休息间寻找平衡。
                     </p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="flex gap-4 items-start group">
                  <div className="text-pink-600 mt-0.5 bg-pink-50/80 p-2 rounded-lg shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                     <TrendingUp size={18} strokeWidth={2} />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 drop-shadow-sm">事业规划</h3>
                     <p className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed">
                        提升<span className="text-gray-900 font-black">唱跳颜值</span>以赢取更多机会，规划好自己要走的道路。
                     </p>
                  </div>
               </div>
            </div>
        </div>

        {/* Footer Button - Fixed at bottom of card */}
        <div className="p-6 md:p-8 pt-0 shrink-0 bg-transparent">
            <button 
              onClick={onStart}
              className="w-full py-3.5 md:py-4 rounded-full font-bold text-white text-base md:text-lg tracking-wider flex items-center justify-center gap-2 transition-all transform hover:scale-[1.03] active:scale-95
              bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500
              border-2 border-white/40 
              shadow-[0_4px_20px_rgba(217,70,239,0.5)] hover:shadow-[0_6px_25px_rgba(217,70,239,0.7)]
              group relative overflow-hidden backdrop-blur-sm"
            >
               <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></span>
               <span className="relative flex items-center gap-2 drop-shadow-md">
                 正式出发 <Sparkles size={20} className="animate-pulse" />
               </span>
            </button>
        </div>

      </div>
    </div>
  );
};
