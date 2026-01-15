
import React from 'react';
import { Sparkles, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  onStart: () => void;
}

export const GameIntroModal: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
         <img src={STORY_IMAGES.setup_bg} alt="bg" className="w-full h-full object-cover blur-sm opacity-50" />
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full p-8 relative z-10 border border-white/50 animate-fade-in-up">
        
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
             ✨
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎踏上星途</h2>
           <p className="text-gray-500 text-sm">通往顶流偶像的旅程即将开始，<br/>请查收这份新人指南。</p>
        </div>

        <div className="space-y-6 mb-8">
           {/* Step 1 */}
           <div className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                 <Sparkles size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-800 text-sm mb-1">随机机遇</h3>
                 <p className="text-xs text-gray-600 leading-relaxed">
                    每一季度开始，都会触发2到4个<span className="text-purple-600 font-bold">突发事件</span>。你的选择将决定星途走向，带来意外的数值收获。
                 </p>
              </div>
           </div>

           {/* Step 2 */}
           <div className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                 <Zap size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-800 text-sm mb-1">行动规划</h3>
                 <p className="text-xs text-gray-600 leading-relaxed">
                    每轮拥有 <span className="text-blue-600 font-bold">3或5 个行动点 (AP)</span>。合理安排训练、休息，勿浪费每一次变强的机会。
                 </p>
              </div>
           </div>

           {/* Step 3 */}
           <div className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                 <TrendingUp size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-800 text-sm mb-1">数值平衡</h3>
                 <p className="text-xs text-gray-600 leading-relaxed">
                    除了唱跳颜值，请关注<span className="text-red-500 font-bold">健康</span>与<span className="text-green-600 font-bold">道德</span>。一旦归零，生涯将被迫中止。
                 </p>
              </div>
           </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
           正式出发 <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
};
