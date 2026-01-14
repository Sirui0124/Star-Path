
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

export interface Stats {
  vocal: number;
  dance: number;
  looks: number;
  eq: number;
  morale: number; // 道德
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
  base: number;
  action: number;
  bonus: number;
  total: number;
}

export interface GameState {
  stats: Stats;
  hiddenStats: HiddenStats;
  time: GameTime;
  stage: GameStage;
  company: Company;
  ap: number; // Action Points
  maxAp: number;
  history: string[]; 
  
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
    morale: boolean;
  };
}

export interface ActionEffect {
  vocal?: number;
  dance?: number;
  looks?: number;
  eq?: number;
  morale?: number;
  health?: number;
  fans?: number; // range [min, max] or fixed
  votes?: number;
  sincerity?: number;
  dream?: number;
  hotCp?: number;
  viralMoments?: number;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  apCost: number;
  effect: (currentStats: GameState) => Partial<ActionEffect>; // Returns changes
  condition?: (state: GameState) => boolean;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  trigger: (state: GameState) => boolean;
  options: {
    text: string;
    effect: (state: GameState) => Partial<Stats>;
    log: string;
  }[];
}
