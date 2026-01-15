
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
  "星河", "沐沐", "小七", "阿光", "Yuna", "Kiki", "Alex", "Max",
  "子墨", "云帆", "知夏", "乐天", "Coco", "Vivi", "Rain", 
  "予安", "清欢", "北辰", "南笙", "Zero"
];

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
      morale: 10,
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
      morale: -5,
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
      morale: -10,
      fans: chance(25) ? rand(10, 20) : rand(3, 8),
      votes: chance(25) ? rand(20,30) : rand(5,10),
      sincerity: -10,
      hotCp: chance(15) ? 1 : 0
    })
  }
];
