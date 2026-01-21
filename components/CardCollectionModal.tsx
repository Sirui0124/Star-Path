
import React, { useState, useEffect } from 'react';
import { X, Lock, Sparkles, BookOpen, Info } from 'lucide-react';
import { ALL_CARDS, UnlockableCard } from '../content/cards';
import { logGameEvent } from '../services/firebase';

interface Props {
  onClose: () => void;
}

export const CardCollectionModal: React.FC<Props> = ({ onClose }) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<UnlockableCard | null>(null);

  useEffect(() => {
    const storage = localStorage.getItem('star_path_cards');
    let currentUnlocked: string[] = [];
    if (storage) {
      try {
        currentUnlocked = JSON.parse(storage);
        setUnlockedIds(currentUnlocked);
      } catch (e) {
        console.error("Failed to parse card storage");
      }
    }

    // Analytics: Track collection status when user opens the modal
    // helping to verify if card collection drives engagement
    logGameEvent('view_collection_status', {
        unlocked_count: currentUnlocked.length,
        total_count: ALL_CARDS.length,
        completion_rate: (currentUnlocked.length / ALL_CARDS.length).toFixed(2)
    });

    // --- Analytics: Collection Snapshot ---
    const urCount = ALL_CARDS.filter(c => c.rarity === 'UR' && currentUnlocked.includes(c.id)).length;
    const ssrCount = ALL_CARDS.filter(c => c.rarity === 'SSR' && currentUnlocked.includes(c.id)).length;

    logGameEvent('collection_summary', {
        owned_count: currentUnlocked.length,
        completion_percentage: (currentUnlocked.length / ALL_CARDS.length).toFixed(4), // More precision
        ur_count: urCount,
        ssr_count: ssrCount
    });

  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'UR': return 'text-red-500 bg-red-100 border-red-200';
      case 'SSR': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'SR': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'UR': return 'shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-400';
      case 'SSR': return 'shadow-[0_0_15px_rgba(234,179,8,0.5)] border-yellow-400';
      case 'SR': return 'shadow-[0_0_10px_rgba(147,51,234,0.4)] border-purple-300';
      default: return 'border-blue-200';
    }
  };

  const renderSection = (rarity: 'UR' | 'SSR' | 'SR' | 'R') => {
    const cards = ALL_CARDS.filter(c => c.rarity === rarity);
    if (cards.length === 0) return null;

    return (
      <div className="mb-6 last:mb-2">
        <div className="flex items-center gap-2 mb-3 px-1">
           <span className={`text-xs font-black px-2 py-0.5 rounded ${getRarityColor(rarity)}`}>
             {rarity}
           </span>
           <div className="h-px bg-gray-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {cards.map(card => {
             const isUnlocked = unlockedIds.includes(card.id);
             // Logic: R/SR show title when locked. SSR/UR show ???
             const showLockedTitle = ['R', 'SR'].includes(card.rarity);

             return (
                <button 
                   key={card.id}
                   onClick={() => isUnlocked ? setSelectedCard(card) : null}
                   className={`
                      relative aspect-[2/3] rounded-xl border-2 transition-all duration-300 flex flex-col overflow-hidden group
                      ${isUnlocked 
                         ? `${getRarityGlow(card.rarity)} bg-white cursor-pointer hover:scale-105` 
                         : 'border-gray-200 bg-gray-100 cursor-not-allowed'}
                   `}
                >
                   {/* Unlocked View */}
                   {isUnlocked && (
                      <>
                         <img src={card.image} className="absolute inset-0 w-full h-full object-cover" alt={card.title} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                         
                         {/* Rarity Badge */}
                         <div className={`absolute top-1 left-1 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm ${getRarityColor(card.rarity).split(' ')[1]} ${getRarityColor(card.rarity).split(' ')[0]}`}>
                            {card.rarity}
                         </div>

                         <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                            <div className="text-[10px] md:text-xs font-bold text-white drop-shadow-md truncate">{card.title}</div>
                         </div>
                      </>
                   )}

                   {/* Locked View */}
                   {!isUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-1 p-2">
                         <Lock size={18} className="mb-1 opacity-50" />
                         <div className={`text-[10px] font-bold text-center leading-tight ${showLockedTitle ? 'text-gray-500' : 'text-gray-300'}`}>
                            {showLockedTitle ? card.title : '???'}
                         </div>
                      </div>
                   )}
                </button>
             );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 animate-fade-in font-sans">
      <div className="absolute inset-0 z-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                 <BookOpen size={18} />
              </div>
              <div>
                 <h2 className="text-lg font-bold text-gray-800">我的集卡册</h2>
                 <p className="text-[10px] text-gray-500 font-medium">
                    收集进度: {unlockedIds.length} / {ALL_CARDS.length}
                 </p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
           </button>
        </div>

        {/* Instruction Banner */}
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-start gap-2">
            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-blue-600 leading-tight">
                每次游戏走到结局后，将根据本轮的最终数值、排名和特殊经历，自动解锁对应的成就卡牌。
            </p>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide bg-gray-50">
           {renderSection('UR')}
           {renderSection('SSR')}
           {renderSection('SR')}
           {renderSection('R')}
        </div>
      </div>

      {/* Card Detail Popup */}
      {selectedCard && (
         <div className="absolute inset-0 z-20 flex items-center justify-center p-6" onClick={() => setSelectedCard(null)}>
            <div className="bg-black/40 absolute inset-0 backdrop-blur-sm"></div>
            <div 
               className="relative bg-white rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden animate-fade-in-up transform transition-transform"
               onClick={(e) => e.stopPropagation()} 
            >
               <div className="aspect-[3/4] relative">
                  <img src={selectedCard.image} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4">
                     <span className={`text-sm font-black px-3 py-1 rounded-md shadow-lg ${getRarityColor(selectedCard.rarity)}`}>
                        {selectedCard.rarity}
                     </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                     <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg flex items-center gap-2">
                        {selectedCard.title}
                        {selectedCard.rarity === 'UR' && <Sparkles size={20} className="text-yellow-400 animate-pulse" />}
                     </h3>
                     <p className="text-sm text-gray-200 leading-relaxed font-medium drop-shadow-md">
                        {selectedCard.unlockText}
                     </p>
                  </div>
               </div>
               <div className="p-5 bg-white border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">解锁条件</h4>
                  <p className="text-sm text-gray-700 font-medium">
                     {selectedCard.description}
                  </p>
                  <button 
                     onClick={() => setSelectedCard(null)}
                     className="mt-5 w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors text-sm"
                  >
                     关闭
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
