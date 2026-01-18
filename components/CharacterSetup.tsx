
import React, { useState, useEffect } from 'react';
import { Gender } from '../types';
import { RANDOM_PLAYER_NAMES } from '../constants';
import { STORY_IMAGES } from '../content/images';
import { Mic, Music, Star, ChevronRight, Dices, RefreshCw, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (name: string, gender: Gender, dreamLabel: string, initialStats: { vocal: number; dance: number; looks: number }) => void;
}

const DREAMS = [
  {
    id: 'idol',
    title: '舞台王者',
    desc: '唱跳全能的舞台主宰。I am the C',
    icon: <Star size={20} />,
    defaultStats: { vocal: 25, dance: 25, looks: 10 }
  },
  {
    id: 'singer',
    title: '灵魂歌手',
    desc: '唱到体育场，声音永远屹立不倒',
    icon: <Mic size={20} />,
    defaultStats: { vocal: 40, dance: 5, looks: 15 }
  },
  {
    id: 'artist',
    title: '实力明星',
    desc: '多元身份，穿梭在镜头和舞台之间',
    icon: <Music size={20} />,
    defaultStats: { vocal: 15, dance: 10, looks: 35 }
  }
];

export const CharacterSetup: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [gender] = useState<Gender>('male'); // Locked to male
  const [selectedDreamId, setSelectedDreamId] = useState<string>('');
  
  // Step 2 States
  const [name, setName] = useState('');
  const [stats, setStats] = useState({ vocal: 20, dance: 20, looks: 20 });
  const [statsInitialized, setStatsInitialized] = useState(false);

  // Initialize stats when entering step 2 based on dream
  useEffect(() => {
    if (step === 2 && !statsInitialized && selectedDreamId) {
      const dream = DREAMS.find(d => d.id === selectedDreamId);
      if (dream) {
        setStats({ ...dream.defaultStats });
        setStatsInitialized(true);
      }
    }
  }, [step, selectedDreamId, statsInitialized]);

  const currentDream = DREAMS.find(d => d.id === selectedDreamId);

  const getNameLength = (str: string) => {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  };

  const isNameValid = name.trim().length > 0 && getNameLength(name) <= 8;

  const handleRandomName = () => {
    const r = RANDOM_PLAYER_NAMES[Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length)];
    setName(r);
  };

  const handleRandomStats = () => {
    let r1 = Math.floor(Math.random() * 61);
    let r2 = Math.floor(Math.random() * 61);
    const min = Math.min(r1, r2);
    const max = Math.max(r1, r2);
    
    const v = min;
    const d = max - min;
    const l = 60 - max;

    const values = [v, d, l].sort(() => 0.5 - Math.random());
    setStats({
        vocal: values[0],
        dance: values[1],
        looks: values[2]
    });
  };

  const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
     <div className="mb-4">
        <div className="flex justify-between text-sm md:text-base font-bold text-gray-700 mb-1">
           <span>{label}</span>
           <span>{value}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
           <div className={`h-full bg-${color}-500 transition-all duration-500`} style={{ width: `${(value / 60) * 100}%` }}></div>
        </div>
     </div>
  );

  return (
    <div className="h-[100dvh] max-w-md mx-auto relative flex flex-col items-center justify-center font-sans overflow-hidden bg-blue-50">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={STORY_IMAGES.setup_bg} 
          alt="Setup Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-sm relative z-10 bg-white/50 backdrop-blur-md shadow-xl md:rounded-2xl border border-white/40 flex flex-col overflow-hidden">
        
        {/* Header / Progress - Fixed */}
        <div className="shrink-0 pt-6 px-6 pb-2">
            <div className="flex justify-between mb-4 px-2 opacity-50">
                {[1, 2].map(i => (
                    <div key={i} className={`h-1 flex-1 mx-1 rounded-full ${i <= step ? 'bg-blue-800' : 'bg-gray-400'}`} />
                ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-1 font-serif">
                {step === 1 ? "序章：镜中少年" : "你的名字"}
            </h2>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide flex flex-col">
            {step === 1 && (
                <div className="animate-fade-in pb-4 flex-1 flex flex-col justify-center min-h-[300px]">
                    <div className="text-center text-gray-800 mb-8 leading-relaxed text-base md:text-lg font-medium">
                        <p>16岁，你站在练习室的落地镜前，</p>
                        <p>看着镜子里那个满头大汗的少年。</p>
                        <p className="mt-4 text-blue-900 font-bold text-lg md:text-xl">这一刻，你听见心底的声音在问：</p>
                        <p className="mt-1">“你想成为什么样的人？”</p>
                    </div>
                    
                    {/* Dream Selection */}
                    <div className="space-y-3">
                        {DREAMS.map(d => (
                            <button
                            key={d.id}
                            onClick={() => setSelectedDreamId(d.id)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 group ${
                                selectedDreamId === d.id 
                                ? 'border-blue-500 bg-white/90 shadow-md transform scale-[1.02]' 
                                : 'border-transparent bg-white/60 hover:bg-white/80 hover:border-blue-200'
                            }`}
                            >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                selectedDreamId === d.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100/50 text-gray-500'
                            }`}>
                                {d.icon}
                            </div>
                            <div>
                                <div className={`font-bold text-base md:text-lg mb-1 ${selectedDreamId === d.id ? 'text-blue-900' : 'text-gray-800'}`}>
                                {d.title}
                                </div>
                                <div className={`text-xs md:text-sm leading-snug ${selectedDreamId === d.id ? 'text-blue-800' : 'text-gray-600'}`}>
                                {d.desc}
                                </div>
                            </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="animate-fade-in pb-4 flex-1 flex flex-col justify-center">
                    <p className="text-center text-gray-700 mb-8 text-sm md:text-base font-medium">
                        这个名字，未来或许会被无数人呐喊。
                    </p>

                    {/* Name Input */}
                    <div className="mb-6">
                        <div className={`flex items-center bg-white/80 rounded-xl border-2 transition-all shadow-sm ${
                            !name || isNameValid ? 'border-transparent focus-within:border-blue-500' : 'border-red-400'
                        }`}>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="签下你的名字..."
                                className="flex-1 p-4 bg-transparent outline-none text-lg md:text-xl font-bold text-gray-900 text-center placeholder-gray-400 min-w-0"
                            />
                            <div className="h-8 w-px bg-gray-300/50 shrink-0"></div>
                            <button 
                            onClick={handleRandomName}
                            className="flex flex-col items-center justify-center px-4 py-2 text-gray-500 hover:text-blue-600 transition-colors active:scale-95 shrink-0"
                            title="随机姓名"
                            >
                            <Dices size={20} />
                            <span className="text-xs font-bold whitespace-nowrap">随机</span>
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className={`text-xs md:text-sm ${!isNameValid && name.length > 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                {name.length > 0 ? (isNameValid ? '名字可用' : '名字太长了') : ' '}
                            </span>
                        </div>
                    </div>

                    {/* Stats Display */}
                    <div className="bg-white/60 p-5 rounded-2xl mb-4 relative border border-white/50 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200/50 pb-2">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                                <Sparkles size={16} className="text-yellow-500"/> 天赋评估
                            </h3>
                            <button 
                                onClick={handleRandomStats}
                                className="text-xs md:text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                            >
                                <RefreshCw size={14} /> 重新鉴定
                            </button>
                        </div>
                        
                        <StatBar label="Vocal (声乐)" value={stats.vocal} color="blue" />
                        <StatBar label="Dance (舞蹈)" value={stats.dance} color="purple" />
                        <StatBar label="Looks (颜值)" value={stats.looks} color="pink" />
                    </div>
                </div>
            )}
        </div>

        {/* Footer Button - Fixed */}
        <div className="shrink-0 p-6 pt-2 bg-transparent">
             {step === 1 && (
                <button 
                    onClick={() => setStep(2)} 
                    disabled={!selectedDreamId}
                    className={`w-full py-4 md:py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-base md:text-lg ${
                        selectedDreamId 
                        ? 'bg-blue-900 text-white hover:bg-blue-800' 
                        : 'bg-gray-400/50 text-white cursor-not-allowed'
                    }`}
                    >
                    这就是我的回答 <ChevronRight size={20} />
                </button>
             )}

             {step === 2 && (
                <>
                    <button 
                        onClick={() => onComplete(name, gender, currentDream?.title || '', stats)} 
                        disabled={!isNameValid}
                        className={`w-full py-4 md:py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-base md:text-lg ${
                            isNameValid
                            ? 'bg-blue-900 text-white hover:bg-blue-800' 
                            : 'bg-gray-400/50 text-white cursor-not-allowed'
                        }`}
                        >
                        开启星途 <Star size={20} />
                    </button>
                    
                    <button 
                        onClick={() => setStep(1)}
                        className="w-full mt-3 text-gray-600 text-sm hover:text-gray-900 py-1"
                    >
                        再想一想
                    </button>
                </>
             )}
        </div>

      </div>
    </div>
  );
};
