import React, { useState, useEffect } from 'react';
import { GameState, GameStage, Company, Action, GameEvent, Trainee, VoteBreakdown } from './types';
import { AMATEUR_ACTIONS, SHOW_ACTIONS, EVENTS, COMPANIES } from './constants';
import { StatsPanel } from './components/StatsPanel';
import { ShowRankModal } from './components/ShowRankModal';
import { STAGE_GUIDES } from './content/guides';
import { ANNUAL_NARRATIVES } from './content/narratives';
import { STORY_IMAGES, getEndingImageKey } from './content/images';
import { generateGameSummary, generateAnnualSummary, generateFanComments } from './services/gemini';
import { formatEffectLog, generateTrainees } from './utils';
import { Play, SkipForward, AlertCircle, Briefcase, BookOpen, HelpCircle, X, Building2, Calendar } from 'lucide-react';

const INITIAL_STATE: GameState = {
  stats: {
    vocal: 30, dance: 0, looks: 30, eq: 10,
    morale: 50, health: 50, fans: 1, votes: 0
  },
  hiddenStats: { sincerity: 50, dream: 50, hotCp: 0, viralMoments: 0 },
  time: { year: 1, quarter: 1, age: 16 },
  stage: GameStage.AMATEUR,
  company: Company.NONE,
  ap: 3,
  maxAp: 3,
  history: ['游戏开始：你是一个怀揣梦想的16岁少年。'],
  
  isSignedUpForShow: false,
  showTurnCount: 0,
  rank: 100,
  trainees: [],
  
  isGameOver: false,
  warnings: { health: false, morale: false },
};

type TurnPhase = 'START' | 'EVENT' | 'ACTION' | 'END';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [phase, setPhase] = useState<TurnPhase>('START');
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  // Modals
  const [showGuide, setShowGuide] = useState(false);
  const [showNarrative, setShowNarrative] = useState<string | null>(ANNUAL_NARRATIVES[16]);
  const [showRankModal, setShowRankModal] = useState(false);
  const [currentVoteBreakdown, setCurrentVoteBreakdown] = useState<VoteBreakdown | null>(null);
  const [fanComments, setFanComments] = useState<string[]>([]);
  
  // Annual Summary Modal
  const [showAnnualSummaryModal, setShowAnnualSummaryModal] = useState(false);
  const [annualSummaryText, setAnnualSummaryText] = useState('');

  // --- Helpers ---
  const addLog = (text: string) => {
    setLogs(prev => [...prev, text]);
    setGameState(prev => ({ ...prev, history: [...prev.history, `${prev.time.age}岁${prev.time.quarter}季度: ${text}`] }));
  };

  const updateStats = (effect: Partial<GameState['stats']> & Partial<GameState['hiddenStats']>) => {
    setGameState(prev => {
      const newStats = { ...prev.stats };
      const newHidden = { ...prev.hiddenStats };
      const newWarnings = { ...prev.warnings };
      
      // Update Stats
      if (effect.vocal) newStats.vocal = Math.min(300, Math.max(0, newStats.vocal + effect.vocal));
      if (effect.dance) newStats.dance = Math.min(300, Math.max(0, newStats.dance + effect.dance));
      if (effect.looks) newStats.looks = Math.min(300, Math.max(0, newStats.looks + effect.looks));
      if (effect.eq) newStats.eq = Math.min(100, Math.max(0, newStats.eq + effect.eq));
      if (effect.morale) newStats.morale = Math.min(100, Math.max(0, newStats.morale + effect.morale));
      if (effect.health) newStats.health = Math.min(100, Math.max(0, newStats.health + effect.health));
      if (effect.fans) newStats.fans = Math.max(0, newStats.fans + effect.fans);
      if (effect.votes) newStats.votes = Math.max(0, newStats.votes + effect.votes);

      // Update Hidden Stats
      if (effect.sincerity) newHidden.sincerity += effect.sincerity;
      if (effect.dream) newHidden.dream += effect.dream;
      if (effect.hotCp) newHidden.hotCp += effect.hotCp;
      if (effect.viralMoments) newHidden.viralMoments += effect.viralMoments;

      // Reset warnings if stats recover
      if (effect.health && effect.health > 0) newWarnings.health = false;
      if (effect.morale && effect.morale > 0) newWarnings.morale = false;

      return { ...prev, stats: newStats, hiddenStats: newHidden, warnings: newWarnings };
    });
  };

  // --- Phase Logic ---

  // 0. Monitor Vital Signs (Immediate Game Over Check)
  useEffect(() => {
    if (!gameState.isGameOver) {
      if (gameState.stats.health <= 0 || gameState.stats.morale <= 0) {
        endGame("因身心状况彻底崩溃，不得不遗憾退圈。");
      }
    }
  }, [gameState.stats.health, gameState.stats.morale, gameState.isGameOver]);

  // 1. Start Phase
  useEffect(() => {
    if (phase === 'START' && !gameState.isGameOver) {
      setLogs([]); 
      
      // Annual Narrative Trigger (Static) - Only if not showing annual summary
      if (gameState.time.quarter === 1 && ANNUAL_NARRATIVES[gameState.time.age] && gameState.showTurnCount === 0 && !showAnnualSummaryModal) {
        setShowNarrative(ANNUAL_NARRATIVES[gameState.time.age]);
      }

      // Company Bonus
      if (gameState.company !== Company.NONE) {
        const co = COMPANIES[gameState.company];
        let bonusEffect = {};
        if (gameState.company === Company.COFFEE) bonusEffect = { vocal: 10, fans: 5 };
        if (gameState.company === Company.ORIGIN) bonusEffect = { looks: 5, fans: 10 };
        if (gameState.company === Company.STARLIGHT) bonusEffect = { looks: 5, eq: 5 };
        if (gameState.company === Company.AGRAY) bonusEffect = { vocal: 5, dance: 5, fans: 10 };
        
        updateStats(bonusEffect);
        addLog(`【公司资源】${co.name}资源已发放 (${formatEffectLog(bonusEffect)})`);
      }

      setPhase('EVENT');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, gameState.time]);

  // 2. Event Phase
  useEffect(() => {
    if (phase === 'EVENT' && !currentEvent) {
      const possibleEvents = EVENTS.filter(e => e.trigger(gameState));
      if (possibleEvents.length > 0 && Math.random() < 0.5) {
        const evt = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        setCurrentEvent(evt);
      } else {
        setPhase('ACTION');
      }
    }
  }, [phase, currentEvent, gameState]);

  const handleEventOption = (idx: number) => {
    if (!currentEvent) return;
    const option = currentEvent.options[idx];
    const effect = option.effect(gameState);
    updateStats(effect);
    addLog(`【事件】${currentEvent.title}: ${option.log} (${formatEffectLog(effect)})`);
    setCurrentEvent(null);
    setPhase('ACTION');
  };

  // 3. Action Phase
  const handleAction = (action: Action) => {
    if (gameState.ap < action.apCost) return;
    
    const effect = action.effect(gameState);

    // Warning Checks - Prevent action if it triggers first warning
    if (effect.health && gameState.stats.health + effect.health <= 0) {
       if (!gameState.warnings.health) {
         setGameState(prev => ({ ...prev, warnings: { ...prev.warnings, health: true } }));
         addLog("⚠️【健康预警】身体已达极限！请立即休息，否则将被迫退圈。");
         return; // Prevent action
       }
       // If warning already exists, allow action (game over will trigger via useEffect)
    }

    if (effect.morale && gameState.stats.morale + effect.morale <= 0) {
      if (!gameState.warnings.morale) {
        setGameState(prev => ({ ...prev, warnings: { ...prev.warnings, morale: true } }));
        addLog("⚠️【心理预警】心态濒临崩溃！请立即放松，否则将被迫退圈。");
        return; // Prevent action
      }
    }

    setGameState(prev => ({ ...prev, ap: prev.ap - action.apCost }));
    updateStats(effect);
    addLog(`执行 [${action.name}] (${formatEffectLog(effect)})`);
  };

  // 4. Turn Logic
  const nextQuarter = async () => {
    // A. Show Phase Logic
    if (gameState.stage === GameStage.SHOW) {
      if (gameState.showTurnCount >= 4) {
        endGameBasedOnShow();
        return;
      }
      await advanceShowTurn(); // Now async
      return;
    } 
    
    // B. Amateur Phase Logic
    
    // Check for End of Year (Quarter 4) -> Annual Summary
    if (gameState.time.quarter === 4) {
       setIsLoadingAi(true);
       // Generate summary based on current state (before time advances)
       const summary = await generateAnnualSummary(gameState);
       setAnnualSummaryText(summary);
       setIsLoadingAi(false);
       setShowAnnualSummaryModal(true);
       return; // Stop here, wait for user to close modal to advance time
    }

    advanceTime();
  };

  const advanceShowTurn = async () => {
      setIsLoadingAi(true);

      // --- Calculate Show Logic ---
      
      // 1. Calculate Player Vote Gain
      const baseVotes = Math.floor(gameState.stats.fans * 0.1) + 5; // Passive from fans
      const actionVotes = Math.floor(Math.random() * 10); // Simulated gain from performing well
      const bonusVotes = (gameState.hiddenStats.viralMoments * 20) + (gameState.hiddenStats.hotCp * 15) + Math.floor(Math.random() * 5);
      
      const totalNewVotes = Math.floor(baseVotes + actionVotes + bonusVotes);
      
      // 2. Update Player Stats (Create temp state for calculation)
      const newVotes = Math.floor(gameState.stats.votes + totalNewVotes);
      
      // 3. Update Trainees (Competitors)
      // Make vote changes more integer-friendly and constrained to a reasonable range
      const updatedTrainees = gameState.trainees.map(t => {
        // Base growth trend + some random variance.
        // Cap the random variance to avoid massive swings, but keep it integer.
        const variance = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const growth = Math.max(0, Math.floor(t.trend + variance)); 
        return {
          ...t,
          votes: Math.floor(t.votes + growth)
        };
      });
      
      // 4. Calculate Rank
      const allScores = [
        ...updatedTrainees.map(t => t.votes),
        newVotes
      ].sort((a, b) => b - a);
      
      const myRank = allScores.indexOf(newVotes) + 1;

      // 5. Generate Comments (Pass the "future" state logically)
      const tempStateForAI = { ...gameState, rank: myRank, stats: { ...gameState.stats, votes: newVotes } };
      const comments = await generateFanComments(tempStateForAI, 'UPDATE');
      setFanComments(comments);

      // 6. Set State & Show Modal
      setGameState(prev => ({
        ...prev,
        stats: { ...prev.stats, votes: newVotes },
        trainees: updatedTrainees,
        rank: myRank,
        showTurnCount: prev.showTurnCount + 1,
        time: { ...prev.time, quarter: (prev.time.quarter % 4 + 1) as 1|2|3|4 },
        ap: 5 
      }));
      
      setCurrentVoteBreakdown({
        base: baseVotes,
        action: actionVotes,
        bonus: bonusVotes,
        total: totalNewVotes
      });

      setIsLoadingAi(false);
      setShowRankModal(true);
  }

  const advanceTime = async () => {
    let newQuarter = gameState.time.quarter + 1;
    let newYear = gameState.time.year;
    let newAge = gameState.time.age;

    // Check for Show Start Transition (Winter -> Spring)
    const isShowStart = gameState.stage === GameStage.AMATEUR && gameState.isSignedUpForShow && gameState.time.quarter === 4;

    if (newQuarter > 4) {
      newQuarter = 1;
      newYear += 1;
      newAge += 1;
    }
    
    if (newAge > 26) {
      endGame("到了退役年龄，星途结束");
      return;
    }

    if (isShowStart) {
        setIsLoadingAi(true);
        // Generate initial comments for show start
        const comments = await generateFanComments({
            ...gameState, 
            stage: GameStage.SHOW,
            trainees: generateTrainees(99) // Temp logic to make AI aware competitors exist
        }, 'START');
        setFanComments(comments);
        setIsLoadingAi(false);
    }

    setGameState(prev => {
      let newState = {
        ...prev,
        time: { year: newYear, quarter: newQuarter as 1|2|3|4, age: newAge },
        ap: prev.company !== Company.NONE ? 2 : 3,
        maxAp: prev.company !== Company.NONE ? 2 : 3,
      };

      // Handle Show Start
      if (isShowStart) {
        newState.stage = GameStage.SHOW;
        newState.ap = 5;
        newState.maxAp = 5;
        newState.showTurnCount = 1;
        newState.trainees = generateTrainees(99); // Generate 99 competitors
        addLog("春天到了，《青春404》正式入营！");
      }

      return newState;
    });

    setPhase('START');
    
    // If show just started, we want to show the rank modal (as an intro) or just rely on the first event. 
    // To make sure user sees the comments, let's open the modal with "Initial Status" if it's show start
    if (isShowStart) {
        setCurrentVoteBreakdown(null); // No votes yet
        setShowRankModal(true); // Re-use modal to show initial comments/rank 100
    }
  };

  // --- End Logic ---

  const signCompany = (c: Company) => {
    setGameState(prev => ({ ...prev, company: c, maxAp: 2 }));
    addLog(`成功签约 ${COMPANIES[c].name}！`);
  };

  const signUpForShow = () => {
    setGameState(prev => ({ ...prev, isSignedUpForShow: true }));
    addLog("报名成功！请继续积攒实力，等待明年春季节目开启。");
  };

  const endGameBasedOnShow = () => {
     const { stats, hiddenStats, rank } = gameState;
     const totalSkill = stats.vocal + stats.dance + stats.eq + stats.looks;
     
     let result = "未出道";
     if (rank <= 1) result = "C位断层出道";
     else if (rank <= 11) result = "高位成团出道";
     else if (rank <= 25) result = "Solo出道 (优质偶像)";
     else if (stats.fans > 200 || totalSkill > 400) result = "Solo出道 (逆风翻盘)";
     else result = "遗憾淘汰";

     endGame(result);
  };

  const endGame = async (result: string) => {
    if (gameState.isGameOver) return; // Prevent double firing
    setGameState(prev => ({ ...prev, isGameOver: true, stage: GameStage.ENDED, gameResult: result }));
    setIsLoadingAi(true);
    const summary = await generateGameSummary({ ...gameState, gameResult: result });
    setAiSummary(summary);
    setIsLoadingAi(false);
  };

  // --- Render Sections ---

  const renderActionGrid = () => {
    const actions = gameState.stage === GameStage.AMATEUR ? AMATEUR_ACTIONS : SHOW_ACTIONS;
    return (
      <div className="grid grid-cols-2 gap-3">
        {actions.map(act => (
          <button
            key={act.id}
            onClick={() => handleAction(act)}
            disabled={gameState.ap < act.apCost || gameState.isGameOver}
            className={`p-3 rounded-lg border text-left transition-colors ${
              gameState.ap < act.apCost 
              ? 'bg-gray-100 text-gray-400 border-gray-200' 
              : 'bg-white hover:bg-pink-50 border-pink-200 text-gray-800 shadow-sm'
            }`}
          >
            <div className="font-bold flex justify-between">
              {act.name}
              <span className="text-xs font-normal bg-gray-100 px-1 rounded text-gray-500">AP: {act.apCost}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{act.description}</div>
          </button>
        ))}
      </div>
    );
  };

  const renderContracts = () => {
    if (gameState.stage !== GameStage.AMATEUR || gameState.company !== Company.NONE || gameState.time.quarter !== 4) return null;
    const { vocal, dance, looks, fans, eq } = gameState.stats;
    const eligible = [];
    if (vocal >= 60 && looks >= 30 && fans >= 10) eligible.push(Company.COFFEE);
    if (looks >= 60 && (vocal >= 30 || dance >= 30) && gameState.time.age <= 17) eligible.push(Company.ORIGIN);
    if (looks >= 60 && eq >= 60 && fans >= 30) eligible.push(Company.STARLIGHT);
    if (vocal >= 60 && (dance >= 30 || looks >= 30) && fans >= 30) eligible.push(Company.AGRAY);
    if (eligible.length === 0) return null;
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 mb-4 animate-fade-in">
        <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
          <Briefcase size={18} /> 收到经纪公司邀约！
        </h3>
        <div className="grid gap-2">
          {eligible.map(c => (
            <button key={c} onClick={() => signCompany(c)} className="bg-white p-3 rounded-lg border border-purple-200 text-left hover:shadow-md transition-all">
              <div className="font-bold text-purple-700">{COMPANIES[c].name}</div>
              <div className="text-xs text-gray-600">{COMPANIES[c].desc} | 福利: {COMPANIES[c].bonus}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderShowEntry = () => {
    if (gameState.stage !== GameStage.AMATEUR || gameState.time.age < 17) return null;
    if (gameState.isGameOver) return null;
    if (gameState.isSignedUpForShow) {
       return (
         <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600"><Briefcase size={20} /></div>
            <div>
              <h3 className="font-bold text-green-800">已报名《青春404》</h3>
              <p className="text-xs text-green-600">海选已通过！请等待明年春季节目组通知。</p>
            </div>
         </div>
       );
    }
    
    const { vocal, dance, looks, eq } = gameState.stats;
    const canEnter = ((vocal + dance >= 150) || looks >= 200) && eq >= 50;
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-orange-800">《青春404》海选报名中</h3>
            <p className="text-xs text-orange-600 mt-1">门槛: (唱跳≥150 或 颜值≥200) 且 情商≥50</p>
            <p className="text-[10px] text-orange-500 mt-0.5">*报名后将于次年春季开启录制</p>
          </div>
          {canEnter ? (
             <button onClick={signUpForShow} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-orange-600 animate-bounce">
               立即报名
             </button>
          ) : (
             <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">条件未达标</span>
          )}
        </div>
      </div>
    );
  };

  // --- Main Render ---

  if (gameState.stage === GameStage.ENDED) {
    const endingImage = STORY_IMAGES[getEndingImageKey(gameState.gameResult || '')];
    
    return (
      <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl overflow-hidden flex flex-col">
         {/* Ending Header Image */}
         <div className="relative h-48 w-full bg-gray-100">
            <img src={endingImage} alt="Ending" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
         </div>

         <div className="p-8 flex-1 overflow-y-auto -mt-6 relative">
            <h1 className="text-3xl font-bold text-center text-pink-600 mb-2">星途终章</h1>
            <div className="text-center text-xl font-medium text-gray-700 mb-6">{gameState.gameResult}</div>
            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 mb-6">
               <h2 className="text-lg font-bold text-pink-800 mb-4">最终数据</h2>
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>粉丝: {gameState.stats.fans}万</div>
                  <div>票数: {gameState.stats.votes}万</div>
                  <div>Vocal: {gameState.stats.vocal}</div>
                  <div>Dance: {gameState.stats.dance}</div>
                  <div>颜值: {gameState.stats.looks}</div>
                  <div>情商: {gameState.stats.eq}</div>
               </div>
            </div>
            <div className="prose prose-pink">
              <h3 className="font-bold text-gray-800 mb-2">星途回溯</h3>
              {isLoadingAi ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="animate-spin">✨</span> 正在生成你的星途传记...
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
              )}
            </div>
         </div>
         <button onClick={() => window.location.reload()} className="m-4 bg-pink-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-pink-700">再玩一次</button>
      </div>
    );
  }

  // Cast to any for the new properties in guide which TS might not know about if types aren't updated
  const currentGuide = (gameState.stage === GameStage.AMATEUR ? STAGE_GUIDES.AMATEUR : STAGE_GUIDES.SHOW) as any;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden flex flex-col font-sans relative">
      
      {/* Header */}
      <header className="bg-pink-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-lg font-bold flex items-center gap-2"><span>✨</span> 星途 Star Path</h1>
        <button onClick={() => setShowGuide(true)} className="flex items-center gap-1 px-3 py-1.5 bg-pink-700/50 hover:bg-pink-700 rounded-full transition text-sm font-medium border border-pink-500/30">
          <HelpCircle size={16} /> 目标与指引
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <StatsPanel stats={gameState.stats} hiddenStats={gameState.hiddenStats} time={gameState.time} stage={gameState.stage} rank={gameState.rank} />

        {/* Narrative Modal (Beginning of Year) */}
        {showNarrative && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center relative border-2 border-pink-200 overflow-hidden">
              {/* Narrative Image */}
              <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden shadow-inner">
                <img 
                   src={STORY_IMAGES[gameState.time.age] || STORY_IMAGES.default} 
                   alt="Chapter Start" 
                   className="w-full h-full object-cover" 
                />
              </div>

              <div className="text-lg font-medium text-gray-800 whitespace-pre-wrap leading-relaxed mb-6 font-serif px-2">
                {showNarrative}
              </div>
              <button 
                onClick={() => setShowNarrative(null)}
                className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-700 w-full"
              >
                开启新的一年
              </button>
            </div>
          </div>
        )}

        {/* Annual Summary Modal (End of Year) */}
        {showAnnualSummaryModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative border-2 border-indigo-200">
               {/* Annual Image (Re-using story image for consistency, or default) */}
               <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden shadow-inner">
                 <img 
                    src={STORY_IMAGES[gameState.time.age] || STORY_IMAGES.default} 
                    alt="Annual Summary" 
                    className="w-full h-full object-cover" 
                 />
               </div>

               <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-indigo-900 flex items-center justify-center gap-2">
                    <Calendar className="w-6 h-6" /> 
                    {gameState.time.age}岁 · 年度总结
                  </h2>
               </div>
               
               <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-900 leading-relaxed min-h-[100px] mb-6 whitespace-pre-wrap border border-indigo-100">
                  {annualSummaryText || "正在生成年度总结..."}
               </div>

               <button 
                  onClick={() => {
                    setShowAnnualSummaryModal(false);
                    advanceTime(); // Actually advance time when user closes summary
                  }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 w-full"
               >
                  继续前行
               </button>
            </div>
          </div>
        )}

        {/* Show Ranking Modal */}
        {showRankModal && (
          <ShowRankModal 
            rank={gameState.rank}
            votes={gameState.stats.votes}
            voteBreakdown={currentVoteBreakdown}
            trainees={gameState.trainees}
            comments={fanComments}
            onClose={() => {
              setShowRankModal(false);
              setPhase('START'); // Continue to next turn
            }}
          />
        )}

        {/* Guide Modal */}
        {showGuide && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up relative max-h-[85vh] overflow-y-auto">
               <button onClick={() => setShowGuide(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
               <h2 className="text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
                 <Briefcase size={20} /> {currentGuide.title}
               </h2>
               <div className="space-y-4 text-sm text-gray-700">
                 <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                    <h3 className="font-bold mb-2 text-pink-800">当前目标</h3>
                    <ul className="space-y-1">
                      {currentGuide.goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
                    </ul>
                 </div>
                 <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <div className="whitespace-pre-wrap font-medium text-orange-800">{currentGuide.conditions}</div>
                 </div>
                 
                 {/* Companies Section */}
                 {currentGuide.companies && (
                   <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <h3 className="font-bold mb-3 text-purple-800 flex items-center gap-2"><Building2 size={16}/> 经纪公司签约指南</h3>
                      <div className="space-y-3">
                        {currentGuide.companies.map((c: any, i: number) => (
                          <div key={i} className="bg-white p-2 rounded border border-purple-100 shadow-sm">
                             <div className="font-bold text-purple-700">{c.name}</div>
                             <div className="text-xs text-gray-600 mt-1"><span className="font-semibold">条件:</span> {c.req}</div>
                             <div className="text-xs text-gray-600 mt-0.5"><span className="font-semibold">收益:</span> {c.benefit}</div>
                          </div>
                        ))}
                      </div>
                      {currentGuide.companyNote && (
                        <div className="mt-2 text-xs text-purple-600 italic">{currentGuide.companyNote}</div>
                      )}
                   </div>
                 )}
               </div>
             </div>
          </div>
        )}

        {/* Event Modal */}
        {currentEvent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
              <div className="flex items-center gap-2 text-pink-600 mb-2">
                <AlertCircle />
                <span className="font-bold">突发事件</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{currentEvent.title}</h2>
              <p className="text-gray-600 mb-6">{currentEvent.description}</p>
              <div className="space-y-2">
                {currentEvent.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEventOption(idx)}
                    className="w-full p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium rounded-lg text-left transition-colors border border-pink-200"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!currentEvent && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 max-h-32 overflow-y-auto text-sm text-gray-600 space-y-1">
              {logs.length === 0 ? <p className="text-gray-400 italic">本季度暂无动态...</p> : logs.map((l, i) => (
                <div key={i} className={l.includes('⚠️') ? 'text-red-600 font-bold' : ''}>• {l}</div>
              ))}
            </div>
            {renderContracts()}
            {renderShowEntry()}
            <div>
              <h3 className="font-bold text-gray-700 mb-3 flex flex-wrap items-center justify-between gap-2">
                 <span>行动安排</span>
                 <div className="flex items-center gap-2">
                    {(gameState.warnings.health || gameState.warnings.morale) && (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded animate-pulse">
                           ⚠️ 状态危急
                        </span>
                    )}
                    <span className="text-sm bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                        AP剩余: {gameState.ap}/{gameState.maxAp}
                    </span>
                 </div>
              </h3>

              {(gameState.warnings.health || gameState.warnings.morale) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-sm text-red-800 flex items-start gap-2 shadow-sm">
                     <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                     <div className="flex-1">
                        {gameState.warnings.health && <div className="font-bold">⚠️ 身体已达极限！</div>}
                        {gameState.warnings.health && <div className="text-xs mt-1 text-red-700">请立即执行【休息/就医】类行动恢复健康，若再次消耗健康将直接退圈。</div>}
                        
                        {gameState.warnings.morale && <div className="font-bold mt-1">⚠️ 心态濒临崩溃！</div>}
                        {gameState.warnings.morale && <div className="text-xs mt-1 text-red-700">请立即执行【娱乐/放松】类行动恢复道德，若再次消耗道德将直接退圈。</div>}
                     </div>
                  </div>
              )}

              {renderActionGrid()}
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white border-t border-gray-200">
        <button
          onClick={nextQuarter}
          disabled={(gameState.ap > 0 && !currentEvent) || isLoadingAi}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            gameState.ap === 0 
              ? (isLoadingAi ? 'bg-indigo-400 cursor-wait' : 'bg-pink-600 text-white shadow-lg hover:bg-pink-700')
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isLoadingAi ? '生成中...' : (gameState.ap > 0 ? <><span className="text-sm font-normal">行动点未耗尽</span> <SkipForward size={18} /></> : <>结束本季度 <Play size={18} /></>)}
        </button>
      </footer>
    </div>
  );
}