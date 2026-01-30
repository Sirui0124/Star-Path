import { Action, Company } from './types';

// --- Loading Messages ---
export const LOADING_MESSAGES = [
  "经纪人正在疯狂打电话...",
  "正在联系百万修音师...",
  "粉丝后援会正在集资冲榜...",
  "正在挑选红毯战袍...",
  "正在应对营销号的突发爆料...",
  "正在等待热搜降临...",
  "正在练习室挥洒汗水...",
  "正在与导演组激烈沟通...",
  "正在精修路透生图...",
  "正在确认通告行程...",
  "站姐正在上传高清直拍..."
];

// --- Random Player Names ---
export const RANDOM_PLAYER_NAMES = [
  "星河", "沐沐", "张寒", 
  "子墨", "云帆", "艾格", "张瞳孔",
  "予安", "北辰", "Zero", "子涵",
  "星野", "闻屿", "顾迟","Raine","苏遇", "纪寻","陆遥", "江辰"
  
];

// --- Companies ---
export const COMPANIES = {
  [Company.COFFEE]: { name: '咖啡粒文化', desc: '小唱片公司', bonus: '每季 Vocal+10, 粉丝+2w' },
  [Company.ORIGIN]: { name: '原计划', desc: '爱豆型公司', bonus: '每季 颜值+5, 粉丝+10w' },
  [Company.STARLIGHT]: { name: '星华娱乐', desc: '影视资源丰富', bonus: '每季 颜值+10, 情商+3, 粉丝+5w' },
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
    effect: () => ({ ethics: -3, health: -3, looks: 15, sincerity: -5 })
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
    description: '健康-8, Vocal+5, 情商+3, 粉+',
    apCost: 1,
    effect: (state) => ({
      health: -8,
      vocal: 5,
      eq: 3,
      fans: state.stats.fans >= 100 ? rand(8, 12) : rand(3, 5),
      dream: 3
    })
  },
  {
    id: 'social_media',
    name: '社媒运营',
    description: '健康-2, 情商+5, 粉丝+',
    apCost: 1,
    effect: (state) => ({
      health: -2,
      eq: 5,
      fans: state.stats.fans >= 100 ? rand(6, 10) : rand(2, 4)
    })
  }
];

export const SHOW_ACTIONS: Action[] = [
  {
    id: 'show_practice',
    name: '独自苦练（无镜头）',
    description: 'Vocal+10, Dance+10, 票数-5, 概率出圈',
    apCost: 1,
    effect: () => ({
      vocal: 10,
      dance: 10,
      votes: -5,
      dream: 2,
      viralMoments: chance(20) ? 1 : 0
    })
  },
    {
    id: 'show_communicate',
    name: '学员交流（搞好关系）',
    description: '情商+3, 粉丝+, 概率CP',
    apCost: 1,
    effect: () => ({
      eq: +3,
      fans: rand(3,5),
      hotCp: chance(15) ? 1 : 0
    })
  },
    {
    id: 'show_performane',
    name: '公演做妆造',
    description: '颜值+10, 票数+',
    apCost: 1,
    effect: () => ({
      looks: +10,
      votes: rand(3,5),
    })
  },
    {
    id: 'show_looks',
    name: '刻意锐评抢镜头',
    description: '道德-3, 票数++,概率出圈',
    apCost: 1,
    effect: () => ({
      ethics: -3,
      votes: rand(5,10),
      viralMoments: chance(30) ? 1 : 0
    })
  },
  {
    id: 'show_fan_service',
    name: '粉丝营业（媚粉）',
    description: '道德-3,粉丝++, 票数+, 概率出圈',
    apCost: 1,
    effect: () => ({
      fans: rand(5, 10),
      votes: rand(3, 8),
      ethics: -3,
      viralMoments: chance(15) ? 1 : 0
    })
  },
  {
    id: 'show_social',
    name: '炒CP（有机会大爆）',
    description: '道德-10,粉丝++,票数++,大概率CP',
    apCost: 1,
    effect: () => ({
      ethics: -10,
      fans:chance(15)? 10: rand(5,8),
      votes: chance(15)? 20 : rand(8,12),
      hotCp: chance(30) ? 1 : 0
    })
  }
];

export const SOCIAL_FEEDBACKS = {
  GENERAL: [
    { type: 'WEIBO', sender: '吃瓜路人', content: '有一说一，这波操作确实有点意思。' },
    { type: 'WEIBO', sender: '颜狗', content: '虽然但是，脸是好看的。' },
    { type: 'WEIBO', sender: '路人甲', content: '这是谁？最近老刷到。' },
    { type: 'WEIBO', sender: '营销号', content: '据知情人士爆料，这位很有野心。' },
    { type: 'WEIBO', sender: '互联网嘴替', content: '笑死我了，这是什么展开？' },
    { type: 'WEIBO', sender: '柠檬精', content: '这就红了？我不理解。' }
  ],
  FAMILY: [
    { type: 'WECHAT', sender: '妈妈', content: '宝贝，看了你的节目，瘦了好多，心疼。' },
    { type: 'WECHAT', sender: '爸爸', content: '钱够花吗？不够跟爸说。' },
    { type: 'WECHAT', sender: '表妹', content: '姐！帮我要个签名照！我同学都想要！' },
    { type: 'WECHAT', sender: '奶奶', content: '乖孙，什么时候回来吃饭啊？' },
    { type: 'WECHAT', sender: '大姨', content: '在电视上看到你了，真出息了！' }
  ],
  COMPANY: [
    { type: 'WECHAT', sender: '经纪人', content: '最近数据不错，继续保持这个势头。' },
    { type: 'WECHAT', sender: '宣发组', content: '这波热搜很及时，正在跟进话题。' },
    { type: 'WECHAT', sender: '老板', content: '好好练，公司看好你。' },
    { type: 'WECHAT', sender: '助理', content: '明天的行程表发你了，记得确认。' },
    { type: 'WECHAT', sender: '运营', content: '记得发微博营业，别冷落了粉丝。' }
  ]
};