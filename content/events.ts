
import { GameEvent, GameStage } from '../types';

// Helper for randomness
const chance = (percent: number) => Math.random() * 100 < percent;

export const ALL_EVENTS: GameEvent[] = [
  // =================================================================
  // SPECIAL MANDATORY EVENTS
  // =================================================================
  {
    id: 'social_sick_fan',
    type: 'SOCIAL',
    title: '深夜的私信',
    description: '17岁的冬天格外寒冷。你收到一条私信，粉丝说她的朋友身患重病，希望能得到你的安慰。私信言辞恳切。',
    stage: GameStage.AMATEUR,
    isMandatory: true,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.time.age === 17 && s.time.quarter === 4,
    options: [
      { 
        text: '发微博，祝福大家都好好的', 
        effect: () => ({ fans: 2, eq: 1, log: '温暖但保持距离，大家觉得你很暖心。' }) 
      },
      { 
        text: '斟酌长篇认真回复', 
        effect: () => ({ 
          ethics: 5, 
          fans: 8, 
          health: -4, 
          log: '你花了四小时核实并认真写下鼓励的话。后来得知那位朋友真的深受鼓舞，奇迹般挺过了危险期。',
          flags: { angel_reply: true }
        }) 
      },
      { 
        text: '装没看见，私信万一是骗人的', 
        effect: () => ({ eq: 2, ethics: -1, log: '虽然避免了风险，但心里总觉得有点不安。' }) 
      }
    ]
  },

  // =================================================================
  // 1. GENERIC SOCIAL EVENTS (社媒互动 - ONLY AMATEUR)
  // =================================================================
  {
    id: 'social_star_discovery',
    type: 'SOCIAL',
    title: '街头星探',
    description: '你在路边翻唱的视频被某知名娱乐公司的星探账号转发并评论："好苗子，有兴趣来聊聊吗？" 评论区瞬间炸锅。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.stats.vocal > 40 && chance(15),
    options: [
      { text: '激动回复并私信联系', effect: () => ({ fans: 4, vocal: 2, health: -2 }), log: '果断抓住机会，粉丝狂吹"是金子总会发光"，但熬夜联系导致疲惫。' },
      { text: '矜持感谢', effect: () => ({ fans: 2, ethics: 2, eq: -1 }), log: '表现沉稳有分寸，路人缘提升，但被部分粉丝认为不够主动。' },
      { text: '谨慎核实账号真伪后再回应', effect: () => ({ fans: -1, ethics: 2, eq: 1 }), log: '行事稳妥获好评，但错过了最佳回应时机。' }
    ]
  },
  {
    id: 'social_cp_ship',
    type: 'SOCIAL',
    title: 'CP粉的诞生',
    description: '你和同期练习生A在练习室互相压腿的视频流出，双人舞片段被剪辑出粉色泡泡。超话"双A宇宙"一夜之间建起，CP粉火速赶来。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.stats.dance > 30 && s.stats.looks > 35 && chance(25),
    options: [
      { text: '正常互动，不避嫌也不迎合', effect: () => ({ fans: 3, eq: 2, ethics: -1 }), log: '"社会主义兄弟情"引发热议，两人热度齐飞，但唯粉有些不满。' },
      { text: '发单人练习视频，强调个人成长', effect: () => ({ fans: -1, dance: 2, ethics: 1 }), log: '稳住唯粉基本盘，但CP粉觉得有些刻意，部分脱粉。' },
      { text: '点赞CP二创视频，但配文"友情万岁"', effect: () => ({ fans: 4, eq: 1, ethics: -2 }), log: 'CP粉狂欢"正主发糖"，热度爆炸，但唯粉强烈不满。' }
    ]
  },
  {
    id: 'social_fan_project',
    type: 'SOCIAL',
    title: '粉丝应援计划',
    description: '你的大粉发起"地铁灯箱应援"集资计划，需要粉丝真金白银支持。超话里晒付款截图成风，争议随之而来。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 80 && chance(35),
    options: [
      { text: '公开发声：爱是陪伴，不必破费', effect: () => ({ ethics: 3, fans: -1, eq: 1 }), log: '树立正能量偶像形象，获主流媒体点赞，但部分大粉觉得被背刺。' },
      { text: '默默转发一条反诈宣传微博', effect: () => ({ fans: -1, ethics: 2, eq: 2 }), log: '含蓄表态，聪明人懂了，但集资粉觉得被内涵而脱粉。' },
      { text: '发布感谢视频，但强调"量力而行"', effect: () => ({ fans: 3, ethics: 1, health: -2 }), log: '安抚了粉丝热情，但被部分人认为变相鼓励，压力增大。' }
    ]
  },
  {
    id: 'social_talent_out',
    type: 'SOCIAL',
    title: '隐藏技能出圈',
    description: '你随手用钢琴弹了一段《告白气球》的即兴变奏，被室友偷拍发上网。#被练习生耽误的音乐人# tag 病毒式传播。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.vocal > 50 || s.stats.eq > 60,
    options: [
      { text: '顺势发布完整编曲版', effect: () => ({ vocal: 3, fans: 3, health: -1 }), log: '才华得到认证，音乐人社区纷纷关注，但熬夜编曲影响状态。' },
      { text: '害羞表示只是瞎玩，感谢大家喜欢', effect: () => ({ fans: 2, ethics: 2, eq: 1 }), log: '谦逊人设更讨喜，粉丝保护欲激增。' },
      { text: '借此机会发起音乐挑战，邀请粉丝参与', effect: () => ({ vocal: 2, fans: 2, eq: -1 }), log: '将热度转化为互动，但挑战设计不佳引发争议。' }
    ]
  },
  {
    id: 'social_friend_betrayal',
    type: 'SOCIAL',
    title: '"好友"的直播',
    description: '你视为好友的练习生B，在其直播中被粉丝问及你的近况，他笑着说："他最近压力挺大，有一次还说训练太累想回家呢，不过就是随口一说啦。"片段被单独截出传播。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(30),
    options: [
      { text: '发训练到凌晨的vlog，配文"汗水不会说谎"', effect: () => ({ dance: 2, fans: 2, health: -2 }), log: '用行动打脸，励志形象深入人心，但过度训练影响健康。' },
      { text: '在B的直播间刷礼物，并留言"一起加油"', effect: () => ({ fans: 1, eq: 3, ethics: 1 }), log: '展现超高情商和团队意识，化解尴尬，收获路人好评。' },
      { text: '在个人直播中轻松带过："谁训练累的时候没点抱怨"', effect: () => ({ fans: -1, eq: 2, health: 1 }), log: '显得豁达，但部分事业粉觉得你不够有冲劲而脱粉。' }
    ]
  },
  {
    id: 'social_meme_creation',
    type: 'SOCIAL',
    title: '表情包狂欢',
    description: '你某次舞台失误后一脸懵的表情，被做成"我是谁我在哪"表情包，席卷各大聊天群。甚至官媒都用它来科普安全知识。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(40),
    options: [
      { text: '加入狂欢，用自己表情包评论', effect: () => ({ fans: 4, eq: 2, ethics: -1 }), log: '接地气，亲和力MAX，成功破圈，但被部分人批评"不严肃"。' },
      { text: '发布原视频慢放版，配文"失误瞬间永留存"', effect: () => ({ fans: 2, ethics: 2, dance: 1 }), log: '直面失误，展现专业态度，获得舞者同行尊重。' },
      { text: '发起二创大赛，征集更有趣的表情包', effect: () => ({ fans: 3, eq: 1, health: -1 }), log: '将被动玩梗转化为主动互动，但运营活动耗费精力。' }
    ]
  },
  {
    id: 'social_scandal_rumor',
    type: 'SOCIAL',
    title: '恋爱绯闻突袭',
    description: '八卦号放出模糊剪影，暗示"某潜力练习生与网红深夜密室约会"，评论区90%的人@了你。后援会紧急开会。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 70 && chance(30),
    options: [
      { text: '晒出当晚在练习室的监控截图', effect: () => ({ ethics: 3, fans: 3, health: -1 }), log: '"事业批"人设焊死，粉丝感动落泪，但熬夜整理证据疲惫。' },
      { text: '发与队友的团建合照，配文"密室，但是一群人"', effect: () => ({ fans: 2, eq: 2, ethics: -1 }), log: '巧妙辟谣，展现幽默感，但仍有部分人不信。' },
      { text: '不直接回应，发新歌预告"谣言止于智者"', effect: () => ({ vocal: 2, fans: -2, ethics: 1 }), log: '用作品转移视线，显得有格局，但激进的粉丝脱粉抗议。' }
    ]
  },
  {
    id: 'social_lost_fan',
    type: 'SOCIAL',
    title: '"氪金大佬"爬墙',
    description: '你的站姐、头号氪金粉"为你摘星"发布长文，细数对你失望的瞬间，宣布"我的爱意耗尽了"，并清空微博转投对家。粉圈地震。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.stats.fans > 100 && chance(25),
    options: [
      { text: '私信感谢过去的陪伴，祝好', effect: () => ({ fans: -2, ethics: 3, eq: 2 }), log: '体面告别' },
      { text: '在直播中分享励志歌曲', effect: () => ({ fans: -1, ethics: 2, vocal: 1 }), log: '传递正能量，稳定军心，但爬墙粉认为虚伪。' },
      { text: '发布高质量舞台直拍，配文"用舞台说话"', effect: () => ({ dance: 2, vocal: 2, fans: 1 }), log: '用实力回应，吸引新粉.' }
    ]
  },
  {
    id: 'social_trending_challenge',
    type: 'SOCIAL',
    title: '爆款挑战赛',
    description: '你参与了一个#爱豆反油腻舞蹈挑战#，动作干净清爽，被原发起人、顶流舞者转发称赞："有内味了，清爽弟弟。"',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.dance > 45 && chance(20),
    options: [
      { text: '谦虚回复前辈，并翻跳其经典作品致敬', effect: () => ({ dance: 3, fans: 3, ethics: -1 }), log: '获得前辈粉丝好感，舞技得到公认，但被部分人批"蹭热度"。' },
      { text: '趁机发起自己的编舞挑战', effect: () => ({ dance: 2, fans: 2, health: -1 }), log: '展现创作野心，热度持续，但准备新编舞消耗精力。' },
      { text: '制作挑战教程视频，帮助更多人参与', effect: () => ({ fans: 3, ethics: 2, eq: -1 }), log: '贴心又专业，拉拢路人缘，但个人锋芒稍减。' }
    ]
  },
  {
    id: 'social_mentorship',
    type: 'SOCIAL',
    title: '前辈的提携',
    description: '一位业内口碑很好的唱作人前辈关注了你，并在你翻唱视频下评论："音色有故事，有空来我棚里玩玩。"',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.vocal > 60 && chance(15),
    options: [
      { text: '立刻准备原创小样，私信请教', effect: () => ({ vocal: 3, eq: 2, health: -3 }), log: '积极态度获前辈赏识，得到私下指导，但熬夜创作影响状态。' },
      { text: '公开表达崇敬，并翻唱前辈冷门佳作致敬', effect: () => ({ vocal: 2, fans: 2, ethics: 1 }), log: '展现音乐品味和诚意，路人缘好，前辈也感受到尊重。' },
      { text: '先深入研究前辈作品，再择机互动', effect: () => ({ vocal: 2, eq: 2, fans: -1 }), log: '沉稳真诚，但可能错过最佳互动时机，热度稍降。' }
    ]
  },
  {
    id: 'social_charity_misstep',
    type: 'SOCIAL',
    title: '公益活动的"照骗"',
    description: '你参加公益扫街活动的照片被赞"人美心善"，但有人指出你拍照后就把扫帚递给工作人员，质疑作秀。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.ethics > 50 && chance(30),
    options: [
      { text: '放出全程跟拍vlog，证明自己实干', effect: () => ({ ethics: 3, fans: 2, health: -1 }), log: '铁证如山，逆转舆论，公益形象更加牢固，但整理素材耗费时间。' },
      { text: '诚恳回应：确实有休息，但主要工作都完成了', effect: () => ({ ethics: 2, fans: -1, eq: 2 }), log: '诚实但不完美，部分人觉得真实，部分人仍不满意。' },
      { text: '发起"一周公益打卡"活动，邀请粉丝一起', effect: () => ({ ethics: 3, fans: 1, health: -2 }), log: '将争议转化为长期行动，展现领导力，但需要持续投入精力。' }
    ]
  },
  {
    id: 'social_ai_cover',
    type: 'SOCIAL',
    title: 'AI翻唱风波',
    description: '有技术粉用你的音色AI模型合成了热门歌曲，效果以假乱真，在音乐平台热度甚至超过你的官方作品。版权和伦理问题引发争议。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.stats.vocal > 40 && chance(20),
    options: [
      { text: '联合平台发起"尊重原音"倡议，但欣赏技术', effect: () => ({ ethics: 3, eq: 2, fans: -1 }), log: '站在道德和科技前沿，展现格局，但激进的科技粉不满。' },
      { text: '发律师函要求下架所有AI作品', effect: () => ({ fans: -3, ethics: 1, vocal: 1 }), log: '坚决维护权益，但被科技爱好者批评"保守"，失去先锋粉丝。' },
      { text: '亲自翻唱该歌，发起#人声挑战AI#', effect: () => ({ vocal: 3, fans: 4, health: -2 }), log: '用实力正面刚，话题度拉满，凸显人类歌手的不可替代性，但疲惫。' }
    ]
  },
  {
    id: 'social_fashion_mistake',
    type: 'SOCIAL',
    title: '造型"车祸现场"',
    description: '一次线下活动，造型师给你搭配了过于前卫（怪异）的服装，生图流出后被时尚博主群嘲："这是把垃圾袋穿出高定感？"',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.looks > 40 && chance(25),
    options: [
      { text: '自嘲："今天负责回收时尚"', effect: () => ({ eq: 3, fans: 2, looks: -1 }), log: '高情商化解尴尬，沙雕出圈，但部分颜粉觉得形象受损。' },
      { text: '发另一套备选造型图，配文"你们喜欢哪套？"', effect: () => ({ looks: 2, fans: 2, ethics: -1 }), log: '巧妙转移焦点，展现可塑性，但可能得罪原造型师。' },
      { text: '与造型师直播连线，探讨设计理念', effect: () => ({ ethics: 3, eq: 2, fans: -1 }), log: '展现专业度和尊重，提升业内口碑，但部分网友不买账。' }
    ]
  },
  {
    id: 'social_esports_crossover',
    type: 'SOCIAL',
    title: '游戏直播联动',
    description: '你作为神秘嘉宾，出现在某顶流电竞选手的直播车队里。你游戏技术菜但话多搞笑，直播间人气爆炸。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(20),
    options: [
      { text: '疯狂玩梗，化身"娱乐圈绊脚石"', effect: () => ({ fans: 4, eq: 2, ethics: -1 }), log: '综艺感爆棚，成功打入电竞圈，收获大量直男粉丝，但被批"不务正业"。' },
      { text: '认真打游戏，虽然菜但不放弃', effect: () => ({ fans: 3, ethics: 2, health: -1 }), log: '"倔强菜鸟"形象惹人怜爱，电竞粉丝认可你的态度，但熬夜游戏疲惫。' },
      { text: '赛后认真复盘，发布游戏操作学习vlog', effect: () => ({ fans: 2, ethics: 2, eq: 1 }), log: '将娱乐转化为学习人设，显得上进，但可能不够"有趣"。' }
    ]
  },
  {
    id: 'social_doubt_career',
    type: 'SOCIAL',
    title: 'emo时刻',
    description: '连续在练习室记不住舞蹈动作，你深夜emo发了一句："也许我并不适合舞台……"，秒删，但已被手快的粉丝截图。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.health < 40 && chance(25),
    options: [
      { text: '第二天发练习室挥汗视频，配文"再试一次"', effect: () => ({ dance: 2, fans: 3, health: -2 }), log: '极致的虐粉与固粉，粉丝忠诚度飙升，"逆袭剧本"开启，但过度训练。' },
      { text: '开直播谈心，承认压力但也表达坚持', effect: () => ({ fans: 2, eq: 3, health: 1 }), log: '真实脆弱引发共鸣，巩固"养成系"陪伴感，状态有所恢复。' },
      { text: '发布新目标，如"一个月内攻破这支舞"', effect: () => ({ dance: 3, fans: 1, health: -1 }), log: '将情绪转化为具体行动，显得有规划，但压力更大。' }
    ]
  },
  {
    id: 'social_hybrid_identity',
    type: 'SOCIAL',
    title: '"文化杂糅"争议',
    description: '你发布了一段融合传统戏曲腔调的流行歌曲翻唱，被一部分人盛赞"文化传承新火花"，却被另一部分人抨击"不伦不类"、"蹭传统文化热度"。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.stats.vocal > 55 && chance(20),
    options: [
      { text: '发布创作思路长文，致敬戏曲老师', effect: () => ({ vocal: 3, ethics: 2, fans: 1 }), log: '展现诚意和专业度，获得主流文化媒体点赞，争议转化为口碑。' },
      { text: '与戏曲名家直播连麦，现场请教', effect: () => ({ ethics: 3, eq: 2, fans: -1 }), log: '用行动打破"蹭热度"质疑，树立虚心好学的青年形象，但传统派仍不满。' },
      { text: '继续发布系列作品，用质量回应争议', effect: () => ({ vocal: 4, fans: 1, health: -2 }), log: '用持续产出证明不是玩票，但陷入长期争议且创作压力大。' }
    ]
  },
  {
    id: 'social_viral_hashtag',
    type: 'SOCIAL',
    title: '莫名的话题爆款',
    description: '你三年前发的一条普通日常博文，突然被段子手挖出，配上新的解读，衍生出#XXX的松弛感哲学#话题，阅读量破亿。你完全不知道它为什么火了。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(15),
    options: [
      { text: '顺应热度，发新图配文"保持松弛"', effect: () => ({ fans: 4, eq: 1, ethics: -1 }), log: '轻松接住流量，强化新人设，热度最大化，但被批"迎合"。' },
      { text: '考古其他旧博，制造连续话题', effect: () => ({ fans: 3, eq: -1, health: -1 }), log: '有运营思维，但过度消费过去显得刻意，且耗费精力。' },
      { text: '不作回应，怕说多错多', effect: () => ({ fans: 2, ethics: 2 }), log: '保持神秘感，让话题自然发酵，但错失最大涨粉机会。' }
    ]
  },
  {
    id: 'social_fan_art_feature',
    type: 'SOCIAL',
    title: '神仙画手粉丝',
    description: '一位粉丝为你创作的古典水墨风格肖像画技惊四座，在画手圈疯传。画手本人@你，希望得到回应。',
    stage: GameStage.AMATEUR,
    isMandatory: true,
    repeatable: false,
    trigger: (s) => s.stats.fans > 40 && chance(30),
    options: [
      { text: '设为微博头像，并公开感谢', effect: () => ({ fans: 4, ethics: 2, looks: -2 }), log: '最高规格认可，画手狂喜，粉丝凝聚力暴增，但部分人觉得画风不符。' },
      { text: '转发并提议以双方名义进行公益拍卖', effect: () => ({ ethics: 4, fans: 2, health: -3 }), log: '将粉丝热爱转化为社会价值，格调飙升，但拍卖流程复杂耗时。' },
      { text: '私信感谢，并询问能否用作专辑封面灵感', effect: () => ({ vocal: 2, fans: 2, eq: 1 }), log: '尊重版权且用于专业领域，展现音乐人素养。' }
    ]
  },

  // =================================================================
  // 2. GENERIC RANDOM EVENTS (突发事件 - ONLY AMATEUR)
  // =================================================================
  {
    id: 'random_rainy_day_revamped',
    type: 'RANDOM',
    title: '暴雨中的抉择',
    description: '突遇暴雨，没带伞，但公司门口有站姐在蹲守拍摄。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => true,
    options: [
      { text: '冒雨狂奔保持形象', effect: () => ({ health: -3, looks: 1, fans: 1 }), log: '“破碎感美少年”路透出圈，但当晚就发烧了。' },
      { text: '借伞并与站姐互动', effect: () => ({ ethics: 2, fans: 2, health: 1 }), log: '暖心举动被大加称赞，但被经纪人提醒注意分寸。' },
      { text: '直接叫车无视拍摄', effect: () => ({ fans: -1, health: 1, eq: -1 }), log: '被解读为“脾气大”、“不珍惜粉丝”，口碑小跌。' }
    ]
  },
  {
    id: 'random_equipment_fail_revamped',
    type: 'RANDOM',
    title: '直播设备暴雷',
    description: '首次个人直播，麦克风突然啸叫，弹幕开始嘲笑。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 30 && chance(30),
    options: [
      { text: '撒娇卖萌求原谅', effect: () => ({ fans: 2, eq: 1, vocal: -1 }), log: '“笨蛋美人”设定意外吸粉，但被指不够专业。' },
      { text: '淡定处理并清唱', effect: () => ({ vocal: 2, fans: 1, ethics: 1 }), log: '临场反应获赞，用实力扭转局面，展现大将之风。' },
      { text: '脸色不悦中断直播', effect: () => ({ fans: -3, ethics: -2 }), log: '“糊咖还耍大牌”登上实时话题，掉粉严重。' }
    ]
  },
  {
    id: 'random_roommate_revamped',
    type: 'RANDOM',
    title: '室友是“敌人”',
    description: '你发现室友偷偷在录你打呼噜的视频，想做成黑料。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(25),
    options: [
      { text: '当面揭穿并警告', effect: () => ({ ethics: 1, eq: -2, health: -1 }), log: '关系彻底破裂，宿舍变成战场，日夜提防心力交瘁。' },
      { text: '找公司申请调换', effect: () => ({ ethics: -1, fans: -1 }), log: '申请被驳回，反而被公司认为“事多难搞”。' },
      { text: '反向收集他的黑料', effect: () => ({ ethics: -3, eq: 2 }), log: '手握把柄互相制衡，表面和平但内心黑暗值+1。' }
    ]
  },
  {
    id: 'random_variety_revamped',
    type: 'RANDOM',
    title: '撞型的综艺邀约',
    description: '一档热门综艺邀请你，但同期受邀的还有你的直接竞品练习生。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 50 && chance(30),
    options: [
      { text: '接下，并准备艳压', effect: () => ({ dance: 2, vocal: 1, health: -2 }), log: '通宵练习准备杀手锏，决心在镜头前一决高下。' },
      { text: '婉拒，专注练习室', effect: () => ({ ethics: 2, fans: -2 }), log: '被粉丝怒其不争，但赢得了“沉得住气”的业内口碑。' },
      { text: '接下，主动示好组CP', effect: () => ({ fans: 3, ethics: -1, eq: 1 }), log: '节目效果拉满，热度飙升，但纯粉痛心疾首。' }
    ]
  },
  {
    id: 'random_voice_change_revamped',
    type: 'RANDOM',
    title: '考核前夜失声',
    description: '月度考核前一天，你因重感冒完全失声，舞蹈却是弱项。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.vocal > 40 && chance(25),
    options: [
      { text: '打封闭针硬上', effect: () => ({ vocal: -3, dance: 2, ethics: 1 }), log: '舞蹈惊艳全场，但声带损伤，被老师痛斥不爱惜羽毛。' },
      { text: '放弃演唱，纯舞蹈', effect: () => ({ dance: 3, vocal: -2, fans: 1 }), log: '扬长避短策略成功，但“哑巴爱豆”的标签暂时摘不掉了。' },
      { text: '申请延期并加练', effect: () => ({ ethics: -1, health: 2, dance: 1 }), log: '错过最佳展示期，但身体恢复，舞蹈也有进步。' }
    ]
  },
  {
    id: 'random_mental_breakdown',
    type: 'RANDOM',
    title: '临界点',
    description: '在又一次被否定后，长期积累的压力终于将你击垮。',
    stage: GameStage.AMATEUR,
    isMandatory: true,
    repeatable: false,
    trigger: (s) => s.stats.health < 35 && s.stats.eq < 40,
    options: [
      { text: '在练习室痛哭一场', effect: () => ({ health: 1, eq: 1, ethics: -1 }), log: '泪水冲刷了部分压力，但“爱哭鬼”的标签悄悄贴上了。' },
      { text: '消失一天，独自散心', effect: () => ({ health: 2, fans: -2, ethics: -2 }), log: '身心得到了喘息，公司震怒，粉丝担忧变成埋怨。' },
      { text: '找最严苛的老师倾诉', effect: () => ({ eq: 3, vocal: 1, dance: 1 }), log: '意外的坦诚获得了指导，关系破冰，心境豁然开朗。' }
    ]
  },
  {
    id: 'random_fan_script',
    type: 'RANDOM',
    title: '粉丝写的“剧本”',
    description: '大粉为你写了详细的“逆袭剧本”，要求你按她的规划发展。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 60 && chance(30),
    options: [
      { text: '私下感谢但婉拒', effect: () => ({ fans: -1, ethics: 3, eq: 2 }), log: '大粉觉得不被需要，脱粉回踩，但守住了自主权。' },
      { text: '选择性采纳建议', effect: () => ({ fans: 2, ethics: 1 }), log: '与大粉结成战略同盟，她成为你的“民间宣传总监”。' },
      { text: '完全照做，失去自我', effect: () => ({ fans: 3, eq: -3, vocal: -1 }), log: '数据短期飙升，但你感觉自己像个被操纵的提线木偶。' }
    ]
  },
  {
    id: 'random_trend_challenge',
    type: 'RANDOM',
    title: '挑战热门舞',
    description: '一段超高难度的网红舞蹈挑战席卷全网。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => true,
    options: [
      { text: '翻跳并@原编舞', effect: () => ({ dance: 3, fans: 2, health: -1 }), log: '展现实力，获得原编舞认可。' },
      { text: '改编简单版教粉丝', effect: () => ({ dance: 1, fans: 3, eq: 1 }), log: '贴心又亲民，拉近粉丝距离。' },
      { text: '无视，练自己的', effect: () => ({ dance: 1 }), log: '专注自身，但错过热点。' }
    ]
  },
  {
    id: 'random_company_rule',
    type: 'RANDOM',
    title: '公司新规',
    description: '公司突然宣布，练习生社交媒体全部交由团队审核。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => chance(20),
    options: [
      { text: '理解并配合', effect: () => ({ ethics: 2, eq: 1 }), log: '听话的乖孩子，公司好感up。' },
      { text: '用小号继续冲浪', effect: () => ({ ethics: -1, fans: 1 }), log: '保留一丝真实的自我。' },
      { text: '公开抱怨不自由', effect: () => ({ ethics: -2, fans: -1 }), log: '被约谈，贴上“难搞”标签。' }
    ]
  },
  {
    id: 'random_fan_project',
    type: 'RANDOM',
    title: '应援撞车',
    description: '生日将至，两个粉丝站策划了风格迥异的应援方案。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 55 && chance(30),
    options: [
      { text: '含蓄表达偏好A', effect: () => ({ fans: 2, ethics: -1 }), log: '一家欢喜一家愁，内部暗流涌动。' },
      { text: '发博感谢所有心意', effect: () => ({ fans: 1, ethics: 2, eq: 1 }), log: '端水大师，平稳度过。' },
      { text: '提议将资金合并做公益', effect: () => ({ ethics: 4, fans: -1 }), log: '格局超大，但部分粉丝失落。' }
    ]
  },
  {
    id: 'random_meme_king',
    type: 'RANDOM',
    title: '表情包大户',
    description: '你各种失控的表情被粉丝做成表情包，广为流传。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 35 && chance(30),
    options: [
      { text: '自己也用得不亦乐乎', effect: () => ({ fans: 3, eq: 2 }), log: '彻底放飞，亲和力MAX。' },
      { text: '请求粉丝别用丑照', effect: () => ({ looks: 1, fans: -2 }), log: '偶像包袱略重，劝退整活粉。' },
      { text: '出官方联名表情包', effect: () => ({ fans: 2, ethics: 1 }), log: '商业化思维，赢麻了。' }
    ]
  },
  {
    id: 'random_group_project',
    type: 'RANDOM',
    title: '小组作业',
    description: '老师布置了编舞任务，你的组员们各有想法，争执不下。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(35),
    options: [
      { text: '强势拍板定方案', effect: () => ({ dance: 2, ethics: -1 }), log: '效率高，但被说独断。' },
      { text: '耐心协调求共识', effect: () => ({ ethics: 3, eq: 2, dance: -1 }), log: '团队和谐，但进度稍慢。' },
      { text: '摆烂让他们决定', effect: () => ({ dance: -1, health: 1 }), log: '省心了，但参与度低。' }
    ]
  },
  {
    id: 'random_hand_slip',
    type: 'RANDOM',
    title: '手滑点赞',
    description: '你不小心点赞了一条吐槽队友实力的微博。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 30 && chance(30),
    options: [
      { text: '立刻取消', effect: () => ({ ethics: -1, fans: -1 }), log: '被手速快的网友截图了。' },
      { text: '装被盗号', effect: () => ({ fans: -2, eq: -1 }), log: '信的人不多，略显尴尬。' },
      { text: '夸队友转移焦点', effect: () => ({ ethics: 2, eq: 1 }), log: '危机公关，挽回形象。' }
    ]
  },
  {
    id: 'random_fan_edit',
    type: 'RANDOM',
    title: '神级二创',
    description: '有粉丝为你做了爆款安利视频，一夜百万播放。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.stats.fans > 40 && chance(25),
    options: [
      { text: '转发感谢', effect: () => ({ fans: 3, ethics: 2 }), log: '粉丝狂喜，产出热情高涨。' },
      { text: '私下联系送礼物', effect: () => ({ fans: 2, ethics: -1 }), log: '被传私联，引起小范围争议。' },
      { text: '装作没看见', effect: () => ({ fans: -1, eq: -1 }), log: '产出粉心凉了半截。' }
    ]
  },
  {
    id: 'random_diet_fail',
    type: 'RANDOM',
    title: '破戒暴食',
    description: '严格管理期，深夜没忍住点了一整只炸鸡外卖。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(20),
    options: [
      { text: '充满罪恶感吃完', effect: () => ({ health: -1, looks: -1 }), log: '味蕾满足，体重哭泣。' },
      { text: '只吃一口就扔掉', effect: () => ({ health: 1, ethics: -1 }), log: '浪费食物，心在滴血。' },
      { text: '拉上室友一起放纵', effect: () => ({ health: -1, ethics: 1 }), log: '快乐翻倍，脂肪也翻倍。' }
    ]
  },
  {
    id: 'random_live_mistake',
    type: 'RANDOM',
    title: '直播事故',
    description: '公司安排的日常直播，你忘记关麦说了句大实话。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(25),
    options: [
      { text: '赶紧装信号不好', effect: () => ({ eq: -1, fans: -1 }), log: '演技生硬，欲盖弥彰。' },
      { text: '大方承认并圆场', effect: () => ({ fans: 2, eq: 2 }), log: '真实人设，意外吸粉。' },
      { text: '甩锅给隔壁声音', effect: () => ({ ethics: -2 }), log: '被指甩锅，情商遭疑。' }
    ]
  },
  {
    id: 'random_social_media',
    type: 'RANDOM',
    title: '营业困难症',
    description: '经纪人催你发微博，但你毫无灵感，不想营业。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => chance(30),
    options: [
      { text: '发张练习室汗颜', effect: () => ({ fans: 1, dance: 1 }), log: '固粉成功，显得努力。' },
      { text: '分享一首emo歌', effect: () => ({ fans: -1, vocal: 1 }), log: '小众歌单，掉粉预警。' },
      { text: '发段清唱挑战', effect: () => ({ fans: 2, health: -1 }), log: '展现实力，但准备到很晚。' }
    ]
  },
  {
    id: 'random_fan_clash',
    type: 'RANDOM',
    title: '粉丝内战',
    description: '你的唯粉和队内CP粉在超话里吵得不可开交。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 60 && chance(35),
    options: [
      { text: '发博呼吁“爱是唯一”', effect: () => ({ fans: -2, ethics: 3 }), log: '端水失败，两边都得罪。' },
      { text: '空降唯粉群安慰', effect: () => ({ fans: 2, ethics: -1 }), log: '唯粉狂喜，CP粉心碎。' },
      { text: '什么都不做', effect: () => ({ fans: -1, eq: 1 }), log: '冷处理，等待自然平息。' }
    ]
  },
  {
    id: 'random_windfall',
    type: 'RANDOM',
    title: '一夜爆火',
    description: '你早期一个搞笑reaction视频被营销号搬运，全网玩梗。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans < 70 && chance(20),
    options: [
      { text: '顺势玩梗', effect: () => ({ fans: 4, eq: 2 }), log: '接住流量，路人缘大涨。' },
      { text: '觉得羞耻想删掉', effect: () => ({ fans: -2, ethics: -1 }), log: '被说“又当又立”，错过机会。' },
      { text: '严肃声明维护形象', effect: () => ({ looks: 1, fans: -3 }), log: '梗图变黑图，劝退路人。' }
    ]
  },
  {
    id: 'random_mukbang',
    type: 'RANDOM',
    title: '吃播邀约',
    description: '有美食UP主想邀请你合作一期探店吃播。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 35 && chance(25),
    options: [
      { text: '欣然接受', effect: () => ({ fans: 2, health: -2 }), log: '展现亲和力，但身材管理告急。' },
      { text: '以身材管理拒绝', effect: () => ({ looks: 1, fans: -1 }), log: '被夸自律，也被说放不开。' },
      { text: '改成健康餐教程', effect: () => ({ health: 1, fans: 1 }), log: '巧妙转化，符合人设。' }
    ]
  },
  {
    id: 'random_misunderstanding',
    type: 'RANDOM',
    title: '被传绯闻',
    description: '和异性练习生吃饭被拍，八卦号暗示你们在恋爱。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(20),
    options: [
      { text: '立刻发声明澄清', effect: () => ({ ethics: 1, fans: -1 }), log: '澄清迅速，但略显无情。' },
      { text: '开玩笑式否认', effect: () => ({ fans: 1, eq: 2 }), log: '轻松化解，展现高情商。' },
      { text: '冷处理', effect: () => ({ fans: -2 }), log: '谣言愈演愈烈。' }
    ]
  },
  {
    id: 'random_costume',
    type: 'RANDOM',
    title: '私服出圈',
    description: '你机场穿的一套平价私服被扒出链接，卖到断货。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.looks > 40 && chance(25),
    options: [
      { text: '开心认领“带货王”', effect: () => ({ fans: 3, looks: 1 }), log: '时尚感受认可，商业价值初显。' },
      { text: '呼吁理性消费', effect: () => ({ ethics: 2, fans: 1 }), log: '格局打开，获得好评。' },
      { text: '以后只穿大牌', effect: () => ({ ethics: -1, fans: -1 }), log: '被吐槽“红了就飘”。' }
    ]
  },
  {
    id: 'random_practice_rival',
    type: 'RANDOM',
    title: '卷王队友',
    description: '同队练习生每天比你早到两小时，无形中压力巨大。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(30),
    options: [
      { text: '比他更早到', effect: () => ({ dance: 2, vocal: 1, health: -2 }), log: '实力进步，但身体透支。' },
      { text: '调整自己节奏', effect: () => ({ health: 1, eq: 2 }), log: '拒绝内耗，心态平稳。' },
      { text: '散布他开小灶谣言', effect: () => ({ ethics: -3, dance: -1 }), log: '心思不正，实力也落下了。' }
    ]
  },
  {
    id: 'random_antis',
    type: 'RANDOM',
    title: '黑粉狙击',
    description: '一个职业黑粉号开始持续发你的“黑料”和恶意P图。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.stats.fans > 45 && chance(30),
    options: [
      { text: '发律师函警告', effect: () => ({ fans: 1, ethics: 1 }), log: '态度强硬，吓退一部分人。' },
      { text: '用搞笑P图反击', effect: () => ({ fans: 2, eq: 1 }), log: '化戾气为笑料，路人转粉。' },
      { text: '视而不见专注练习', effect: () => ({ vocal: 1, dance: 1, health: -1 }), log: '用实力说话，但心情受影响。' }
    ]
  },
  {
    id: 'random_high_note',
    type: 'RANDOM',
    title: '声乐瓶颈',
    description: '连续一周高音上不去，老师说你没天赋。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
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
    description: '评论区说你“发腮”、“馒化”，像发面馒头。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.looks > 50 && chance(30),
    options: [
      { text: '怒晒健身照', effect: () => ({ looks: 2, health: 1 }), log: '用腹肌说话。' },
      { text: '发素颜怼脸拍', effect: () => ({ looks: 1, fans: 2 }), log: '妈粉护体。' },
      { text: '删评闭麦', effect: () => ({ health: -2 }), log: '玻璃心碎了。' }
    ]
  },
  {
    id: 'random_old_pic',
    type: 'RANDOM',
    title: '旧照曝光',
    description: '你高中时期的非主流照片被同学曝光。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(25),
    options: [
      { text: '自嘲黑历史', effect: () => ({ fans: 3, ethics: 2 }), log: '沙雕出圈。' },
      { text: '举报删帖', effect: () => ({ fans: -2, ethics: -2 }), log: '被网友说玩不起。' },
      { text: 'P成表情包', effect: () => ({ fans: 2, ethics: 1 }), log: '自黑式营销。' }
    ]
  },
  {
    id: 'random_teacher_critic',
    type: 'RANDOM',
    title: '老师批评',
    description: '声乐老师当众说：“你怎么还是找不着调？”',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.vocal < 40 && chance(40),
    options: [
      { text: '当场落泪', effect: () => ({ vocal: 1, ethics: 2 }), log: '老师心软了。' },
      { text: '默默练习', effect: () => ({ vocal: 3, health: -1 }), log: '偷偷努力惊艳所有人。' },
      { text: '顶嘴辩解', effect: () => ({ vocal: -1, ethics: -2 }), log: '被老师标记为“态度差”。' }
    ]
  },
  {
    id: 'random_family',
    type: 'RANDOM',
    title: '家人来电',
    description: '妈妈打电话问你什么时候放弃做爱豆。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(25),
    options: [
      { text: '保证会出道', effect: () => ({ ethics: -2, health: -1}), log: '压力山大。' },
      { text: '撒娇求支持', effect: () => ({ ethics: 3, fans: 1 }), log: '家人心软了。' },
      { text: '沉默挂电话', effect: () => ({ ethics: -3, health: -1 }), log: '情绪低落。' }
    ]
  },
  {
    id: 'random_metro',
    type: 'RANDOM',
    title: '地铁被认',
    description: '素颜坐地铁被粉丝偶遇了。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 20 && chance(30),
    options: [
      { text: '亲切合影', effect: () => ({ fans: 2, ethics: 1 }), log: '粉丝直呼“哥哥好近人”。' },
      { text: '婉拒但签名', effect: () => ({ fans: 1, ethics: -1 }), log: '被说有点架子。' },
      { text: '低头装路人', effect: () => ({ fans: -1, ethics: -1 }), log: '被扒出后说“糊咖装大牌”。' }
    ]
  },
  {
    id: 'random_stray_cat',
    type: 'RANDOM',
    title: '流浪猫',
    description: '公司楼下出现了一只脏兮兮的小橘猫，正冲你喵喵叫。',
    stage: GameStage.AMATEUR,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => true,
    options: [
      { text: '喂它根火腿肠', effect: () => ({ ethics: 2, fans: 1 }), log: '它蹭了蹭你的裤脚。' },
      { text: '带去宠物医院', effect: () => ({ health: -1, ethics: 3, fans: 1 }), log: '善良的举动被路人拍到了。' },
      { text: '无视走开', effect: () => ({ ethics: -1 }), log: '心里有点过意不去。' }
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
    repeatable: false,
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
    repeatable: false,
    trigger: (s) => s.stats.fans > 60 && chance(40),
    options: [
      { text: '配合营业', effect: () => ({ fans: 4, ethics: -3 }), log: 'CP粉狂欢，毒唯气炸。' },
      { text: '保持距离', effect: () => ({ fans: -3, ethics: 2 }), log: '被节目组防爆。' },
      { text: '暗示自己是直男', effect: () => ({ fans: 1, ethics: 1 }), log: '端水但两边不讨好。' }
    ]
  },
  {
    id: 'show_social_cp',
    type: 'SHOW',
    title: 'CP营业',
    description: '你和队友的合影被CP粉疯狂转发，热度惊人。',
    stage: GameStage.SHOW,
    isMandatory: false,
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
    trigger: (s) => s.stats.fans > 100 && chance(25),
    options: [
      { text: '起诉造谣', effect: () => ({ fans: 3, ethics: 2 }), log: '用法律维权。' },
      { text: '冷处理', effect: () => ({ fans: -4, ethics: -2 }), log: '塌房实锤既视感。' },
      { text: '直播澄清', effect: () => ({ health: -3, fans: 3 }), log: '很累，但粉丝很感动。' }
    ]
  },
  {
    id: 'show_teammate',
    type: 'SHOW',
    title: '队友被黑',
    description: '队友被爆恋爱，找你打掩护。',
    stage: GameStage.SHOW,
    isMandatory: false,
    repeatable: false,
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
    repeatable: false,
    trigger: (s) => chance(20),
    options: [
      { text: '自嘲学历低但业务强', effect: () => ({ vocal: 2, dance: 2 }), log: '转移焦点。' },
      { text: '晒毕业证', effect: () => ({ fans: -1, ethics: -1 }), log: '越描越黑。' },
      { text: '不回应', effect: () => ({ fans: -2 }), log: '被嘲默认。' }
    ]
  },
  {
    id: 'show_love',
    type: 'SHOW',
    title: '恋爱风波',
    description: '网传你在和女生单独吃饭，其实是表妹。',
    stage: GameStage.SHOW,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => s.stats.fans > 80 && chance(30),
    options: [
      { text: '立即澄清', effect: () => ({ fans: 2 }), log: '速度够快，影响较小。' },
      { text: '让表妹出面澄清', effect: () => ({ fans: -1, eq: -2 }), log: '群众不信，越扒越有。' },
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
    trigger: (s) => s.showTurnCount === 2,
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
    description: '初舞台评级，导师们一脸严肃。你准备以什么样的作品登场？',
    stage: GameStage.SHOW,
    useAiForOutcome: false,
    isMandatory: true,
    repeatable: false,
    trigger: (s) => s.showTurnCount === 1,
    options: [
      { text: '听导演组安排', 
        effect: (s) => {
            if (s.stats.looks >= 100 && s.stats.fans >= 100 && s.stats.vocal + s.stats.dance >= 150) {
              return { fans: 5, vocal: 2, dance: 2, log: '导演看重你的颜值和粉丝基数，给你了剧本' };
            } else {
              return { fans: -8, ethics: -2, log: '实力不足，喜提祭天剧本：糖果超甜。' };
            }
        }
      },
      { text: '展示专业能力的舞台', effect: () => ({vocal:2, fans: -2, ethics: +3 }), log: '被一剪梅。' },
      { text: '听公司安排', effect: () => ({ looks:+2, eq:+1, fans:+3 }), log: '公司发力了' }
    ] 
  },
  {
    id: 'show_dorm_live',
    type: 'SHOW',
    title: '宿舍直播',
    description: '节目组要求你们宿舍开直播互动。',
    stage: GameStage.SHOW,
    isMandatory: false,
    repeatable: false,
    trigger: (s) => chance(40),
    options: [
      { text: '主动cue流程', effect: () => ({ fans: 2, ethics: 1 }), log: '展现了队长潜质。' },
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
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
    repeatable: false,
    trigger: (s) => s.showTurnCount > 10,
    options: [
      { text: '让粉丝别氪金', effect: () => ({ fans: 3, ethics: 3 }), log: '清流爱豆，但可能出不了道。' },
      { text: '暗示粉丝打投', effect: () => ({ fans: 4, ethics: -2 }), log: '被嘲"又当又立"。' },
      { text: '听天由命', effect: () => ({ ethics: 1 }), log: '佛系选手。' }
    ]
  }
];
