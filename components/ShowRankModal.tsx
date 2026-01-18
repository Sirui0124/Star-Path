
import React from 'react';
import { Trainee, VoteBreakdown } from '../types';
import { Trophy, Users, MessageCircle, BarChart3, Flame, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { STORY_IMAGES } from '../content/images';

interface Props {
  title: string;
  rank: number;
  votes: number;
  voteBreakdown: VoteBreakdown | null;
  trainees: Trainee[];
  comments?: string[];
  highlights?: string[]; // Added Highlights
  onClose: () => void;
}

export const ShowRankModal: React.FC<Props> = ({ title, rank, votes, voteBreakdown, trainees, comments, highlights, onClose }) => {
  // Combine user (as temp trainee) with trainees to get sorted list for display logic
  const allTrainees = [
    { id: 'player', name: '我 (你)', votes: votes, trend: 0 },
    ...trainees
  ].sort((a, b) => b.votes - a.votes);

  const getTraineeAtRank = (r: number) => allTrainees[r - 1];

  const milestones = [1, 11, 22, 33, 55];
  
  return (
    <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh] border border-blue-900/50">
        
        {/* 1. Header with Image Background */}
        <div className="relative h-24 shrink-0 overflow-hidden">
             <div className="absolute inset-0">
                 <img src={STORY_IMAGES.show_rank_bg} className="w-full h-full object-cover opacity-80" alt="rank bg" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
             </div>
             <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                 <div>
                    <div className="text-[10px] text-blue-300 font-bold tracking-wider uppercase mb-1 flex items-center gap-1">
                        <Trophy size={10} /> Official Ranking
                    </div>
                    <h2 className="text-xl font-bold text-white drop-shadow-md">{title}</h2>
                 </div>
             </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1 scrollbar-hide">
          
          {/* 2. My Stats Row (Compact) */}
          <div className="flex items-center justify-between bg-blue-950/50 rounded-xl p-4 border border-blue-800/50 mb-5 shadow-inner relative overflow-hidden group">
             {/* Gloss Effect */}
             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-400/20 transition-colors"></div>

             <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-xs text-blue-400 font-bold uppercase">Rank</span>
                <span className="text-3xl font-black text-white italic tracking-tighter">NO.{rank}</span>
             </div>
             
             <div className="text-right relative z-10">
                <div className="text-[10px] text-blue-400 font-bold uppercase mb-0.5">Total Votes</div>
                <div className="text-xl font-bold text-yellow-400 font-mono tracking-tight">{votes} 万</div>
             </div>
          </div>

          {/* 3. Vote Breakdown (Detailed) */}
          {voteBreakdown && (
            <div className="mb-6 space-y-3">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <BarChart3 size={12} /> 本轮票数构成
               </div>
               
               <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                     <div className="text-[9px] text-slate-500 mb-0.5">粉丝打投 (基础)</div>
                     <div className="text-sm font-bold text-blue-300">+{voteBreakdown.fansVote}万</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                     <div className="text-[9px] text-slate-500 mb-0.5">本赛段额外票池</div>
                     <div className="text-sm font-bold text-purple-300">+{voteBreakdown.stagePool}万</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                     <div className="text-[9px] text-slate-500 mb-0.5">路人盘 (实力/颜)</div>
                     <div className="text-sm font-bold text-green-300">+{voteBreakdown.publicAppeal}万</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800 relative overflow-hidden">
                     {voteBreakdown.bonus > 5 && <div className="absolute right-0 top-0 text-[8px] bg-red-500 text-white px-1 rounded-bl">HOT</div>}
                     <div className="text-[9px] text-slate-500 mb-0.5">额外 (CP/出圈)</div>
                     <div className="text-sm font-bold text-yellow-300">+{voteBreakdown.bonus}万</div>
                  </div>
               </div>
               
               <div className="flex justify-end text-[10px] text-slate-500 font-mono">
                  本轮新增合计: <span className="text-white ml-1 font-bold">+{voteBreakdown.total}万</span>
               </div>
            </div>
          )}

          {/* 4. Season Highlights (Drama) */}
          {highlights && highlights.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Flame size={12} className="text-orange-500" /> 本季大事件
                </div>
                <div className="bg-orange-950/20 border border-orange-900/30 rounded-lg p-3 space-y-2">
                    {highlights.map((hl, i) => (
                        <div key={i} className="flex gap-2 items-start text-[10px] text-orange-200/80 leading-snug">
                            <span className="mt-0.5 w-1 h-1 rounded-full bg-orange-500 shrink-0"></span>
                            <span>{hl}</span>
                        </div>
                    ))}
                </div>
              </div>
          )}

          {/* 5. Comments (Fun) */}
          {comments && comments.length > 0 && (
            <div className="mb-6">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <MessageCircle size={12} /> 实时弹幕
               </div>
               <div className="space-y-2">
                 {comments.map((comment, i) => (
                   <div key={i} className="flex gap-2 items-start animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold text-slate-900 ${['bg-pink-400','bg-blue-400','bg-yellow-400','bg-purple-400'][i % 4]}`}>
                        {['粉','路','黑','吃'][i % 4]}
                      </div>
                      <div className="bg-slate-800 px-3 py-1.5 rounded-r-lg rounded-bl-lg text-[10px] text-slate-300 flex-1 leading-relaxed border border-slate-700">
                        {comment}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* 6. Leaderboard Snippets */}
          <div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <TrendingUp size={12} /> 关键排名速报
             </div>
             <div className="space-y-1.5">
             {milestones.map(r => {
                const t = getTraineeAtRank(r);
                if (!t) return null;
                const isMe = t.id === 'player';
                return (
                  <div key={r} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${isMe ? 'bg-blue-900/40 border-blue-700' : 'bg-slate-800/40 border-slate-700/50'}`}>
                     <div className="flex items-center gap-3">
                        <span className={`w-5 text-center font-black text-sm ${r <= 11 ? 'text-yellow-400' : 'text-slate-500'}`}>{r}</span>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold ${isMe ? 'text-blue-300' : 'text-slate-200'}`}>{t.name}</span>
                                {r === 11 && <span className="text-[8px] px-1 bg-red-900/50 text-red-400 rounded border border-red-900/50">守门员</span>}
                                {r === 1 && <span className="text-[8px] px-1 bg-yellow-900/50 text-yellow-400 rounded border border-yellow-900/50">C位</span>}
                            </div>
                        </div>
                     </div>
                     <span className="text-xs font-mono font-bold text-slate-400">{t.votes}w</span>
                  </div>
                );
             })}
             </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
            <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all shrink-0 flex items-center justify-center gap-2 text-sm"
            >
            <Sparkles size={16} /> 确认排名并继续
            </button>
        </div>
      </div>
    </div>
  );
};
