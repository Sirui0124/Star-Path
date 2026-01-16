
import React from 'react';
import { Trainee, VoteBreakdown } from '../types';
import { Trophy, Users, Star, MessageCircle } from 'lucide-react';

interface Props {
  title: string;
  rank: number;
  votes: number;
  voteBreakdown: VoteBreakdown | null;
  trainees: Trainee[];
  comments?: string[];
  onClose: () => void;
}

export const ShowRankModal: React.FC<Props> = ({ title, rank, votes, voteBreakdown, trainees, comments, onClose }) => {
  // Combine user (as temp trainee) with trainees to get sorted list for display logic
  const allTrainees = [
    { id: 'player', name: '我 (你)', votes: votes, trend: 0 },
    ...trainees
  ].sort((a, b) => b.votes - a.votes);

  const getTraineeAtRank = (r: number) => allTrainees[r - 1];

  const milestones = [1, 11, 22, 33, 55];
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center text-white relative shrink-0">
          <Trophy className="mx-auto mb-2 w-12 h-12 text-yellow-300 drop-shadow-md" />
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="mt-2 text-indigo-100 text-sm">全民制作人请多指教</div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* My Stats */}
          <div className="text-center mb-6">
            <div className="text-gray-500 text-sm mb-1">当前排名</div>
            <div className="text-4xl font-black text-purple-600 mb-2">NO.{rank}</div>
            <div className="text-gray-600 font-bold">{votes} 万票</div>
          </div>

          {/* Social Media Comments */}
          {comments && comments.length > 0 && (
            <div className="mb-6 bg-blue-50 rounded-lg p-3 border border-blue-100">
               <div className="font-bold text-blue-800 mb-3 flex items-center gap-2 text-sm">
                  <MessageCircle size={14} /> 实时热门讨论
               </div>
               <div className="space-y-3">
                 {comments.map((comment, i) => (
                   <div key={i} className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-200 shrink-0 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                        {['U','A','X','Q','K'][i % 5]}
                      </div>
                      <div className="bg-white p-2 rounded-r-lg rounded-bl-lg shadow-sm text-xs text-gray-700 flex-1">
                        {comment}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Breakdown */}
          {voteBreakdown && (
            <div className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100 text-sm">
              <div className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Star size={14} /> 本周票数构成
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                   <span className="text-gray-500">路人盘(基础):</span>
                   <span>+{voteBreakdown.base}万</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-500">行动表现:</span>
                   <span>+{voteBreakdown.action}万</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-500">事件/话题:</span>
                   <span>+{voteBreakdown.bonus}万</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between font-bold text-purple-700">
                   <span>本周新增:</span>
                   <span>+{voteBreakdown.total}万</span>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Snippets */}
          <div className="space-y-2">
             <div className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Users size={14} /> 关键排名速报
             </div>
             {milestones.map(r => {
                const t = getTraineeAtRank(r);
                if (!t) return null;
                const isMe = t.id === 'player';
                return (
                  <div key={r} className={`flex justify-between items-center p-2 rounded ${isMe ? 'bg-purple-100 border border-purple-200' : 'bg-white border border-gray-100'}`}>
                     <div className="flex items-center gap-2">
                        <span className={`w-6 text-center font-bold ${r <= 11 ? 'text-red-500' : 'text-gray-400'}`}>{r}</span>
                        <span className={`font-medium ${isMe ? 'text-purple-700' : 'text-gray-700'}`}>{t.name}</span>
                        {r === 11 && <span className="text-[10px] px-1 bg-red-100 text-red-600 rounded">出道位守门</span>}
                     </div>
                     <span className="text-sm text-gray-500">{t.votes}万</span>
                  </div>
                );
             })}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="m-4 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shrink-0 shadow-lg"
        >
          确认
        </button>
      </div>
    </div>
  );
};
