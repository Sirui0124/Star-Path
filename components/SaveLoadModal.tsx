
import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, HardDrive, FileClock } from 'lucide-react';
import { GameState } from '../types';

interface Props {
  currentGameState: GameState;
  onClose: () => void;
  onLoad: (state: GameState) => void;
  onSave: (slotId: string) => void;
}

interface SaveSlotData {
  summary: {
    name: string;
    timeLabel: string;
    stage: string;
    fans: number;
    company: string;
    updatedAt: number;
    age: number;
  };
  state: GameState;
}

const SLOT_KEYS = ['auto', 'slot_1', 'slot_2', 'slot_3'];
const SLOT_NAMES: Record<string, string> = {
  'auto': '自动存档 (每年冬季)',
  'slot_1': '存档位 01',
  'slot_2': '存档位 02',
  'slot_3': '存档位 03'
};

export const SaveLoadModal: React.FC<Props> = ({ currentGameState, onClose, onLoad, onSave }) => {
  const [slots, setSlots] = useState<Record<string, SaveSlotData | null>>({});

  // Load slots from localStorage on mount
  useEffect(() => {
    refreshSlots();
  }, []);

  const refreshSlots = () => {
    const loaded: Record<string, SaveSlotData | null> = {};
    SLOT_KEYS.forEach(key => {
      const saved = localStorage.getItem(`star_path_save_${key}`);
      if (saved) {
        try {
          loaded[key] = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse save", key);
          loaded[key] = null;
        }
      } else {
        loaded[key] = null;
      }
    });
    setSlots(loaded);
  };

  const handleSave = (key: string) => {
    onSave(key);
    refreshSlots(); // Refresh UI
  };

  const handleLoad = (key: string) => {
    const slot = slots[key];
    if (slot && slot.state) {
      // Removed window.confirm to prevent blocking issues. 
      // Directly loading the state.
      try {
          console.log("Loading slot:", key);
          onLoad(slot.state);
          onClose();
      } catch (e) {
          console.error("Load failed", e);
          alert("读取存档失败，文件可能已损坏");
      }
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('zh-CN', { 
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div className="flex items-center gap-2 text-slate-800">
              <HardDrive size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">存档 / 读取</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
              <X size={20} />
           </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
           {SLOT_KEYS.map(key => {
              const slot = slots[key];
              const isAuto = key === 'auto';
              
              return (
                <div key={key} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Icon Area */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isAuto ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {isAuto ? <FileClock size={20} /> : <Save size={20} />}
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 text-sm">{SLOT_NAMES[key]}</h3>
                            {slot && <span className="text-[10px] text-gray-400 font-mono">{formatDate(slot.summary.updatedAt)}</span>}
                        </div>
                        
                        {slot ? (
                            <div className="text-xs text-gray-600 space-y-0.5">
                                <div className="font-medium flex items-center gap-2">
                                    <span>{slot.summary.name}</span>
                                    <span className="w-px h-3 bg-gray-300"></span>
                                    <span>{slot.summary.timeLabel}</span>
                                    <span className="w-px h-3 bg-gray-300"></span>
                                    <span>{slot.summary.age}岁</span>
                                </div>
                                <div className="text-gray-400 flex items-center gap-2">
                                    <span>{slot.summary.fans}万粉丝</span>
                                    {slot.summary.company !== 'NONE' && (
                                        <>
                                            <span className="w-px h-3 bg-gray-300"></span>
                                            <span>已签约</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400 italic">暂无存档</div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 self-end sm:self-center shrink-0">
                        {!isAuto && (
                            <button 
                                onClick={() => handleSave(key)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
                            >
                                <Save size={14} /> 覆盖
                            </button>
                        )}
                        
                        {slot && (
                            <button 
                                onClick={() => handleLoad(key)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                            >
                                <RotateCcw size={14} /> 读取
                            </button>
                        )}
                    </div>
                </div>
              );
           })}
        </div>

      </div>
    </div>
  );
};
