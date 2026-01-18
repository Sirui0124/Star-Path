
export enum GameStage {
  AMATEUR = 'AMATEUR', // 素人/练习生
  SHOW = 'SHOW',       // 选秀中
  ENDED = 'ENDED'      // 结局
}

export enum Company {
  NONE = 'NONE',
  COFFEE = 'COFFEE',      // 咖啡粒文化
  ORIGIN = 'ORIGIN',      // 原计划
  STARLIGHT = 'STARLIGHT',// 星华娱乐
  AGRAY = 'AGRAY'         // 艾灰音乐
}

export type Gender = 'male' | 'female';

export interface Stats {
  vocal: number;
  dance: number;
  looks: number;
  eq: number;
  ethics: number; // 道德
  health: number;
  fans: number; // 单位：万
  votes: number; // 单位：万 (404阶段)
}

export interface HiddenStats {
  sincerity: number; // 真诚
  dream: number;     // 梦想
  hotCp: number;     // 大热CP计数
  viralMoments: number; // 出圈镜头计数
}

export interface GameTime {
  year: number;   // 相对年份，从1开始
  quarter: 1 | 2 | 3 | 4; // 1:春, 2:夏, 3:秋, 4:冬
  age: number;
}

export interface Trainee {
  id: string;
  name: string;
  votes: number;
  trend: number; // base growth rate
}

export interface VoteBreakdown {
  fansVote: number;    // 粉丝打投
  stagePool: number;   // 本赛段额外票池
  publicAppeal: number;// 路人盘 (实力/颜值)
  bonus: number;       // 额外 (CP/出圈)
  total: number;       // 本轮新增总计
}

export interface GameState {
  name: string; // Player name
  gender: Gender;
  dreamLabel: string; // User selected dream text

  stats: Stats;
  hiddenStats: HiddenStats;
  time: GameTime;
  stage: GameStage;
  company: Company;
  ap: number; // Action Points
  maxAp: number;
  history: string[]; 
  
  // New: Track triggered events to prevent duplication
  triggeredEventIds: string[];
  
  // New: Narrative Flags for Card Unlocking (e.g. { "script_candy": true })
  flags: Record<string, boolean>;

  // Show specific logic
  isSignedUpForShow: boolean; // 是否已报名等待明年春季
  showTurnCount: number; // Tracks turns inside the show (max 4)
  rank: number; // Current rank in show
  trainees: Trainee[]; // Pool of competitors
  
  isGameOver: boolean;
  gameResult?: string;

  // Warnings for critical stats
  warnings: {
    health: boolean;
    ethics: boolean;
  };
}

export interface ActionEffect {
  vocal?: number;
  dance?: number;
  looks?: number;
  eq?: number;
  ethics?: number;
  health?: number;
  fans?: number; // range [min, max] or fixed
  votes?: number;
  sincerity?: number;
  dream?: number;
  hotCp?: number;
  viralMoments?: number;
  
  // New: Ability to set flags via actions/events
  flags?: Record<string, boolean>;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  apCost: number;
  effect: (currentStats: GameState) => Partial<ActionEffect>; // Returns changes
  condition?: (state: GameState) => boolean;
}

export type EventType = 'SOCIAL' | 'RANDOM' | 'SHOW';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  stage: GameStage | 'ALL'; // Restrict event to specific stage
  isMandatory: boolean; // If true, it MUST happen if triggered. If false, it competes in the random pool.
  repeatable?: boolean; // If true, this event can happen multiple times. Defaults to false.
  
  // Control Flag: If false, use hardcoded options.effect and options.log for the result.
  // AI will only be used for social comments (best effort).
  // Default is true (AI controls outcome).
  useAiForOutcome?: boolean; 

  trigger: (state: GameState) => boolean;
  options: {
    text: string;
    // Allow effect to return an optional log string for dynamic narratives
    effect: (state: GameState) => Partial<ActionEffect> & { log?: string }; 
    log?: string; // Static Fallback log
  }[];
}

// New Interface for AI Event Results
export interface EventOutcome {
  narrative: string;
  changes: Partial<Stats & HiddenStats>;
  socialType: 'WECHAT' | 'WEIBO' | 'SYSTEM';
  socialSender: string; // e.g., "经纪人", "吃瓜路人", "系统"
  socialContent: string;
}
