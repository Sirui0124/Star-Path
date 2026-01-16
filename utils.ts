
import { Stats, HiddenStats, Trainee } from './types';
import { TRAINEE_NAMES } from './constants';

export const formatEffectLog = (effect: Partial<Stats & HiddenStats>): string => {
  const parts: string[] = [];
  const map: Record<string, string> = {
    vocal: 'Vocal',
    dance: 'Dance',
    looks: '颜值',
    eq: '情商',
    ethics: '道德', // Updated
    health: '健康',
    fans: '粉丝',
    votes: '票数',
    // Removed sincerity and dream
    hotCp: 'CP热度',
    viralMoments: '出圈'
  };

  Object.entries(effect).forEach(([key, val]) => {
    if (typeof val === 'number' && val !== 0 && map[key]) {
      const sign = val > 0 ? '+' : '';
      const unit = (key === 'fans' || key === 'votes') ? '万' : '';
      parts.push(`${map[key]}${sign}${val}${unit}`);
    }
  });

  return parts.join(', ');
};

// Helper for random range
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateTrainees = (count: number): Trainee[] => {
  const trainees: Trainee[] = [];
  // Shuffle names
  const names = [...TRAINEE_NAMES].sort(() => 0.5 - Math.random());
  
  // We need to generate 100 NPCs (User is +1 = 101 total)
  // To make it challenging, we use a tiered system instead of pure random.
  
  for (let i = 0; i < count; i++) {
    let initialVotes = 0;
    let growthTrend = 0;
    const name = names[i] || `练习生${i + 1}`;

    // Tiers Logic
    if (i < 3) {
      // Tier S: "The Whales" (大魔王/回锅肉)
      // High start, High growth. Very hard to beat for Center.
      initialVotes = rand(180, 250); 
      growthTrend = rand(45, 65);
    } else if (i < 12) {
      // Tier A: "Debut Line Contenders" (出道圈守门员)
      // Solid start, Good growth. Player needs to fight these for Top 11.
      initialVotes = rand(120, 170);
      growthTrend = rand(30, 50);
    } else if (i < 35) {
      // Tier B: "Mid-High Tier" (有实力的竞争者)
      initialVotes = rand(60, 110);
      growthTrend = rand(20, 40);
    } else if (i < 60) {
      // Tier C: "Mid Tier" (小透明)
      initialVotes = rand(30, 60);
      growthTrend = rand(10, 25);
    } else {
      // Tier D: "Fodder" (炮灰)
      initialVotes = rand(5, 30);
      growthTrend = rand(5, 15);
    }

    trainees.push({
      id: `npc_${i}`,
      name: name,
      votes: initialVotes,
      trend: growthTrend 
    });
  }

  // Shuffle the result so the strong ones aren't always at the top of the array index (though they will be sorted by votes later)
  return trainees.sort(() => 0.5 - Math.random());
};
