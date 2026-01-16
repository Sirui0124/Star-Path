import React from 'react';
import { X, Compass, AlertCircle } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  guide: any;
  onClose: () => void;
}

export const GuideModal: React.FC<Props> = ({ guide, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in font-sans">
      
      {/* 1. Background Layer: Dimmed overlay */}
      <div className="absolute inset-0 z-0 bg-slate-900/60 backdrop-blur-sm"></div>

      {/* 2. Main Dark Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-fade-in-up">
        
        {/* Background Image - Increased Visibility */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
            <img src={STORY_IMAGES.guide_bg} className="w-full h-full object-cover" alt="" />
            {/* Subtle Gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/10"></div>
        </div>

        {/* Header - Transparent & White Text */}
        <div className="relative z-10 px-4 py-5 text-center shrink-0">
           <button 
             onClick={onClose}
             className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors bg-white/10 p-1 rounded-full hover:bg-white/20 backdrop-blur-md"
           >
             <X size={18} strokeWidth={2} />
           </button>
           
           <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md shadow-inner border border-white/20 mb-3">
              <Compass size={20} className="text-blue-200" strokeWidth={1.5}/>
           </div>
           
           <h2 className="text-xl font-serif font-bold tracking-widest text-white leading-tight drop-shadow-md">
             {guide.title.split('：')[0]}
           </h2>
           <p className="text-[10px] text-blue-100/80 uppercase tracking-[0.2em] mt-1.5 font-bold drop-shadow-sm">Star Path Guide · 星途指南</p>
        </div>

        {/* Scrollable Content - White Cards floating on glass */}
        <div className="relative z-10 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          
          {/* Part 1: Primary Goals */}
          <div className="bg-white/95 backdrop-blur-sm border border-blue-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 rounded-full translate-x-6 -translate-y-6 blur-xl opacity-50"></div>
                
                <h3 className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wider relative z-10">
                   <div className="w-0.5 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                   当前目标
                </h3>
                
                <ul className="space-y-1.5 relative z-10">
                  {guide.goals.map((g: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 leading-snug font-medium">
                       <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0 shadow-sm"></span>
                       <span>{g}</span>
                    </li>
                  ))}
                </ul>

                {guide.conditions && (
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 text-[10px] text-slate-500 leading-relaxed relative z-10">
                       <span className="font-bold text-blue-600">💡 提示：</span>{guide.conditions}
                    </div>
                )}
          </div>

          {/* Part 2: Secondary Info (Table Layout) */}
          {guide.companies ? (
             <div className="bg-white/95 backdrop-blur-sm border border-purple-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50/30 to-white">
                    <h3 className="flex items-center gap-2 text-[12px] font-bold text-slate-700 uppercase tracking-wider">
                        <div className="w-0.5 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                        经纪公司签约指南
                    </h3>
                </div>

                {/* Note Above Table */}
                {guide.companyNote && (
                   <div className="mx-2 mt-2 mb-1 p-2 bg-blue-50/50 border border-blue-100 rounded-md flex gap-2 items-start">
                      <AlertCircle size={12} className="text-blue-500 mt-0.5 shrink-0" />
                      <div className="text-[10px] text-slate-700 leading-tight font-medium">
                         {guide.companyNote}
                      </div>
                   </div>
                )}

                <div className="w-full overflow-x-auto pb-1">
                    <table className="w-full text-left border-collapse min-w-[280px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-2 pl-3 pr-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider w-[30%]">公司</th>
                                <th className="py-2 px-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider w-[35%]">门槛</th>
                                <th className="py-2 pl-1 pr-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider w-[35%] text-right">季度收益</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {guide.companies.map((c: any, i: number) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-purple-50/20 transition-colors">
                                    <td className="py-2 pl-3 pr-1 align-top">
                                        <div className="text-[11px] font-bold text-slate-700 mb-0.5 leading-tight">{c.name.split(' ')[1] || c.name}</div>
                                        <span className="text-[9px] text-gray-500 border border-gray-200 rounded px-1 py-0 inline-block bg-gray-50 scale-90 origin-left">{c.type}</span>
                                    </td>
                                    <td className="py-2 px-1 align-top">
                                        <div className="space-y-0.5">
                                            {c.req.split('\n').map((r: string, idx: number) => (
                                                <div key={idx} className="text-[10px] text-slate-600 font-medium whitespace-nowrap flex items-center gap-1 leading-tight">
                                                   <span className="w-0.5 h-0.5 rounded-full bg-gray-400"></span>{r}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-2 pl-1 pr-3 align-top text-right">
                                         <div className="space-y-0.5">
                                            {c.benefit.split('\n').map((b: string, idx: number) => (
                                                <div key={idx} className="text-[10px] text-blue-600 font-bold whitespace-nowrap leading-tight">{b}</div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
          ) : (
             <div className="bg-white/95 backdrop-blur-sm border border-pink-100 rounded-xl p-3 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 rounded-full translate-x-8 -translate-y-8 blur-xl opacity-50"></div>
                 <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider relative z-10">
                   <div className="w-0.5 h-2.5 bg-pink-500 rounded-full shadow-sm"></div>
                   核心玩法
                </h3>
                <div className="text-[11px] text-slate-600 font-medium leading-relaxed relative z-10">
                   选秀阶段是积累粉丝的关键期。所有的努力、甚至争议，都将转化为最终的票数。请谨言慎行，或放手一搏。
                </div>
             </div>
          )}

        </div>
        
        {/* Footer Decoration */}
        <div className="p-3 border-t border-white/10 text-center bg-black/20 z-10 backdrop-blur-md">
            <div className="text-[9px] text-white/40 tracking-[0.3em] font-medium uppercase">
               Dream Big · Shine Bright
            </div>
        </div>

      </div>
    </div>
  );
};