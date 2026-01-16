import React, { useState } from 'react';
import { Stats, GameTime, GameStage, HiddenStats } from '../types';
import { Heart, User, Mic, Music, Star, TrendingUp, Hourglass, Trophy, Info, X } from 'lucide-react';

interface Props {
  stats: Stats;
  hiddenStats: HiddenStats;
  time: GameTime;
  stage: GameStage;
  rank: number;
  name: string;
}

const StatBar = ({ label, value, max, icon, colorClass, bgClass, barClass }: { 
  label: string; 
  value: number; 
  max: number; 
  icon: React.ReactNode; 
  colorClass: string; 
  bgClass: string; 
  barClass: string;
}) => (
  <div className="flex items-center gap-1.5 h-5 w-full">
    <div className={`${colorClass} w-4 shrink-0 flex justify-center`}>{icon}</div>
    {/* Increased w-8 -> w-9, text-xs -> text-sm */}
    <div className="w-9 font-bold text-gray-700 shrink-0 text-sm">{label}</div>
    <div className={`flex-1 ${bgClass} rounded-sm h-2 overflow-hidden`}>
      <div 
        className={`h-full rounded-sm ${barClass} transition-all duration-500`} 
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      ></div>
    </div>
    {/* Increased text-[10px] -> text-xs */}
    <div className="w-10 text-right text-xs text-gray-500 font-mono font-bold shrink-0 leading-none">
        {value}/{max}
    </div>
  </div>
);

const SimpleStatRow = ({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: string | number, colorClass: string }) => (
    <div className="flex items-center gap-1.5 h-5 w-full">
        <div className={`${colorClass} w-4 shrink-0 flex justify-center`}>{icon}</div>
        {/* Increased w-8 -> w-9, text-xs -> text-sm */}
        <div className="w-9 font-bold text-gray-700 shrink-0 text-sm">{label}</div>
        {/* Increased text-xs -> text-sm */}
        <div className={`flex-1 text-right text-sm font-bold ${colorClass} font-mono`}>
            {value}
        </div>
    </div>
);

export const StatsPanel: React.FC<Props> = ({ stats, hiddenStats, time, stage, rank, name }) => {
  const [showInfo, setShowInfo] = useState(false);
  const getQuarterName = (q: number) => ['春', '夏', '秋', '冬'][q - 1];

  return (
    <div className="mb-3 animate-fade-in-down relative">
      {/* Stats Info Modal */}
      {showInfo && (
        <div className="absolute top-full right-0 z-[60] bg-white/95 backdrop-blur shadow-xl border border-blue-100 rounded-md p-3 w-72 text-[10px] text-gray-600 animate-fade-in mt-1">
            <h4 className="font-bold text-blue-800 mb-1.5 text-xs">指标说明</h4>
            <ul className="space-y-1 list-disc pl-3 leading-tight">
                <li><b>健康/道德</b>: 归零则退圈。注意：道德值不可逆，除突发事件外，没有特殊提升手段。</li>
                <li><b>颜值/Vocal/Dance</b>: 核心能力。</li>
                <li><b>情商</b>: 影响事件的走向，情商越高，事件遇到好结果的概率越大</li>
                <li><b>粉丝</b>: 决定选秀票仓和后续影响</li>
            </ul>
            <button onClick={() => setShowInfo(false)} className="absolute top-1 right-1 text-gray-400 p-1 hover:text-gray-600"><X size={14}/></button>
        </div>
      )}

      {/* 1. Top Header: Age - Year - Name - Status */}
      <div className="flex justify-between items-center px-2 mb-1.5">
        <div className="text-xl font-serif font-bold text-gray-800 drop-shadow-sm flex items-baseline gap-1">
          <span>{time.age}岁</span>
          <span className="text-sm font-sans font-medium text-gray-600">· {time.year}年{getQuarterName(time.quarter)}</span>
        </div>
        <div className="flex items-center gap-2">
             <span className="font-bold text-gray-700 text-xs">{name}</span>
             <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm text-[10px] font-bold border border-blue-200 shadow-sm">
                {stage === GameStage.AMATEUR ? '练习生' : stage === GameStage.SHOW ? '选秀中' : '已出道'}
            </span>
        </div>
      </div>

      {/* 2. Main Stats Container - Compacted Padding */}
      <div className="bg-white/60 backdrop-blur-md rounded-md p-2.5 shadow-sm border border-white/50 flex gap-1.5 relative">
        
        {/* Left Column (Bars) - Compacted Gap */}
        <div className="flex-1 flex flex-col min-w-[60%] gap-1.5">
           <StatBar 
             label="健康" value={stats.health} max={100} 
             icon={<Heart size={12} />} 
             colorClass="text-red-500" 
             bgClass="bg-gray-200/80" 
             barClass="bg-red-400" 
           />
           <StatBar 
             label="颜值" value={stats.looks} max={300} 
             icon={<User size={12} />} 
             colorClass="text-pink-500" 
             bgClass="bg-gray-200/80" 
             barClass="bg-pink-400" 
           />
           <StatBar 
             label="Vocal" value={stats.vocal} max={300} 
             icon={<Mic size={12} />} 
             colorClass="text-blue-500" 
             bgClass="bg-gray-200/80" 
             barClass="bg-blue-400" 
           />
           <StatBar 
             label="Dance" value={stats.dance} max={300} 
             icon={<Music size={12} />} 
             colorClass="text-purple-500" 
             bgClass="bg-gray-200/80" 
             barClass="bg-indigo-400" 
           />
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] bg-gray-300/50 my-1"></div>

        {/* Right Column (Simple Rows) - Compacted Gap */}
        <div className="w-[35%] flex flex-col gap-1.5">
            <SimpleStatRow 
                icon={<Star size={12} />} 
                label="粉丝" 
                value={`${stats.fans}万`} 
                colorClass="text-blue-600" 
            />
            <SimpleStatRow 
                icon={<TrendingUp size={12} />} 
                label="情商" 
                value={stats.eq} 
                colorClass="text-purple-600" 
            />
            <SimpleStatRow 
                icon={<Hourglass size={12} />} 
                label="道德" 
                value={stats.ethics} 
                colorClass="text-emerald-600" 
            />
            
            {/* Slot 4: Rank Info (if active) OR Info Button */}
            {stage === GameStage.SHOW ? (
                 <div className="h-5 flex items-center gap-1.5 w-full bg-orange-50 border border-orange-100 rounded-sm px-1.5">
                    <div className="text-orange-500 w-4 flex justify-center"><Trophy size={10} /></div>
                    <div className="flex-1 flex justify-between items-center text-xs font-bold text-orange-700">
                        <span>Rank</span>
                        <span>#{rank}</span>
                    </div>
                 </div>
            ) : (
                <div className="h-5 flex items-center justify-end">
                    <button 
                        onClick={() => setShowInfo(!showInfo)} 
                        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Info size={11} /> 指标说明
                    </button>
                </div>
            )}

            {/* If in Show stage, button goes to next line (Slot 5 equivalent area, or just floating below) */}
            {stage === GameStage.SHOW && (
                 <div className="flex justify-end mt-[-2px]">
                    <button 
                        onClick={() => setShowInfo(!showInfo)} 
                        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Info size={11} /> 指标说明
                    </button>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};