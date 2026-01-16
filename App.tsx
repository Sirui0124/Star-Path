import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameStage, Company, Action, GameEvent, Trainee, VoteBreakdown, EventOutcome, Gender, EventType } from './types';
import { AMATEUR_ACTIONS, SHOW_ACTIONS, COMPANIES, LOADING_MESSAGES, SOCIAL_FEEDBACKS } from './constants';
import { ALL_EVENTS } from './content/events';
import { StatsPanel } from './components/StatsPanel';
import { ShowRankModal } from './components/ShowRankModal';
import { EventResultModal } from './components/EventResultModal';
import { EventChoiceModal } from './components/EventChoiceModal';
import { CharacterSetup } from './components/CharacterSetup';
import { GameIntroModal } from './components/GameIntroModal';
import { STAGE_GUIDES } from './content/guides';
import { ANNUAL_NARRATIVES } from './content/narratives';
import { STORY_IMAGES, getEndingImageKey } from './content/images';
import { generateGameSummary, generateAnnualSummary, generateFanComments, generateEventOutcome } from './services/gemini';
import { logGameEvent } from './services/firebase';
import { formatEffectLog, generateTrainees } from './utils';
import { Play, SkipForward, AlertCircle, Briefcase, HelpCircle, X, Building2, Calendar, CheckCircle } from 'lucide-react';

const INITIAL_STATE: GameState = {
  name: '练习生', // Default placeholder
  gender: 'female',
  dreamLabel: '追梦人',
  stats: {
    vocal: 30, dance: 0, looks: 30, eq: 10,
    ethics: 50, health: 50, fans: 1, votes: 0
  },
  hiddenStats: { sincerity: 50, dream: 50, hotCp: 0, viralMoments: 0 },
  time: { year: 1, quarter: 1, age: 16 },
  stage: GameStage.AMATEUR,
  company: Company.NONE,
  ap: 3,
  maxAp: 3,
  history: [],
  triggeredEventIds: [], // Initialize empty
  
  isSignedUpForShow: false,
  showTurnCount: 0,
  rank: 100,
  trainees: [],
  
  isGameOver: false,
  warnings: { health: false, ethics: false },
};

type TurnPhase = 'SETUP' | 'INTRO' | 'START' | 'EVENT' | 'ACTION' | 'END';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  // Start with INTRO instead of SETUP
  const [phase, setPhase] = useState<TurnPhase>('INTRO');
  
  // Event Queue System
  const [eventQueue, setEventQueue] = useState<GameEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  
  const [logs, setLogs] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [loadingTip, setLoadingTip] = useState('');
  
  // Modals
  const [showGuide, setShowGuide] = useState(false);
  const [showNarrative, setShowNarrative] = useState<string | null>(null);
  const [showRankModal, setShowRankModal] = useState(false);
  const [currentVoteBreakdown, setCurrentVoteBreakdown] = useState<VoteBreakdown | null>(null);
  const [fanComments, setFanComments] = useState<string[]>([]);
  const [showAnnualSummaryModal, setShowAnnualSummaryModal] = useState(false);
  const [annualSummaryText, setAnnualSummaryText] = useState('');
  const [eventOutcome, setEventOutcome] = useState<EventOutcome | null>(null);
  const [activeEventType, setActiveEventType] = useState<EventType | null>(null);
  // Updated state to include image URL
  const [signModal, setSignModal] = useState<{name: string, text: string, image: string} | null>(null);

  // --- Preload Images ---
  useEffect(() => {
    const imagesToPreload = [
      STORY_IMAGES.event_social,
      STORY_IMAGES.event_random,
      STORY_IMAGES.event_show,
      STORY_IMAGES.setup_bg,
      STORY_IMAGES.signing_coffee,
      STORY_IMAGES.signing_origin,
      STORY_IMAGES.signing_starlight,
      STORY_IMAGES.signing_agray,
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // --- Helpers ---
  const getRandomLoadingTip = () => {
    return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoadingAi) {
      setLoadingTip(getRandomLoadingTip()); 
      interval = setInterval(() => {
        setLoadingTip(getRandomLoadingTip());
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoadingAi]);

  const startLoading = () => {
    setIsLoadingAi(true);
  };

  const addLog = (text: string) => {
    setLogs(prev => [...prev, text]);
    setGameState(prev => ({ ...prev, history: [...prev.history, `${prev.time.age}岁${prev.time.quarter}季度: ${text}`] }));
  };

  const getShowRankTitle = (turn: number) => {
    switch (turn) {
      case 1: return "青春404 · 初始顺位";
      case 2: return "青春404 · 第一轮公演";
      case 3: return "青春404 · 第二轮公演";
      case 4: return "青春404 · 第三轮公演";
      case 5: return "青春404 · 总决赛成团夜";
      default: return "青春404 · 顺位发布";
    }
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
      if (effect.ethics) newStats.ethics = Math.min(100, Math.max(0, newStats.ethics + effect.ethics));
      if (effect.health) newStats.health = Math.min(100, Math.max(0, newStats.health + effect.health));
      if (effect.fans) newStats.fans = Math.max(0, newStats.fans + effect.fans);
      if (effect.votes) newStats.votes = Math.max(0, newStats.votes + effect.votes);

      if (effect.sincerity) newHidden.sincerity += effect.sincerity;
      if (effect.dream) newHidden.dream += effect.dream;
      if (effect.hotCp) newHidden.hotCp += effect.hotCp;
      if (effect.viralMoments) newHidden.viralMoments += effect.viralMoments;

      if (effect.health && effect.health > 0) newWarnings.health = false;
      if (effect.ethics && effect.ethics > 0) newWarnings.ethics = false;

      return { ...prev, stats: newStats, hiddenStats: newHidden, warnings: newWarnings };
    });
  };

  // Setup Handler
  const handleSetupComplete = (name: string, gender: Gender, dreamLabel: string, initialStats: { vocal: number; dance: number; looks: number }) => {
    setGameState(prev => ({
      ...prev,
      name,
      gender,
      dreamLabel,
      stats: {
        ...prev.stats,
        vocal: initialStats.vocal,
        dance: initialStats.dance,
        looks: initialStats.looks,
      },
      history: [`游戏开始：你叫${name}，是一个怀揣【${dreamLabel}】梦想的16岁${gender === 'male' ? '少年' : '少女'}。`]
    }));
    
    // Analytics: Game Start
    logGameEvent('game_start', {
      character_dream: dreamLabel,
      character_gender: gender,
      initial_vocal: initialStats.vocal,
      initial_dance: initialStats.dance,
      initial_looks: initialStats.looks
    });

    // Auto show guide at start of Amateur stage
    setShowGuide(true);
    setPhase('START'); 
  };
  
  const handleIntroComplete = () => {
    // Intro finishes -> Go to Character Setup
    setPhase('SETUP');
  };

  // --- Core Game Loop Logic ---

  // Generate Queue of events for the current turn
  const generateEventQueue = (currentState: GameState): GameEvent[] => {
    const queue: GameEvent[] = [];
    const isShowStage = currentState.stage === GameStage.SHOW;

    // 1. Filter events applicable to current stage & trigger & REPEATABLE CHECK
    const validEvents = ALL_EVENTS.filter(e => {
        // Stage Check
        if (e.stage !== 'ALL' && e.stage !== currentState.stage) return false;
        
        // Repeatable Check: If not repeatable and already triggered, skip it.
        if (!e.repeatable && currentState.triggeredEventIds.includes(e.id)) return false;

        // Trigger Check
        try {
            return e.trigger(currentState);
        } catch (err) {
            console.error(`Error triggering event ${e.id}`, err);
            return false;
        }
    });

    // 2. Separate Mandatory vs Random Pools
    const mandatoryEvents = validEvents.filter(e => e.isMandatory);
    const poolEvents = validEvents.filter(e => !e.isMandatory);

    // 3. Selection Logic based on Stage
    if (isShowStage) {
        // Show Stage: 2-3 Show/Random events
        // Mandatory take precedence
        queue.push(...mandatoryEvents);
        
        // Fill remaining slots with pool events (Show Events)
        // Prefer SHOW type events in SHOW stage
        const showPool = poolEvents.filter(e => e.type === 'SHOW');
        const otherPool = poolEvents.filter(e => e.type !== 'SHOW'); // Should be empty ideally if strict
        
        // Shuffle pools
        showPool.sort(() => 0.5 - Math.random());
        otherPool.sort(() => 0.5 - Math.random());

        // Target: 2-3 events total
        const targetCount = 2 + Math.floor(Math.random() * 2);
        let needed = Math.max(0, targetCount - queue.length);

        // Take from Show Pool first
        const fromShow = showPool.slice(0, needed);
        queue.push(...fromShow);
        
        // If still needed, take from others (fallback)
        needed -= fromShow.length;
        if (needed > 0) {
            queue.push(...otherPool.slice(0, needed));
        }

    } else {
        // Amateur Stage Logic: Strictly 1-2 Social AND 1-2 Random
        
        // A. Add Mandatory Events first
        queue.push(...mandatoryEvents);

        // B. Add Social Events (Target: 1-2)
        const socialPool = poolEvents.filter(e => e.type === 'SOCIAL');
        socialPool.sort(() => 0.5 - Math.random());
        
        const socialTarget = 1 + Math.floor(Math.random() * 2); // Randomly 1 or 2
        const selectedSocials = socialPool.slice(0, socialTarget);
        queue.push(...selectedSocials);

        // C. Add Random Events (Target: 1-2)
        const randomPool = poolEvents.filter(e => e.type === 'RANDOM');
        randomPool.sort(() => 0.5 - Math.random());

        const randomTarget = 1 + Math.floor(Math.random() * 2); // Randomly 1 or 2
        const selectedRandoms = randomPool.slice(0, randomTarget);
        queue.push(...selectedRandoms);
    }

    // Deduplicate just in case (though pools are separate)
    return Array.from(new Set(queue));
  };


  // --- Phase Watchers ---

  // 0. Monitor Vital Signs
  useEffect(() => {
    if (!gameState.isGameOver && phase !== 'SETUP' && phase !== 'INTRO') {
      if (gameState.stats.health <= 0 || gameState.stats.ethics <= 0) {
        endGame("因身心状况彻底崩溃，不得不遗憾退圈。");
      }
    }
  }, [gameState.stats.health, gameState.stats.ethics, gameState.isGameOver, phase]);

  // 1. Event Phase Processor
  useEffect(() => {
    if (phase === 'EVENT' && !currentEvent && !eventOutcome) {
        if (eventQueue.length > 0) {
            // Pop next event
            const nextEvent = eventQueue[0];
            setEventQueue(prev => prev.slice(1)); // Remove it from queue
            setCurrentEvent(nextEvent);
        } else {
            // Queue empty, go to Action
            setPhase('ACTION');
        }
    }
  }, [phase, eventQueue, currentEvent, eventOutcome]);

  // 2. Start Phase (Gatekeeper)
  useEffect(() => {
    if (phase === 'START' && !gameState.isGameOver) {
      setLogs([]); 
      
      // Company Bonus
      if (gameState.company !== Company.NONE) {
        const co = COMPANIES[gameState.company];
        let bonusEffect = {};
        // Updated Bonus Logic
        if (gameState.company === Company.COFFEE) bonusEffect = { vocal: 10, fans: 2 };
        if (gameState.company === Company.ORIGIN) bonusEffect = { looks: 5, fans: 10 };
        if (gameState.company === Company.STARLIGHT) bonusEffect = { looks: 10, eq: 5, fans: 5 };
        if (gameState.company === Company.AGRAY) bonusEffect = { vocal: 5, dance: 5, fans: 10 };
        
        updateStats(bonusEffect);
        addLog(`【公司资源】${co.name}资源已发放 (${formatEffectLog(bonusEffect)})`);
      }

      // Check Narrative (Year Start)
      const hasNarrative = gameState.time.quarter === 1 && ANNUAL_NARRATIVES[gameState.time.age] && gameState.showTurnCount === 0 && !showAnnualSummaryModal;
      
      if (hasNarrative) {
        setShowNarrative(ANNUAL_NARRATIVES[gameState.time.age]);
        return; 
      }

      // Prepare Event Queue if not showing narrative
      const newQueue = generateEventQueue(gameState);
      setEventQueue(newQueue);
      setPhase('EVENT');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, gameState.time]);

  const handleNarrativeClose = () => {
    setShowNarrative(null);
    // Prepare Queue after narrative closes
    const newQueue = generateEventQueue(gameState);
    setEventQueue(newQueue);
    setPhase('EVENT');
  };

  const handleEventOption = async (idx: number) => {
    if (!currentEvent) return;
    const option = currentEvent.options[idx];

    // Analytics: Event Choice
    logGameEvent('event_choice', {
      event_id: currentEvent.id,
      event_type: currentEvent.type,
      choice_text: option.text,
      current_stage: gameState.stage
    });
    
    // Store type before clearing event
    setActiveEventType(currentEvent.type);

    // Record the event as triggered immediately (for deduplication)
    setGameState(prev => ({
        ...prev,
        triggeredEventIds: [...prev.triggeredEventIds, currentEvent.id]
    }));

    startLoading();
    
    const aiOutcome = await generateEventOutcome(gameState, currentEvent, option.text);
    setIsLoadingAi(false);

    if (aiOutcome) {
      setEventOutcome(aiOutcome);
    } else {
      const changes = option.effect(gameState);
      
      // Dynamic Fallback Logic
      // 1. Build Pool
      const feedbackPool = [
          ...SOCIAL_FEEDBACKS.GENERAL,
          ...SOCIAL_FEEDBACKS.FAMILY
      ];
      // 2. Add Company pool only if signed
      if (gameState.company !== Company.NONE) {
          feedbackPool.push(...SOCIAL_FEEDBACKS.COMPANY);
      }
      
      // 3. Pick random
      const randomSocial = feedbackPool[Math.floor(Math.random() * feedbackPool.length)];
      
      setEventOutcome({
        narrative: option.log || "生活还在继续。",
        changes: changes as any,
        socialType: randomSocial.type as any,
        socialSender: randomSocial.sender,
        socialContent: randomSocial.content
      });
    }
    
    setCurrentEvent(null);
  };

  const closeEventResultModal = () => {
    if (eventOutcome) {
       updateStats(eventOutcome.changes);
       addLog(`【${currentEvent?.type === 'SOCIAL' ? '社媒' : '事件'}】${eventOutcome.narrative} (${formatEffectLog(eventOutcome.changes)})`);
    }
    setEventOutcome(null);
    setActiveEventType(null);
    // Effect will trigger next event in queue or move to ACTION
  };

  // 3. Action Phase
  const handleAction = (action: Action) => {
    if (gameState.ap < action.apCost) return;
    
    // Analytics: Perform Action
    logGameEvent('perform_action', {
      action_id: action.id,
      action_name: action.name,
      stage: gameState.stage
    });

    const effect = action.effect(gameState);

    if (effect.health && gameState.stats.health + effect.health <= 0) {
       if (!gameState.warnings.health) {
         setGameState(prev => ({ ...prev, warnings: { ...prev.warnings, health: true } }));
         addLog("⚠️【健康预警】请提升健康，否则将被迫退圈。");
         return; 
       }
    }

    if (effect.ethics && gameState.stats.ethics + effect.ethics <= 0) {
      if (!gameState.warnings.ethics) {
        setGameState(prev => ({ ...prev, warnings: { ...prev.warnings, ethics: true } }));
        addLog("⚠️【道德预警】请提升道德，否则将被迫退圈。");
        return; 
      }
    }

    setGameState(prev => ({ ...prev, ap: prev.ap - action.apCost }));
    updateStats(effect);
    addLog(`执行 [${action.name}] (${formatEffectLog(effect)})`);
  };

  // 4. Turn Advancement
  const nextQuarter = async () => {
    // A. Show Phase Logic
    if (gameState.stage === GameStage.SHOW) {
      // Extended to 5 turns to accommodate "Finals Debut Night" as the last ranking reveal
      if (gameState.showTurnCount >= 5) {
        endGameBasedOnShow();
        return;
      }
      await advanceShowTurn(); 
      return;
    } 
    
    // B. Amateur Phase Logic
    if (gameState.time.quarter === 4) {
       startLoading();
       const summary = await generateAnnualSummary(gameState);
       setAnnualSummaryText(summary);
       setIsLoadingAi(false);
       setShowAnnualSummaryModal(true);
       return;
    }

    advanceTime();
  };

  const advanceShowTurn = async () => {
      startLoading();

      // 1. Calculate Player Growth
      const baseVotes = Math.floor(gameState.stats.fans * 0.1) + 5; 
      const actionVotes = Math.floor(Math.random() * 10); 
      const bonusVotes = (gameState.hiddenStats.viralMoments * 20) + (gameState.hiddenStats.hotCp * 15) + Math.floor(Math.random() * 5);
      const totalNewVotes = Math.floor(baseVotes + actionVotes + bonusVotes);
      
      const newPlayerVotes = Math.floor(gameState.stats.votes + totalNewVotes);
      
      // 2. Calculate NPC Growth (Improved Logic: Matthews Effect & Viral Spikes)
      // Sort NPCs by votes first to know who is leading
      const sortedTrainees = [...gameState.trainees].sort((a, b) => b.votes - a.votes);
      
      const updatedTrainees = sortedTrainees.map((t, index) => {
        const rank = index + 1;
        let rankBonus = 0;
        
        // Matthews Effect: The rich get richer (Screen time)
        if (rank <= 3) rankBonus = 15; // Top 3 get huge push
        else if (rank <= 11) rankBonus = 10; // Debut line gets push
        else if (rank <= 35) rankBonus = 5;

        // Random Variance
        const variance = Math.floor(Math.random() * 11) - 5; 
        
        // Viral Spike Chance (Black Horse) - 2% chance for massive spike for anyone
        const viralBonus = Math.random() < 0.02 ? Math.floor(Math.random() * 30) + 20 : 0;

        const growth = Math.max(0, Math.floor(t.trend + variance + rankBonus + viralBonus)); 
        
        return { ...t, votes: Math.floor(t.votes + growth) };
      });
      
      // 3. Re-Rank everyone
      const allScores = [...updatedTrainees.map(t => t.votes), newPlayerVotes].sort((a, b) => b - a);
      const myRank = allScores.indexOf(newPlayerVotes) + 1;

      const tempStateForAI = { ...gameState, rank: myRank, stats: { ...gameState.stats, votes: newPlayerVotes } };
      const comments = await generateFanComments(tempStateForAI, 'UPDATE');
      setFanComments(comments);
      
      setIsLoadingAi(false); // <--- FIXED: Ensure loading state is cleared

      // Apply changes but don't set queue yet
      // AP Reduced to 4 if in company
      const nextAp = gameState.company !== Company.NONE ? 4 : 5;
      
      setGameState(prev => ({
        ...prev,
        stats: { ...prev.stats, votes: newPlayerVotes },
        trainees: updatedTrainees,
        rank: myRank,
        showTurnCount: prev.showTurnCount + 1,
        time: { ...prev.time, quarter: (prev.time.quarter % 4 + 1) as 1|2|3|4 },
        ap: nextAp,
        maxAp: nextAp
      }));
      
      setCurrentVoteBreakdown({ base: 5, action: actionVotes, bonus: bonusVotes, total: totalNewVotes });
      setShowRankModal(true); // Will trigger queue gen on close
      // No setPhase here, modal close handles it
  };

  const handleShowRankModalClose = () => {
      setShowRankModal(false);
      
      // If we just finished the Finals (Turn 5), end the game
      if (gameState.showTurnCount >= 5) {
          endGameBasedOnShow();
          return;
      }

      // Generate Show Events Queue
      const newQueue = generateEventQueue(gameState);
      setEventQueue(newQueue);
      setPhase('EVENT');
  };

  const advanceTime = async () => {
    let newQuarter = gameState.time.quarter + 1;
    let newYear = gameState.time.year;
    let newAge = gameState.time.age;

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
        startShowStage(newYear, newQuarter as 1|2|3|4, newAge);
        return;
    }

    setGameState(prev => ({
      ...prev,
      time: { year: newYear, quarter: newQuarter as 1|2|3|4, age: newAge },
      ap: prev.company !== Company.NONE ? 2 : 3,
      maxAp: prev.company !== Company.NONE ? 2 : 3,
    }));

    setPhase('START');
  };

  const startShowStage = async (year: number, quarter: 1|2|3|4, age: number) => {
        startLoading();
        
        const { vocal, dance, looks, fans } = gameState.stats;
        const totalSkill = vocal + dance;
        let initialVotes = 0;
        let archetypeLabel = "初登场";

        // Player Initial Vote Logic (Slightly boosted to match new difficulty)
        const potentialVotes: {v: number, l: string}[] = [];
        if (fans >= 100) potentialVotes.push({ v: 120 + Math.floor(Math.random() * 30), l: "自带流量" }); // Boosted from 100
        if (looks >= 80 && vocal > 70 && dance > 70) potentialVotes.push({ v: 110 + Math.floor(Math.random() * 20), l: "全能ACE" }); // Boosted from 90
        if (looks >= 100 && totalSkill < 50) potentialVotes.push({ v: 90 + Math.floor(Math.random() * 20), l: "美丽废物" }); // Boosted from 80
        if (looks < 60 && totalSkill >= 180) potentialVotes.push({ v: 70 + Math.floor(Math.random() * 20), l: "实力派" }); // Boosted from 50
        potentialVotes.push({ v: 20 + Math.floor(Math.random() * 20), l: "小透明" }); // Boosted from 10

        potentialVotes.sort((a, b) => b.v - a.v);
        initialVotes = potentialVotes[0].v;
        archetypeLabel = potentialVotes[0].l;

        // Generate 100 NPCs (Total 101 with player)
        const initialTrainees = generateTrainees(100);
        
        const allScores = [...initialTrainees.map(t => t.votes), initialVotes].sort((a, b) => b - a);
        const myRank = allScores.indexOf(initialVotes) + 1;

        const tempState = {
            ...gameState,
            stage: GameStage.SHOW,
            trainees: initialTrainees,
            stats: { ...gameState.stats, votes: initialVotes },
            rank: myRank
        };

        const comments = await generateFanComments(tempState, 'START');
        setFanComments(comments);
        setIsLoadingAi(false);

        // AP logic: 4 if signed, 5 if amateur
        const startAp = gameState.company !== Company.NONE ? 4 : 5;

        setGameState(prev => {
            let newState = {
                ...prev,
                time: { year: year, quarter: quarter, age: age },
                stage: GameStage.SHOW,
                ap: startAp,
                maxAp: startAp,
                showTurnCount: 1,
                trainees: initialTrainees,
                stats: { ...prev.stats, votes: initialVotes },
                rank: myRank,
            };
            newState.history = [...prev.history, `${age}岁${quarter}季度: 春天到了，《青春404》正式入营！你的【${archetypeLabel}】初舞台获得了${initialVotes}万初始票数。`];
            return newState;
        });
        
        setCurrentVoteBreakdown({ base: initialVotes, action: 0, bonus: 0, total: initialVotes });
        setShowRankModal(true);
        // Auto show guide at start of Show stage
        setShowGuide(true);
        // No setPhase here, modal close handles it
  };

  const signCompany = (c: Company) => {
    // Determine welcome text and image
    let text = "";
    let image = STORY_IMAGES.default;

    switch(c) {
      case Company.COFFEE: 
        text = "CEO申饼紧张地喝了口咖啡：欢迎入伙，我们用心做歌，冰美式和饼管够。"; 
        image = STORY_IMAGES.signing_coffee;
        break;
      case Company.ORIGIN: 
        text = "老板侯悦把合约拍在桌上：签了字就别想偷懒。"; 
        image = STORY_IMAGES.signing_origin;
        break;
      case Company.STARLIGHT: 
        text = "刘姐推了推墨镜：啧啧，这张脸不红简直天理难容，我们会把你捧成顶流。"; 
        image = STORY_IMAGES.signing_starlight;
        break;
      case Company.AGRAY: 
        text = "Tony总监：音色很有辨识度。来艾灰，我们用作品说话。"; 
        image = STORY_IMAGES.signing_agray;
        break;
      default:
        text = "欢迎加入！";
        image = STORY_IMAGES.default;
    }

    setGameState(prev => ({ ...prev, company: c, maxAp: 2 }));
    addLog(`成功签约 ${COMPANIES[c].name}！`);
    
    // Show Modal
    setSignModal({ name: COMPANIES[c].name, text, image });
  };

  const signUpForShow = () => {
    setGameState(prev => ({ ...prev, isSignedUpForShow: true }));
    addLog("报名成功！请继续积攒实力，等待明年春季节目开启。");
  };

  const endGameBasedOnShow = () => {
     const { stats, rank } = gameState;
     const totalSkill = stats.vocal + stats.dance + stats.eq + stats.looks;
     
     let result = "未出道";
     if (rank <= 1) result = "C位断层出道";
     else if (rank <= 11) result = "高位成团出道";
     else if (rank <= 25) result = "决赛圈Solo出道";
     else if (stats.fans > 200 || totalSkill > 400) result = "Solo出道 (逆风翻盘)";
     else result = "遗憾淘汰";

     endGame(result);
  };

  const endGame = async (result: string) => {
    if (gameState.isGameOver) return; 
    setGameState(prev => ({ ...prev, isGameOver: true, stage: GameStage.ENDED, gameResult: result }));
    
    // Analytics: Game Complete
    logGameEvent('game_complete', {
      result_type: result,
      final_fans: gameState.stats.fans,
      final_votes: gameState.stats.votes,
      company: gameState.company
    });

    startLoading();
    const summary = await generateGameSummary({ ...gameState, gameResult: result });
    setAiSummary(summary);
    setIsLoadingAi(false);
  };

  // --- Render Sections ---

  if (phase === 'INTRO') {
     return <GameIntroModal onStart={handleIntroComplete} />;
  }

  if (phase === 'SETUP') {
    return <CharacterSetup onComplete={handleSetupComplete} />;
  }

  const currentGuide = (gameState.stage === GameStage.AMATEUR ? STAGE_GUIDES.AMATEUR : STAGE_GUIDES.SHOW) as any;

  if (gameState.stage === GameStage.ENDED) {
    const endingImage = STORY_IMAGES[getEndingImageKey(gameState.gameResult || '')];
    
    return (
      <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl overflow-hidden flex flex-col">
         {/* Ending Header Image */}
         <div className="relative w-full aspect-[6/5] bg-gray-100">
            <img src={endingImage} alt="Ending" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
         </div>

         <div className="p-8 flex-1 overflow-y-auto -mt-6 relative">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">星途终章</h1>
            <div className="text-center text-xl font-medium text-gray-700 mb-6">{gameState.gameResult}</div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
               <h2 className="text-lg font-bold text-blue-800 mb-4">最终数据</h2>
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>粉丝: {gameState.stats.fans}万</div>
                  <div>票数: {gameState.stats.votes}万</div>
                  <div>Vocal: {gameState.stats.vocal}</div>
                  <div>Dance: {gameState.stats.dance}</div>
                  <div>颜值: {gameState.stats.looks}</div>
                  <div>情商: {gameState.stats.eq}</div>
               </div>
            </div>
            <div className="prose prose-blue">
              <h3 className="font-bold text-gray-800 mb-2">星途回溯</h3>
              {isLoadingAi ? (
                <div className="flex items-center gap-2 text-blue-600 font-medium animate-pulse">
                   <span>✨</span> {loadingTip}
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
              )}
            </div>
         </div>
         <button onClick={() => window.location.reload()} className="m-4 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700">再玩一次</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden flex flex-col font-sans relative">
      
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-lg font-bold flex items-center gap-2"><span>✨</span> 星途 Star Path</h1>
        <button onClick={() => setShowGuide(true)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-700/50 hover:bg-blue-700 rounded-full transition text-sm font-medium border border-blue-500/30">
          <HelpCircle size={16} /> 目标与指引
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <StatsPanel stats={gameState.stats} hiddenStats={gameState.hiddenStats} time={gameState.time} stage={gameState.stage} rank={gameState.rank} />

        {/* Narrative Modal (Beginning of Year) */}
        {showNarrative && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
          
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center relative border-2 border-blue-200 overflow-hidden">
              <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg mb-4 overflow-hidden shadow-inner">
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
                onClick={handleNarrativeClose}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 w-full"
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
               <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg mb-4 overflow-hidden shadow-inner">
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
                  {isLoadingAi ? (
                    <div className="flex items-center justify-center h-full gap-2 text-indigo-500 font-medium animate-pulse py-8">
                       <span>✨</span> {loadingTip}
                    </div>
                  ) : (
                    annualSummaryText || "正在生成年度总结..."
                  )}
               </div>

               <button 
                  onClick={() => {
                    setShowAnnualSummaryModal(false);
                    advanceTime(); // Actually advance time when user closes summary
                  }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 w-full"
                  disabled={isLoadingAi}
               >
                  {isLoadingAi ? '请稍候...' : '继续前行'}
               </button>
            </div>
          </div>
        )}

        {/* Company Signing Modal */}
        {signModal && (
           <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col relative animate-fade-in-up">
                 
                 {/* Image Header */}
                 <div className="relative w-full aspect-[4/3] bg-blue-50">
                    <img 
                      src={signModal.image} 
                      alt="Signing" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                 </div>

                 <div className="p-6 -mt-12 relative z-10 text-center">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-lg border-4 border-white">
                        <Building2 size={24} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-blue-900 mb-1">签约成功</h2>
                    <h3 className="text-base font-medium text-gray-600 mb-6">{signModal.name}</h3>
                 
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-blue-800 font-medium italic mb-6 text-sm leading-relaxed relative">
                       <span className="absolute top-2 left-2 text-3xl text-blue-200/50 leading-none">"</span>
                       {signModal.text}
                       <span className="absolute bottom-[-10px] right-2 text-3xl text-blue-200/50 leading-none">"</span>
                    </div>

                    <button 
                        onClick={() => setSignModal(null)}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} /> 开启职业生涯
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* Show Ranking Modal */}
        {showRankModal && (
          <ShowRankModal 
            title={getShowRankTitle(gameState.showTurnCount)}
            rank={gameState.rank}
            votes={gameState.stats.votes}
            voteBreakdown={currentVoteBreakdown}
            trainees={gameState.trainees}
            comments={fanComments}
            onClose={handleShowRankModalClose}
          />
        )}

        {/* Event Result Modal */}
        {eventOutcome && (
           <EventResultModal outcome={eventOutcome} eventType={activeEventType || 'RANDOM'} onClose={closeEventResultModal} />
        )}

        {/* Guide Modal */}
        {showGuide && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up relative max-h-[85vh] overflow-y-auto">
               <button onClick={() => setShowGuide(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
               <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                 <Briefcase size={20} /> {currentGuide.title}
               </h2>
               <div className="space-y-4 text-sm text-gray-700">
                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="font-bold mb-2 text-blue-800">当前目标</h3>
                    <ul className="space-y-1">
                      {currentGuide.goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
                    </ul>
                 </div>
                 <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <div className="whitespace-pre-wrap font-medium text-orange-800">{currentGuide.conditions}</div>
                 </div>
                 
                 {currentGuide.companies && (
                   <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                      <h3 className="font-bold mb-2 text-purple-800 flex items-center gap-2 text-sm"><Building2 size={16}/> 经纪公司签约指南</h3>
                      
                      {currentGuide.companyNote && (
                        <div className="mb-2 text-xs text-purple-600 font-medium">{currentGuide.companyNote}</div>
                      )}

                      <div className="overflow-hidden rounded-lg border border-purple-200 bg-white">
                        <table className="w-full text-[10px] text-center border-collapse">
                          <thead>
                            <tr className="bg-purple-100 text-purple-900">
                              {currentGuide.companies.map((c: any, i: number) => (
                                <th key={i} className="p-1 border-r border-purple-200 last:border-0 font-bold whitespace-nowrap">{c.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="text-gray-600">
                             {/* Row 2: Type */}
                             <tr className="bg-purple-50/50">
                               {currentGuide.companies.map((c: any, i: number) => (
                                 <td key={i} className="p-1 border-r border-t border-purple-200 last:border-r-0">{c.type}</td>
                               ))}
                             </tr>
                             {/* Row 3: Requirements */}
                             <tr>
                               {currentGuide.companies.map((c: any, i: number) => (
                                 <td key={i} className="p-1 border-r border-t border-purple-200 last:border-r-0 whitespace-pre-wrap align-top h-12">{c.req}</td>
                               ))}
                             </tr>
                             {/* Row 4: Benefits */}
                             <tr className="bg-purple-50/30 text-purple-800 font-medium">
                               {currentGuide.companies.map((c: any, i: number) => (
                                 <td key={i} className="p-1 border-r border-t border-purple-200 last:border-r-0 whitespace-pre-wrap align-top">{c.benefit}</td>
                               ))}
                             </tr>
                          </tbody>
                        </table>
                      </div>
                   </div>
                 )}
               </div>
             </div>
          </div>
        )}

        {/* Current Event Choice Modal */}
        {currentEvent && !eventOutcome && (
           <EventChoiceModal 
              event={currentEvent} 
              onOptionSelect={handleEventOption} 
              isLoading={isLoadingAi}
              loadingTip={loadingTip}
           />
        )}

        {/* Action Phase Panel */}
        {!currentEvent && !eventOutcome && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 max-h-32 overflow-y-auto text-sm text-gray-600 space-y-1">
              {logs.length === 0 ? <p className="text-gray-400 italic">本季度暂无动态...</p> : logs.map((l, i) => (
                <div key={i} className={l.includes('⚠️') ? 'text-red-600 font-bold' : ''}>• {l}</div>
              ))}
            </div>
            
            {(gameState.stage === GameStage.AMATEUR && gameState.company === Company.NONE && gameState.time.quarter === 4) && (
                (() => {
                    const { vocal, dance, looks, fans, eq } = gameState.stats;
                    const eligible = [];
                    if (vocal >= 60 && looks >= 30 && fans >= 10) eligible.push(Company.COFFEE);
                    if (looks >= 60 && (vocal >= 30 || dance >= 30) && gameState.time.age <= 17) eligible.push(Company.ORIGIN);
                    if (looks >= 60 && eq >= 60 && fans >= 30) eligible.push(Company.STARLIGHT);
                    if (vocal >= 60 && (dance >= 30 || looks >= 30) && fans >= 30) eligible.push(Company.AGRAY);
                    if (eligible.length === 0) return null;
                    return (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100 mb-4 animate-fade-in">
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
                })()
            )}

            {(gameState.stage === GameStage.AMATEUR && gameState.time.age >= 17 && !gameState.isGameOver) && (
                (() => {
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
                     
                     const { vocal, dance, looks, eq, fans } = gameState.stats;
                     const canEnter = ((vocal + dance >= 150) || looks >= 100 || fans >= 100) && eq >= 40;
                     
                     return (
                       <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 mb-4">
                         <div className="flex justify-between items-center">
                           <div>
                             <h3 className="font-bold text-orange-800">《青春404》海选报名中</h3>
                             <p className="text-xs text-orange-600 mt-1">
                                门槛: (唱跳≥150 或 颜值≥100 或 粉丝≥100w) 且 情商≥40
                             </p>
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
                })()
            )}

            <div>
              <h3 className="font-bold text-gray-700 mb-3 flex flex-wrap items-center justify-between gap-2">
                 <span>行动安排</span>
                 <div className="flex items-center gap-2">
                    {(gameState.warnings.health || gameState.warnings.ethics) && (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded animate-pulse">
                           ⚠️ 状态危急
                        </span>
                    )}
                    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        AP剩余: {gameState.ap}/{gameState.maxAp}
                    </span>
                 </div>
              </h3>

              {(gameState.warnings.health || gameState.warnings.ethics) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-sm text-red-800 flex items-start gap-2 shadow-sm">
                     <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                     <div className="flex-1">
                        {gameState.warnings.health && <div className="font-bold">⚠️ 身体已达极限！</div>}
                        {gameState.warnings.health && <div className="text-xs mt-1 text-red-700">请立即执行行动恢复健康，若再次消耗健康将直接退圈。</div>}
                        
                        {gameState.warnings.ethics && <div className="font-bold mt-1">⚠️ 心态濒临崩溃！</div>}
                        {gameState.warnings.ethics && <div className="text-xs mt-1 text-red-700">请立即执行行动恢复道德，若再次消耗道德将直接退圈。</div>}
                     </div>
                  </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {(gameState.stage === GameStage.AMATEUR ? AMATEUR_ACTIONS : SHOW_ACTIONS).map(act => (
                  <button
                    key={act.id}
                    onClick={() => handleAction(act)}
                    disabled={gameState.ap < act.apCost || gameState.isGameOver}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      gameState.ap < act.apCost 
                      ? 'bg-gray-100 text-gray-400 border-gray-200' 
                      : 'bg-white hover:bg-blue-50 border-blue-200 text-gray-800 shadow-sm'
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
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white border-t border-gray-200">
        <button
          onClick={nextQuarter}
          disabled={(gameState.ap > 0 && !currentEvent) || isLoadingAi || !!eventOutcome}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            gameState.ap === 0 
              ? (isLoadingAi ? 'bg-indigo-400 cursor-wait' : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700')
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isLoadingAi ? loadingTip : (gameState.ap > 0 ? <><span className="text-sm font-normal">行动点未耗尽</span> <SkipForward size={18} /></> : <>结束本季度 <Play size={18} /></>)}
        </button>
      </footer>
    </div>
  );
}