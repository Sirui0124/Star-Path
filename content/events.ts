
import { GameEvent, GameStage } from '../types';

// Helper for randomness
const chance = (percent: number) => Math.random() * 100 < percent;

export const ALL_EVENTS: GameEvent[] = [
  // =================================================================
  // 1. GENERIC SOCIAL EVENTS (社媒互动 - ONLY AMATEUR)
  // =================================================================
  {
    id: 'social_daily_vlog',
    type: 'SOCIAL',
    title: '练习室日常',
    description: '今天的练习结束了，拍张满头大汗的照片记录一下吧。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '配文：凌晨三点的月亮', effect: () => ({ fans: 2, health: -1 }), log: '感动了自己也感动了粉丝。' },
      { text: '配文：打卡下班！', effect: () => ({ fans: 1, ethics: 1 }), log: '元气满满。' },
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
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '发美食九宫格', effect: () => ({ fans: 1, health: 1 }), log: '深夜放毒，最为致命。' },
      { text: '只拍自己的脸', effect: () => ({ looks: 1, fans: 1 }), log: '粉丝只在乎你帅不帅。' },
      { text: '算了，怕被教练骂', effect: () => ({ health: -1, ethics: 2 }), log: '自律让我自由。' }
    ]
  },
  {
    id: 'social_song_cover',
    type: 'SOCIAL',
    title: '翻唱营业',
    description: '最近有首新歌很火，粉丝在评论区催你翻唱。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
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
    repeatable: true, // Filler
    trigger: (s) => s.stats.looks > 20,
    options: [
      { text: '酷盖风格', effect: () => ({ looks: 2, fans: 1 }), log: '被夸衣品好。' },
      { text: '邻家少年感', effect: () => ({ looks: 1, fans: 2 }), log: '妈粉直呼可爱。' },
      { text: '不修边幅风', effect: () => ({ ethics: 2, fans: -1 }), log: '女友粉转成妈粉。' }
    ]
  },
  {
    id: 'social_fan_reply',
    type: 'SOCIAL',
    title: '翻牌互动',
    description: '评论区有个粉丝坚持打卡100天，要回复吗？',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => s.stats.fans > 5,
    options: [
      { text: '暖心回复鼓励', effect: () => ({ fans: 2, ethics: 2 }), log: '双向奔赴最感人。' },
      { text: '已读不回', effect: () => ({ ethics: -1 }), log: '保持距离感。' },
      { text: '截图发超话', effect: () => ({ fans: 3, ethics: 1 }), log: '粉丝集体过年。' }
    ]
  },
  {
    id: 'social_selfie',
    type: 'SOCIAL',
    title: '营业自拍',
    description: '好久没发动态了，梦里的你提醒你营业一下。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true, 
    options: [
      { text: '发一张精修自拍', effect: () => ({ looks: 2, fans: 1 }), log: '颜值即正义。' },
      { text: '分享练歌片段', effect: () => ({ vocal: 2, fans: 1 }), log: '用实力说话。' },
      { text: '分享深夜鸡汤', effect: () => ({ ethics: 2, fans: -1 }), log: '感性时刻。' }
    ]
  },
  {
    id: 'social_hater',
    type: 'SOCIAL',
    title: '恶评来袭',
    description: '一条恶评被顶到了前排："长得好普，凭什么有粉丝？"',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 30 && chance(60),
    options: [
      { text: '直接回怼', effect: () => ({ ethics: 2, fans: -2 }), log: '虽然爽但容易招黑。' },
      { text: '礼貌回复', effect: () => ({ fans: 3, ethics: 1 }), log: '展现了格局。' },
      { text: '拉黑删除', effect: () => ({ health: 1, ethics: 1 }), log: '眼不见为净。' }
    ]
  },
  {
    id: 'social_trend',
    type: 'SOCIAL',
    title: '蹭热点',
    description: '最近"多巴胺穿搭"很火，别人建议你跟风拍一组。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.looks > 40 && chance(30),
    options: [
      { text: '积极营业', effect: () => ({ fans: 3, looks: 1 }), log: '获得了不少流量。' },
      { text: '保持自我风格', effect: () => ({ ethics: 2, fans: -1 }), log: '不随波逐流。' },
      { text: '让队友去蹭', effect: () => ({ fans: -1, ethics: -1 }), log: '错失良机。' }
    ]
  },
  {
    id: 'social_no_makeup',
    type: 'SOCIAL',
    title: '素颜挑战',
    description: '粉丝发起#素颜挑战#，艾特你参与。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.looks > 30,
    options: [
      { text: '纯素颜直出', effect: () => ({ fans: 3, looks: -1 }), log: '真实感拉满，部分颜粉脱粉。' },
      { text: '心机伪素颜', effect: () => ({ looks: 2, fans: 2 }), log: '妈生粉狂欢。' },
      { text: '假装没看见', effect: () => ({ ethics: -1 }), log: '被说偶像包袱重。' }
    ]
  },
  {
    id: 'social_fan_war',
    type: 'SOCIAL',
    title: '粉丝互撕',
    description: '你的粉丝和对家粉丝在广场撕起来了，场面混乱。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 50 && chance(40),
    options: [
      { text: '发美图转移视线', effect: () => ({ fans: 2, looks: 1 }), log: '用美照平息战火。' },
      { text: '发练习视频', effect: () => ({ vocal: 1, dance: 1, fans: 1 }), log: '用实力说话。' },
      { text: '关评论装死', effect: () => ({ fans: -2, ethics: 2 }), log: '被说没担当。' }
    ]
  },
  {
    id: 'social_live_fail',
    type: 'SOCIAL',
    title: '直播事故',
    description: '直播时没忍住打了个哈欠，被网友截图疯传。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(35),
    options: [
      { text: '道歉并解释', effect: () => ({ fans: 1, ethics: -1 }), log: '诚恳但略显尴尬。' },
      { text: '自嘲是睡美人', effect: () => ({ fans: 3, ethics: 2 }), log: '化危机为沙雕。' },
      { text: '下播装死', effect: () => ({ fans: -2 }), log: '被网友骂不敬业。' }
    ]
  },
  {
    id: 'social_emo',
    type: 'SOCIAL',
    title: '深夜emo',
    description: '凌晨三点睡不着，想发条伤感动态。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.health < 50 && chance(30),
    options: [
      { text: '发月亮照片配文"罢了"', effect: () => ({ fans: 2, ethics: -1 }), log: '被解读为资源不好。' },
      { text: '发练舞淤青照', effect: () => ({ fans: 3, dance: 1 }), log: '虐粉固粉成功。' },
      { text: '忍住不发', effect: () => ({ ethics: 2 }), log: '职业素养在线。' }
    ]
  },
  {
    id: 'social_endorsement',
    type: 'SOCIAL',
    title: '商务推广',
    description: '接了个小众美妆品牌的推广，粉丝觉得不贴合。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 40 && chance(30),
    options: [
      { text: '硬气推广', effect: () => ({ fans: -2, ethics: 1 }), log: '被嘲"想钱想疯了"。' },
      { text: '佛系推广', effect: () => ({ fans: 1, ethics: -1 }), log: '金主爸爸不太满意。' },
      { text: '幽默化解', effect: () => ({ fans: 2, looks: 1 }), log: '用颜值和幽默征服一切。' }
    ]
  },
  {
    id: 'social_dance_cover',
    type: 'SOCIAL',
    title: '翻跳挑战',
    description: '某短视频平台发起热门舞蹈挑战，全员参与。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.dance > 30,
    options: [
      { text: '完美翻跳', effect: () => ({ dance: 2, fans: 2 }), log: '舞担人设稳了。' },
      { text: '故意跳错制造笑果', effect: () => ({ fans: 3, dance: -1 }), log: '沙雕人设出圈。' },
      { text: '拒绝参与', effect: () => ({ fans: -2, ethics: 2 }), log: '被说太清高。' }
    ]
  },
  {
    id: 'social_funny_video',
    type: 'SOCIAL',
    title: '沙雕视频',
    description: '想用搞笑视频固粉，但怕破坏形象。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(40),
    options: [
      { text: '拍变装反转', effect: () => ({ fans: 2, looks: 1 }), log: '颜值与沙雕并存。' },
      { text: '拍土味情话', effect: () => ({ fans: 3, ethics: 1 }), log: '土味出圈。' },
      { text: '维持高冷', effect: () => ({ fans: -1, ethics: -1 }), log: '错失引流机会。' }
    ]
  },
  {
    id: 'social_like_fail',
    type: 'SOCIAL',
    title: '手滑点赞',
    description: '凌晨刷手机，手滑给队友的黑料微博点了赞！',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(25),
    options: [
      { text: '立刻取消装无事', effect: () => ({ fans: -1, ethics: -2 }), log: '但还是被截图了，越描越黑。' },
      { text: '道歉说是手滑', effect: () => ({ fans: -2, ethics: 1 }), log: '队友粉不买账。' },
      { text: '自嘲是吃瓜手速太快', effect: () => ({ fans: 2, ethics: 1 }), log: '用幽默化解。' }
    ]
  },
  {
    id: 'social_benefit',
    type: 'SOCIAL',
    title: '粉丝福利',
    description: '粉丝数破10万，该发福利了。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 10 && s.stats.fans % 10 === 0,
    options: [
      { text: '发清唱语音', effect: () => ({ vocal: 1, fans: 2 }), log: '歌粉狂喜。' },
      { text: '发九宫格自拍', effect: () => ({ looks: 1, fans: 2 }), log: '颜粉过年了。' },
      { text: '发跳舞视频', effect: () => ({ dance: 1, fans: 2 }), log: '舞粉满足。' }
    ]
  },
  {
    id: 'social_control_comment',
    type: 'SOCIAL',
    title: '控评教学',
    description: '粉丝控评总是慢半拍，你在评论区暗示技巧。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 80 && chance(30),
    options: [
      { text: '发教程贴', effect: () => ({ fans: 2, ethics: -1 }), log: '被营销号截图夸专业。' },
      { text: '让粉丝自由发挥', effect: () => ({ fans: -1, ethics: 2 }), log: '评论区一片混乱。' },
      { text: '亲自控评', effect: () => ({ fans: 3, health: -1 }), log: '熬夜控到热一，粉丝感动哭了。' }
    ]
  },
  {
    id: 'social_sasaeng',
    type: 'SOCIAL',
    title: '私生跟车',
    description: '发博吐槽私生跟车，但怕被说卖惨。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 100 && chance(40),
    options: [
      { text: '严肃警告', effect: () => ({ fans: 1, ethics: 2 }), log: '获得路人支持。' },
      { text: '温柔劝导', effect: () => ({ fans: 2, ethics: -1 }), log: '私生更猖狂了。' },
      { text: '不回应', effect: () => ({ ethics: -2 }), log: '憋出内伤。' }
    ]
  },
  {
    id: 'social_birthday',
    type: 'SOCIAL',
    title: '生日应援',
    description: '粉丝准备了豪华应援，你该怎么回应？',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(5),
    options: [
      { text: '发感谢长文', effect: () => ({ fans: 3, ethics: 2 }), log: '小作文虐粉成功。' },
      { text: '直播感谢', effect: () => ({ fans: 2, health: -1 }), log: '感动但疲惫。' },
      { text: '简单道谢', effect: () => ({ fans: -1, ethics: 1 }), log: '被说敷衍。' }
    ]
  },
  {
    id: 'social_clash',
    type: 'SOCIAL',
    title: '竞品代言',
    description: '队友刚官宣饮料代言，你也想发喝饮料的照片。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 70 && chance(35),
    options: [
      { text: '发不同品牌', effect: () => ({ fans: -2, ethics: 1 }), log: '被对家粉狙"皇族"。' },
      { text: '支持队友品牌', effect: () => ({ fans: 2, ethics: -1 }), log: '被说蹭队友资源。' },
      { text: '发白开水', effect: () => ({ fans: 1, health: 1 }), log: '养生人设出奇制胜。' }
    ]
  },
  {
    id: 'social_dark_joke',
    type: 'SOCIAL',
    title: '黑梗自嘲',
    description: '黑粉叫你"猴系爱豆"，你决定玩梗。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 50 && chance(30),
    options: [
      { text: '发自拍配猴子表情包', effect: () => ({ fans: 3, ethics: 2 }), log: '自嘲式洗白，路人缘上升。' },
      { text: '严肃澄清', effect: () => ({ fans: -2, ethics: -2 }), log: '被说玩不起。' },
      { text: '不care', effect: () => ({ ethics: 1 }), log: '高冷人设。' }
    ]
  },
  {
    id: 'social_station',
    type: 'SOCIAL',
    title: '站姐出图',
    description: '站姐发了你的神图，但精修过度不像你了。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 30 && chance(40),
    options: [
      { text: '转发赞美', effect: () => ({ fans: 2, looks: 1 }), log: '粉圈狂欢。' },
      { text: '暗示原图', effect: () => ({ fans: -1, ethics: 1 }), log: '站姐不满。' },
      { text: '假装没看见', effect: () => ({ fans: 1 }), log: '端水大师。' }
    ]
  },

  // =================================================================
  // 2. GENERIC RANDOM EVENTS (突发事件 - ONLY AMATEUR)
  // =================================================================
  {
    id: 'random_rainy_day',
    type: 'RANDOM',
    title: '突降大雨',
    description: '去练习室的路上突然下起了暴雨，没带伞。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '冒雨跑过去', effect: () => ({ health: -2, ethics: 1 }), log: '淋成了落汤鸡。' },
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
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '喂它根火腿肠', effect: () => ({ ethics: 2, fans: 1 }), log: '它蹭了蹭你的裤脚。' },
      { text: '带去宠物医院', effect: () => ({ health: -1, ethics: 3, fans: 1 }), log: '善良的举动被路人拍到了。' },
      { text: '无视走开', effect: () => ({ ethics: -1 }), log: '心里有点过意不去。' }
    ]
  },
  {
    id: 'random_lost_items',
    type: 'RANDOM',
    title: '丢三落四',
    description: '到练习室才发现，耳机落在家里了！',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '回去拿', effect: () => ({ health: -2 }), log: '折腾了一趟累死了。' },
      { text: '外放音乐练习', effect: () => ({ vocal: -1, dance: 1 }), log: '吵到了隔壁的前辈。' },
      { text: '借别人的用', effect: () => ({ ethics: 1 }), log: '顺便交了个朋友。' }
    ]
  },
  {
    id: 'random_inspiration',
    type: 'RANDOM',
    title: '灵感迸发',
    description: '走在路上，脑海里突然蹦出一段绝妙的旋律。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '赶紧录下来', effect: () => ({ vocal: 3, ethics: 2 }), log: '或许以后能写进歌里。' },
      { text: '不管它，先去吃饭', effect: () => ({ health: 1 }), log: '灵感像小鸟一样飞走了。' },
      { text: '哼给队友听', effect: () => ({ vocal: 1, ethics: 1 }), log: '获得队友好评。' }
    ]
  },
  {
    id: 'random_convenience_store',
    type: 'RANDOM',
    title: '深夜便利店',
    description: '凌晨两点，便利店的关东煮只剩下最后一串萝卜。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '买下来吃掉', effect: () => ({ health: 1, ethics: 1 }), log: '热乎乎的，治愈了疲惫。' },
      { text: '让给旁边的小孩', effect: () => ({ ethics: 3 }), log: '觉得自己胸前的红领巾更鲜艳了。' },
      { text: '和店员商量进货', effect: () => ({ ethics: 1, fans: 1 }), log: '被店员认出。' }
    ]
  },
  {
    id: 'random_equipment_fail',
    type: 'RANDOM',
    title: '设备故障',
    description: '练习室的音响突然坏了，发出刺耳的电流声。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '尝试自己修', effect: () => ({ ethics: 1 }), log: '居然修好了，技多不压身。' },
      { text: '清唱练习', effect: () => ({ vocal: 2, dance: -1 }), log: '专注声音本身。' },
      { text: '找后勤投诉', effect: () => ({ ethics: -1 }), log: '浪费了不少时间。' }
    ]
  },
  {
    id: 'random_metro',
    type: 'RANDOM',
    title: '地铁被认',
    description: '素颜坐地铁被粉丝偶遇了。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 20 && chance(30),
    options: [
      { text: '亲切合影', effect: () => ({ fans: 2, ethics: 1 }), log: '粉丝直呼"哥哥好近人"。' },
      { text: '婉拒但签名', effect: () => ({ fans: 1, ethics: -1 }), log: '被说有点架子。' },
      { text: '低头装路人', effect: () => ({ fans: -1, ethics: -1 }), log: '被扒出后说"糊咖装大牌"。' }
    ]
  },
  {
    id: 'random_roommate',
    type: 'RANDOM',
    title: '宿舍吵架',
    description: '室友总不打扫卫生，你终于爆发了。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(30),
    options: [
      { text: '冷战', effect: () => ({ ethics: -2, health: -1 }), log: '宿舍气氛降至冰点。' },
      { text: '沟通和解', effect: () => ({ ethics: 2 }), log: '成熟处理方式。' },
      { text: '找公司换宿舍', effect: () => ({ ethics: 1, fans: -1 }), log: '被传队内不合。' }
    ]
  },
  {
    id: 'random_teacher_critic',
    type: 'RANDOM',
    title: '老师批评',
    description: '声乐老师当众说："你怎么还是找不着调？"',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.vocal < 40 && chance(40),
    options: [
      { text: '当场落泪', effect: () => ({ vocal: 1, ethics: 2 }), log: '老师心软了。' },
      { text: '默默练习', effect: () => ({ vocal: 3, health: -1 }), log: '偷偷努力惊艳所有人。' },
      { text: '顶嘴辩解', effect: () => ({ vocal: -1, ethics: -2 }), log: '被老师标记为"态度差"。' }
    ]
  },
  {
    id: 'random_family',
    type: 'RANDOM',
    title: '家人来电',
    description: '妈妈打电话问你什么时候放弃回家。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(25),
    options: [
      { text: '保证会出道', effect: () => ({ ethics: -2 }), log: '压力山大。' },
      { text: '撒娇求支持', effect: () => ({ ethics: 3, fans: 1 }), log: '家人心软了。' },
      { text: '沉默挂电话', effect: () => ({ ethics: -3, health: -1 }), log: '情绪低落。' }
    ]
  },
  {
    id: 'random_endorse_fail',
    type: 'RANDOM',
    title: '代言翻车',
    description: '你代言的奶茶品牌被曝食品安全问题。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 80 && chance(30),
    options: [
      { text: '立即解约', effect: () => ({ fans: 1, ethics: 1 }), log: '损失违约金但保住口碑。' },
      { text: '装死不回应', effect: () => ({ fans: -3, ethics: -2 }), log: '被喷"要钱不要命"。' },
      { text: '转发声明', effect: () => ({ fans: -1 }), log: '粉丝帮你洗广场。' }
    ]
  },
  {
    id: 'random_styling',
    type: 'RANDOM',
    title: '造型灾难',
    description: '公司给的回归造型是"非主流杀马特"。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.looks > 50 && chance(35),
    options: [
      { text: '咬牙接受', effect: () => ({ looks: -3, fans: 2 }), log: '黑图出圈，但黑红也是红。' },
      { text: '私下改动', effect: () => ({ looks: 1, ethics: 2 }), log: '化妆师对你印象极差。' },
      { text: '拒绝造型', effect: () => ({ looks: 1, ethics: -3 }), log: '被说耍大牌。' }
    ]
  },
  {
    id: 'random_variety',
    type: 'RANDOM',
    title: '综艺邀约',
    description: '一个小网综邀请你做飞行嘉宾。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 40 && chance(30),
    options: [
      { text: '爽快答应', effect: () => ({ fans: 2, health: -1 }), log: '刷脸成功。' },
      { text: '怕生拒绝', effect: () => ({ ethics: -2 }), log: '错失曝光机会。' },
      { text: '要求带队友', effect: () => ({ fans: 1, ethics: 1 }), log: '展现团队精神。' }
    ]
  },
  {
    id: 'random_senior',
    type: 'RANDOM',
    title: '撞到前辈',
    description: '在练习室哼歌，没发现顶级前辈在休息。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(25),
    options: [
      { text: '90度鞠躬道歉', effect: () => ({ ethics: -1 }), log: '前辈觉得你吵。' },
      { text: '清唱展示实力', effect: () => ({ vocal: 2, ethics: 2 }), log: '前辈记住了你。' },
      { text: '落荒而逃', effect: () => ({ ethics: -2 }), log: '怂了。' }
    ]
  },
  {
    id: 'random_scalper',
    type: 'RANDOM',
    title: '信息泄露',
    description: '发现黄牛在卖你的航班信息。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 50 && chance(35),
    options: [
      { text: '挂黄牛微博', effect: () => ({ fans: 2, ethics: 1 }), log: '获得支持。' },
      { text: '改航班', effect: () => ({ health: -1, ethics: -1 }), log: '打乱行程。' },
      { text: '让公司处理', effect: () => ({ ethics: -1 }), log: '公司不作为。' }
    ]
  },
  {
    id: 'random_fan_leave',
    type: 'RANDOM',
    title: '大粉爬墙',
    description: '你的大粉站姐突然发博说"脱粉了，累了"。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 70 && chance(30),
    options: [
      { text: '私信挽留', effect: () => ({ fans: 1, ethics: -2 }), log: '卑微挽留。' },
      { text: '潇洒放手', effect: () => ({ fans: -3, ethics: 2 }), log: '被赞体面，但粉丝流失。' },
      { text: '装作不知道', effect: () => ({ fans: -2, ethics: -1 }), log: '粉丝说你冷漠。' }
    ]
  },
  {
    id: 'random_gift',
    type: 'RANDOM',
    title: '礼物争议',
    description: '你晒了粉丝送的礼物，被网友说"引导氪金"。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 60 && chance(30),
    options: [
      { text: '删博道歉', effect: () => ({ fans: -2, ethics: 1 }), log: '道歉姿态。' },
      { text: '怼黑粉', effect: () => ({ fans: 1, ethics: -2 }), log: '被说"玻璃心"。' },
      { text: '补发"禁止送礼"公告', effect: () => ({ fans: 2, ethics: 1 }), log: '官方态度。' }
    ]
  },
  {
    id: 'random_injury',
    type: 'RANDOM',
    title: '舞蹈受伤',
    description: '练舞时扭伤了脚腕，肿得像馒头。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.dance > 50 && chance(35),
    options: [
      { text: '缠绷带上场', effect: () => ({ dance: -2, fans: 2 }), log: '带伤上阵博好感。' },
      { text: '请假休息', effect: () => ({ health: 3, dance: -1 }), log: '被说"不敬业"。' },
      { text: '拍X光发博', effect: () => ({ fans: 1, health: 2 }), log: '证明真伤。' }
    ]
  },
  {
    id: 'random_high_note',
    type: 'RANDOM',
    title: '声乐瓶颈',
    description: '连续一周高音上不去，老师说你没天赋。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.vocal > 40 && chance(30),
    options: [
      { text: '哭完继续练', effect: () => ({ vocal: 3, health: -2 }), log: '铁杵磨成针。' },
      { text: '转攻中低音', effect: () => ({ vocal: 1, ethics: 2 }), log: '找到舒适区。' },
      { text: '怀疑人生', effect: () => ({ ethics: -3, vocal: -1 }), log: '陷入创作瓶颈。' }
    ]
  },
  {
    id: 'random_looks',
    type: 'RANDOM',
    title: '颜值焦虑',
    description: '评论区说你"发腮"、"馒化"，像发面馒头。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => s.stats.looks > 60 && chance(30),
    options: [
      { text: '怒晒健身照', effect: () => ({ looks: 2, health: 1 }), log: '用腹肌说话。' },
      { text: '发素颜怼脸拍', effect: () => ({ looks: 1, fans: 2 }), log: '妈粉护体。' },
      { text: '删评闭麦', effect: () => ({ ethics: -2 }), log: '玻璃心碎了。' }
    ]
  },
  {
    id: 'random_old_pic',
    type: 'RANDOM',
    title: '旧照曝光',
    description: '你高中时期的非主流照片被同学曝光。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    trigger: (s) => chance(25),
    options: [
      { text: '自嘲黑历史', effect: () => ({ fans: 3, ethics: 2 }), log: '沙雕出圈。' },
      { text: '举报删帖', effect: () => ({ fans: -2, ethics: -2 }), log: '被网友说玩不起。' },
      { text: 'P成表情包', effect: () => ({ fans: 2, ethics: 1 }), log: '自黑式营销。' }
    ]
  },

  // =================================================================
  // 3. SHOW EVENTS (选秀事件 - ONLY SHOW)
  // =================================================================
  {
    id: 'show_daily_training',
    type: 'SHOW',
    title: '节目日常',
    description: '又是紧张的一天，摄像机正对着你，要表现点什么吗？',
    stage: GameStage.SHOW,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => true,
    options: [
      { text: '对着镜头卖萌', effect: () => ({ fans: 1, looks: 1 }), log: '展现了可爱的一面。' },
      { text: '专注练习', effect: () => ({ vocal: 1, dance: 1 }), log: '努力的人最发光。' },
      { text: '帮队友扣动作', effect: () => ({ ethics: 2, fans: 1 }), log: '体现了团队精神。' }
    ]
  },
  {
    id: 'show_cp_event',
    type: 'SHOW',
    title: '强制CP',
    description: '节目组要求你和热门选手炒CP。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 60 && chance(40),
    options: [
      { text: '配合营业', effect: () => ({ fans: 4, ethics: -3 }), log: 'CP粉狂欢，毒唯气炸。' },
      { text: '保持距离', effect: () => ({ fans: -3, ethics: 2 }), log: '被节目组防爆。' },
      { text: '暗示自己单身', effect: () => ({ fans: 1, ethics: 1 }), log: '端水但两边不讨好。' }
    ]
  },
  {
    id: 'show_social_cp',
    type: 'SHOW',
    title: 'CP营业',
    description: '你和队友的合影被CP粉疯狂转发，热度惊人。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 60 && chance(50),
    options: [
      { text: '配合发糖', effect: () => ({ fans: 4, ethics: -1 }), log: 'CP粉过年了，唯粉怒了。' },
      { text: '保持距离', effect: () => ({ fans: -2, ethics: 2 }), log: '被说拆CP，热度下降。' },
      { text: '模糊处理', effect: () => ({ fans: 2, ethics: 1 }), log: '端水大师。' }
    ]
  },
  {
    id: 'show_resource',
    type: 'SHOW',
    title: '资源被抢',
    description: '原定你的中插广告，被公司给了"皇族"队友。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 60 && chance(35),
    options: [
      { text: '找经纪人理论', effect: () => ({ ethics: 2, fans: -2 }), log: '"皇族"粉丝说你"心机婊"。' },
      { text: '更努力练习', effect: () => ({ vocal: 2, dance: 2 }), log: '用实力证明自己。' },
      { text: '发微博内涵', effect: () => ({ fans: 2, ethics: -1 }), log: '被解读为"酸鸡"。' }
    ]
  },
  {
    id: 'show_fever',
    type: 'SHOW',
    title: '高烧不退',
    description: '发烧39度，但明天有重要公演。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.health < 50 && chance(40),
    options: [
      { text: '带病上场', effect: () => ({ vocal: -2, dance: -2, fans: 3 }), log: '敬业人设，但表演砸了。' },
      { text: '硬撑彩排后晕倒', effect: () => ({ health: -5, fans: 5 }), log: '热搜预定，但身体垮了。' },
      { text: '申请替补', effect: () => ({ health: 3, fans: -2 }), log: '被说没责任心。' }
    ]
  },
  {
    id: 'show_black_hot',
    type: 'SHOW',
    title: '黑热搜',
    description: '莫名奇妙#你的名字 耍大牌#上了热搜。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 90 && chance(40),
    options: [
      { text: '发律师函', effect: () => ({ fans: 2, ethics: 1 }), log: '硬刚到底。' },
      { text: '找节目组澄清', effect: () => ({ fans: 1, ethics: -1 }), log: '节目组不置可否。' },
      { text: '让粉丝洗广场', effect: () => ({ fans: 3, ethics: -2 }), log: '粉丝战斗力MAX，但你心疼。' }
    ]
  },
  {
    id: 'show_station_leave',
    type: 'SHOW',
    title: '站姐脱粉',
    description: '站姐发长文脱粉回踩，说你有嫂子。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 100 && chance(25),
    options: [
      { text: '起诉造谣', effect: () => ({ fans: 3, ethics: 2 }), log: '用法律维权。' },
      { text: '冷处理', effect: () => ({ fans: -4, ethics: -2 }), log: '塌房实锤既视感。' },
      { text: '直播澄清', effect: () => ({ health: -1, fans: 2 }), log: '澄清但没完全澄清。' }
    ]
  },
  {
    id: 'show_teammate',
    type: 'SHOW',
    title: '队友被黑',
    description: '队友被爆恋爱，找你打掩护。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(40),
    options: [
      { text: '帮忙澄清', effect: () => ({ fans: -1, ethics: 1 }), log: '被说"重义气"。' },
      { text: '拒绝并劝分', effect: () => ({ ethics: -1 }), log: '被说"塑料兄弟情"。' },
      { text: '装傻不知情', effect: () => ({ fans: 1 }), log: '独善其身。' }
    ]
  },
  {
    id: 'show_education',
    type: 'SHOW',
    title: '学历争议',
    description: '有人扒出你读的是"野鸡大学"。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(20),
    options: [
      { text: '自嘲学历低但业务强', effect: () => ({ vocal: 2, dance: 2 }), log: '转移焦点。' },
      { text: '晒毕业证', effect: () => ({ fans: -1, ethics: -1 }), log: '越描越黑。' },
      { text: '不回应', effect: () => ({ ethics: -2 }), log: '被嘲默认。' }
    ]
  },
  {
    id: 'show_love',
    type: 'SHOW',
    title: '恋爱风波',
    description: '被拍到和女生单独吃饭，其实是表姐。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 80 && chance(30),
    options: [
      { text: '立即澄清', effect: () => ({ fans: 1 }), log: '速度够快，影响较小。' },
      { text: '让表姐出面', effect: () => ({ fans: -1, ethics: -2 }), log: '越扒越有。' },
      { text: '冷处理', effect: () => ({ fans: -3, ethics: -1 }), log: '塌房既视感。' }
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
      { text: '发律师函', effect: () => ({ ethics: 2, fans: -3 }), log: '硬刚到底。' },
      { text: '冷处理', effect: () => ({ ethics: 1, fans: -1 }), log: '无视是最好的反击。' },
      { text: '卖惨澄清', effect: () => ({ fans: 3, ethics: -2 }), log: '获得了一些怜爱。' }
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
      { text: '趁热打铁', effect: () => ({ fans: 5 }), log: '抓住流量密码。' },
      { text: '保持谦逊', effect: () => ({ ethics: 3, fans: 2 }), log: '路人缘提升了。' },
      { text: '买热搜加码', effect: () => ({ fans: 3, ethics: -1 }), log: '被扒出买热搜。' }
    ]
  },
  {
    id: 'evil_editing',
    type: 'SHOW',
    title: '恶魔剪辑',
    description: '节目组把你发呆的镜头剪辑成了对导师翻白眼。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(25),
    options: [
      { text: '找选管理论', effect: () => ({ ethics: 2, fans: -2 }), log: '虽然解气但不明智。' },
      { text: '忍气吞声', effect: () => ({ ethics: 1, health: -1 }), log: '退一步海阔天空。' },
      { text: '自黑解围', effect: () => ({ fans: 2, ethics: 3 }), log: '化尴尬为幽默。' }
    ]
  },
  {
    id: 'late_night_practice',
    type: 'SHOW',
    title: '深夜练习',
    description: '练习室的灯只剩下你这一盏，但是明天就是考核了。',
    stage: GameStage.SHOW,
    isMandatory: false,
    repeatable: true, // Filler
    trigger: (s) => s.stats.health > 60 && chance(40),
    options: [
      { text: '坚持到底', effect: () => ({ vocal: 2, dance: 2, health: -3 }), log: '越努力越幸运。' },
      { text: '回去休息', effect: () => ({ health: 2, ethics: 1 }), log: '休息是为了走更远。' },
      { text: '边练边直播', effect: () => ({ fans: 2, health: -2 }), log: '虐粉固粉。' }
    ]
  },
  {
    id: 'center_battle',
    type: 'SHOW',
    title: 'C位之争',
    description: '小组作业选曲结束，大家正在推选C位。',
    stage: GameStage.SHOW,
    isMandatory: true,
    trigger: (s) => s.showTurnCount === 2,
    options: [
      { text: '毛遂自荐', effect: () => ({ vocal: 3, dance: 3, ethics: -2 }), log: '野心是爱豆最好的装饰品。' },
      { text: '推荐队友', effect: () => ({ ethics: 5 }), log: '团队凝聚力提升了。' },
      { text: '服从安排', effect: () => ({ health: 1 }), log: '默默做好了分内之事。' }
    ]
  },
  {
    id: 'show_song_selection',
    type: 'SHOW',
    title: '一公选曲',
    description: '第一次公演，你要选择哪首歌？',
    stage: GameStage.SHOW,
    isMandatory: true,
    trigger: (s) => s.showTurnCount === 0,
    options: [
      { text: '选最燃的C位曲', effect: () => ({ dance: 3, vocal: 2, ethics: -2 }), log: '高风险高回报。' },
      { text: '选适合自己的', effect: () => ({ vocal: 3, ethics: 1 }), log: '稳妥但不出彩。' },
      { text: '让队友先选', effect: () => ({ ethics: 2 }), log: '佛系选手。' }
    ]
  },
  {
    id: 'show_grade',
    type: 'SHOW',
    title: '等级评定',
    description: '初舞台评级，导师们一脸严肃。',
    stage: GameStage.SHOW,
    isMandatory: true,
    trigger: (s) => s.showTurnCount === 1,
    options: [
      { text: '超常发挥', effect: () => ({ vocal: 2, dance: 2, ethics: 2 }), log: '导师眼前一亮。' },
      { text: '紧张失误', effect: () => ({ vocal: -1, ethics: -3 }), log: '出师不利。' },
      { text: '平稳完成', effect: () => ({ ethics: 1 }), log: '无功无过。' }
    ]
  },
  {
    id: 'show_dorm_live',
    type: 'SHOW',
    title: '宿舍直播',
    description: '节目组要求你们宿舍开直播互动。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(40),
    options: [
      { text: '主动cue流程', effect: () => ({ fans: 2, ethics: 1 }), log: '展现队长潜质。' },
      { text: '安静背景板', effect: () => ({ fans: -1 }), log: '全程查无此人。' },
      { text: '和队友互怼', effect: () => ({ fans: 3, ethics: -1 }), log: '综艺感拉满。' }
    ]
  },
  {
    id: 'show_mentor',
    type: 'SHOW',
    title: '导师合作',
    description: '导师想和你合作一个即兴舞台。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.vocal > 50 && chance(30),
    options: [
      { text: '大胆接受', effect: () => ({ vocal: 3, ethics: 2 }), log: '导师对你刮目相看。' },
      { text: '婉拒称怕拖后腿', effect: () => ({ ethics: -1 }), log: '导师觉得有点可惜。' },
      { text: '要求加队友', effect: () => ({ ethics: 1, fans: 1 }), log: '重情重义。' }
    ]
  },
  {
    id: 'show_elimination',
    type: 'SHOW',
    title: '淘汰发言',
    description: '你的队友被淘汰了，镜头对准你。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(50),
    options: [
      { text: '泪洒现场', effect: () => ({ fans: 2, ethics: -2 }), log: '真情实感虐粉。' },
      { text: '强颜欢笑祝福', effect: () => ({ ethics: 1 }), log: '体面告别。' },
      { text: '一言不发', effect: () => ({ fans: -1, ethics: -1 }), log: '被说冷漠。' }
    ]
  },
  {
    id: 'show_ranking',
    type: 'SHOW',
    title: '顺位发布',
    description: '排名发布，你在出道位边缘。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(45),
    options: [
      { text: '发表热血宣言', effect: () => ({ fans: 3, ethics: 2 }), log: '燃起来了！' },
      { text: '感谢粉丝', effect: () => ({ fans: 2 }), log: '标准发言。' },
      { text: '紧张到忘词', effect: () => ({ fans: -1, ethics: -3 }), log: '播出效果极差。' }
    ]
  },
  {
    id: 'show_unfair',
    type: 'SHOW',
    title: '黑幕质疑',
    description: '有选手明显皇族，镜头量是别人的三倍。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 70 && chance(30),
    options: [
      { text: '发微博内涵', effect: () => ({ fans: 2, ethics: -2 }), log: '被节目组约谈。' },
      { text: '直播哭诉', effect: () => ({ fans: 4, ethics: -3 }), log: '热搜第一，但得罪节目组。' },
      { text: '忍气吞声', effect: () => ({ ethics: 1, fans: -2 }), log: '防爆成功，但没水花。' }
    ]
  },
  {
    id: 'show_ad',
    type: 'SHOW',
    title: '中插广告',
    description: '节目组安排你拍中插广告。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => chance(50),
    options: [
      { text: '尬演也全情投入', effect: () => ({ fans: 1 }), log: '被嘲"洗洁精演技"。' },
      { text: '自然表现', effect: () => ({ fans: 2 }), log: '意外有反差萌。' },
      { text: '拒绝拍摄', effect: () => ({ fans: -2, ethics: -1 }), log: '得罪金主。' }
    ]
  },
  {
    id: 'show_offline',
    type: 'SHOW',
    title: '线下应援',
    description: '粉丝来录制现场应援，声势浩大。',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.stats.fans > 100 && chance(40),
    options: [
      { text: '开窗回应', effect: () => ({ fans: 3, ethics: 2 }), log: '双向奔赴。' },
      { text: '让助理代打招呼', effect: () => ({ fans: 1, ethics: -1 }), log: '被说"耍大牌"。' },
      { text: '无视', effect: () => ({ fans: -3, ethics: -2 }), log: '寒了粉丝心。' }
    ]
  },
  {
    id: 'show_final',
    type: 'SHOW',
    title: '决赛冲刺',
    description: '决赛前夜，你还要继续练习吗？',
    stage: GameStage.SHOW,
    isMandatory: false,
    trigger: (s) => s.showTurnCount > 8 && chance(60),
    options: [
      { text: '通宵练习', effect: () => ({ vocal: 3, dance: 3, health: -5 }), log: '燃烧生命。' },
      { text: '适度练习早睡', effect: () => ({ health: 2, ethics: 2 }), log: '养精蓄锐。' },
      { text: '和队友谈心', effect: () => ({ ethics: 3 }), log: '调整状态。' }
    ]
  },
  {
    id: 'show_debut',
    type: 'SHOW',
    title: '成团争议',
    description: '你卡在出道位，粉丝和资本在博弈。',
    stage: GameStage.SHOW,
    isMandatory: true,
    trigger: (s) => s.showTurnCount > 10,
    options: [
      { text: '让粉丝别氪金', effect: () => ({ fans: 3, ethics: 3 }), log: '清流爱豆，但可能出不了道。' },
      { text: '暗示粉丝打投', effect: () => ({ fans: 4, ethics: -2 }), log: '被嘲"又当又立"。' },
      { text: '听天由命', effect: () => ({ ethics: 1 }), log: '佛系选手。' }
    ]
  }
];
