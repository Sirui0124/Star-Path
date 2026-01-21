
import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameStage, Company, Action, GameEvent, Trainee, VoteBreakdown, EventOutcome, Gender, EventType } from './types';
import { AMATEUR_ACTIONS, SHOW_ACTIONS, COMPANIES, LOADING_MESSAGES, SOCIAL_FEEDBACKS } from './constants';
import { ALL_EVENTS } from './content/events';
import { ALL_CARDS, UnlockableCard } from './content/cards'; // Import Cards
import { StatsPanel } from './components/StatsPanel';
import { ShowRankModal } from './components/ShowRankModal';
import { EventResultModal } from './components/EventResultModal';
import { EventChoiceModal } from './components/EventChoiceModal';
import { CharacterSetup } from './components/CharacterSetup';
import { GameIntroModal } from './components/GameIntroModal';
import { GuideModal } from './components/GuideModal';
import { CardCollectionModal } from './components/CardCollectionModal'; // Import Component
import { SaveLoadModal } from './components/SaveLoadModal'; // Import SaveLoad
import { FeedbackModal } from './components/FeedbackModal'; // Import Feedback
import { STAGE_GUIDES } from './content/guides';
import { ANNUAL_NARRATIVES } from './content/narratives';
import { STORY_IMAGES, getEndingImageKey } from './content/images';
import { generateGameSummary, generateAnnualSummary, generateFanComments, generateEventOutcome, generateSocialFeedback } from './services/gemini';
import { logGameEvent } from './services/firebase';
import { formatEffectLog, generateTrainees, generateShowHighlights } from './utils';
import { Play, SkipForward, AlertCircle, Briefcase, HelpCircle, X, Building2, Calendar, CheckCircle, Wifi, WifiOff, Sparkles, Zap, Download, Mic, Music, User, TrendingUp, Flame, RefreshCcw, Trophy, BookOpen, Save, MessageSquare } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useGameAnalytics } from './hooks/useGameAnalytics';

const INITIAL_STATE: GameState = {
  name: '练习生', // Default placeholder
  gender: 'male', //是男爱豆！！！
  dreamLabel: '追梦人',
  stats: {
    vocal: 30, dance: 0, looks: 30, eq: 10,
    ethics: 50, health: 50, fans: 1, votes: 0
  },
  hiddenStats: { dream: 50, sincerity: 50, hotCp: 0, viralMoments: 0 },
  time: { year: 1, quarter: 1, age: 16 },
  stage: GameStage.AMATEUR,
  company: Company.NONE,
  ap: 3,
  maxAp: 3,
  history: [],
  triggeredEventIds: [], 
  flags: {}, // Initialize flags
  eventsGenerated: false, // Default false
  
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
  const [showCardCollection, setShowCardCollection] = useState(false); // New State
  const [showSaveLoad, setShowSaveLoad] = useState(false); // New SaveLoad State
  const [showFeedback, setShowFeedback] = useState(false); // New Feedback State
  const [newlyUnlockedCards, setNewlyUnlockedCards] = useState<UnlockableCard[]>([]); // New Cards Popup
  const [showNarrative, setShowNarrative] = useState<string | null>(null);
  const [showRankModal, setShowRankModal] = useState(false);
  const [currentVoteBreakdown, setCurrentVoteBreakdown] = useState<VoteBreakdown | null>(null);
  const [fanComments, setFanComments] = useState<string[]>([]);
  const [showHighlights, setShowHighlights] = useState<string[]>([]); // New Highlights
  const [showAnnualSummaryModal, setShowAnnualSummaryModal] = useState(false);
  const [annualSummaryText, setAnnualSummaryText] = useState('');
  
  // Outcome & AI Status Tracking
  const [eventOutcome, setEventOutcome] = useState<EventOutcome | null>(null);
  const [activeEventType, setActiveEventType] = useState<EventType | null>(null);
  const [lastEventWasAi, setLastEventWasAi] = useState(false); // Track if the result was AI generated

  // Context for the result modal (what event and what choice led here)
  const [lastEventContext, setLastEventContext] = useState<{title: string, desc: string, options: string[], selectedIndex: number} | null>(null);
  
  // Updated state to include image URL
  const [signModal, setSignModal] = useState<{name: string, text: string, image: string} | null>(null);
  const endingRef = useRef<HTMLDivElement>(null);

  // Tracker for votes at the start of a show turn to calculate the "Stage Pool" (Net Change)
  const lastTurnVotesRef = useRef(0);

  // --- ANALYTICS HOOK ---
  useGameAnalytics(phase, gameState.stage);

  // --- Preload Images ---
  useEffect(() => {
    const imagesToPreload = [
      // Core UI
      STORY_IMAGES.event_social,
      STORY_IMAGES.event_random,
      STORY_IMAGES.event_show,
      STORY_IMAGES.setup_bg,
      STORY_IMAGES.guide_bg,
      STORY_IMAGES.show_rank_bg,
      
      // Companies
      STORY_IMAGES.signing_coffee,
      STORY_IMAGES.signing_origin,
      STORY_IMAGES.signing_starlight,
      STORY_IMAGES.signing_agray,

      // Actions (Amateur)
      STORY_IMAGES.action_train_vocal,
      STORY_IMAGES.action_train_dance,
      STORY_IMAGES.action_gym,
      STORY_IMAGES.action_street_perform,
      STORY_IMAGES.action_social_media,
      STORY_IMAGES.action_plastic_surgery,

      // Actions (Show)
      STORY_IMAGES.action_show_practice,
      STORY_IMAGES.action_show_communicate,
      STORY_IMAGES.action_show_performane,
      STORY_IMAGES.action_show_looks,
      STORY_IMAGES.action_show_fan_service,
      STORY_IMAGES.action_show_social,
    ];
    imagesToPreload.forEach(src => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, []);

  // --- Analytics: Mobile Save/Share Intent Detection (Long Press) ---
  useEffect(() => {
    const handleContextMenu = () => {
        let scene = 'main_hub';
        if (gameState.stage === GameStage.ENDED) scene = 'ending_summary';
        else if (showRankModal) scene = 'rank_reveal';
        else if (eventOutcome) scene = 'event_result';
        else if (currentEvent) scene = 'event_choice';
        else if (showNarrative) scene = 'narrative_text';

        logGameEvent('mobile_save_intent_long_press', {
            phase: phase,
            stage: gameState.stage,
            age: gameState.time.age,
            scene: scene,
            current_fans: gameState.stats.fans
        });
    };
    
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [phase, gameState.stage, gameState.time.age, showRankModal, eventOutcome, currentEvent, showNarrative]);

  // --- Save/Load System ---
  const handleSaveGame = (slotId: string, stateToSave: GameState = gameState) => {
    const saveData = {
        summary: {
            name: stateToSave.name,
            timeLabel: `${stateToSave.time.year}年 ${['春','夏','秋','冬'][stateToSave.time.quarter-1]}`,
            stage: stateToSave.stage,
            age: stateToSave.time.age,
            fans: stateToSave.stats.fans,
            company: stateToSave.company,
            updatedAt: Date.now()
        },
        state: stateToSave
    };
    try {
        localStorage.setItem(`star_path_save_${slotId}`, JSON.stringify(saveData));
        if (slotId !== 'auto') {
            addLog("存档成功！");
        }
    } catch (e) {
        console.error("Save failed", e);
        alert("存档失败：存储空间不足或权限受限");
    }
  };

  const handleLoadGame = (loadedState: GameState) => {
      const mergedState: GameState = {
          ...INITIAL_STATE,
          ...loadedState,
          stats: { ...INITIAL_STATE.stats, ...loadedState.stats },
          hiddenStats: { ...INITIAL_STATE.hiddenStats, ...loadedState.hiddenStats },
          time: { ...INITIAL_STATE.time, ...loadedState.time },
          warnings: { ...INITIAL_STATE.warnings, ...loadedState.warnings },
          flags: { ...INITIAL_STATE.flags, ...(loadedState.flags || {}) },
          eventsGenerated: loadedState.eventsGenerated ?? false, 
          history: Array.isArray(loadedState.history) ? loadedState.history : [],
          triggeredEventIds: Array.isArray(loadedState.triggeredEventIds) ? loadedState.triggeredEventIds : [],
          trainees: Array.isArray(loadedState.trainees) ? loadedState.trainees : []
      };

      setGameState(mergedState);
      
      setShowSaveLoad(false);
      setShowCardCollection(false);
      setShowGuide(false);
      setShowFeedback(false);

      setEventQueue([]);
      setCurrentEvent(null);
      setEventOutcome(null);
      setShowNarrative(null);
      setShowRankModal(false);
      setShowAnnualSummaryModal(false);
      setSignModal(null);
      
      const currentQuarterPrefix = `${mergedState.time.age}岁${mergedState.time.quarter}季度:`;
      const recentLogs = mergedState.history
          .filter(h => h.startsWith(currentQuarterPrefix))
          .map(h => h); 
      
      if (recentLogs.length > 0) {
          setLogs([...recentLogs, `--- 已读取存档 ---`]);
      } else {
          setLogs([`已读取存档：${mergedState.time.age}岁 ${['春','夏','秋','冬'][mergedState.time.quarter-1]}`]);
      }

      if (mergedState.eventsGenerated) {
          setPhase('ACTION');
      } else {
          setPhase('START'); 
      }
  };

  // --- Auto Save Logic ---
  useEffect(() => {
     if (gameState.time.quarter === 4 && phase === 'START' && !gameState.isGameOver) {
         handleSaveGame('auto', gameState);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.time, phase]);

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

  const getActionBg = (actionId: string) => {
    return STORY_IMAGES[`action_${actionId}`] || null;
  };

  const updateStats = (effect: Partial<GameState['stats']> & Partial<GameState['hiddenStats']> & { flags?: Record<string, boolean> }) => {
    setGameState(prev => {
      const newStats = { ...prev.stats };
      const newHidden = { ...prev.hiddenStats };
      const newWarnings = { ...prev.warnings };
      const newFlags = { ...prev.flags, ...(effect.flags || {}) }; 
      
      if (effect.vocal) newStats.vocal = Math.min(300, Math.max(0, newStats.vocal + effect.vocal));
      if (effect.dance) newStats.dance = Math.min(300, Math.max(0, newStats.dance + effect.dance));
      if (effect.looks) newStats.looks = Math.min(300, Math.max(0, newStats.looks + effect.looks));
      if (effect.eq) newStats.eq = Math.max(0, newStats.eq + effect.eq);
      if (effect.ethics) newStats.ethics = Math.min(100, Math.max(0, newStats.ethics + effect.ethics));
      if (effect.health) newStats.health = Math.min(100, Math.max(0, newStats.health + effect.health));
      if (effect.fans) newStats.fans = Math.max(0, newStats.fans + effect.fans);
      if (effect.votes) newStats.votes = newStats.votes + effect.votes;

      if (effect.dream) newHidden.dream += effect.dream;
      if (effect.sincerity) newHidden.sincerity += effect.sincerity;
      if (effect.hotCp) newHidden.hotCp += effect.hotCp;
      if (effect.viralMoments) newHidden.viralMoments += effect.viralMoments;

      if (effect.health && effect.health > 0) newWarnings.health = false;
      if (effect.ethics && effect.ethics > 0) newWarnings.ethics = false;

      return { ...prev, stats: newStats, hiddenStats: newHidden, warnings: newWarnings, flags: newFlags };
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
    
    logGameEvent('game_start', {
      character_dream: dreamLabel,
      character_gender: gender,
      initial_vocal: initialStats.vocal,
      initial_dance: initialStats.dance,
      initial_looks: initialStats.looks
    });

    // Skip connect test, go straight to game, trigger guide
    setShowGuide(true);
    setPhase('START');
  };
  
  const handleIntroComplete = () => {
    setPhase('SETUP');
  };

  const handleSaveImage = async () => {
    logGameEvent('click_save_ending_image', {
        result: gameState.gameResult,
        fans: gameState.stats.fans,
        final_age: gameState.time.age
    });

    if (endingRef.current) {
      try {
        const canvas = await html2canvas(endingRef.current, {
          useCORS: true,
          scale: 2,
          backgroundColor: '#ffffff',
          ignoreElements: (element) => element.hasAttribute('data-html2canvas-ignore')
        });
        const link = document.createElement('a');
        link.download = `星途回忆录_${gameState.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (err) {
        console.error("Save image failed", err);
        alert("保存图片失败，请尝试截图保存。");
      }
    }
  };

  const handleRetrySummary = async () => {
    startLoading();
    const summary = await generateGameSummary(gameState);
    setAiSummary(summary);
    setIsLoadingAi(false);
  };

  // --- Core Game Loop Logic ---

  const generateEventQueue = (currentState: GameState): GameEvent[] => {
    const isShowStage = currentState.stage === GameStage.SHOW;
    const validEvents = ALL_EVENTS.filter(e => {
        if (e.stage !== 'ALL' && e.stage !== currentState.stage) return false;
        if (!e.repeatable && currentState.triggeredEventIds.includes(e.id)) return false;
        try {
            return e.trigger(currentState);
        } catch (err) {
            console.error(`Error triggering event ${e.id}`, err);
            return false;
        }
    });

    const finalQueue: GameEvent[] = [];
    const mandatory = validEvents.filter(e => e.isMandatory);
    const optional = validEvents.filter(e => !e.isMandatory);

    if (isShowStage) {
        const totalTarget = 3 + Math.floor(Math.random() * 2);
        finalQueue.push(...mandatory);
        let needed = Math.max(0, totalTarget - finalQueue.length);
        if (needed > 0) {
            const showPool = optional.filter(e => e.type === 'SHOW');
            showPool.sort(() => 0.5 - Math.random());
            finalQueue.push(...showPool.slice(0, needed));
        }
    } else {
        const socialTarget = 1 + Math.floor(Math.random() * 2);
        const socialMandatory = mandatory.filter(e => e.type === 'SOCIAL');
        const socialOptional = optional.filter(e => e.type === 'SOCIAL');
        const socialPicks = [...socialMandatory];
        let socialNeeded = Math.max(0, socialTarget - socialPicks.length);
        if (socialNeeded > 0) {
            socialOptional.sort(() => 0.5 - Math.random());
            socialPicks.push(...socialOptional.slice(0, socialNeeded));
        }

        const randomTarget = 1;
        const randomMandatory = mandatory.filter(e => e.type === 'RANDOM');
        const randomOptional = optional.filter(e => e.type === 'RANDOM');
        const randomPicks = [...randomMandatory];
        let randomNeeded = Math.max(0, randomTarget - randomPicks.length);
        if (randomNeeded > 0) {
            randomOptional.sort(() => 0.5 - Math.random());
            randomPicks.push(...randomOptional.slice(0, randomNeeded));
        }

        finalQueue.push(...socialPicks);
        finalQueue.push(...randomPicks);
    }
    return Array.from(new Set(finalQueue));
  };


  // --- Phase Watchers ---

  useEffect(() => {
    if (!gameState.isGameOver && phase !== 'SETUP' && phase !== 'INTRO') {
      if (gameState.stats.health <= 0) {
        endGame("因身体状况彻底崩溃，被迫中断演艺生涯，提前退圈疗养。");
      } else if (gameState.stats.ethics <= 0) {
        endGame("因道德争议过大，被全网抵制，遭到行业封杀。");
      }
    }
  }, [gameState.stats.health, gameState.stats.ethics, gameState.isGameOver, phase]);

  useEffect(() => {
    if (phase === 'EVENT' && !currentEvent && !eventOutcome) {
        if (eventQueue.length > 0) {
            const nextEvent = eventQueue[0];
            setEventQueue(prev => prev.slice(1)); 
            setCurrentEvent(nextEvent);
        } else {
            setPhase('ACTION');
        }
    }
  }, [phase, eventQueue, currentEvent, eventOutcome]);

  useEffect(() => {
    if (phase === 'START' && !gameState.isGameOver) {
      setLogs([]); 
      
      if (gameState.company !== Company.NONE) {
        const co = COMPANIES[gameState.company];
        let bonusEffect = {};
        if (gameState.company === Company.COFFEE) bonusEffect = { vocal: 10, fans: 2 };
        if (gameState.company === Company.ORIGIN) bonusEffect = { looks: 5, fans: 10 };
        if (gameState.company === Company.STARLIGHT) bonusEffect = { looks: 10, eq: 3, fans: 5 };
        if (gameState.company === Company.AGRAY) bonusEffect = { vocal: 5, dance: 5, fans: 10 };
        updateStats(bonusEffect);
        addLog(`【公司资源】${co.name}资源已发放 (${formatEffectLog(bonusEffect)})`);
      }

      const hasNarrative = gameState.time.quarter === 1 && ANNUAL_NARRATIVES[gameState.time.age] && gameState.showTurnCount === 0 && !showAnnualSummaryModal;
      if (hasNarrative) {
        setShowNarrative(ANNUAL_NARRATIVES[gameState.time.age]);
        return; 
      }

      if (gameState.eventsGenerated) {
          setPhase('ACTION');
      } else {
          const newQueue = generateEventQueue(gameState);
          setEventQueue(newQueue);
          setGameState(prev => ({ ...prev, eventsGenerated: true }));
          setPhase('EVENT');
      }
    }
  }, [phase, gameState.time]);

  const handleNarrativeClose = () => {
    setShowNarrative(null);
    const newQueue = generateEventQueue(gameState);
    setEventQueue(newQueue);
    setGameState(prev => ({ ...prev, eventsGenerated: true }));
    setPhase('EVENT');
  };

  const handleEventOption = async (idx: number) => {
    if (!currentEvent) return;
    const option = currentEvent.options[idx];

    logGameEvent('event_choice', {
      event_id: currentEvent.id,
      event_type: currentEvent.type,
      choice_text: option.text,
      current_stage: gameState.stage
    });
    
    setActiveEventType(currentEvent.type);
    
    setLastEventContext({
        title: currentEvent.title,
        desc: currentEvent.description,
        options: currentEvent.options.map(o => o.text),
        selectedIndex: idx
    });

    setGameState(prev => ({
        ...prev,
        triggeredEventIds: [...prev.triggeredEventIds, currentEvent.id]
    }));

    startLoading();
    
    const useAiForOutcome = currentEvent.useAiForOutcome !== false;
    let outcome: EventOutcome | null = null;
    let isAi = false;

    if (useAiForOutcome) {
       outcome = await generateEventOutcome(gameState, currentEvent, option.text);
       if (outcome) isAi = true; 
    }

    if (!outcome) {
       // Fallback logic
       const effectResult = option.effect(gameState);
       const { log: dynamicLog, ...statsChanges } = effectResult as any;
       const narrative = dynamicLog || option.log || "生活还在继续。";
       
       // Try AI for social comment only
       let socialFeedback = await generateSocialFeedback(currentEvent.title, option.text, narrative);
       
       if (socialFeedback) {
           isAi = true; // We consider it partially AI generated if the comment is AI
       } else {
           isAi = false; // Totally offline/fallback
           const feedbackPool = [
              ...SOCIAL_FEEDBACKS.GENERAL,
              ...SOCIAL_FEEDBACKS.FAMILY
           ];
           if (gameState.company !== Company.NONE) {
              feedbackPool.push(...SOCIAL_FEEDBACKS.COMPANY);
           }
           const randomSocial = feedbackPool[Math.floor(Math.random() * feedbackPool.length)];
           socialFeedback = {
             socialType: randomSocial.type as any,
             socialSender: randomSocial.sender,
             socialContent: randomSocial.content
           };
       }
       
       outcome = {
         narrative,
         changes: statsChanges, 
         socialType: socialFeedback.socialType,
         socialSender: socialFeedback.socialSender,
         socialContent: socialFeedback.socialContent
       };
    }
    
    setLastEventWasAi(isAi);
    setIsLoadingAi(false);
    setEventOutcome(outcome);
    setCurrentEvent(null);
  };

  const closeEventResultModal = () => {
    if (eventOutcome) {
       updateStats(eventOutcome.changes as any);
       addLog(`【${currentEvent?.type === 'SOCIAL' ? '社媒' : '事件'}】${eventOutcome.narrative} (${formatEffectLog(eventOutcome.changes)})`);
    }
    setEventOutcome(null);
    setActiveEventType(null);
    setLastEventContext(null);
  };

  // 3. Action Phase
  const handleAction = (action: Action) => {
    if (gameState.ap < action.apCost) return;
    
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
    if (gameState.stage === GameStage.SHOW) {
      if (gameState.showTurnCount >= 5) {
        endGameBasedOnShow();
        return;
      }
      await advanceShowTurn(); 
      return;
    } 
    
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

      const { fans, vocal, dance, looks } = gameState.stats;
      const { viralMoments, hotCp } = gameState.hiddenStats;
      const turn = gameState.showTurnCount;
      const age = gameState.time.age;

      let ageMultiplier = 1.0;
      if (age === 20) ageMultiplier = 0.95;
      else if (age >= 21) ageMultiplier = 0.85;

      const stageMultiplier = 1 + (turn * 0.1);
      const fansVote = Math.floor(fans * stageMultiplier * (0.8 + Math.random() * 0.4) * ageMultiplier);
      const skillFactor = (vocal + dance + looks) / 10;
      const publicAppeal = Math.floor(skillFactor * stageMultiplier * (0.8 + Math.random() * 0.4) * ageMultiplier);
      const viralBonus = viralMoments * 30; 
      const cpBonus = hotCp * 20;
      const bonus = Math.floor((viralBonus + cpBonus) * (0.5 + Math.random())); 

      const currentVotes = gameState.stats.votes;
      const stagePool = currentVotes - lastTurnVotesRef.current;
      const totalNewVotes = Math.max(0, fansVote + publicAppeal + bonus + stagePool);
      const newPlayerVotes = totalNewVotes;
      lastTurnVotesRef.current = newPlayerVotes;

      const npcGrowthBase = 3.2; 
      const npcTurnBonus = turn * 0.6; 
      const npcDifficulty = npcGrowthBase + npcTurnBonus;

      const updatedTrainees = gameState.trainees.map((t) => {
        const basePower = t.trend * npcDifficulty; 
        const variation = 0.85 + Math.random() * 0.3; 
        let stageVotes = Math.floor(basePower * stageMultiplier * variation);
        const luck = Math.random();
        if (luck > 0.96) stageVotes = Math.floor(stageVotes * 1.35);
        if (luck < 0.04) stageVotes = Math.floor(stageVotes * 0.75); 
        stageVotes += Math.floor(turn * 15) + Math.floor(Math.random() * 10);
        return { ...t, votes: stageVotes };
      }).sort((a, b) => b.votes - a.votes);
      
      const allScores = [...updatedTrainees.map(t => t.votes), newPlayerVotes].sort((a, b) => b - a);
      const myRank = allScores.indexOf(newPlayerVotes) + 1;

      const tempStateForAI = { ...gameState, rank: myRank, stats: { ...gameState.stats, votes: newPlayerVotes } };
      
      const [comments, highlights] = await Promise.all([
         generateFanComments(tempStateForAI, 'UPDATE'),
         Promise.resolve(generateShowHighlights(updatedTrainees))
      ]);
      
      setFanComments(comments);
      setShowHighlights(highlights);
      setIsLoadingAi(false);

      const nextAp = gameState.company !== Company.NONE ? 4 : 5;
      
      setGameState(prev => ({
        ...prev,
        stats: { ...prev.stats, votes: newPlayerVotes },
        trainees: updatedTrainees,
        rank: myRank,
        showTurnCount: prev.showTurnCount + 1,
        time: { ...prev.time, quarter: (prev.time.quarter % 4 + 1) as 1|2|3|4 },
        ap: nextAp,
        maxAp: nextAp,
        eventsGenerated: false 
      }));
      
      setCurrentVoteBreakdown({ 
          fansVote, 
          stagePool, 
          publicAppeal, 
          bonus, 
          total: totalNewVotes 
      });
      
      setShowRankModal(true); 
  };

  const handleShowRankModalClose = () => {
      setShowRankModal(false);
      if (gameState.showTurnCount >= 5) {
          endGameBasedOnShow();
          return;
      }
      const newQueue = generateEventQueue(gameState);
      setEventQueue(newQueue);
      setGameState(prev => ({ ...prev, eventsGenerated: true }));
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

    if (gameState.stage === GameStage.AMATEUR && !gameState.isSignedUpForShow && newAge > 20) {
        endGame("因超过20岁仍未报名选秀，遗憾错失黄金年龄，黯然退圈。");
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
      eventsGenerated: false 
    }));

    setPhase('START');
  };

  const startShowStage = async (year: number, quarter: 1|2|3|4, age: number) => {
        startLoading();
        
        const { vocal, dance, looks, fans } = gameState.stats;
        const totalSkill = vocal + dance;
        let initialVotes = 0;
        let archetypeLabel = "初登场";

        const potentialVotes: {v: number, l: string}[] = [];
        if (fans >= 100) potentialVotes.push({ v: 120 + Math.floor(Math.random() * 30), l: "自带流量" }); 
        if (looks >= 80 && vocal > 70 && dance > 70) potentialVotes.push({ v: 110 + Math.floor(Math.random() * 20), l: "全能ACE" }); 
        if (looks >= 100 && totalSkill < 50) potentialVotes.push({ v: 90 + Math.floor(Math.random() * 20), l: "美丽废物" }); 
        if (looks < 60 && totalSkill >= 180) potentialVotes.push({ v: 70 + Math.floor(Math.random() * 20), l: "实力派" }); 
        potentialVotes.push({ v: 20 + Math.floor(Math.random() * 20), l: "小透明" }); 

        potentialVotes.sort((a, b) => b.v - a.v);
        initialVotes = potentialVotes[0].v;
        archetypeLabel = potentialVotes[0].l;
        
        lastTurnVotesRef.current = initialVotes;
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

        const [comments, highlights] = await Promise.all([
             generateFanComments(tempState, 'START'),
             Promise.resolve(generateShowHighlights(initialTrainees))
        ]);

        setFanComments(comments);
        setShowHighlights(highlights);
        setIsLoadingAi(false);

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
                eventsGenerated: false 
            };
            newState.history = [...prev.history, `${age}岁${quarter}季度: 春天到了，《青春404》正式入营！你的【${archetypeLabel}】初舞台获得了${initialVotes}万初始票数。`];
            return newState;
        });
        
        setCurrentVoteBreakdown({ 
            fansVote: initialVotes, 
            stagePool: 0, 
            publicAppeal: 0, 
            bonus: 0, 
            total: initialVotes 
        });
        
        setShowRankModal(true);
        setShowGuide(true);
  };

  const signCompany = (c: Company) => {
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
        text = "Amy总监：音色很有辨识度。来艾灰，我们用作品说话。"; 
        image = STORY_IMAGES.signing_agray;
        break;
      default:
        text = "欢迎加入！";
        image = STORY_IMAGES.default;
    }
    setGameState(prev => ({ ...prev, company: c, maxAp: 2 }));
    addLog(`成功签约 ${COMPANIES[c].name}！`);
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
    
    let currentRuns = 0;
    try {
        const runsStr = localStorage.getItem('star_path_runs');
        currentRuns = parseInt(runsStr || '0') + 1;
        localStorage.setItem('star_path_runs', currentRuns.toString());
    } catch (e) {
        console.error("Failed to update runs", e);
    }

    const currentState = { ...gameState, isGameOver: true, stage: GameStage.ENDED, gameResult: result };
    
    let storedCards: string[] = [];
    try {
      const stored = localStorage.getItem('star_path_cards');
      if (stored) storedCards = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const newUnlocks: UnlockableCard[] = [];
    ALL_CARDS.forEach(card => {
        if (!storedCards.includes(card.id)) {
            if (card.condition(currentState)) {
                newUnlocks.push(card);
                storedCards.push(card.id);
                logGameEvent('card_first_unlock', {
                  card_id: card.id,
                  rarity: card.rarity,
                  total_runs: currentRuns
                });
            }
        }
    });

    if (newUnlocks.length > 0) {
        localStorage.setItem('star_path_cards', JSON.stringify(storedCards));
        setNewlyUnlockedCards(newUnlocks);
        newUnlocks.forEach(card => {
            logGameEvent('card_unlocked', {
                card_id: card.id,
                card_title: card.title,
                card_rarity: card.rarity
            });
        });
    }

    setGameState(prev => ({ ...prev, isGameOver: true, stage: GameStage.ENDED, gameResult: result }));
    
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

  if (phase === 'INTRO') {
     return (
       <>
         <GameIntroModal 
            onStart={handleIntroComplete} 
            onOpenCollection={() => setShowCardCollection(true)} 
            onOpenSaveLoad={() => setShowSaveLoad(true)}
            onOpenFeedback={() => setShowFeedback(true)} 
         />
         {showCardCollection && <CardCollectionModal onClose={() => setShowCardCollection(false)} />}
         {showSaveLoad && <SaveLoadModal currentGameState={gameState} onClose={() => setShowSaveLoad(false)} onLoad={handleLoadGame} onSave={handleSaveGame} />}
         {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
       </>
     );
  }

  if (phase === 'SETUP') {
    return <CharacterSetup onComplete={handleSetupComplete} />;
  }

  // CONNECT_TEST PHASE REMOVED

  const currentGuide = (gameState.stage === GameStage.AMATEUR ? STAGE_GUIDES.AMATEUR : STAGE_GUIDES.SHOW) as any;

  if (gameState.stage === GameStage.ENDED) {
    const endingImage = STORY_IMAGES[getEndingImageKey(gameState.gameResult || '')];
    return (
      <div className="min-h-[100dvh] bg-slate-50 relative pb-20">
         <button onClick={() => setShowFeedback(true)} data-html2canvas-ignore="true" className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/20 shadow-lg flex items-center gap-1.5 transition-all">
            <MessageSquare size={12} /> 开发者爆肝中，提建议给TA
         </button>
         {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
         <div ref={endingRef} className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative overflow-hidden">
            <div className="relative h-72">
                <img src={endingImage} alt="Ending" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-center">
                    <div className="inline-block px-3 py-1 bg-black/80 text-white text-[10px] font-bold tracking-[0.3em] uppercase mb-3 rounded-full">星途·终章 -（出道后内容开发中）</div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 font-serif tracking-tight drop-shadow-sm">{gameState.gameResult}</h1>
                    <p className="text-slate-500 font-medium text-sm tracking-wide">{gameState.name} · {gameState.time.age}岁</p>
                </div>
            </div>
            <div className="px-8 pb-12 space-y-8">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                   <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp size={14} /> Final Statistics</h2>
                   <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="col-span-2 flex gap-4 mb-2">
                          <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm"><div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Fans</div><div className="text-2xl font-black text-blue-600">{gameState.stats.fans}w</div></div>
                          <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm"><div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Final Votes</div><div className="text-2xl font-black text-purple-600">{gameState.stats.votes}w</div></div>
                      </div>
                      <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-600 font-bold"><Mic size={14}/> Vocal</span><span className="font-mono font-bold text-slate-900">{gameState.stats.vocal}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-600 font-bold"><Music size={14}/> Dance</span><span className="font-mono font-bold text-slate-900">{gameState.stats.dance}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-600 font-bold"><User size={14}/> Looks</span><span className="font-mono font-bold text-slate-900">{gameState.stats.looks}</span></div>
                      </div>
                      <div className="space-y-3 pl-2 border-l border-slate-200">
                          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-600 font-bold"><Sparkles size={14}/> EQ</span><span className="font-mono font-bold text-slate-900">{gameState.stats.eq}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-pink-500 font-bold"><Flame size={14}/> CP热度</span><span className="font-mono font-bold text-pink-600">{gameState.hiddenStats.hotCp}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-yellow-500 font-bold"><Zap size={14}/> 出圈</span><span className="font-mono font-bold text-yellow-600">{gameState.hiddenStats.viralMoments}</span></div>
                      </div>
                   </div>
                </div>
                <div>
                   <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 justify-center"><Briefcase size={14} /> Memories</h2>
                   <div className="prose prose-slate prose-sm max-w-none text-justify leading-relaxed font-serif text-slate-700 whitespace-pre-wrap">
                      {isLoadingAi ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                           <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                           <p className="text-xs font-sans animate-pulse">正在编织星途回忆...</p>
                        </div>
                      ) : (
                        <>
                            {aiSummary}
                            {(aiSummary.includes("网络波动") || aiSummary.includes("API Key")) && (
                                <div className="mt-8 text-center pt-4 border-t border-dashed border-slate-200">
                                    <p className="text-xs text-slate-400 mb-3">生成似乎遇到了问题？</p>
                                    <button onClick={handleRetrySummary} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-bold transition-all border border-blue-200 shadow-sm">
                                        <RefreshCcw size={14} /> 重新生成回忆录
                                    </button>
                                </div>
                            )}
                        </>
                      )}
                   </div>
                </div>
                <div className="pt-8 border-t border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 tracking-[0.5em] uppercase font-bold mb-1">Produced by Star Path</div>
                    <div className="text-[12px] text-slate-300 font-mono tracking-wide">starpath-ai.com</div>
                </div>
            </div>
         </div>
         <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center gap-4 px-6">
            <button onClick={() => window.location.reload()} className="flex-1 bg-white text-slate-900 border border-slate-200 shadow-xl py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all hover:-translate-y-0.5">
               <RefreshCcw size={18} /> 再玩一次
            </button>
            <button onClick={handleSaveImage} className="flex-1 bg-slate-900 text-white shadow-xl py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:-translate-y-0.5">
               <Download size={18} /> 保存回忆录
            </button>
         </div>
         {newlyUnlockedCards.length > 0 && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setNewlyUnlockedCards([])}>
                <div className="text-center w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="text-yellow-400 font-black text-2xl mb-4 animate-bounce drop-shadow-glow">✨ 新卡牌解锁! ✨</div>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide px-2">
                        {newlyUnlockedCards.map((card, i) => (
                            <div key={card.id} className="bg-white rounded-xl p-4 shadow-2xl transform hover:scale-105 transition-transform animate-fade-in-up" style={{animationDelay: `${i*150}ms`}}>
                                <img src={card.image} alt="" className="w-full h-48 object-cover rounded-lg mb-3 shadow-md"/>
                                <div className="font-bold text-lg text-gray-900">{card.title}</div>
                                <div className="text-xs text-gray-500">{card.unlockText}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setNewlyUnlockedCards([])} className="mt-8 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full font-bold border border-white/50 backdrop-blur-md">
                        收入卡册
                    </button>
                </div>
            </div>
         )}
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto shadow-2xl flex flex-col font-sans relative bg-gradient-to-b from-[#bae1ff] to-[#e6d4ff] overflow-hidden">
      <header className="bg-white/30 backdrop-blur-md text-slate-800 px-4 py-3 sticky top-0 z-20 flex justify-between items-center border-b border-white/20 shrink-0">
        <div className="flex items-center gap-2">
            <span className="text-base filter drop-shadow-sm">✨</span>
            <div className="flex flex-col">
                <h1 className="text-sm font-bold leading-tight text-slate-900">星途</h1>
                <span className="text-[10px] text-slate-500 font-mono leading-none tracking-tight">starpath-ai.com</span>
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setShowSaveLoad(true)} className="flex items-center gap-1 px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-full transition text-sm font-medium border border-white/40 text-blue-800">
                <Save size={16} /> 存档
            </button>
            <button onClick={() => setShowCardCollection(true)} className="flex items-center gap-1 px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-full transition text-sm font-medium border border-white/40 text-purple-800">
                <BookOpen size={16} /> 卡册
            </button>
            <button onClick={() => setShowGuide(true)} className="flex items-center gap-1 px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-full transition text-sm font-medium border border-white/40 text-blue-800">
                <HelpCircle size={16} /> 指引
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-3 scrollbar-hide">
        <StatsPanel stats={gameState.stats} hiddenStats={gameState.hiddenStats} time={gameState.time} stage={gameState.stage} rank={gameState.rank} name={gameState.name}/>
        {showNarrative && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-md shadow-2xl max-w-sm w-full p-6 text-center relative border-2 border-blue-200 overflow-hidden">
              <div className="w-full aspect-[4/3] bg-gray-100 rounded-md mb-4 overflow-hidden shadow-inner">
                <img src={STORY_IMAGES[gameState.time.age] || STORY_IMAGES.default} alt="Chapter Start" className="w-full h-full object-cover" />
              </div>
              <div className="text-lg font-medium text-gray-800 whitespace-pre-wrap leading-relaxed mb-6 font-serif px-2">
                {showNarrative}
              </div>
              <button onClick={handleNarrativeClose} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 w-full">
                开启新的一年
              </button>
            </div>
          </div>
        )}
        {showAnnualSummaryModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-md shadow-2xl max-w-sm w-full p-6 relative border-2 border-indigo-200">
               <div className="w-full aspect-[4/3] bg-gray-100 rounded-md mb-4 overflow-hidden shadow-inner">
                 <img src={STORY_IMAGES[gameState.time.age] || STORY_IMAGES.default} alt="Annual Summary" className="w-full h-full object-cover" />
               </div>
               <div className="text-center mb-4"><h2 className="text-xl font-bold text-indigo-900 flex items-center justify-center gap-2"><Calendar className="w-6 h-6" /> {gameState.time.age}岁 · 年度总结</h2></div>
               <div className="bg-indigo-50 p-4 rounded-md text-sm text-indigo-900 leading-relaxed min-h-[100px] mb-6 whitespace-pre-wrap border border-indigo-100">
                  {isLoadingAi ? <div className="flex items-center justify-center h-full gap-2 text-indigo-500 font-medium animate-pulse py-8"><span>✨</span> {loadingTip}</div> : annualSummaryText || "正在生成年度总结..."}
               </div>
               <button onClick={() => {setShowAnnualSummaryModal(false); advanceTime();}} className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold shadow-lg hover:bg-indigo-700 w-full" disabled={isLoadingAi}>
                  {isLoadingAi ? '请稍候...' : '继续前行'}
               </button>
            </div>
          </div>
        )}
        {showSaveLoad && <SaveLoadModal currentGameState={gameState} onClose={() => setShowSaveLoad(false)} onLoad={handleLoadGame} onSave={handleSaveGame} />}
        {signModal && (
           <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white rounded-md shadow-2xl max-w-sm w-full overflow-hidden flex flex-col relative animate-fade-in-up">
                 <div className="relative w-full aspect-[4/3] bg-blue-50">
                    <img src={signModal.image} alt="Signing" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                 </div>
                 <div className="p-6 -mt-12 relative z-10 text-center">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-lg border-4 border-white"><Building2 size={24} /></div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-1">签约成功</h2>
                    <h3 className="text-base font-medium text-gray-600 mb-6">{signModal.name}</h3>
                    <div className="bg-blue-50 p-5 rounded-md border border-blue-100 text-blue-800 font-medium italic mb-6 text-sm leading-relaxed relative"><span className="absolute top-2 left-2 text-3xl text-blue-200/50 leading-none">"</span>{signModal.text}<span className="absolute bottom-[-10px] right-2 text-3xl text-blue-200/50 leading-none">"</span></div>
                    <button onClick={() => setSignModal(null)} className="w-full bg-blue-600 text-white py-3.5 rounded-md font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"><CheckCircle size={18} /> 开启职业生涯</button>
                 </div>
              </div>
           </div>
        )}
        {showRankModal && <ShowRankModal title={getShowRankTitle(gameState.showTurnCount)} rank={gameState.rank} votes={gameState.stats.votes} voteBreakdown={currentVoteBreakdown} trainees={gameState.trainees} comments={fanComments} highlights={showHighlights} onClose={handleShowRankModalClose} />}
        {eventOutcome && (
           <EventResultModal 
             outcome={eventOutcome} 
             eventType={activeEventType || 'RANDOM'} 
             context={lastEventContext}
             onClose={closeEventResultModal} 
             isAiGenerated={lastEventWasAi}
           />
        )}
        {showGuide && <GuideModal guide={currentGuide} onClose={() => setShowGuide(false)} />}
        {showCardCollection && <CardCollectionModal onClose={() => setShowCardCollection(false)} />}
        {currentEvent && !eventOutcome && (
           <EventChoiceModal event={currentEvent} onOptionSelect={handleEventOption} isLoading={isLoadingAi} loadingTip={loadingTip} />
        )}
        {!currentEvent && !eventOutcome && (
          <div className="space-y-3">
            <div className="bg-white/60 backdrop-blur-md rounded-md p-2.5 shadow-sm border border-white/50 h-24 overflow-y-auto">
               {logs.length === 0 ? <p className="text-gray-500 text-xs italic text-center py-2">新的一季开始了...</p> : <ul className="space-y-1">{logs.slice().reverse().map((l, i) => ( <li key={i} className={`text-xs leading-tight flex items-start gap-1 py-0.5 ${l.includes('⚠️') ? 'text-red-600 font-bold' : 'text-gray-800 font-medium'}`}><span className="shrink-0 mt-[3px] w-1.5 h-1.5 rounded-full bg-blue-400"></span><span>{l.replace(/^\d+岁\d+季度: /, '')}</span></li>))}</ul>}
            </div>
            
            {(gameState.stage === GameStage.AMATEUR && gameState.company === Company.NONE) && (
                (() => {
                    const { vocal, dance, looks, fans } = gameState.stats;
                    const eligible = [];
                    if (vocal >= 60 && looks >= 30 && fans >= 10) eligible.push(Company.COFFEE);
                    if (looks >= 60 && (vocal >= 30 || dance >= 30) && gameState.time.age <= 17) eligible.push(Company.ORIGIN);
                    if (looks >= 60 && dance >=30 && fans >= 60) eligible.push(Company.STARLIGHT);
                    if (vocal >= 60 && dance >= 60 && fans >= 30) eligible.push(Company.AGRAY);
                    if (eligible.length === 0) return null;
                    return (
                    <div className="bg-white/60 backdrop-blur-md p-3 rounded-md border border-purple-100 mb-3 animate-fade-in shadow-sm">
                        <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2 text-sm"><Briefcase size={16} /> 收到经纪公司邀约！</h3>
                        <div className="grid gap-2">
                        {eligible.map(c => (
                            <div key={c} className="bg-white/80 p-3 rounded-md border border-purple-100 flex justify-between items-center shadow-sm">
                                <div><div className="font-bold text-purple-700 text-sm">{COMPANIES[c].name}</div><div className="text-[10px] text-gray-600">{COMPANIES[c].desc} | 福利: {COMPANIES[c].bonus}</div></div>
                                <button onClick={() => signCompany(c)} className="bg-blue-900 text-white text-xs px-3 py-1.5 rounded-md font-bold shadow hover:bg-blue-800 shrink-0 ml-2">签约</button>
                            </div>
                        ))}
                        </div>
                    </div>
                    );
                })()
            )}

            {gameState.stage === GameStage.AMATEUR && !gameState.isSignedUpForShow && gameState.time.age >= 17 && gameState.time.age <= 20 && (
                (() => {
                    const { eq, vocal, dance, looks, fans } = gameState.stats;
                    const skillTotal = vocal + dance;
                    const eqPass = eq >= 40;
                    const hardPass = skillTotal >= 150 || looks >= 100 || fans >= 100;
                    const canSignUp = eqPass && hardPass;
                    return (
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 shadow-lg mb-4 text-white relative overflow-hidden animate-fade-in">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl -mr-6 -mt-6"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div><h3 className="font-black text-lg flex items-center gap-2"><Trophy size={14} className="text-yellow-300" /> 青春404 · 选手招募</h3></div>
                                    <div className="text-right"><div className="text-[10px] font-bold bg-black/30 px-2 py-1 rounded">截止年龄: 20岁</div></div>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2 text-[10px] md:text-xs mb-3 space-y-1">
                                    <div className={`flex items-center gap-1.5 ${eqPass ? 'text-green-300' : 'text-red-300'}`}>{eqPass ? <CheckCircle size={10} /> : <X size={10} />}<span>情商 ≥ 40 (当前: {eq})</span></div>
                                    <div className={`flex items-center gap-1.5 ${hardPass ? 'text-green-300' : 'text-red-300'}`}>{hardPass ? <CheckCircle size={10} /> : <X size={10} />}<span>唱+跳≥150 (当前: {vocal}+{dance}）或 颜值≥100 (当前: {looks})或 粉丝≥100w(当前: {fans}w)</span></div>
                                </div>
                                <button onClick={signUpForShow} disabled={!canSignUp} className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${canSignUp ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300 hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-400/50 text-gray-200 cursor-not-allowed'}`}>{canSignUp ? '立即报名' : '条件未达标'}</button>
                            </div>
                        </div>
                    );
                })()
            )}

            <div>
               <div className="flex justify-between items-center px-2 mb-2">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base"><span>行动安排</span></h3>
                  <div className="bg-white/50 px-3 py-0.5 rounded-full text-sm font-bold text-blue-800 border border-white/40 shadow-sm">AP剩余: {gameState.ap}/{gameState.maxAp}</div>
               </div>
              {(gameState.warnings.health || gameState.warnings.ethics) && (
                  <div className="bg-red-50/90 border border-red-200 rounded-md p-2.5 mb-2.5 text-sm text-red-800 flex items-start gap-2 shadow-sm">
                     <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                     <div className="flex-1">
                        {gameState.warnings.health && <div className="font-bold text-xs">⚠️ 身体已达极限！</div>}
                        {gameState.warnings.health && <div className="text-[10px] mt-0.5 text-red-700">请立即执行行动恢复健康，若再次消耗健康将直接退圈。</div>}
                        {gameState.warnings.ethics && <div className="font-bold text-xs mt-1">⚠️ 心态濒临崩溃！</div>}
                        {gameState.warnings.ethics && <div className="text-[10px] mt-0.5 text-red-700">请不要再消耗道德，若再次消耗道德将直接退圈。</div>}
                     </div>
                  </div>
              )}
              <div className="grid grid-cols-2 gap-2.5 pb-2">
                {(gameState.stage === GameStage.AMATEUR ? AMATEUR_ACTIONS : SHOW_ACTIONS).map(act => {
                  const bgImage = getActionBg(act.id);
                  return (
                    <button key={act.id} onClick={() => handleAction(act)} disabled={gameState.ap < act.apCost || gameState.isGameOver} className={`p-3 rounded-md text-left border shadow-sm relative overflow-hidden min-h-[56px] h-auto flex flex-col justify-center ${gameState.ap < act.apCost ? 'bg-gray-100/80 text-gray-400 border-transparent' : 'bg-white/70 text-gray-800 border-white/50 active:bg-white/90'}`}>
                        {bgImage && <div className="absolute right-0 bottom-0 w-full h-full pointer-events-none opacity-25"><img src={bgImage} alt="" className="w-full h-full object-contain object-right-bottom" /></div>}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 active:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="relative z-10 w-full">
                            <div className="font-bold text-sm mb-0.5 flex justify-between items-center"><span className="whitespace-nowrap">{act.name}</span></div>
                            <div className="text-xs text-gray-500 leading-tight w-full pr-1">{act.description}</div>
                        </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="px-4 py-2.5 bg-white/30 backdrop-blur-md border-t border-white/20 shrink-0">
        <button onClick={nextQuarter} disabled={(gameState.ap > 0 && !currentEvent) || isLoadingAi || !!eventOutcome} className={`w-full py-2.5 rounded-md font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${gameState.ap === 0 ? (isLoadingAi ? 'bg-indigo-400 cursor-wait text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl active:scale-95') : 'bg-white/50 text-gray-400 border border-white/50'}`}>
          {isLoadingAi ? loadingTip : (gameState.ap > 0 ? <><span className="text-sm font-normal">行动点未耗尽</span> <SkipForward size={18} /></> : <>结束本季度 <Play size={18} /></>)}
        </button>
      </footer>
    </div>
  );
}
