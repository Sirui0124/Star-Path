import React from 'react';
import { Stats, GameTime, GameStage, HiddenStats } from '../types';
import { Heart, Smile, Mic, Music, Video, User, TrendingUp, Star, Trophy, Flame, Zap } from 'lucide-react';

interface Props {
  stats: Stats;
  hiddenStats: HiddenStats;
  time: GameTime;
  stage: GameStage;
  rank: number;
}

const StatBar = ({ label, value, max, icon, color }: { label: string; value: number; max: number; icon: React.ReactNode; color: string }) => (
  <div className="flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm">
    <div className={`text-${color}-600 w-4 shrink-0 flex justify-center`}>{icon}</div>
    <div className="w-10 sm:w-12 font-bold text-gray-700 shrink-0 truncate">{label}</div>
    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden min-w-[20px]">
      <div 
        className={`h-2 rounded-full bg-${color}-500 transition-all duration-500`} 
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      ></div>
    </div>
    <div className="w-14 sm:w-16 text-right text-[10px] sm:text-xs text-gray-500 shrink-0 font-medium font-mono leading-none">
        {value}/{max}
    </div>
  </div>
);

export const StatsPanel: React.FC<Props> = ({ stats, hiddenStats, time, stage, rank }) => {
  const getQuarterName = (q: number) => ['春', '夏', '秋', '冬'][q - 1];

  return (
    <div className="bg-white p-3 rounded-xl shadow-md mb-4 border border-pink-100">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <div className="text-lg font-bold text-pink-600">
          {time.age}岁 · {time.year}年{getQuarterName(time.quarter)}
        </div>
        <div className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full whitespace-nowrap">
            {stage === GameStage.AMATEUR ? '练习生' : stage === GameStage.SHOW ? '青春404' : '结局'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <div>
           <StatBar label="健康" value={stats.health} max={100} icon={<Heart size={14} />} color="red" />
           <StatBar label="道德" value={stats.morale} max={100} icon={<Smile size={14} />} color="green" />
           <StatBar label="颜值" value={stats.looks} max={300} icon={<User size={14} />} color="pink" />
        </div>
        <div>
           <StatBar label="Vocal" value={stats.vocal} max={300} icon={<Mic size={14} />} color="blue" />
           <StatBar label="Dance" value={stats.dance} max={300} icon={<Music size={14} />} color="purple" />
           <StatBar label="情商" value={stats.eq} max={100} icon={<TrendingUp size={14} />} color="yellow" />
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center pt-2 border-t text-sm font-medium">
         <div className="flex items-center gap-1 text-pink-700 text-xs sm:text-sm">
            <Star size={14} /> 粉丝: {stats.fans}万
         </div>
         {stage === GameStage.SHOW && (
            <div className="flex flex-col items-end gap-1">
               <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-orange-600">
                      <span className="font-bold">票: {stats.votes}万</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-700 bg-purple-100 px-2 py-0.5 rounded-lg">
                      <Trophy size={14} /> 
                      <span className="font-bold">#{rank > 100 ? '100+' : rank}</span>
                  </div>
               </div>
               {/* Hidden Stats that are visible in Show */}
               <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  {(hiddenStats.hotCp > 0 || hiddenStats.viralMoments > 0) ? (
                    <>
                       {hiddenStats.hotCp > 0 && (
                          <span className="flex items-center gap-0.5 text-pink-500"><Flame size={10} /> CP:{hiddenStats.hotCp}</span>
                       )}
                       {hiddenStats.viralMoments > 0 && (
                          <span className="flex items-center gap-0.5 text-yellow-500"><Zap size={10} /> 出圈:{hiddenStats.viralMoments}</span>
                       )}
                    </>
                  ) : <span className="opacity-50">暂无热点</span>}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};