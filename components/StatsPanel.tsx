
import React, { useState } from 'react';
import { Stats, GameTime, GameStage, HiddenStats } from '../types';
import { Heart, User, Mic, Music, Star, TrendingUp, Hourglass, Trophy, Info, X, Flame, Zap } from 'lucide-react';

interface Props {
  stats: Stats;
  hiddenStats: HiddenStats;
  time: GameTime;
  stage: GameStage;
  rank: number;
  name: string;
}

// Updated StatBar:
// 1. Label and Value have shrink-0 to prevent collapsing.
// 2. Bar has right margin to simulate "80% length" look (looser).
// 3. Font sizes adjusted for mobile safety.
const StatBar = ({ label, value, max, icon, colorClass, bgClass, barClass }: { 
  label: string; 
  value: number; 
  max: number; 
  icon: React.ReactNode; 
  colorClass: string; 
  bgClass: string; 
  barClass: string;
}) => (
  <div className="flex items-center gap-1.5 w-full">
    {/* Icon & Label Group: Fixed min-width to prevent wrapping */}
    <div className="flex items-center gap-1 shrink-0 w-[52px] sm:w-[58px]">
        <div className={`${colorClass} w-3 flex justify-center shrink-0`}>{icon}</div>
        <div className="font-bold text-gray-700 text-[10px] sm:text-[11px] whitespace-nowrap leading-none mt-0.5 transform scale-95 origin-left sm:scale-100">{label}</div>
    </div>
    
    {/* Progress Bar: Flex-1 but with margin to look '80% length'/looser */}
    <div className={`flex-1 ${bgClass} rounded-full h-1.5 overflow-hidden min-w-[30px] mr-1`}>
      <div 
        className={`h-full rounded-full ${barClass} transition-all duration-500`} 
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      ></div>
    </div>
    
    {/* Value: Fixed width aligned right */}
    <div className="w-[42px] sm:w-[48px] text-right text-[10px] text-gray-500 font-mono font-bold shrink-0 leading-none whitespace-nowrap">
        {value}/{max}
    </div>
  </div>
);

// Updated SimpleStatRow with similar safe constraints
const SimpleStatRow = ({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: string | number, colorClass: string }) => (
    <div className="flex items-center gap-1 w-full justify-between">
        <div className="flex items-center gap-1 shrink-0">
            <div className={`${colorClass} w-3 flex justify-center shrink-0`}>{icon}</div>
            <div className="font-bold text-gray-700 text-[10px] sm:text-[11px] whitespace-nowrap leading-none mt-0.5">{label}</div>
        </div>
        <div className={`text-right text-[10px] sm:text-[11px] font-bold ${colorClass} font-mono shrink-0 whitespace-nowrap`}>
            {value}
        </div>
    </div>
);

export const StatsPanel: React.FC<Props> = ({ stats, hiddenStats, time, stage, rank, name }) => {
  const [showInfo, setShowInfo] = useState(false);
  const getQuarterName = (q: number) => ['春', '夏', '秋', '冬'][q - 1];

  return (
    <div className="mb-4 animate-fade-in-down relative w-full mx-auto">
      {/* Stats Info Modal */}
      {showInfo && (
        <div className="absolute top-full right-0 z-[60] bg-white/95 backdrop-blur shadow-xl border border-blue-100 rounded-md p-3 w-64 text-[10px] text-gray-600 animate-fade-in mt-1">
            <h4 className="font-bold text-blue-800 mb-1.5 text-xs">指标说明</h4>
            <ul className="space-y-1 list-disc pl-3 leading-tight">
                <li><b>健康/道德</b>: 归零则退圈。注意：道德值不可逆，除突发事件外，没有特殊提升手段。</li>
                <li><b>颜值/Vocal/Dance</b>: 核心能力。</li>
                <li><b>情商</b>: 影响事件的走向，情商越高，事件遇到好结果的概率越大</li>
                <li><b>粉丝</b>: 决定选秀票仓和后续影响</li>
                <li><b>选秀票数</b>: 每轮清零，依靠粉丝基数和当季表现重新计算。</li>
            </ul>
            <button onClick={() => setShowInfo(false)} className="absolute top-1 right-1 text-gray-400 p-1 hover:text-gray-600"><X size={14}/></button>
        </div>
      )}

      {/* 1. Top Header */}
      <div className="flex justify-between items-center px-1 mb-2">
        <div className="text-lg font-serif font-bold text-gray-800 drop-shadow-sm flex items-baseline gap-1.5">
          <span>{time.age}岁</span>
          <span className="text-xs font-sans font-medium text-gray-500 tracking-wide uppercase">{time.year}年 · {getQuarterName(time.quarter)}</span>
        </div>
        <div className="flex items-center gap-2 overflow-hidden">
             <span className="font-bold text-gray-700 text-[11px] truncate max-w-[100px]">{name}</span>
             <span className="bg-white/80 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-blue-100 shadow-sm shrink-0">
                {stage === GameStage.AMATEUR ? '练习生' : stage === GameStage.SHOW ? '选秀中' : '已出道'}
            </span>
        </div>
      </div>

      {/* 2. Main Stats Container - Full Width */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-3 shadow-sm border border-white/60 flex gap-3 relative">
        
        {/* Left Column (Bars) - Flex logic optimized */}
        <div className="flex-[1.4] flex flex-col gap-2 min-w-0">
           <StatBar 
             label="健康" value={stats.health} max={100} 
             icon={<Heart size={10} />} 
             colorClass="text-red-500" 
             bgClass="bg-gray-200/50" 
             barClass="bg-red-400" 
           />
           <StatBar 
             label="颜值" value={stats.looks} max={300} 
             icon={<User size={10} />} 
             colorClass="text-pink-500" 
             bgClass="bg-gray-200/50" 
             barClass="bg-pink-400" 
           />
           <StatBar 
             label="Vocal" value={stats.vocal} max={300} 
             icon={<Mic size={10} />} 
             colorClass="text-blue-500" 
             bgClass="bg-gray-200/50" 
             barClass="bg-blue-400" 
           />
           <StatBar 
             label="Dance" value={stats.dance} max={300} 
             icon={<Music size={10} />} 
             colorClass="text-purple-500" 
             bgClass="bg-gray-200/50" 
             barClass="bg-indigo-400" 
           />
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] bg-gray-300/30 my-1 shrink-0"></div>

        {/* Right Column (Simple Rows) */}
        <div className="flex-1 flex flex-col gap-2 min-w-0 justify-between py-0.5">
            <SimpleStatRow 
                icon={<Star size={10} />} 
                label="粉丝" 
                value={`${stats.fans}万`} 
                colorClass="text-blue-600" 
            />
            <SimpleStatRow 
                icon={<TrendingUp size={10} />} 
                label="情商" 
                value={stats.eq} 
                colorClass="text-purple-600" 
            />
            <SimpleStatRow 
                icon={<Hourglass size={10} />} 
                label="道德" 
                value={stats.ethics} 
                colorClass="text-emerald-600" 
            />
            
            {/* Slot 4: Rank or Info */}
            <div className="mt-auto pt-1 min-w-0">
                {stage === GameStage.SHOW ? (
                    <div className="flex items-center gap-1">
                        {/* Hidden Stats Indicators for Show Stage */}
                        <div className="flex flex-col gap-0.5 shrink-0 mr-1">
                            <div className="flex items-center gap-0.5 bg-pink-50 border border-pink-100 px-1 rounded text-[8px] text-pink-600 font-bold" title="CP热度">
                                <Flame size={8} /> {hiddenStats.hotCp}
                            </div>
                            <div className="flex items-center gap-0.5 bg-yellow-50 border border-yellow-100 px-1 rounded text-[8px] text-yellow-600 font-bold" title="出圈镜头">
                                <Zap size={8} /> {hiddenStats.viralMoments}
                            </div>
                        </div>

                        {/* Rank Box */}
                        <div className="h-7 flex items-center gap-1 w-full bg-orange-50/80 border border-orange-100 rounded px-1.5 overflow-hidden">
                            <div className="text-orange-500 shrink-0"><Trophy size={10} /></div>
                            <div className="flex-1 flex justify-between items-center text-[10px] font-bold text-orange-700 min-w-0">
                                <span className="shrink-0 mr-1 text-[9px]">Rank</span>
                                <span className="text-[12px] truncate">#{rank}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-end">
                        <button 
                            onClick={() => setShowInfo(!showInfo)} 
                            className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-gray-600 transition-colors bg-white/50 px-1.5 py-0.5 rounded border border-transparent hover:border-gray-100"
                        >
                            <Info size={10} /> 指标说明
                        </button>
                    </div>
                )}
            </div>
            
            {/* Duplicate button logic for show stage to keep layout consistent if needed */}
            {stage === GameStage.SHOW && (
                 <div className="flex justify-end mt-1">
                    <button 
                        onClick={() => setShowInfo(!showInfo)} 
                        className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Info size={10} />
                    </button>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};
