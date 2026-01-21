
import { GameState, Company } from '../types';
import { STORY_IMAGES } from './images';

export interface UnlockableCard {
  id: string;
  title: string;
  description: string;
  unlockText: string;
  image: string;
  rarity: 'R' | 'SR' | 'SSR' | 'UR';
  condition: (state: GameState) => boolean;
}

export const ALL_CARDS: UnlockableCard[] = [
  // --- EXISTING CARDS (1-12) ---
  {
    id: 'ending_center',
    title: '绝对C位',
    description: '在选秀中以第1名的成绩断层出道。',
    unlockText: '你就是舞台上唯一的神！',
    image: STORY_IMAGES.card_1,
    rarity: 'UR',
    condition: (s) => s.rank === 1 && s.gameResult?.includes('C位')
  },
  {
    id: 'ending_group',
    title: '最终成团',
    description: '以第2-11名的成绩成功出道。',
    unlockText: '聚是一团火，星途璀璨。',
    image: STORY_IMAGES.card_2,
    rarity: 'SR',
    condition: (s) => s.rank > 1 && s.rank <= 11 && s.gameResult?.includes('成团')
  },
  {
    id: 'trait_looks',
    title: '脸蛋天才',
    description: '结局时颜值 > 200。',
    unlockText: '这张脸就值得一个出道位，女娲炫技之作。',
    image: STORY_IMAGES.card_3,
    rarity: 'SR',
    condition: (s) => s.stats.looks > 200
  },
  {
    id: 'trait_villain',
    title: '黑红顶流',
    description: '粉丝 > 200w 且 道德 <= 10。',
    unlockText: '虽然全网黑，但架不住你红啊。坏女人/坏男人剧本最带感了。',
    image: STORY_IMAGES.card_4,
    rarity: 'SR',
    condition: (s) => s.stats.fans > 200 && s.stats.ethics <= 10
  },
  {
    id: 'trait_angel',
    title: '人间天使',
    description: '在【深夜私信】事件中选择认真回复。',
    unlockText: '世界匆忙，但你留下的星光，成为了他人绝境中的黎明。有个小歌手也和你做了一样的选择。',
    image: STORY_IMAGES.card_5,
    rarity: 'SSR',
    condition: (s) => !!s.flags['angel_reply']
  },
  {
    id: 'trait_cp',
    title: '国民CP',
    description: 'CP热度 >= 4。',
    unlockText: '我是假的，但我的CP是真的！民政局给你们搬来了。',
    image: STORY_IMAGES.card_6,
    rarity: 'SR',
    condition: (s) => s.hiddenStats.hotCp >= 4
  },
  {
    id: 'trait_viral',
    title: '热搜包年',
    description: '出圈名场面 >= 4。',
    unlockText: '你站在那里就是话题中心，营销号的衣食父母。',
    image: STORY_IMAGES.card_7,
    rarity: 'SR',
    condition: (s) => s.hiddenStats.viralMoments >= 4
  },
  {
    id: 'trait_skill',
    title: '全能ACE',
    description: 'Vocal+Dance>300，且颜值>150。',
    unlockText: '无短板的六边形战士，内娱有你了不起。',
    image: STORY_IMAGES.card_8,
    rarity: 'SSR',
    condition: (s) => s.stats.vocal+s.stats.dance > 300&& s.stats.looks > 150
  },
  {
    id: 'ending_rich',
    title: '打了个酱油',
    description: '参加选秀但低位的酱油选手。',
    unlockText: '混不好就要回去继承亿万家产了，真可怜（bushi）。',
    image: STORY_IMAGES.card_9,
    rarity: 'R',
    condition: (s) => s.rank > 50 && s.rank <=101 && s.gameResult?.includes('淘汰')
  },
  {
    id: 'trait_eq',
    title: '端水大师',
    description: '结局时情商 > 80。',
    unlockText: '见人说人话，见鬼说鬼话，这情商建议出书。',
    image: STORY_IMAGES.card_10,
    rarity: 'R',
    condition: (s) => s.stats.eq > 80
  },
  {
    id: 'ending_solo',
    title: '独美Solo',
    description: '未成团但成功Solo出道。',
    unlockText: '既然不能融入群体，那就独自闪耀吧。',
    image: STORY_IMAGES.card_11,
    rarity: 'SR',
    condition: (s) => s.gameResult?.includes('Solo')
  },
  {
    id: 'trait_dumb',
    title: '笨蛋美人',
    description: '颜值 > 100 且 (情商 < 40 或 Vocal+Dance < 80)。',
    unlockText: '上帝为你打开了颜值的门，顺手把脑子的窗关得死死的。',
    image: STORY_IMAGES.card_12,
    rarity: 'R',
    condition: (s) => s.stats.looks > 100 && (s.stats.eq < 40 || s.stats.vocal + s.stats.dance < 80)
  },

  // --- NEW CARDS (13-18) ---
  
  // 13. Health Failure
  {
    id: 'ending_sick',
    title: '病弱离场',
    description: '因健康值耗尽被迫退圈。',
    unlockText: '身体是革命的本钱，星途虽好，但健康更重要。好好休息吧。',
    image: STORY_IMAGES.card_13,
    rarity: 'R',
    condition: (s) => s.stats.health <= 0
  },

  // 14. Ethics Failure
  {
    id: 'ending_bad',
    title: '法制咖',
    description: '因道德值耗尽被封杀。',
    unlockText: '学艺先学德。哪怕红极一时，踩了底线也只能凉凉。',
    image: STORY_IMAGES.card_14,
    rarity: 'R',
    condition: (s) => s.stats.ethics <= 0
  },

  // 15. Accidental/Age Failure
  {
    id: 'ending_missed',
    title: '不可抗力',
    description: '因年龄限制或未报名等意外因素遗憾离场。',
    unlockText: '有时候，错过也是一种命运。',
    image: STORY_IMAGES.card_15,
    rarity: 'R',
    condition: (s) => s.stats.health > 0 && s.stats.ethics > 0 && (s.gameResult?.includes('年龄') || s.gameResult?.includes('错过'))
  },

  // 16. Event: Candy Super Sweet
  {
    id: 'script_candy',
    title: '糖果超甜',
    description: '在初评级中触发了【糖果超甜】祭天剧本。',
    unlockText: '虽然有点油腻，但至少让观众记住了你！黑红也是红嘛。',
    image: STORY_IMAGES.card_16,
    rarity: 'SR',
    condition: (s) => !!s.flags['script_candy']
  },

  // 17. Event: Defying Fate
  {
    id: 'script_reverse',
    title: '逆天改命',
    description: '拿了【糖果超甜】剧本，最后却依然成团出道。',
    unlockText: '谁说祭天剧本就不能翻盘？我命由我不由天！',
    image: STORY_IMAGES.card_17,
    rarity: 'UR',
    condition: (s) => !!s.flags['script_candy'] && s.rank <= 11
  },

  // 18. Dream: Stage King
  {
    id: 'dream_king',
    title: '特别的星',
    description: '选择了【灵魂歌手】梦想+【咖啡粒文化】，在【决赛圈出道】，且【深夜私信】事件中选择认真回复。',
    unlockText: '愿他星途璀璨。',
    image: STORY_IMAGES.card_18,
    rarity: 'UR',
    condition: (s) => s.dreamLabel === '灵魂歌手' && s.company === Company.COFFEE && s.rank <= 25 && !!s.flags['angel_reply']
  },

  // 19. Honest Person
  {
    id: 'trait_honest',
    title: '老实人',
    description: '比赛期间从未做过【刻意锐评】、【粉丝营业】、【炒CP】三个减道德的行动，且成功出道。',
    unlockText: '在这个大染缸里，你的干净显得格格不入，却又无比珍贵。',
    image: STORY_IMAGES.card_19,
    rarity: 'SSR',
    condition: (s) => {
        const debuted = s.gameResult?.includes('成团') || s.gameResult?.includes('Solo') || s.gameResult?.includes('C位');
        if (!debuted) return false;
        // The exact names from constants.ts are: '刻意锐评抢镜头', '粉丝营业（媚粉）', '炒CP（有机会大爆）'
        const badActions = ['刻意锐评抢镜头', '粉丝营业（媚粉）', '炒CP（有机会大爆）'];
        const hasBadAction = s.history.some(log => badActions.some(act => log.includes(`执行 [${act}]`)));
        return !hasBadAction;
    }
  },

  // 20. Pure Strength
  {
    id: 'trait_pure_strength',
    title: '凭实力说话',
    description: '比赛期间 CP热度+出圈次数 为0，且成功出道。',
    unlockText: '没有花哨的剧本，没有热闹的CP，你站在那里，就是底气。',
    image: STORY_IMAGES.card_20,
    rarity: 'SR',
    condition: (s) => {
        const debuted = s.gameResult?.includes('成团') || s.gameResult?.includes('Solo') || s.gameResult?.includes('C位');
        return debuted && (s.hiddenStats.hotCp + s.hiddenStats.viralMoments === 0);
    }
  }
];
