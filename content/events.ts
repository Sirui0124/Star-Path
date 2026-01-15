
import { GameEvent, GameStage } from '../types';

// Helper for randomness
const chance = (percent: number) => Math.random() * 100 < percent;

export const ALL_EVENTS: GameEvent[] = [
  // =================================================================
  // 1. GENERIC SOCIAL EVENTS (Always Available)
  // =================================================================
  {
    id: 'social_daily_vlog',
    type: 'SOCIAL',
    title: '练习室日常',
    description: '今天的练习结束了，拍张满头大汗的照片记录一下吧。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '配文：凌晨三点的月亮', effect: () => ({ fans: 1, dream: 1 }), log: '感动了自己也感动了粉丝。' },
      { text: '配文：打卡下班！', effect: () => ({ fans: 1, morale: 1 }), log: '元气满满。' },
      { text: '纯发图不说话', effect: () => ({ looks: 1 }), log: '高冷人设屹立不倒。' }
    ]
  },
  {
    id: 'social_food_share',
    type: 'SOCIAL',
    title: '放纵餐分享',
    description: '难得的休息日，去吃了一顿好的，要发社媒吗？',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '发美食九宫格', effect: () => ({ fans: 1, health: 1 }), log: '深夜放毒，最为致命。' },
      { text: '只拍自己的脸', effect: () => ({ looks: 1, fans: 1 }), log: '粉丝只在乎你帅不帅。' },
      { text: '算了，怕被教练骂', effect: () => ({ health: -1, morale: 2 }), log: '自律让我自由。' }
    ]
  },
  {
    id: 'social_song_cover',
    type: 'SOCIAL',
    title: '翻唱营业',
    description: '最近有首新歌很火，粉丝在评论区催你翻唱。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '吉他弹唱版', effect: () => ({ vocal: 2, fans: 1 }), log: '展现了才艺。' },
      { text: '清唱一段副歌', effect: () => ({ vocal: 1, fans: 1 }), log: '随性又迷人。' },
      { text: '没时间练，下次一定', effect: () => ({ fans: -1 }), log: '粉丝略感失望。' }
    ]
  },
  {
    id: 'social_ootd',
    type: 'SOCIAL',
    title: 'OOTD穿搭',
    description: '今天出门穿得还挺帅的，对着镜子拍一张？',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.looks > 20,
    options: [
      { text: '酷盖风格', effect: () => ({ looks: 2, fans: 1 }), log: '被夸衣品好。' },
      { text: '邻家少年感', effect: () => ({ looks: 1, fans: 2 }), log: '妈粉直呼可爱。' }
    ]
  },
  {
    id: 'social_fan_reply',
    type: 'SOCIAL',
    title: '翻牌互动',
    description: '评论区有个粉丝坚持打了卡100天，要回复吗？',
    stage: 'ALL',
    isMandatory: false,
    trigger: (s) => s.stats.fans > 5,
    options: [
      { text: '暖心回复鼓励', effect: () => ({ fans: 2, eq: 2, sincerity: 2 }), log: '双向奔赴最感人。' },
      { text: '已读不回', effect: () => ({ morale: -1 }), log: '保持距离感。' }
    ]
  },

  // =================================================================
  // 2. GENERIC RANDOM EVENTS (Always Available)
  // =================================================================
  {
    id: 'random_rainy_day',
    type: 'RANDOM',
    title: '突降大雨',
    description: '去练习室的路上突然下起了暴雨，没带伞。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '冒雨跑过去', effect: () => ({ health: -2, morale: 1 }), log: '淋成了落汤鸡。' },
      { text: '躲雨迟到一会', effect: () => ({ dance: -1, health: 1 }), log: '少练了半小时。' },
      { text: '打车（虽然很贵）', effect: () => ({ health: 1 }), log: '花钱消灾。' }
    ]
  },
  {
    id: 'random_stray_cat',
    type: 'RANDOM',
    title: '流浪猫',
    description: '公司楼下出现了一只脏兮兮的小橘猫，正冲你喵喵叫。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '喂它根火腿肠', effect: () => ({ morale: 2, sincerity: 1 }), log: '它蹭了蹭你的裤脚。' },
      { text: '带去宠物医院', effect: () => ({ health: -1, morale: 4, fans: 1 }), log: '善良的举动被路人拍到了。' },
      { text: '无视走开', effect: () => ({ morale: -1 }), log: '心里有点过意不去。' }
    ]
  },
  {
    id: 'random_lost_items',
    type: 'RANDOM',
    title: '丢三落四',
    description: '到练习室才发现，耳机落在家里了！',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '回去拿', effect: () => ({ health: -2 }), log: '折腾了一趟累死了。' },
      { text: '外放音乐练习', effect: () => ({ eq: -2, dance: 1 }), log: '吵到了隔壁的前辈。' },
      { text: '借别人的用', effect: () => ({ eq: 1 }), log: '顺便交了个朋友。' }
    ]
  },
  {
    id: 'random_inspiration',
    type: 'RANDOM',
    title: '灵感迸发',
    description: '走在路上，脑海里突然蹦出一段绝妙的旋律。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '赶紧录下来', effect: () => ({ vocal: 3, dream: 2 }), log: '或许以后能写进歌里。' },
      { text: '不管它，先去吃饭', effect: () => ({ health: 1 }), log: '灵感像小鸟一样飞走了。' }
    ]
  },
  {
    id: 'random_convenience_store',
    type: 'RANDOM',
    title: '深夜便利店',
    description: '凌晨两点，便利店的关东煮只剩下最后一串萝卜。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '买下来吃掉', effect: () => ({ health: 1, morale: 1 }), log: '热乎乎的，治愈了疲惫。' },
      { text: '让给旁边的小孩', effect: () => ({ morale: 3, eq: 1 }), log: '觉得自己胸前的红领巾更鲜艳了。' }
    ]
  },
  {
    id: 'random_equipment_fail',
    type: 'RANDOM',
    title: '设备故障',
    description: '练习室的音响突然坏了，发出刺耳的电流声。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true,
    options: [
      { text: '尝试自己修', effect: () => ({ eq: 1, morale: 1 }), log: '居然修好了，技多不压身。' },
      { text: '清唱练习', effect: () => ({ vocal: 2, dance: -1 }), log: '专注声音本身。' },
      { text: '找后勤投诉', effect: () => ({ morale: -1 }), log: '浪费了不少时间。' }
    ]
  },

  // =================================================================
  // 3. SPECIFIC SOCIAL EVENTS (Condition Triggered)
  // =================================================================
  {
    id: 'social_selfie',
    type: 'SOCIAL',
    title: '营业自拍',
    description: '好久没发动态了，经纪人催你营业。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => true, 
    options: [
      { text: '发一张精修自拍', effect: () => ({ looks: 2, fans: 1 }), log: '颜值即正义。' },
      { text: '分享练歌片段', effect: () => ({ vocal: 2, fans: 1 }), log: '用实力说话。' },
      { text: '分享深夜鸡汤', effect: () => ({ eq: 2, fans: -1 }), log: '感性时刻。' }
    ]
  },
  {
    id: 'social_hater',
    type: 'SOCIAL',
    title: '恶评来袭',
    description: '一条莫名其妙的恶评被顶到了前排：“长得好普，凭什么有粉丝？”',
    stage: 'ALL',
    isMandatory: false,
    trigger: (s) => s.stats.fans > 30 && chance(60),
    options: [
      { text: '直接回怼', effect: () => ({ morale: 2, eq: -2 }), log: '虽然爽但容易招黑。' },
      { text: '礼貌回复', effect: () => ({ eq: 3, sincerity: 2 }), log: '展现了格局。' },
      { text: '拉黑删除', effect: () => ({ health: 1, morale: 1 }), log: '眼不见为净。' }
    ]
  },
  {
    id: 'social_trend',
    type: 'SOCIAL',
    title: '蹭热点',
    description: '最近“多巴胺穿搭”很火，别人建议你跟风拍一组。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.looks > 40 && chance(30),
    options: [
      { text: '积极营业', effect: () => ({ fans: 3, looks: 1 }), log: '获得了不少流量。' },
      { text: '保持自我风格', effect: () => ({ dream: 2, fans: -1 }), log: '不随波逐流。' }
    ]
  },

  // =================================================================
  // 4. SPECIFIC RANDOM EVENTS (Condition Triggered)
  // =================================================================
  {
    id: 'street_scout',
    type: 'RANDOM',
    title: '星探搭讪',
    description: '在便利店买关东煮时，一个戴墨镜的大叔递给你名片。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.looks > 50 && chance(30),
    options: [
      { text: '礼貌收下', effect: () => ({ eq: 2, dream: 1 }), log: '增加了阅历。' },
      { text: '当场拒绝', effect: () => ({ morale: 2, health: 1 }), log: '保护自己最重要。' },
      { text: '热情攀谈', effect: () => ({ eq: -1, dream: 2 }), log: '有点用力过猛。' }
    ]
  },
  {
    id: 'school_festival',
    type: 'RANDOM',
    title: '校园艺术节',
    description: '学校举办艺术节，班长希望你报名一个节目。',
    stage: GameStage.AMATEUR,
    isMandatory: true, // Specific time trigger
    trigger: (s) => s.time.quarter === 3 && chance(60),
    options: [
      { text: '独唱歌曲', effect: () => ({ vocal: 4, fans: 1 }), log: '小试牛刀。' },
      { text: '热舞开场', effect: () => ({ dance: 4, fans: 1 }), log: '活力四射。' },
      { text: '婉拒', effect: () => ({ health: 2, fans: -1 }), log: '享受平静的午后。' }
    ]
  },
  {
    id: 'health_cold',
    type: 'RANDOM',
    title: '换季感冒',
    description: '最近温差有点大，喉咙感觉很不舒服。',
    stage: 'ALL',
    isMandatory: false,
    trigger: (s) => s.stats.health < 40 && chance(50),
    options: [
      { text: '请假休息', effect: () => ({ health: 5, vocal: 1 }), log: '身体是革命的本钱。' },
      { text: '带病坚持', effect: () => ({ health: -5, morale: 3 }), log: '精神可嘉但不可取。' }
    ]
  },
  {
    id: 'fan_gift',
    type: 'RANDOM',
    title: '粉丝的礼物',
    description: '收到了一封手写的长信和一盒润喉糖。',
    stage: 'ALL',
    isMandatory: false,
    trigger: (s) => s.stats.fans > 10 && chance(30),
    options: [
      { text: '认真收藏', effect: () => ({ fans: 2, sincerity: 4 }), log: '真诚永远是必杀技。' },
      { text: '分享给朋友', effect: () => ({ eq: 2, health: 1 }), log: '传递善意。' },
      { text: '发微博感谢', effect: () => ({ eq: -2, fans: -3 }), log: '其他粉丝认为你小题大做，想私联' }
    ]
  },
  {
    id: 'reality_check',
    type: 'RANDOM',
    title: '现实的打击',
    description: '同期的练习生因为家里有钱，直接空降了一个大火综艺。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.eq < 30 && chance(30),
    options: [
      { text: '愤愤不平', effect: () => ({ morale: 2, eq: -2 }), log: '情绪写在了脸上。' },
      { text: '更加努力', effect: () => ({ vocal: 2, dance: 2 }), log: '实力才是硬道理。' }
    ]
  },

  // =================================================================
  // 5. SHOW EVENTS (Show Stage)
  // =================================================================
  {
    id: 'show_daily_training',
    type: 'SHOW',
    title: '节目日常',
    description: '又是紧张的一天，摄像机正对着你，要表现点什么吗？',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => true, // Fallback event to ensure queue is not empty
    options: [
      { text: '对着镜头卖萌', effect: () => ({ fans: 1, votes: 1 }), log: '展现了可爱的一面。' },
      { text: '专注练习', effect: () => ({ vocal: 1, dance: 1 }), log: '努力的人最发光。' },
      { text: '帮队友扣动作', effect: () => ({ eq: 2, morale: 1 }), log: '体现了团队精神。' }
    ]
  },
  {
    id: 'scandal_rumor',
    type: 'SHOW',
    title: '网络谣言',
    description: '有人在论坛爆料你初中时的黑历史，热度正在上升。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 50 && chance(30),
    options: [
      { text: '发律师函', effect: () => ({ morale: 2, fans: -3 }), log: '硬刚到底。' },
      { text: '冷处理', effect: () => ({ eq: 2, fans: -1 }), log: '无视是最好的反击。' },
      { text: '卖惨澄清', effect: () => ({ sincerity: -2, fans: 3 }), log: '获得了一些怜爱。' }
    ]
  },
  {
    id: 'viral_video',
    type: 'SHOW',
    title: '直拍出圈',
    description: '你在公演中一个抓拍镜头的动图在社交媒体疯传。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => (s.stats.dance > 80 || s.stats.looks > 80) && chance(20),
    options: [
      { text: '趁热打铁', effect: () => ({ fans: 5, votes: 5 }), log: '抓住流量密码。' },
      { text: '保持谦逊', effect: () => ({ eq: 3, sincerity: 3 }), log: '路人缘提升了。' }
    ]
  },
  {
    id: 'evil_editing',
    type: 'SHOW',
    title: '恶魔剪辑',
    description: '节目组把你发呆的镜头剪辑成了对导师翻白眼，预告片一出恶评如潮。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(25),
    options: [
      { text: '找选管理论', effect: () => ({ eq: -2, morale: 2 }), log: '虽然解气但不明智。' },
      { text: '忍气吞声', effect: () => ({ eq: 2, health: -1 }), log: '退一步海阔天空。' },
      { text: '自黑解围', effect: () => ({ fans: 2, eq: 3 }), log: '化尴尬为幽默。' }
    ]
  },
  {
    id: 'late_night_practice',
    type: 'SHOW',
    title: '深夜练习',
    description: '练习室的灯只剩下你这一盏，但是明天就是考核了。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.health > 60 && chance(40),
    options: [
      { text: '坚持到底', effect: () => ({ vocal: 2, dance: 2, health: -3 }), log: '越努力越幸运。' },
      { text: '回去休息', effect: () => ({ health: 2, morale: 1 }), log: '休息是为了走更远。' }
    ]
  },
  {
    id: 'center_battle',
    type: 'SHOW',
    title: 'C位之争',
    description: '小组作业选曲结束，大家正在推选C位。',
    stage: GameStage.SHOW,
    isMandatory: true, // High chance
    trigger: (s) => s.showTurnCount === 2, // Happens mid-show
    options: [
      { text: '毛遂自荐', effect: () => ({ vocal: 3, dance: 3, eq: -2 }), log: '野心是爱豆最好的装饰品。' },
      { text: '推荐队友', effect: () => ({ eq: 5, morale: 2 }), log: '团队凝聚力提升了。' },
      { text: '服从安排', effect: () => ({ health: 1 }), log: '默默做好了分内之事。' }
    ]
  }
];
