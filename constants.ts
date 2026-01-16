
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
  "星河", "沐沐", "小七", "阿光", "张寒", "Kiki", "Alex", "Max",
  "子墨", "云帆", "知夏", "乐天", "艾格", "张瞳孔", "Rain", 
  "予安", "清欢", "北辰", "南笙", "Zero", "子涵"
];

// --- Companies ---
export const COMPANIES = {
  [Company.COFFEE]: { name: '咖啡粒文化', desc: '小唱片公司', bonus: '每季 Vocal+10, 粉丝+2w' },
  [Company.ORIGIN]: { name: '原计划', desc: '爱豆型公司', bonus: '每季 颜值+5, 粉丝+10w' },
  [Company.STARLIGHT]: { name: '星华娱乐', desc: '影视资源丰富', bonus: '每季 颜值+10, 情商+5, 粉丝+5w' },
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
    description: '健康-8, Vocal+5, 情商+3, 粉丝+',
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
      fans: state.stats.fans >= 100 ? rand(8, 12) : rand(3, 5)
    })
  }
];

export const SHOW_ACTIONS: Action[] = [
  {
    id: 'show_practice',
    name: '独自苦练（无镜头）',
    description: 'Vocal+5,Dance+5,票数--, 概率出圈',
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
    description: '健康+10, 粉丝/票数下降',
    apCost: 1,
    effect: () => ({
      health: 15,
      fans: -rand(1, 3),
      votes: -3
    })
  },
  {
    id: 'show_makeup',
    name: '化妆造型',
    description: '健康-2, 颜值+8, 票数+2, 粉丝+',
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
    name: '帮助他人',
    description: '道德+10, 情商+3, 随机能力-5',
    apCost: 1,
    effect: () => ({
      ethics: 10,
      eq: 3,
      vocal: Math.random() > 0.5 ? -5 : 0,
      dance: Math.random() <= 0.5 ? -5 : 0,
    })
  },
  {
    id: 'show_vlog',
    name: '录制Vlog',
    description: '健康-5, 粉丝+5, 票数+8, 概率出圈',
    apCost: 1,
    effect: () => ({
      health: -5,
      fans: 5,
      votes: 8,
      viralMoments: chance(10) ? 1 : 0,
      sincerity: 2
    })
  },
  {
    id: 'show_camera',
    name: '抢镜头',
    description: '健康-5, 道德-5, 票数++',
    apCost: 1,
    effect: () => ({
      health: -5,
      ethics: -5,
      votes: chance(25) ? rand(20,30) : rand(5,10),
      sincerity: -5
    })
  },
  {
    id: 'show_cp',
    name: '炒CP',
    description: '健康-5, 道德-10, 粉丝++, 票数++',
    apCost: 2,
    effect: () => ({
      health: -5,
      ethics: -10,
      fans: chance(25) ? rand(10, 20) : rand(3, 8),
      votes: chance(25) ? rand(20,30) : rand(5,10),
      sincerity: -10,
      hotCp: chance(15) ? 1 : 0
    })
  }
];

// --- Social Feedback Library (Male Idol Context) ---
// Expanded with diverse archetypes
export const SOCIAL_FEEDBACKS = {
  // 1. General Fans (WEIBO) - Mixed Archetypes
  GENERAL: [
    // Visuals (颜狗)
    { type: 'WEIBO', sender: '颜狗', content: '这张脸是真实存在的吗？女娲毕设！' },
    { type: 'WEIBO', sender: '颜粉', content: '帅得我神魂颠倒，今天的造型师必须加鸡腿！' },
    { type: 'WEIBO', sender: '路人', content: '纯路人，这小哥哥长得有点东西，垂直入坑了。' },
    { type: 'WEIBO', sender: '颜狗', content: '杀疯了杀疯了！这个眼神杀我！' },

    // Girlfriend Fans (女友粉 - 老公/男友)
    { type: 'WEIBO', sender: '女友粉', content: '老公！今天的自拍我直接存做壁纸！' },
    { type: 'WEIBO', sender: '女友粉', content: '什么时候来娶我？民政局我搬来了。' },
    { type: 'WEIBO', sender: '梦女', content: '这是我素未谋面的男朋友，谢谢大家。' },
    { type: 'WEIBO', sender: '女友粉', content: '命给你！都给你！' },

    // Mom Fans (妈粉 - 崽崽/儿砸/宝宝)
    { type: 'WEIBO', sender: '妈粉', content: '崽崽太瘦了，妈妈心疼，多吃点！' },
    { type: 'WEIBO', sender: '亲妈粉', content: '宝宝真棒！妈妈为你骄傲！' },
    { type: 'WEIBO', sender: '妈粉', content: '在外面要照顾好自己，别太累了乖乖。' },

    // Career Fans (事业粉 - 全名/哥哥/ACE)
    { type: 'WEIBO', sender: '事业粉', content: '这眼神绝了，内娱紫微星预定！' },
    { type: 'WEIBO', sender: 'i舞台', content: '这身段，这卡点，全能ACE入股不亏！' },
    { type: 'WEIBO', sender: '数据粉', content: '别废话了，做数据去！送哥哥出道！' },
    { type: 'WEIBO', sender: '事业批', content: '请保持这个搞事业的节奏，不要停！' },

    // Internet Slang / Funny (搞笑/路人)
    { type: 'WEIBO', sender: '泥塑粉', content: '嗨，老婆！(bushi) 真的好美。' },
    { type: 'WEIBO', sender: '吃瓜群众', content: '有点意思，前排占座吃瓜。' },
    { type: 'WEIBO', sender: '某网友', content: '这不比博人传燃？' },
    { type: 'WEIBO', sender: '路人', content: '虽然不追星，但这图我存了。' },
    { type: 'WEIBO', sender: '氪金粉', content: '钱包准备好了，什么时候出周边？' },
    { type: 'WEIBO', sender: '营销号', content: '网传某练习生又有新动作，这波怎么看？' },
  ],
  
  // 2. Family & Friends (WECHAT)
  FAMILY: [
    { type: 'WECHAT', sender: '妈妈', content: '宝贝，天冷了记得穿秋裤，别只要风度。' },
    { type: 'WECHAT', sender: '爸爸', content: '钱够不够花？不够跟爸说。' },
    { type: 'WECHAT', sender: '老同学', content: '苟富贵，勿相忘啊兄弟！' },
    { type: 'WECHAT', sender: '发小', content: '下次回来请你吃烧烤，别太拼了。' },
    { type: 'WECHAT', sender: '表妹', content: '哥！我同学想要你的签名照！' },
  ],
  
  // 3. Company & Staff (WECHAT) - Only if Signed
  COMPANY: [
    { type: 'WECHAT', sender: '经纪人', content: '这波热度维持得不错，继续保持人设。' },
    { type: 'WECHAT', sender: '经纪人', content: '注意表情管理！别被截图做成表情包。' },
    { type: 'WECHAT', sender: '宣传总监', content: '热搜已经安排上了，配合发条微博。' },
    { type: 'WECHAT', sender: '生活助理', content: '明早5点通告，车在楼下等你。' },
    { type: 'WECHAT', sender: '老板', content: '好好干，公司不会亏待你。' },
    { type: 'WECHAT', sender: '选管', content: '后台这边准备一下，马上轮到你了。' },
  ]
};
