
import React, { useState, useEffect } from 'react';
import { Gender } from '../types';
import { RANDOM_PLAYER_NAMES } from '../constants';
import { STORY_IMAGES } from '../content/images';
import { User, Mic, Music, Star, ChevronRight, Dices, RefreshCw, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (name: string, gender: Gender, dreamLabel: string, initialStats: { vocal: number; dance: number; looks: number }) => void;
}

const DREAMS = [
  {
    id: 'idol',
    title: '舞台王者',
    desc: '从练习室走到大舞台，唱跳全能的舞台主宰。I am the C',
    icon: <Star size={24} />,
    defaultStats: { vocal: 25, dance: 25, looks: 10 }
  },
  {
    id: 'singer',
    title: '灵魂歌手',
    desc: '我想一辈子唱歌给我爱的人们听，歌声永远屹立不倒。',
    icon: <Mic size={24} />,
    defaultStats: { vocal: 40, dance: 5, looks: 15 }
  },
  {
    id: 'artist',
    title: '实力明星',
    desc: '不被定义，演戏、综艺、唱跳，定义属于我的星途传奇。',
    icon: <Music size={24} />,
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
        <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
           <span>{label}</span>
           <span>{value}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
           <div className={`h-full bg-${color}-500 transition-all duration-500`} style={{ width: `${(value / 60) * 100}%` }}></div>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col items-center justify-center p-6 font-sans overflow-hidden bg-blue-50">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={STORY_IMAGES.setup_bg} 
          alt="Setup Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full max-w-sm relative z-10 bg-white/50 p-6 rounded-2xl shadow-xl backdrop-blur-md border border-white/40">
        {/* Progress */}
        <div className="flex justify-between mb-8 px-2 opacity-50">
          {[1, 2].map(i => (
            <div key={i} className={`h-1 flex-1 mx-1 rounded-full ${i <= step ? 'bg-blue-800' : 'bg-gray-400'}`} />
          ))}
        </div>

        {/* Step 1: Narrative & Dream */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 font-serif">序章：镜中少年</h2>
            <div className="text-center text-gray-800 mb-8 leading-relaxed text-sm font-medium">
              <p>16岁，你站在练习室的落地镜前，</p>
              <p>看着镜子里那个满头大汗的少年。</p>
              <p className="mt-4 text-blue-900 font-bold">这一刻，你听见心底的声音在问：</p>
              <p>“你想成为什么样的人？”</p>
            </div>
            
            {/* Dream Selection */}
            <div className="space-y-3">
              {DREAMS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDreamId(d.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 group ${
                    selectedDreamId === d.id 
                    ? 'border-blue-500 bg-white/80 shadow-md transform scale-[1.02]' 
                    : 'border-transparent bg-white/40 hover:bg-white/60 hover:border-blue-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 transition-colors ${
                     selectedDreamId === d.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100/50 text-gray-500'
                  }`}>
                    {d.icon}
                  </div>
                  <div>
                    <div className={`font-bold text-base mb-1 ${selectedDreamId === d.id ? 'text-blue-900' : 'text-gray-800'}`}>
                      {d.title}
                    </div>
                    <div className={`text-xs leading-relaxed ${selectedDreamId === d.id ? 'text-blue-800' : 'text-gray-600'}`}>
                      {d.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setStep(2)} 
              disabled={!selectedDreamId}
              className={`w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedDreamId 
                ? 'bg-blue-900 text-white hover:bg-blue-800' 
                : 'bg-gray-400/50 text-white cursor-not-allowed'
              }`}
            >
              这就是我的回答 <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Name & Stats */}
        {step === 2 && (
          <div className="animate-fade-in">
             <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 font-serif">你的名字</h2>
             <p className="text-center text-gray-700 mb-8 text-sm font-medium">
                这个名字，未来或许会被无数人呐喊。
             </p>

            {/* Name Input */}
            <div className="mb-6">
               <div className="flex gap-2 relative">
                 <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="签下你的名字..."
                    className={`flex-1 p-4 pl-4 border-2 rounded-xl outline-none transition-colors bg-white/80 text-lg font-bold text-center placeholder-gray-400 ${
                       !name || isNameValid ? 'border-transparent focus:border-blue-500' : 'border-red-400'
                    }`}
                 />
                 <button 
                   onClick={handleRandomName}
                   className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                   title="随机姓名"
                 >
                   <Dices size={20} />
                 </button>
               </div>
               <div className="text-center mt-2">
                  <span className={`text-xs ${!isNameValid && name.length > 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                     {name.length > 0 ? (isNameValid ? '名字可用' : '名字太长了') : ' '}
                  </span>
               </div>
            </div>

            {/* Stats Display */}
            <div className="bg-white/60 p-5 rounded-2xl mb-6 relative border border-white/50 shadow-sm">
               <div className="flex justify-between items-center mb-4 border-b border-gray-200/50 pb-2">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-500"/> 天赋评估
                  </h3>
                  <button 
                     onClick={handleRandomStats}
                     className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                     <RefreshCw size={12} /> 重新鉴定
                  </button>
               </div>
               
               <StatBar label="Vocal (声乐)" value={stats.vocal} color="blue" />
               <StatBar label="Dance (舞蹈)" value={stats.dance} color="purple" />
               <StatBar label="Looks (颜值)" value={stats.looks} color="pink" />
            </div>

            <button 
              onClick={() => onComplete(name, gender, currentDream?.title || '', stats)} 
              disabled={!isNameValid}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isNameValid
                ? 'bg-blue-900 text-white hover:bg-blue-800' 
                : 'bg-gray-400/50 text-white cursor-not-allowed'
              }`}
            >
              开启星途 <Star size={18} />
            </button>
            
            <button 
              onClick={() => setStep(1)}
              className="w-full mt-4 text-gray-600 text-xs hover:text-gray-900"
            >
               再想一想
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
