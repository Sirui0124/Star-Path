import { Stats, HiddenStats, Trainee } from './types';
import { TRAINEE_NAMES } from './constants';

export const formatEffectLog = (effect: Partial<Stats & HiddenStats>): string => {
  const parts: string[] = [];
  const map: Record<string, string> = {
    vocal: 'Vocal',
    dance: 'Dance',
    looks: '颜值',
    eq: '情商',
    morale: '道德',
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

export const generateTrainees = (count: number): Trainee[] => {
  const trainees: Trainee[] = [];
  // Shuffle names
  const names = [...TRAINEE_NAMES].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < count; i++) {
    trainees.push({
      id: `npc_${i}`,
      name: names[i] || `练习生${i + 1}`,
      votes: Math.floor(Math.random() * 50) + 10, // Initial votes
      trend: Math.random() * 20 + 5 // Growth potential
    });
  }
  return trainees;
};