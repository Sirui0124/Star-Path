
import React from 'react';
import { Sparkles, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  onStart: () => void;
}

export const GameIntroModal: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 font-sans">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-gray-100">
         <img 
            src={STORY_IMAGES.setup_bg} 
            alt="bg" 
            className="w-full h-full object-cover opacity-100" 
         />
         <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Main Card - High Transparency White */}
      <div className="relative z-10 w-full max-w-sm bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/40 animate-fade-in-up">
        
        {/* Title Section */}
        <div className="text-center mb-10 mt-2">
           <h2 className="text-3xl font-bold text-gray-900 tracking-wider mb-3 drop-shadow-sm">
             欢迎踏上星途
           </h2>
           <div className="w-10 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto shadow-sm"></div>
           <p className="text-gray-800 text-sm mt-4 font-bold drop-shadow-sm">
             通往顶流偶像的旅程即将开始
           </p>
        </div>

        {/* Feature List */}
        <div className="space-y-8 mb-12 px-2">
           {/* Step 1 */}
           <div className="flex gap-5 items-start group">
              <div className="text-blue-600 mt-0.5 bg-blue-50/80 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                 <Sparkles size={20} strokeWidth={2} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-900 text-base mb-1 drop-shadow-sm">随机机遇</h3>
                 <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    每季度<span className="text-gray-900 font-black">随机事件</span>，每一次选择是内心的声音，也是命运的转折。
                 </p>
              </div>
           </div>

           {/* Step 2 */}
           <div className="flex gap-5 items-start group">
              <div className="text-purple-600 mt-0.5 bg-purple-50/80 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                 <Zap size={20} strokeWidth={2} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-900 text-base mb-1 drop-shadow-sm">行动规划</h3>
                 <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    合理分配<span className="text-gray-900 font-black">行动点 (AP)</span>，在训练与休息间寻找平衡。
                 </p>
              </div>
           </div>

           {/* Step 3 */}
           <div className="flex gap-5 items-start group">
              <div className="text-pink-600 mt-0.5 bg-pink-50/80 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                 <TrendingUp size={20} strokeWidth={2} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-900 text-base mb-1 drop-shadow-sm">事业规划</h3>
                 <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    提升<span className="text-gray-900 font-black">唱跳颜值</span>以赢取更多机会，规划好自己要走的道路。
                 </p>
              </div>
           </div>
        </div>

        {/* Dreamy Button */}
        <button 
          onClick={onStart}
          className="w-full py-4 rounded-full font-bold text-white text-lg tracking-wider flex items-center justify-center gap-2 transition-all transform hover:scale-[1.03] active:scale-95
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
  );
};
