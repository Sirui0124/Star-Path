import { Action, Company, GameEvent, GameState, GameStage } from './types';

// --- Companies ---
export const COMPANIES = {
  [Company.COFFEE]: { name: '咖啡粒文化', desc: '小唱片公司', bonus: '每季 Vocal+10, 粉丝+5w' },
  [Company.ORIGIN]: { name: '原计划', desc: '爱豆型公司', bonus: '每季 颜值+5, 粉丝+10w' },
  [Company.STARLIGHT]: { name: '星华娱乐', desc: '影视资源丰富', bonus: '每季 颜值+5, 情商+5' },
  [Company.AGRAY]: { name: '艾灰音乐', desc: '头部音乐公司', bonus: '每季 Vocal+5, Dance+5, 粉丝+10w' },
};

// --- NPC Names ---
export const TRAINEE_NAMES = [
  "林星河", "苏沐", "陈子默", "顾云帆", "陆白", "叶修", "白敬", "江辰", "沈清秋", "洛冰河",
  "魏无羡", "蓝忘机", "花城", "谢怜", "贺玄", "师青玄", "权一真", "引玉", "裴茗", "风信",
  "慕情", "君吾", "梅念卿", "戚容", "谷子", "郎千秋", "半月", "刻磨", "裴宿", "宣璇",
  "灵文", "雨师篁", "师无渡", "明仪", "阿昭", "郎莹", "小彭头", "天眼开", "地师", "水师",
  "风师", "雷师", "电师", "雨师", "火师", "木师", "土师", "金师", "水神", "火神",
  "Kiki", "Momo", "Sana", "Mina", "Lisa", "Jennie", "Rose", "Jisoo", "Wendy", "Irene",
  "Seulgi", "Joy", "Yeri", "Karina", "Winter", "Giselle", "Ningning", "Wonyoung", "Yujin", "Gaeul",
  "Rei", "Liz", "Leeseo", "Minji", "Hanni", "Danielle", "Haerin", "Hyein", "Sakura", "Chaewon",
  "Yunjin", "Kazuha", "Eunchae", "Soyeon", "Miyeon", "Minnie", "Yuqi", "Shuhua", "Nayeon", "Jeongyeon"
];

// --- Actions ---

// Helper for random range
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (percent: number) => Math.random() * 100 < percent;

export const AMATEUR_ACTIONS: Action[] = [
  {
    id: 'train_vocal',
    name: '练声乐',
    description: '健康-5, Vocal+10',
    apCost: 1,
    effect: () => ({ health: -5, vocal: 10 })
  },
  {
    id: 'train_dance',
    name: '练舞蹈',
    description: '健康-5, Dance+10',
    apCost: 1,
    effect: () => ({ health: -5, dance: 10 })
  },
  {
    id: 'plastic_surgery',
    name: '医美',
    description: '道德-3, 健康-3, 颜值+15',
    apCost: 1,
    effect: () => ({ morale: -3, health: -3, looks: 15, sincerity: -5 })
  },
  {
    id: 'gym',
    name: '健身',
    description: '健康+10, 随机Vocal/Dance-2',
    apCost: 1,
    effect: () => ({
      health: 10,
      vocal: Math.random() > 0.5 ? -2 : 0,
      dance: Math.random() <= 0.5 ? -2 : 0,
      dream: 2
    })
  },
  {
    id: 'street_perform',
    name: '街头演出',
    description: '健康-8, Vocal+5, 情商+3, 粉丝UP',
    apCost: 1,
    effect: () => ({
      health: -8,
      vocal: 5,
      eq: 3,
      fans: chance(30) ? 10 : rand(3, 5),
      dream: 3
    })
  },
  {
    id: 'social_media',
    name: '社媒运营',
    description: '健康-2, 情商+5, 粉丝UP',
    apCost: 1,
    effect: (state) => ({
      health: -2,
      eq: 5,
      fans: state.stats.fans >= 100 ? rand(8, 12) : rand(3, 5)
    })
  }
];

export const SHOW_ACTIONS: Action[] = [
  {
    id: 'show_practice',
    name: '练习室(高强度)',
    description: 'Vocal/Dance+10, 粉丝/票数下降, 概率出圈',
    apCost: 1,
    effect: () => ({
      vocal: 10,
      dance: 10,
      fans: -rand(2, 4),
      votes: -3,
      dream: 2,
      viralMoments: chance(20) ? 1 : 0
    })
  },
  {
    id: 'show_rest',
    name: '补觉休息',
    description: '健康+15, 粉丝/票数下降',
    apCost: 1,
    effect: () => ({
      health: 15,
      fans: -rand(2, 4),
      votes: -3
    })
  },
  {
    id: 'show_makeup',
    name: '化妆造型',
    description: '健康-2, 颜值+8, 票数+2, 概率涨粉',
    apCost: 1,
    effect: () => ({
      health: -2,
      looks: 8,
      votes: 2,
      fans: chance(20) ? rand(3, 6) : rand(0, 2)
    })
  },
  {
    id: 'show_help',
    name: '帮助朋友',
    description: '道德+10, 随机能力-5',
    apCost: 1,
    effect: () => ({
      morale: 10,
      vocal: Math.random() > 0.5 ? -5 : 0,
      dance: Math.random() <= 0.5 ? -5 : 0,
    })
  },
  {
    id: 'show_vlog',
    name: '录制Vlog',
    description: '健康-5, 情商+6, 粉丝+5, 票数+8, 概率出圈',
    apCost: 1,
    effect: () => ({
      health: -5,
      eq: 6,
      fans: 5,
      votes: 8,
      viralMoments: chance(10) ? 1 : 0
    })
  },
  {
    id: 'show_camera',
    name: '抢镜头',
    description: '健康-5, 道德-5, 情商+8, 粉丝+5',
    apCost: 1,
    effect: () => ({
      health: -5,
      morale: -5,
      eq: 8,
      fans: 5,
      sincerity: -5
    })
  },
  {
    id: 'show_cp',
    name: '炒CP',
    description: '健康-5, 道德-8, 颜值+2, 情商+8, 票数大涨',
    apCost: 1,
    effect: () => ({
      health: -5,
      morale: -8,
      looks: 2,
      eq: 8,
      fans: chance(25) ? rand(10, 20) : rand(3, 8),
      votes: chance(25) ? 30 : 10,
      sincerity: -10,
      hotCp: chance(15) ? 1 : 0
    })
  }
];

// --- Events ---
export const EVENTS: GameEvent[] = [
  {
    id: 'scandal_rumor',
    title: '网络谣言',
    description: '有人在论坛爆料你初中时的黑历史（真假难辨）。',
    trigger: (s) => s.stats.fans > 50 && chance(30),
    options: [
      { text: '发律师函', effect: () => ({ morale: 5, fans: -5 }), log: '你选择了强硬回击，虽然流失了部分粉丝，但维护了尊严。' },
      { text: '冷处理', effect: () => ({ eq: 5, fans: 0 }), log: '你选择冷处理，谣言随着时间慢慢平息。' },
      { text: '卖惨澄清', effect: () => ({ sincerity: -5, fans: 10 }), log: '你哭着开了直播，粉丝心疼不已，但也失去了部分路人缘。' }
    ]
  },
  {
    id: 'street_scout',
    title: '星探搭讪',
    description: '在便利店买关东煮时，一个戴墨镜的大叔递给你名片。',
    trigger: (s) => s.stage === GameStage.AMATEUR && s.stats.looks > 50 && chance(20),
    options: [
      { text: '礼貌收下', effect: () => ({ eq: 5 }), log: '你礼貌收下名片，增加了社会经验。' },
      { text: '当场拒绝', effect: () => ({ morale: 5 }), log: '你警惕地拒绝了，安全第一。' },
      { text: '热情攀谈', effect: () => ({ eq: -5, dream: 5 }), log: '你太热情了，对方反而有点被吓到。' }
    ]
  },
  {
    id: 'school_festival',
    title: '校园艺术节',
    description: '学校举办艺术节，班长希望你报名一个节目。',
    trigger: (s) => s.stage === GameStage.AMATEUR && s.time.quarter === 3 && chance(50),
    options: [
      { text: '独唱歌曲', effect: () => ({ vocal: 10, fans: 2 }), log: '你的歌声惊艳了全校，收获了第一批迷妹。' },
      { text: '热舞开场', effect: () => ({ dance: 10, fans: 2 }), log: '你的舞蹈点燃了全场气氛！' },
      { text: '婉拒', effect: () => ({ health: 5 }), log: '你选择在台下为同学鼓掌，度过了轻松的一天。' }
    ]
  },
  {
    id: 'viral_video',
    title: '意外走红',
    description: '路人随手拍的你练习室的视频在短视频平台火了。',
    trigger: (s) => s.stats.dance > 80 && chance(10),
    options: [
      { text: '趁热打铁开直播', effect: () => ({ fans: 20, health: -5 }), log: '你抓住机会吸了一大波粉。' },
      { text: '保持神秘', effect: () => ({ looks: 5, dream: 5 }), log: '你的神秘感让大家对你更好奇了。' }
    ]
  },
  {
    id: 'late_night_practice',
    title: '深夜练习',
    description: '练习室的灯只剩下你这一盏。',
    trigger: (s) => s.stage === GameStage.SHOW && s.stats.health > 60 && chance(40),
    options: [
      { text: '坚持到底', effect: () => ({ vocal: 5, dance: 5, health: -10, dream: 5 }), log: '你练到了凌晨，看着镜子里的自己，眼神更加坚定了。' },
      { text: '回去休息', effect: () => ({ health: 5 }), log: '懂得休息也是一种能力。' }
    ]
  },
  {
    id: 'evil_editing',
    title: '恶魔剪辑',
    description: '节目组把你发呆的镜头剪辑成了对导师翻白眼。',
    trigger: (s) => s.stage === GameStage.SHOW && chance(25),
    options: [
      { text: '找选管理论', effect: () => ({ eq: -5, morale: 5 }), log: '你据理力争，但得罪了节目组。' },
      { text: '忍气吞声', effect: () => ({ eq: 5, health: -5, dream: -5 }), log: '你默默忍受了委屈，压力很大。' },
      { text: '自黑解围', effect: () => ({ fans: 5, eq: 10 }), log: '你在Vlog里模仿自己的表情包，高情商化解了危机。' }
    ]
  },
  {
    id: 'fan_gift',
    title: '粉丝的礼物',
    description: '收到了一封手写的长信和一盒润喉糖。',
    trigger: (s) => s.stats.fans > 10 && chance(30),
    options: [
      { text: '认真回信', effect: () => ({ fans: 5, sincerity: 10 }), log: '你真诚地回复了粉丝。' },
      { text: '分享给室友', effect: () => ({ eq: 5, health: 5 }), log: '你和室友分享了这份温暖。' }
    ]
  },
  {
    id: 'reality_check',
    title: '现实的打击',
    description: '同期的练习生因为家里有钱，直接空降了出道位。',
    trigger: (s) => s.stage === GameStage.AMATEUR && s.stats.eq < 30 && chance(20),
    options: [
      { text: '愤愤不平', effect: () => ({ morale: 5, eq: -5 }), log: '你发了朋友圈吐槽，被经纪人批评了。' },
      { text: '更加努力', effect: () => ({ vocal: 5, dance: 5, dream: 10 }), log: '你把不甘心化为了动力。' }
    ]
  }
];