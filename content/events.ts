
import { GameEvent, GameStage, Company } from '../types';

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
          log: '你花了很长时间认真写下鼓励的话。后来得知那位朋友真的深受鼓舞，奇迹般挺过了危险期。',
          flags: { angel_reply: true }
        }) 
      },
      { 
        text: '装没看见，私信万一是骗人的', 
        effect: () => ({ eq: 2, ethics: -1, log: '虽然避免了风险，但心里总觉得有点不安。' }) 
      }
    ]
  },

    {
    id: 'social_fans_urge',
    type: 'SOCIAL',
    title: '粉丝催营业',
    description: '好久没营业，看到评论区全是“生产队的驴都不敢这么歇”，想着今天发点啥',
    stage: GameStage.AMATEUR,
    isMandatory: true,
    repeatable: false,
    useAiForOutcome: false,
    trigger: (s) => s.time.age === 16 && s.time.quarter === 1,
    options: [
      { text: '发一张对镜模糊自拍，配文“在练”', effect: () => ({ fans: 1, dance: 1 }), log: '经典“薛定谔的营业”，粉丝一边吐槽“糊弄学大师”一边点赞。' },
      { text: '开20分钟直播，闲聊吃点东西', effect: () => ({ fans: 3, eq: 1, health: -1 }), log: '猝不及防的直播让粉丝惊喜，真实又放松。' },
      { text: '发旧照九宫格，配文“库存清仓”', effect: () => ({ fans: 2, ethics: -2 }), log: '效果不错，但被部分粉丝指出是旧图，批评不够诚意。' }
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
      { 
        text: '激动回复并私信联系', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: 2, vocal: 1, health: -3, log: '过于急切，有收获，但回复质量欠佳。' };
          } else if (s.stats.eq <= 70) {
            return { fans: 2, vocal: 2, health: -2, log: '果断抓住机会，粉丝狂赞"是金子总会发光"，但熬夜联系导致疲惫。' };
          } else {
            return { fans: 4, vocal: 3, eq: 1, log: '热情而不失分寸的回应，既展现渴望又体现专业，公司印象极佳。' };
          }
        }
      },
      { 
        text: '矜持感谢', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: 1, eq: -1, log: '看起来有点高冷。' };
          } else if (s.stats.eq <= 70) {
            return { fans: 1, ethics: 1, log: '表现沉稳有分寸，路人缘提升。' };
          } else {
            return { fans: 3, ethics: 3, eq: 2, log: '谦逊有礼的回应，既表达感谢又留足谈判空间。' };
          }
        }
      },
      { 
        text: '谨慎核实账号真伪后再回应', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: -2, ethics: 2, eq: -1, log: '公开质疑对方是骗子，后发现是官方，场面尴尬。' };
          } else if (s.stats.eq <= 70) {
            return { fans: -1, ethics: 2, eq: 1, log: '行事稳妥获好评，但错过了最佳回应时机，热度流失。' };
          } else {
            return { fans: 1, ethics: 3, eq: 2, log: '私下快速核实后，公开发布专业得体的合作意向，赢得"谨慎聪明"标签。' };
          }
        }
      }
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
      { 
        text: '正常互动，不避嫌也不迎合', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: 1, eq: -2, ethics: -2, log: '互动生硬，被解读为"被迫营业"，两边不讨好。' };
          } else if (s.stats.eq <= 70) {
            return { fans: 3, eq: 2, ethics: -1, log: '"社会主义兄弟情"引发热议，两人热度齐飞，但唯粉有些不满。' };
          } else {
            return { fans: 4, eq: 3, ethics: 1, log: '互动自然有趣，既满足CP粉想象又用坦荡态度稳住唯粉，热度口碑双收。' };
          }
        }
      },
      { 
        text: '发单人练习视频，强调个人成长', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: -2, dance: 1, ethics: 1, log: '能力提升，但文案指向拒绝捆绑导致CP粉大规模脱粉。' };
          } else if (s.stats.eq <= 70) {
            return { fans: -1, dance: 2, ethics: 1, log: '稳住唯粉基本盘，但CP粉觉得刻意，部分脱粉。' };
          } else {
            return { fans: 1, dance: 3, eq: 2, log: '巧妙将个人练习与合作关联，既展示实力又不忘队友，端水大师。' };
          }
        }
      },
      { 
        text: '点赞CP二创视频，但配文"友情万岁"', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: -2, eq: -3, ethics: -1, log: '点赞尺度较大的视频，引发轩然大波，唯粉暴怒。' };
          } else if (s.stats.eq <= 70) {
            return { fans: 1, eq: 1, ethics: -2, log: 'CP粉狂欢"正主发糖"，热度爆炸，但唯粉强烈不满。' };
          } else {
            return { fans: 3, eq: 2, ethics: -1, log: '精准点赞无害二创，配文高情商，既玩梗又明确边界，效果拉满。' };
          }
        }
      }
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
      { 
        text: '公开发声：爱是陪伴，不必破费', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { ethics: 1, fans: -3, eq: -2, log: '语气生硬像说教，大粉觉得被当众打脸，带头脱粉。' };
          } else if (s.stats.eq <= 70) {
            return { ethics: 2, fans: -1, eq: 1, log: '树立正能量偶像形象，获主流媒体点赞，但部分大粉觉得被背刺。' };
          } else {
            return { ethics: 3, fans: 1, eq: 1, log: '温柔而坚定地引导，并提议将集资转为公益捐款，危机变美谈。' };
          }
        }
      },
      { 
        text: '默默转发一条反诈宣传微博', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: -3, ethics: 1, eq: -1, log: '转发语带嘲讽，被解读为暗指粉丝"人傻钱多"，引发众怒。' };
          } else if (s.stats.eq <= 70) {
            return { fans: -1, ethics: 2, eq: 2, log: '含蓄表态，聪明人懂了，但集资粉觉得被内涵而脱粉。' };
          } else {
            return { ethics: 3, eq: 3, log: '在合适时机转发，并评论"保护钱包"，既提醒风险又不伤感情。' };
          }
        }
      },
      { 
        text: '发布感谢视频，但强调"量力而行"', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: 1, health: -3, log: '感谢词虚伪，强调"量力而行"时表情勉强，被认为既想拿钱又立牌坊。' };
          } else if (s.stats.eq <= 70) {
            return { fans: 2, ethics: 1, health: -2, log: '安抚了粉丝热情，但被部分人认为变相鼓励，压力增大。' };
          } else {
            return { fans: 4, ethics: 2, health: -1, log: '真诚感谢每一份心意，并分享攒钱故事，强调心意大于金额，感人至深。' };
          }
        }
      }
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
      { 
        text: '顺势发布完整编曲版', 
        effect: (s) => {
          if (s.stats.vocal < 60) {
            return { vocal: 2, fans: 2, health: -3, log: '急于求成，编曲版完成度低，被嘲"见光死"，口碑反转。' };
          } else if (s.stats.vocal <= 150) {
            return { vocal: 3, fans: 3, health: -1, log: '才华得到认证，音乐人社区纷纷关注，但熬夜编曲影响状态。' };
          } else {
            return { vocal: 4, fans: 4, health: -1, log: '发布高质量编曲并附教程，专业又亲民，圈粉无数。' };
          }
        }
      },
      { 
        text: '害羞表示只是瞎玩，感谢大家喜欢', 
        effect: (s) => {
          if (s.stats.vocal < 60) {
            return { fans: 0, ethics: 0, eq: -1, log: '害羞得语无伦次，被说"上不得台面"，浪费出圈机会。' };
          } else if (s.stats.vocal <= 150) {
            return { fans: 1, ethics: 1, eq: 1, log: '谦逊人设更讨喜，粉丝保护欲激增。' };
          } else {
            return { fans: 3, ethics: 3, eq: 2, log: '以幽默自嘲回应，既展现才华又不炫耀，路人缘爆棚。' };
          }
        }
      },
      { 
        text: '借此机会发起音乐挑战，邀请粉丝参与', 
        effect: (s) => {
          if (s.stats.vocal < 60) {
            return { vocal: 1, fans: -1, eq: -2, log: '挑战玩法规则混乱，奖品不合理，引发粉丝内耗和不满。' };
          } else if (s.stats.vocal <= 150) {
            return { fans: 3, health: -2, log: '将热度转化为互动，但挑战玩法设计很耗精力。' };
          } else {
            return { vocal: 2, fans: 3, eq: 2, log: '发起门槛低、趣味性强的挑战，带动全民参与，成功转化热度。' };
          }
        }
      }
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
    useAiForOutcome: false,
    trigger: (s) => chance(30),
    options: [
      { 
        text: '发训练到凌晨的vlog，配文"汗水不会说谎"', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { dance: 2, eq: -2, log: '怼爽了，但vlog里对B有明显不满表情，被指"情商低"' };
          } else if (s.stats.eq <= 70) {
            return { dance: 2, fans: 2, health: -1, log: '用行动打脸，过度训练影响健康。' };
          } else {
            return { dance: 2, fans: 3, ethics: 1, log: 'vlog记录刻苦训练，并"不经意"提到B也在陪练，巧妙化解' };
          }
        }
      },
      { 
        text: '在B的直播间刷礼物，并留言"一起加油"', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: -2, eq: -3, log: '送的礼物太便宜被嘲，留言生硬，被解读为"阴阳怪气"。' };
          } else if (s.stats.eq <= 70) {
            return { fans: 1, ethics: 1, log: '展现超高情商和团队意识，化解尴尬，收获路人好评。' };
          } else {
            return { fans: 3, eq: 3, ethics: 2, log: '刷恰到好处的礼物，留言真诚幽默，瞬间扭转舆论，两人CP粉暴涨。' };
          }
        }
      },
      { 
        text: '在个人直播中轻松带过："谁训练累的时候没点抱怨"', 
        effect: (s) => {
          if (s.stats.eq < 40) {
            return { fans: -3, health: 1, log: '直播时脸色不佳，被追问后承认"确实累"，坐实负面标签。' };
          } else if (s.stats.eq <= 70) {
            return { fans: -2, eq: 2, log: '显得豁达，但部分事业粉觉得你不够有冲劲而脱粉。' };
          } else {
            return { fans: 1, eq: 3, health: 2, log: '以自嘲和分享糗事谈压力，既真实又励志，巩固"努力但乐观"人设。' };
          }
        }
      }
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
  useAiForOutcome: false,
  trigger: (s) => chance(40),
  options: [
    { 
      text: '加入狂欢，用自己表情包评论', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 1, health: -2, ethics: -3, log: '在严肃新闻下玩梗，被黑粉批"没有分寸感"' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, eq: 2, ethics: -1, log: '接地气，亲和力MAX，成功破圈，但部分人批评"不严肃"' };
        } else {
          return { fans: 4, eq: 3, ethics: 1, log: '精准在粉丝玩梗区使用，并巧妙引导至舞台安利' };
        }
      }
    },
    { 
      text: '发布原视频慢放版，配文"失误瞬间永留存"', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -1, ethics: 1, log: '文案被黑粉解读为不满，被说"玩不起"、"扫兴"' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, ethics: 2, dance: 1, log: '直面失误，展现专业态度，获得舞者同行尊重' };
        } else {
          return {ethics: 3, dance: 2, eq: 1, log: '不仅发布，还配上幽默的"错误动作分解教学"，自黑到底，赢得满堂彩' };
        }
      }
    },
    { 
      text: '发起二创大赛，征集更有趣的表情包', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 1, health: -2, log: '大赛规则复杂，奖品寒酸，被吐槽"又想白嫖创意"' };
        } else if (s.stats.eq <= 70) {
          return { fans: 1, eq: 1, health: -1, log: '将被动玩梗转化为主动互动，但运营活动耗费精力' };
        } else {
          return { fans: 3, eq: 2, health: -1, log: '发起有趣有奖的二创，并亲自参与评选互动，将玩梗热潮转化为成功粉丝活动' };
        }
      }
    }
  ]
},
{
  id: 'social_scandal_rumor',
  type: 'SOCIAL',
  title: '恋爱绯闻突袭',
  description: '八卦号放出模糊剪影，暗示"某潜力练习生与网红深夜密室约会"，评论区90%的人@了你。',
  stage: GameStage.AMATEUR,
  isMandatory: false,
  repeatable: false,
  useAiForOutcome: false,
  trigger: (s) => s.stats.fans > 70 && chance(30),
  options: [
    { 
      text: '晒出当晚在练习室的监控截图', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { ethics: 2, health: -2, log: '黑粉声称P图痕迹明显，怒和黑粉理论十个回合' };
        } else if (s.stats.eq <= 70) {
          return { ethics: 2, fans: 2, health: -2, log: '"事业批"人设焊死，粉丝感动落泪，但熬夜整理证据疲惫' };
        } else {
          return { ethics: 3, fans: 3, log: '晒出带时间水印的完整练习室录像，并幽默调侃狗仔"拍错人了"，一击致命，口碑逆袭' };
        }
      }
    },
    { 
      text: '发与队友的团建合照，配文"密室，但是一群人"', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -2, ethics: -1, log: '合照里大家表情尴尬，文案生硬，被嘲"此地无银三百两"' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, eq: 1, ethics: -1, log: '巧妙辟谣，展现幽默感，但仍有部分人不信' };
        } else {
          return { fans: 3, ethics: 1, log: '发布欢乐的团建vlog，并"不经意"提到那家密室，用事实和氛围轻松粉碎谣言' };
        }
      }
    },
    { 
      text: '不直接回应，发新歌预告"谣言止于智者"', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { vocal: 1, fans: -3, log: '新歌质量一般，被说"用作品转移视线失败"，显得心虚' };
        } else if (s.stats.eq <= 70) {
          return { vocal: 2, fans: -2, ethics: 1, log: '用作品转移视线，显得有格局，但激进的粉丝脱粉抗议' };
        } else {
          return { vocal: 3, fans: 1, log: '新歌质量上乘，歌词被解读为对谣言的洒脱态度，用实力让争议闭嘴' };
        }
      }
    }
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
    { 
      text: '私信感谢过去的陪伴，祝好', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -3, ethics: 1, eq: -2, log: '私信内容被截图曝光，语气表达不当像官方回复，引发更大范围的粉丝心寒' };
        } else if (s.stats.eq <= 70) {
          return { fans: -1, ethics: 2, eq: 1, log: '体面告别，但未能挽回核心粉丝的流失' };
        } else {
          return { ethics: 3, health: 1 , log: '真诚的私信打动对方，虽未回心转意，但对方删除了过激言论，并转为默默关注' };
        }
      }
    },
    { 
      text: '在直播中分享励志歌曲', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -3, ethics: 1, log: '选的歌曲和分享的心境与事件完全不符，被群嘲"矫情"和"假"' };
        } else if (s.stats.eq <= 70) {
          return { fans: -1, ethics: 2, vocal: 1, log: '传递正能量，稳定军心，但爬墙粉认为虚伪' };
        } else {
          return {ethics: 3, vocal: 1, log: '分享的歌和故事巧妙回应了"失望"的点，真诚而不卖惨，稳住了大部分粉丝' };
        }
      }
    },
    { 
      text: '发布高质量舞台直拍，"用舞台说话"', 
      effect: (s) => {
          return {dance: 2, vocal: 2, fans:2, log: '这个世界不会永远有人爱你，但永远都会有人爱你' };
      }
    }
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
    { 
      text: '谦虚回复前辈，并翻跳其经典作品致敬', 
      effect: (s) => {
        if (s.stats.dance < 60) {
          return { dance: 2, fans: 1, ethics: -2, log: '回复语气过于奉承，翻跳水平也一般，被前辈粉丝嫌弃"硬贴"' };
        } else if (s.stats.dance <= 150) {
          return { dance: 3, fans: 3, ethics: -1, log: '获得前辈粉丝好感，舞技得到公认，但被部分人批"蹭热度"' };
        } else {
          return { dance: 4, fans: 4, ethics: 1, log: '回复不卑不亢，翻跳精准且融入个人风格，获得前辈真心赞赏，合作机会增加' };
        }
      }
    },
    { 
      text: '趁机发起自己的编舞挑战', 
      effect: (s) => {
        if (s.stats.dance < 60) {
          return { dance: 1, fans: 0, health: -2, log: '新编舞被指抄袭前辈风格，引发争议，口碑受损' };
        } else if (s.stats.dance <= 150) {
          return { dance: 2, fans: 2, health: -1, log: '展现创作野心，热度持续，但准备新编舞消耗精力' };
        } else {
          return { dance: 3, fans: 3, eq: 1, health: -1, log: '发起与前辈挑战有联动又有区别的新挑战，既致敬又创新，获得双倍热度' };
        }
      }
    },
    { 
      text: '制作挑战教程视频，帮助更多人参与', 
      effect: (s) => {
        if (s.stats.dance < 60) {
          return { fans: 1, ethics: 1, eq: -2, log: '教程讲解不清，态度不耐烦，被骂"好为人师"' };
        } else if (s.stats.dance <= 150) {
          return { fans: 3, ethics: 2, eq: -1, log: '贴心又专业，拉拢路人缘，但个人锋芒稍减' };
        } else {
          return { fans: 4, ethics: 3, eq: 2, log: '教程清晰有趣，还cue了原挑战的亮点，既推广了挑战又展示了自己的理解和亲和力' };
        }
      }
    }
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
  useAiForOutcome: false,
  trigger: (s) => s.stats.vocal > 60 && chance(15),
  options: [
    { 
      text: '立刻准备原创小样，私信请教', 
      effect: (s) => {
        if (s.stats.vocal < 60) {
          return { vocal: 1, eq: -3, health: -3, log: '小样粗糙，私信长篇大论，留下"急躁冒进"的坏印象' };
        } else if (s.stats.vocal <= 100) {
          return { vocal: 3, eq: 2, health: -3, log: '积极态度获前辈赏识，得到私下指导，但熬夜创作影响状态' };
        } else {
          return { vocal: 4, eq: 3, health: -2, log: '精心准备高质量demo，私信措辞得体有礼貌，获得前辈的详细指点和人脉引荐' };
        }
      }
    },
    { 
      text: '公开表达崇敬，并翻唱前辈冷门佳作致敬', 
      effect: (s) => {
        if (s.stats.vocal < 60) {
          return { vocal: -1, fans: -1, log: '翻唱车祸，公开@前辈，被前辈粉丝骂"毁歌"和"蹭"' };
        } else if  (s.stats.vocal <= 100)  {
          return { vocal: 2, fans: 2, ethics: 1, log: '展现音乐品味和诚意，路人缘好，前辈也感受到尊重' };
        } else {
          return { vocal: 3, fans: 3, ethics: 2, log: '翻唱质量上乘，并精准解读了歌曲内涵，前辈亲自转发称赞"知音"' };
        }
      }
    },
    { 
      text: '先深入研究前辈作品，再择机互动', 
      effect: (s) => {
        if (s.stats.vocal < 60) {
          return { vocal: 1, eq: 1, fans: -2, log: '研究半天不得要领，互动时机已过，热度消散，错失良机' };
        } else if  (s.stats.vocal <= 100) {
          return { vocal: 2, eq: 2, fans: -1, log: '沉稳真诚，但可能错过最佳互动时机，热度稍降' };
        } else {
          return { vocal: 3, eq: 3, fans: 1, log: '深入研究后，在后续作品中巧妙融入从前辈处学到的技巧，被前辈注意到并再次主动提及' };
        }
      }
    }
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
  useAiForOutcome: false,
  trigger: (s) => s.stats.ethics > 50 && chance(30),
  options: [
    { 
      text: '放出全程跟拍vlog，证明自己实干', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { ethics: 1, fans: -1, health: -2, log: 'vlog剪辑混乱，重点模糊，反而坐实了"摆拍"嫌疑' };
        } else if (s.stats.eq <= 70) {
          return { ethics: 3, fans: 2, health: -1, log: '铁证如山，逆转舆论，公益形象更加牢固，但整理素材耗费时间' };
        } else {
          return { ethics: 4, fans: 3, eq: 1, health: -1, log: 'vlog不仅记录劳动，还采访了环卫工人，真诚有深度，赢得广泛赞誉' };
        }
      }
    },
    { 
      text: '诚恳回应：确实有休息，但主要工作都完成了', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { ethics: 0, fans: -3, eq: -2, log: '回应语气冲，说"你行你上啊"，引发二次舆情危机' };
        } else if (s.stats.eq <= 70) {
          return { ethics: 2, fans: -1, eq: 2, log: '诚实但不完美，部分人觉得真实，部分人仍不满意' };
        } else {
          return { ethics: 3, fans: 1, eq: 3, log: '坦然承认不足，并承诺下次做得更好，同时呼吁大家关注公益本身而非个人，格局打开' };
        }
      }
    },
    { 
      text: '发起"一周公益打卡"活动，邀请粉丝一起', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { ethics: 1, fans: -2, health: -3, log: '活动虎头蛇尾，自己都没坚持，被嘲"洗白失败"' };
        } else if (s.stats.eq <= 70) {
          return { ethics: 3, fans: 1, health: -2, log: '将争议转化为长期行动，展现领导力，但需要持续投入精力' };
        } else {
          return { ethics: 4, fans: 2, eq: 2, health: -2, log: '活动设计有趣且有持续性，自己以身作则坚持打卡，成功将负面事件转化为正面长期项目' };
        }
      }
    }
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
    { 
      text: '联合平台发起"尊重原音"倡议，但欣赏技术', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { ethics: 1, eq: -2, fans: -3, log: '倡议书措辞强硬，将技术粉推向对立面，被批"老古董"' };
        } else if (s.stats.eq <= 70) {
          return { ethics: 3, eq: 2, fans: -1, log: '站在道德和科技前沿，展现格局，但激进的科技粉不满' };
        } else {
          return { ethics: 4, eq: 3, fans: 1, log: '发起倡议的同时，与技术粉代表对话，探讨AI与艺术的边界，赢得尊重' };
        }
      }
    },
    { 
      text: '发律师函要求下架所有AI作品', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -4, ethics: 0, vocal: 0, log: '律师函存在漏洞，被对方反嘲，舆论一边倒批评你"小气"' };
        } else if (s.stats.eq <= 70) {
          return { fans: -3, ethics: 1, vocal: 1, log: '坚决维护权益，但被科技爱好者批评"保守"，失去先锋粉丝' };
        } else {
          return { fans: -2, ethics: 2, vocal: 2, eq: 1, log: '通过正规渠道谨慎维权，声明侧重保护创作本身，将负面影响降至最低' };
        }
      }
    },
    { 
      text: '亲自翻唱该歌，发起#人声挑战AI#', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { vocal: 2, fans: 1, health: -3, log: '翻唱水平被AI版吊打，话题沦为笑柄，成为"人类战败"梗' };
        } else if (s.stats.eq <= 70) {
          return { vocal: 3, fans: 4, health: -2, log: '用实力正面刚，话题度拉满，凸显人类歌手的不可替代性，但疲惫' };
        } else {
          return { vocal: 4, fans: 5, eq: 2, health: -1, log: '翻唱版本极具个人特色和情感，并邀请AI作者合作，共同探讨艺术与科技，赢得满堂彩' };
        }
      }
    }
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
  useAiForOutcome: false,
  trigger: (s) => s.stats.looks > 40 && chance(25),
  options: [
    { 
      text: '自嘲："今天负责回收时尚"', 
      effect: (s) => {
        if (s.stats.looks < 60) {
          return { eq: 1, fans: 0, looks: -3, log: '自嘲用力过猛，显得破罐破摔，时尚形象彻底崩塌' };
        } else if (s.stats.looks <= 150) {
          return { eq: 3, fans: 2, looks: -1, log: '高情商化解尴尬，沙雕出圈，但部分颜粉觉得形象受损' };
        } else {
          return { eq: 4, fans: 3, looks: 1, log: '用一系列高级自黑表情包和段子成功控评，将"时尚灾难"扭转成"有效传播案例"' };
        }
      }
    },
    { 
      text: '发另一套备选造型图，配文"你们喜欢哪套？"', 
      effect: (s) => {
        if (s.stats.looks < 60) {
          return { looks: 0, fans: -1, ethics: -2, log: '被指责公开拉踩造型师，业内口碑受损' };
        } else if (s.stats.looks <= 150) {
          return { looks: 2, fans: 2, ethics: -1, log: '巧妙转移焦点，展现可塑性，但可能得罪原造型师' };
        } else {
          return { looks: 3, fans: 3, eq: 2, log: '发布多套造型，并感谢造型师的多种尝试，既展示美貌又体现专业素养' };
        }
      }
    },
    { 
      text: '与造型师直播连线，探讨设计理念', 
      effect: (s) => {
        if (s.stats.looks < 60) {
          return { ethics: 1, eq: -1, fans: -2, log: '直播中多次打断造型师，表情管理失败，场面尴尬' };
        } else if (s.stats.looks <= 150) {
          return { ethics: 3, eq: 2, fans: -1, log: '展现专业度和尊重，提升业内口碑，但部分网友不买账' };
        } else {
          return { ethics: 4, eq: 3, fans: 1, log: '直播中引导造型师讲解创意，自己则真诚分享穿着感受，将"翻车"变成一次成功的时尚科普' };
        }
      }
    }
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
    { 
      text: '疯狂玩梗，化身"娱乐圈绊脚石"', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 2, eq: -3, ethics: -2, log: '玩笑开过头，冒犯到电竞选手及其粉丝，引发跨圈冲突' };
        } else if (s.stats.eq <= 70) {
          return { fans: 4, eq: 2, ethics: -1, log: '综艺感爆棚，成功打入电竞圈，收获大量直男粉丝，但被批"不务正业"' };
        } else {
          return { fans: 5, eq: 3, ethics: 1, log: '玩梗恰到好处，自黑与捧哏结合，与选手互动自然，成为直播名场面，疯狂吸粉' };
        }
      }
    },
    { 
      text: '认真打游戏，虽然菜但不放弃', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 1, ethics: 1, health: -2, log: '过于认真导致气氛沉闷，被观众吐槽"放不开"、"无聊"' };
        } else if (s.stats.eq <= 70) {
          return { fans: 3, ethics: 2, health: -1, log: '"倔强菜鸟"形象惹人怜爱，电竞粉丝认可你的态度，但熬夜游戏疲惫' };
        } else {
          return { fans: 4, ethics: 3, eq: 2, health: -1, log: '认真请教游戏技巧，菜得理直气壮又努力，反差萌拉满，电竞圈好感度飙升' };
        }
      }
    },
    { 
      text: '赛后认真复盘，发布游戏操作学习vlog', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 0, ethics: 1, eq: -1, log: '复盘vlog像作秀，被电竞粉嘲"菜是原罪，别搞这些虚的"' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, ethics: 2, eq: 1, log: '将娱乐转化为学习人设，显得上进，但可能不够"有趣"' };
        } else {
          return { fans: 3, ethics: 3, eq: 2, log: '复盘vlog幽默又不失专业，既展示努力又尊重游戏，成功塑造"谦逊好学"的跨界形象' };
        }
      }
    }
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
    { 
      text: '第二天发练习室挥汗视频，配文"再试一次"', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { dance: 1, fans: 1, health: -3, log: '视频里状态更差，表情痛苦，被批"卖惨"和"自我感动"' };
        } else if (s.stats.eq <= 70) {
          return { dance: 2, fans: 3, health: -2, log: '极致的虐粉与固粉，粉丝忠诚度飙升，"逆袭剧本"开启，但过度训练' };
        } else {
          return { dance: 3, fans: 4, health: -1, eq: 2, log: '视频记录从沮丧到重振旗鼓的过程，真诚有力量，激励了众多粉丝' };
        }
      }
    },
    { 
      text: '开直播谈心，承认压力但也表达坚持', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -2, eq: -1, health: 0, log: '直播中情绪崩溃，语无伦次，反而让粉丝更加担忧和失望' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, eq: 3, health: 1, log: '真实脆弱引发共鸣，巩固"养成系"陪伴感，状态有所恢复' };
        } else {
          return { fans: 3, eq: 4, health: 2, log: '坦诚分享瓶颈与压力，并理性分析解决方法，展现成熟心智，获得广泛共情与支持' };
        }
      }
    },
    { 
      text: '发布新目标，如"一个月内攻破这支舞"', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { dance: 1, fans: -1, health: -2, log: '目标定得过高，后续无法完成，沦为笑柄' };
        } else if (s.stats.eq <= 70) {
          return { dance: 3, fans: 1, health: -1, log: '将情绪转化为具体行动，显得有规划，但压力更大' };
        } else {
          return { dance: 4, fans: 2, eq: 2, health: -1, log: '发布切实可行的阶段性目标，并邀请粉丝监督，将个人压力转化为共同成长的动力' };
        }
      }
    }
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
    { 
      text: '发布创作思路长文，致敬戏曲老师', 
      effect: (s) => {
        if (s.stats.vocal < 60) {
          return { vocal: 1, ethics: 0, fans: -2, log: '长文逻辑混乱，错字连篇，被批"没文化硬蹭"' };
        } else if (s.stats.vocal <= 150) {
          return { vocal: 3, ethics: 2, fans: 1, log: '展现诚意和专业度，获得主流文化媒体点赞，争议转化为口碑' };
        } else {
          return { vocal: 4, ethics: 3, fans: 2, log: '长文引经据典，深入浅出，既表达了创新初衷，也展现了深厚尊重，赢得学界和大众双重认可' };
        }
      }
    },
    { 
      text: '与戏曲名家直播连麦，现场请教', 
      effect: (s) => {
        if (s.stats.vocal < 60) {
          return { ethics: 1, eq: -2, fans: -3, log: '直播中举止失当，对名家不够尊重，引发传统圈众怒' };
        } else if (s.stats.vocal <= 150) {
          return { ethics: 3, eq: 2, fans: -1, log: '用行动打破"蹭热度"质疑，树立虚心好学的青年形象，但传统派仍不满' };
        } else {
          return { ethics: 4, eq: 3, fans: 1, vocal: 1, log: '直播中态度谦卑，提问专业，现场学习有模有样，获得名家肯定，争议平息' };
        }
      }
    },
    { 
      text: '继续发布系列作品，用质量回应争议', 
      effect: (s) => {
        if (s.stats.vocal < 60) {
          return { vocal: 2, fans: -2, health: -3, log: '后续作品质量下滑，坐实"江郎才尽"和"纯属炒作"的批评' };
        } else if (s.stats.vocal <= 150) {
          return { vocal: 4, fans: 1, health: -2, log: '用持续产出证明不是玩票，但陷入长期争议且创作压力大' };
        } else {
          return { vocal: 5, fans: 2, eq: 1, health: -2, log: '系列作品一部比一部成熟，逐渐形成独特风格，用实力让批评者闭嘴，开创出新流派' };
        }
      }
    }
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
    { 
      text: '顺应热度，发新图配文"保持松弛"', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 2, eq: -2, ethics: -2, log: '新图刻意摆拍，文案生硬，被嘲"硬炒人设"，适得其反' };
        } else if (s.stats.eq <= 70) {
          return { fans: 4, eq: 1, ethics: -1, log: '轻松接住流量，强化新人设，热度最大化，但被批"迎合"' };
        } else {
          return { fans: 5, eq: 3, ethics: 1, log: '用一组真正体现"松弛感"的生活抓拍回应，自然不做作，成功将偶然话题固化为个人特质' };
        }
      }
    },
    { 
      text: '考古其他旧博，制造连续话题', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 1, eq: -3, health: -2, log: '挖出的旧博黑历史更多，引发新一轮群嘲' };
        } else if (s.stats.eq <= 70) {
          return { fans: 3, eq: -1, health: -1, log: '有运营思维，但过度消费过去显得刻意，且耗费精力' };
        } else {
          return { fans: 4, eq: 2, health: -1, log: '精选几条有趣且无害的旧博，以幽默方式串联，延续热度的同时塑造了有趣的"互联网活人"形象' };
        }
      }
    },
    { 
      text: '不作回应，怕说多错多', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 0, ethics: 1, log: '团队手忙脚乱，错失所有引导机会，热度白白浪费' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, ethics: 2, log: '保持神秘感，让话题自然发酵，但错失最大涨粉机会' };
        } else {
          return { fans: 3, ethics: 3, eq: 1, log: '团队冷静观察，在话题峰值过后，以感谢梗源的方式轻巧回应，维持了格调与热度' };
        }
      }
    }
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
    { 
      text: '设为微博头像，并公开感谢', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 2, ethics: 1, looks: -3, log: '设为头像后，被吐槽画风与本人及账号风格严重不符，显得突兀' };
        } else if (s.stats.eq <= 70) {
          return { fans: 4, ethics: 2, looks: -2, log: '最高规格认可，画手狂喜，粉丝凝聚力暴增，但部分人觉得画风不符' };
        } else {
          return { fans: 5, ethics: 3, eq: 2, looks: 1, log: '不仅设为头像，还详细点评画作亮点，并向粉丝介绍画家，给予极大尊重，三方共赢' };
        }
      }
    },
    { 
      text: '转发并提议以双方名义进行公益拍卖', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { ethics: 2, fans: 0, health: -3, log: '提议过于草率，缺乏可操作性，最后不了了之，被骂"沽名钓誉"' };
        } else if (s.stats.eq <= 70) {
          return { ethics: 4, fans: 2, health: -3, log: '将粉丝热爱转化为社会价值，格调飙升，但拍卖流程复杂耗时' };
        } else {
          return { ethics: 5, fans: 3, eq: 2, health: -2, log: '与画手详细沟通后，联合靠谱公益机构发起拍卖，流程透明，善款去向明确，赢得社会赞誉' };
        }
      }
    },
    { 
      text: '私信感谢，并询问能否用作专辑封面灵感', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { vocal: 1, fans: 1, eq: -1, log: '私信语气像甲方，被画手吐槽"没礼貌"，聊天记录曝光引发小范围争议' };
        } else if (s.stats.eq <= 70) {
          return { vocal: 2, fans: 2, eq: 1, log: '尊重版权且用于专业领域，展现音乐人素养' };
        } else {
          return { vocal: 3, fans: 3, eq: 3, ethics: 2, log: '私信真诚邀约合作，并提及合理的版权费用，专业又尊重，为后续合作铺平道路' };
        }
      }
    }
  ]
},
{
  id: 'social_fan_coupling',
  type: 'SOCIAL',
  title: '又被组CP了',
  description: '好久没营业，看到粉丝把你和队友B在后台打闹的动图做成了“情侣头像”。',
  stage: GameStage.AMATEUR,
  isMandatory: false,
  repeatable: false,
  useAiForOutcome: false,
  trigger: (s) => s.stats.fans > 50 && chance(35),
  options: [
    { 
      text: '装作没看见，发自己的单人训练视频', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -3, ethics: 0, log: '训练视频里对队友B态度明显冷淡，被指“故意避嫌”、“破坏团魂”' };
        } else if (s.stats.eq <= 70) {
          return { fans: -1, ethics: 1, log: '唯粉满意，但CP粉觉得被“拆CP”，有点伤心' };
        } else {
          return { fans: 0, ethics: 2, eq: 1, log: '单人视频质量极高，专注事业，CP粉虽遗憾但也无话可说，唯粉狂喜' };
        }
      }
    },
    { 
      text: '点赞那条动图，但评论“兄弟情！！”', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 1, eq: -3, ethics: -3, log: '点赞后又秒取消，评论语气激动，被截图广泛传播，成为“心虚”实锤' };
        } else if (s.stats.eq <= 70) {
          return { fans: 3, eq: 2, ethics: -1, log: '热度飙升，但“欲盖弥彰”引发更多联想，唯粉开始不满' };
        } else {
          return { fans: 4, eq: 3, ethics: 1, log: '大方点赞，并用一系列兄弟间搞笑互动评论，将暧昧感彻底冲淡，营造健康兄弟情' };
        }
      }
    },
    { 
      text: '和队友B拍个正经合照，配文“好兄弟”', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 0, eq: -1, log: '合照姿势僵硬，文案只有一个“好兄弟”，被吐槽“营业感太重”、“塑料兄弟”' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, eq: 1, log: '试图端水，两边粉丝都勉强接受，但话题很快平息' };
        } else {
          return { fans: 3, eq: 2, ethics: 1, log: '合照自然有趣，文案提及团队趣事，既满足CP粉的“同框”需求，又强化了“兄弟”定位' };
        }
      }
    }
  ]
},
{
  id: 'social_food_blogger',
  type: 'SOCIAL',
  title: '深夜放毒',
  description: '好久没营业，看到手机里的美食照片，想着今天发点啥。',
  stage: GameStage.AMATEUR,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.health > 60 && chance(40),
  options: [
    { 
      text: '热情推荐菜品和蘸料配方', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 1, eq: -2, health: -2, log: '推荐了一家又贵又难吃的网红店，被粉丝实地打卡后狂喷“恰烂钱”' };
        } else if (s.stats.eq <= 70) {
          return { fans: 3, eq: 1, health: -1, log: '“吃货”属性暴露，拉近和粉丝距离，但经纪人提醒注意体重' };
        } else {
          return { fans: 4, eq: 2, health: -1, log: '推荐了实惠又地道的街边小店，并分享独家吃法，真诚不做作，大获好评' };
        }
      }
    },
    { 
      text: '配文“罪恶但快乐”，并附上健身计划', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 0, ethics: 0, log: '健身计划强度离谱，被健身博主打假，嘲讽“摆拍”和“不懂装懂”' };
        } else if (s.stats.eq <= 70) {
          return { fans: 2, ethics: 2, log: '显得自律又真实，树立了健康管理的形象' };
        } else {
          return { fans: 3, ethics: 3, eq: 1, log: '分享美食与健身的平衡心得，鼓励粉丝享受生活也要健康生活，树立积极榜样' };
        }
      }
    },
    { 
      text: '一杯黑咖啡的照片', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -2, ethics: -2, log: '配文“胖子的自我修养”，引发身材焦虑争议，大量脱粉' };
        } else if (s.stats.eq <= 70) {
          return { fans: -1, ethics: -1, log: '被手快的粉丝截图，引发“偶像包袱太重”“不真实”的吐槽' };
        } else {
          return { fans: 1, ethics: 1, eq: 1, log: '黑咖啡旁放着一本写满笔记的乐谱，配文“深夜伴侣”，巧妙将“减肥”转化为“努力”，形象正面' };
        }
      }
    }
  ]
},
{
  id: 'social_penguin_dance',
  type: 'SOCIAL',
  title: '挑战企鹅舞',
  description: '好久没营业，看到全网都在跳那个魔性的企鹅舞，想着你也发一发。',
  stage: GameStage.AMATEUR,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.dance > 20 && chance(50),
  options: [
    { 
      text: '认真跳，尽力还原魔性精髓', 
      effect: (s) => {
        if (s.stats.dance < 60) {
          return { fans: 1, dance: 1, log: '跳得过于卖力但不得精髓，被嘲“用力过猛”、“油腻”' };
        } else if (s.stats.dance <= 150) {
          return { fans: 3, dance: 2, log: '反差萌拉满，视频被大量转发，“一本正经搞笑”人设深入人心' };
        } else {
          return { fans: 4, dance: 3, eq: 1, log: '在精准还原魔性动作的同时，加入了有个人特色的小设计，趣味与实力兼备，成功出圈' };
        }
      }
    },
    { 
      text: '拉着队友一起跳，拍成搞笑视频', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: 2, eq: -2, health: -2, log: '强迫不愿出镜的队友参与，视频氛围尴尬，团队关系出现裂痕' };
        } else if (s.stats.eq <= 70) {
          return { fans: 4, eq: 1, health: -1, log: '团队欢乐氛围感染众人，CP粉和团粉都狂喜，但排练费时间' };
        } else {
          return { fans: 5, eq: 3, health: -1, log: '组织了一场热闹的团队挑战，分工明确笑点十足，极大增强了团队凝聚力和粉丝好感' };
        }
      }
    },
    { 
      text: '随便扭两下，主要靠特效和滤镜', 
      effect: (s) => {
        if (s.stats.eq < 40) {
          return { fans: -2, eq: -3, log: '态度敷衍到惹众怒，被批“不尊重粉丝和流行文化”，大量脱粉' };
        } else if (s.stats.eq <= 70) {
          return { fans: 1, eq: -1, log: '被认为态度敷衍，热度平平，甚至有点掉粉' };
        } else {
          return { fans: 2, eq: 2, log: '用夸张的特效和自嘲文案，将“敷衍”变成一种幽默风格，反而让人觉得真实有趣' };
        }
      }
    }
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
  useAiForOutcome: false, //经典事件，结果固化
  trigger: (s) => true,
  options: [
    { 
      text: '冒雨狂奔保持形象', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { health: -3, looks: 3, fans: 2, log: '“破碎感美少年”路透引爆全网，发烧也值了。' };
        } else if (s.stats.eq >= 40) {
          return { health: -3, looks: 1, fans: 1, log: '“破碎感美少年”路透出圈，但当晚就发烧了。' };
        } else {
          return { health: -3, looks: -1, fans: 1, log: '狼狈姿态被拍下，成了新的搞笑表情包。' };
        }
      }
    },
    { 
      text: '借伞并与站姐互动', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 3, fans: 3, eq: 1, log: '暖心举动被大加称赞，高情商回应圈粉无数。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: 2, fans: 2, health: 1, log: '暖心举动被大加称赞，但被经纪人提醒注意分寸。' };
        } else {
          return { ethics: -1, fans: 1, eq: 1, log: '互动略显生硬，被吐槽“假惺惺”。' };
        }
      }
    },
    { 
      text: '直接叫车无视拍摄', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: -1, health: 1, ethics: 1, log: '果断离开，被解读为“不想被过度打扰”，情有可原。' };
        } else if (s.stats.eq >= 40) {
          return { fans: -1, health: 1, eq: -1, log: '被解读为“脾气大”、“不珍惜粉丝”，口碑小跌。' };
        } else {
          return { fans: -3, ethics: -2, health: 1, log: '黑脸离开，被站姐回踩，风评受损。' };
        }
      }
    }
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
    { 
      text: '撒娇卖萌求原谅', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 3, eq: 2, vocal: -1, log: '“笨蛋美人”设定意外大爆，成为直播名场面。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 2, eq: 1, vocal: -1, log: '“笨蛋美人”设定意外吸粉，但被指不够专业。' };
        } else {
          return { fans: 1, eq: -1, vocal: -2, log: '撒娇过头略显油腻，效果不佳。' };
        }
      }
    },
    { 
      text: '淡定处理并清唱', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { vocal: 3, fans: 2, ethics: 2, log: '完美控场，临场反应和实力双双获赞，成功出圈。' };
        } else if (s.stats.eq >= 40) {
          return { vocal: 2, fans: 1, ethics: 1, log: '临场反应获赞，用实力扭转局面，展现大将之风。' };
        } else {
          return { vocal: 2, fans: -1, eq: -1, log: '清唱救场但表情僵硬，被说“被迫营业”。' };
        }
      }
    },
    { 
      text: '脸色不悦中断直播', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: -2, ethics: -1, vocal: 1, log: '以设备故障为由礼貌中止，但部分粉丝仍感失望。' };
        } else if (s.stats.eq >= 40) {
          return { fans: -3, ethics: -2, log: '“糊咖还耍大牌”登上实时话题，掉粉严重。' };
        } else {
          return { fans: -5, ethics: -3, eq: -2, log: '直接黑脸下播，引发大规模群嘲和脱粉。' };
        }
      }
    }
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
    { 
      text: '当面揭穿并警告', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 1, eq: 1, health: -2, log: '恩威并施，对方道歉删除，但关系降至冰点。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: 1, eq: -2, health: -1, log: '关系彻底破裂，宿舍变成战场，日夜提防心力交瘁。' };
        } else {
          return { ethics: -1, eq: -3, health: -2, log: '大吵一架，事情闹大，双方都被公司警告。' };
        }
      }
    },
    { 
      text: '找公司申请调换', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 1, fans: -1, log: '巧妙说明情况，成功调换宿舍，但留下不好搞的印象。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -1, fans: -1, log: '申请被驳回，反而被公司认为“事多难搞”。' };
        } else {
          return { ethics: -2, fans: -2, eq: -1, log: '越级上报，得罪经纪人，在公司处境更糟。' };
        }
      }
    },
    { 
      text: '反向收集他的黑料', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: -1, eq: 3, log: '巧妙暗示你已掌握情报，达成互不侵犯的默契。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -3, eq: 2, log: '手握把柄互相制衡，表面和平但内心黑暗值+1。' };
        } else {
          return { ethics: -4, eq: -1, health: -1, log: '手段拙劣被发现，矛盾激化，两败俱伤。' };
        }
      }
    }
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
    { 
      text: '接下，并准备艳压', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { dance: 3, vocal: 1, health: -1, eq: 1, log: '实力碾压的同时不失风度，收获“强者”美誉。' };
        } else if (s.stats.eq >= 40) {
          return { dance: 2, vocal: 1, health: -2, log: '通宵练习准备杀手锏，决心在镜头前一决高下。' };
        } else {
          return { dance: 1, vocal: 0, health: -2, eq: -2, log: '好胜心写在脸上，被观众吐槽“吃相难看”。' };
        }
      }
    },
    { 
      text: '婉拒，专注练习室', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 3, fans: -1, vocal: 1, dance: 1, log: '“专注作品，不争一时”的格局获业内赞赏。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: 2, fans: -2, log: '被粉丝怒其不争，但赢得了“沉得住气”的业内口碑。' };
        } else {
          return { ethics: 1, fans: -3, eq: -1, log: '被嘲“不敢应战”，显得怯懦。' };
        }
      }
    },
    { 
      text: '接下，主动示好组CP', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 4, ethics: 0, eq: 2, log: '双赢合作，CP热度与个人魅力齐飞。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 3, ethics: -1, eq: 1, log: '节目效果拉满，热度飙升，但纯粉痛心疾首。' };
        } else {
          return { fans: 2, ethics: -3, eq: -1, log: '刻意卖腐过于明显，遭双方粉丝反感。' };
        }
      }
    }
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
    { 
      text: '打封闭针硬上', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { vocal: -2, dance: 3, ethics: 2, health: -2, log: '悲壮的选择感动全场，但声带受损需要长期休养。' };
        } else if (s.stats.eq >= 40) {
          return { vocal: -3, dance: 2, ethics: 1, health: -3, log: '舞蹈惊艳全场，但声带损伤，被老师痛斥不爱惜羽毛。' };
        } else {
          return { vocal: -4, dance: 1, ethics: -1, health: -4, log: '伤情加重，表演也未达预期，得不偿失。' };
        }
      }
    },
    { 
      text: '放弃演唱，纯舞蹈', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { dance: 4, vocal: -1, fans: 2, eq: 1, log: '聪明的扬长避短，用极致舞蹈弥补，获得尊重。' };
        } else if (s.stats.eq >= 40) {
          return { dance: 3, vocal: -2, fans: 1, log: '扬长避短策略成功，但“哑巴爱豆”的标签暂时摘不掉了。' };
        } else {
          return { dance: 2, vocal: -2, fans: -1, log: '舞蹈平平，又被质疑态度敷衍，评价走低。' };
        }
      }
    },
    { 
      text: '申请延期并加练', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 1, health: 3, dance: 2, eq: 2, log: '展现成熟与担当，身体和业务双恢复，未来可期。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -1, health: 2, dance: 1, log: '错过最佳展示期，但身体恢复，舞蹈也有进步。' };
        } else {
          return { ethics: -2, health: 1, dance: 0, fans: -1, log: '被质疑是借病逃避考核，口碑下滑。' };
        }
      }
    }
  ]
},
{
  id: 'random_mental_breakdown',
  type: 'RANDOM',
  title: '临界点',
  description: '在又一次被否定后，长期积累的压力终于将你击垮。',
  stage: GameStage.AMATEUR,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.health < 35 && s.stats.eq < 40,
  options: [
    { 
      text: '在练习室痛哭一场', 
      effect: (s) => {
        if (s.stats.eq >= 70) { // 虽然触发条件eq<40，但保留结构一致性
          return { health: 2, eq: 2, ethics: 0, log: '真情流露反而让同伴和老师对你改观，压力释放。' };
        } else if (s.stats.eq >= 40) {
          return { health: 1, eq: 1, ethics: -1, log: '泪水冲刷了部分压力，但“爱哭鬼”的标签悄悄贴上了。' };
        } else {
          return {  eq: -1, ethics: -2, fans: -1, log: '失控的哭泣被视为软弱，更不被看好。' };
        }
      }
    },
    { 
      text: '消失一天，独自散心', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { health: 3, fans: -1, ethics: -1, log: '短暂放空后满血复活，但需要向公司解释。' };
        } else if (s.stats.eq >= 40) {
          return { health: 2, fans: -2, ethics: -2, log: '身心得到了喘息，公司震怒，粉丝担忧变成埋怨。' };
        } else {
          return { health: 2, ethics: -2, log: '失联引发恐慌，被贴上“不负责任”的标签。' };
        }
      }
    },
    { 
      text: '找最严苛的老师倾诉', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { eq: 2, vocal: 2, dance: 2, log: '真诚的求助打动了老师，获得了珍贵的指点与支持。' };
        } else if (s.stats.eq >= 40) {
          return { eq: 2, vocal: 1, dance: 1, log: '意外的坦诚获得了指导，关系破冰，心境豁然开朗。' };
        } else {
          return { health: -1, vocal: 1, dance: 1, log: '倾诉变成抱怨，老师觉得你抗压能力太差。' };
        }
      }
    }
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
  useAiForOutcome: false, //经典事件，结果固化
  trigger: (s) => s.stats.fans > 60 && chance(30),
  options: [
    { 
      text: '私下感谢但婉拒', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 4, eq: 3, log: '得体处理，大粉虽失落但转为默默支持，业内好评。' };
        } else if (s.stats.eq >= 40) {
          return { fans: -1, ethics: 3, eq: 2, log: '大粉觉得不被需要，你安抚了粉圈。' };
        } else {
          return { fans: -1, ethics: 2, log: '措辞生硬，激怒大粉，但守住了自己。' };
        }
      }
    },
    { 
      text: '选择性采纳建议', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 1, ethics: 2, eq: 2, log: '巧妙地将粉丝智慧融入规划，达成双赢局面。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 1, ethics: 1,looks:1, log: '与大粉结成战略同盟，她成为你的“民间宣传总监”。' };
        } else {
          return { fans: 1, health: -2, log: '摇摆不定，既没完全听话，又没安抚好，两边不讨好。' };
        }
      }
    },
    { 
      text: '完全照做，尊重大粉', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 4, vocal: -3, dance: -3, log: '粉丝教育家层出不穷，但沦为傀儡，才华被“剧本”束缚。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 2, eq: -2, log: '数据短期增长，但你感觉自己像个被操纵的提线木偶。' };
        } else {
          return { fans: -1, dance: -2, ethics: -1, log: '盲从导致人设崩塌，被嘲“没主见的妈宝偶像”。' };
        }
      }
    }
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
    { 
      text: '翻跳并@原编舞', 
      effect: (s) => {
        if (s.stats.dance >= 100) {
          return { dance: 4, fans: 3, health: -2, log: '神级复刻！获得原编舞转发认证，实力出圈。' };
        } else if (s.stats.dance >= 60) {
          return { dance: 3, fans: 2, health: -2, log: '展现实力，获得原编舞认可。' };
        } else {
          return { dance: 1, fans: 1, health: -2, log: '吃力完成，被嘲“不自量力”，但勇气可嘉。' };
        }
      }
    },
    { 
      text: '改编简单版教粉丝', 
      effect: () => ({ dance: 1, fans: 1, health: -1 }), 
      log: '贴心又亲民，拉近粉丝距离。' 
    },
    { 
      text: '无视，练自己的', 
      effect: () => ({ dance: 1 }), 
      log: '专注自身，但错过热点。' 
    }
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
  trigger: (s) => chance(20),
  options: [
    { 
      text: '理解并配合', 
      effect: (s) => {
        if (s.stats.ethics >= 70) {
          return { ethics: 3, eq: 2, log: '顾全大局，成为公司眼中的模范生，获得更多资源倾斜。' };
        } else if (s.stats.ethics >= 40) {
          return { ethics: 2, eq: 1, log: '听话的乖孩子，公司好感up。' };
        } else {
          return { ethics: 1, eq: 0, log: '表面配合，内心不满，但没表现出来。' };
        }
      }
    },
    { 
      text: '用小号继续冲浪', 
      effect: () => ({ ethics: -1, fans: 1 }), 
      log: '保留一丝真实的自我。' 
    },
    { 
      text: '公开抱怨不自由', 
      effect: () => ({ ethics: -2, fans: -1 }), 
      log: '被约谈，贴上“难搞”标签。' 
    }
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
    { 
      text: '含蓄表达偏好A', 
      effect: (s) => {
        if (s.stats.ethics >= 60) {
          return { fans: 1, ethics: 0, eq: 1, log: '巧妙暗示，避免了大规模冲突，平稳落地。' };
        } else if (s.stats.ethics >= 30) {
          return { fans: 2, ethics: -1, log: '一家欢喜一家愁，内部暗流涌动。' };
        } else {
          return { fans: 3, ethics: -3, log: '偏心明显，导致另一站子解散，引发动荡。' };
        }
      }
    },
    { 
      text: '发博感谢所有心意', 
      effect: () => ({ fans: 1, ethics: 2, eq: 1 }), 
      log: '端水大师，平稳度过。' 
    },
    { 
      text: '提议将资金合并做公益', 
      effect: () => ({ ethics: 4, fans: -1 }), 
      log: '格局超大，但部分粉丝失落。' 
    }
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
    { 
      text: '自己也用得不亦乐乎', 
      effect: (s) => {
        if (s.stats.looks >= 120) {
          return { fans: 4, eq: 2, looks: 1, log: '神仙颜值加上接地气，反差魅力拉满，疯狂吸粉。' };
        } else if (s.stats.looks >= 80) {
          return { fans: 3, eq: 1, log: '彻底放飞，亲和力MAX。' };
        } else {
          return { eq: 1, looks: -2, log: '搞笑是搞笑了，但颜值口碑略有受损。' };
        }
      }
    },
    { 
      text: '请求粉丝别用丑照', 
      effect: () => ({ looks: 1, fans: -2 }), 
      log: '偶像包袱略重，劝退整活粉。' 
    },
    { 
      text: '出官方联名表情包', 
      effect: () => ({ fans: 2, ethics: 1 }), 
      log: '商业化思维，赢麻了。' 
    }
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
    { 
      text: '强势拍板定方案', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { dance: 4, health: -1, log: '以理服人，迅速统一思想，高效完成任务。' };
        } else if (s.stats.eq >= 40) {
          return { dance: 2, ethics: -1, log: '效率高，但被说独断。' };
        } else {
          return { dance: 1, ethics: -3, eq: -1, log: '专横跋扈，组内关系破裂，作品也受影响。' };
        }
      }
    },
    { 
      text: '耐心协调求共识', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 2, dance: 1, log: '完美协调各方，作品融合了所有人的优点，团队凝聚力up。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: 3, dance: -1, log: '团队和谐，但进度稍慢。' };
        } else {
          return { ethics: 2, dance: -2, log: '和稀泥半天也没结果，最后草草了事。' };
        }
      }
    },
    { 
      text: '摆烂让他们决定', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { dance: 1, health: 2, log: '看似摆烂，实则暗中观察，在关键时刻给出建设性意见。' };
        } else if (s.stats.eq >= 40) {
          return { dance: -1, health: 2, log: '省心了，但参与度低。' };
        } else {
          return { dance: -2, ethics: -1, fans: -1, log: '完全游离在外，被组员和老师嫌弃。' };
        }
      }
    }
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
    { 
      text: '立刻取消', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { health: 1, eq: -2, log: '迅速取消并当作无事发生，风波未起即平息。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -1, fans: -1, log: '被手速快的网友截图了。' };
        } else {
          return { ethics: -2, fans: -2, log: '慌乱中取消反而欲盖弥彰，引发更大讨论。' };
        }
      }
    },
    { 
      text: '装被盗号', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: -1, eq: -1, log: '玩笑式地“甩锅”给盗号，以幽默化解尴尬。' };
        } else if (s.stats.eq >= 40) {
          return { fans: -2, ethics: -1, log: '信的人不多，略显尴尬。' };
        } else {
          return { fans: -3, ethics: -1, log: '漏洞百出的说辞，让事情越描越黑。' };
        }
      }
    },
    { 
      text: '夸队友转移焦点', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 2,fans: 1, log: '高情商回应，成功将危机转为展现团魂的机会。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: 2, eq: 1, log: '危机公关，挽回形象。' };
        } else {
          return { ethics: 1, eq: -1, log: '夸奖显得刻意又生硬，被嘲“绿茶”。' };
        }
      }
    }
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
 // useAiForOutcome: false, //经典事件，结果固化
  trigger: (s) => s.stats.fans > 40 && chance(25),
  options: [
    { 
      text: '转发感谢', 
      effect: (s) => {
        if (s.stats.ethics >= 70) {
          return { fans: 4, ethics: 3, eq: 1, log: '不仅转发，还用心评论，引爆粉丝创作热情，形成良性循环。' };
        } else if (s.stats.ethics >= 40) {
          return { fans: 3, ethics: 2, log: '粉丝狂喜，产出热情高涨。' };
        } else {
          return { fans: 2, ethics: 1, log: '简单转发，效果尚可。' };
        }
      }
    },
    { 
      text: '私下联系送礼物感谢', 
      effect: () => ({ fans: -2, ethics: -1 }), 
      log: '被传私联，引起小范围争议。' 
    },
    { 
      text: '装作没看见', 
      effect: () => ({ fans: -1, eq: -1 }), 
      log: '产出粉心凉了半截。' 
    }
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
    { 
      text: '充满罪恶感吃完', 
      effect: (s) => {
        if (s.stats.health >= 80) {
          return { health: -1, looks: 0, ethics: -1, log: '代谢好，偶尔放纵影响不大，但良心不安。' };
        } else if (s.stats.health >= 50) {
          return { health: -1, looks: -1, log: '味蕾满足，体重哭泣。' };
        } else {
          return { health: -3, looks: -2, log: '肠胃不适，皮肤变差，悔不当初。' };
        }
      }
    },
    { 
      text: '只吃一口就扔掉', 
      effect: () => ({ health: 1, ethics: -1 }), 
      log: '浪费食物，心在滴血。' 
    },
    { 
      text: '拉上室友一起放纵', 
      effect: () => ({ health: -1, ethics: 1 }), 
      log: '快乐翻倍，脂肪也翻倍。' 
    }
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
    { 
      text: '赶紧装信号不好', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { eq: 0, fans: 0, log: '自然地以“卡顿”为由切出，演技自然，蒙混过关。' };
        } else if (s.stats.eq >= 40) {
          return { eq: -1, fans: -1, log: '演技生硬，欲盖弥彰。' };
        } else {
          return { eq: -2, fans: -2, log: '慌乱中操作失误，反而暴露更多。' };
        }
      }
    },
    { 
      text: '大方承认并圆场', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 3, eq: 3, ethics: 1, log: '巧妙自嘲并化解，金句频出，成为直播高光时刻。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 2, eq: 2, log: '真实人设，意外吸粉。' };
        } else {
          return { fans: 1, eq: 0, log: '承认了，但圆得有点尴尬。' };
        }
      }
    },
    { 
      text: '甩锅给隔壁声音', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: -1, fans: -1, log: '玩笑式甩锅，部分人觉得可爱，部分人觉得没担当。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -2, log: '被指甩锅，情商遭疑。' };
        } else {
          return { ethics: -3, fans: -2, eq: -2, log: '恶劣的甩锅态度引发众怒。' };
        }
      }
    }
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
  trigger: (s) => chance(30),
  options: [
    { 
      text: '发张练习室汗颜', 
      effect: (s) => {
        if (s.stats.dance >= 100) {
          return { fans: 2, dance: 1, ethics: 1, log: '汗水与实力并存，激励粉丝，获赞“努力的天才”。' };
        } else if (s.stats.dance >= 60) {
          return { fans: 1, dance: 1, log: '固粉成功，显得努力。' };
        } else {
          return { fans: 0, dance: 1, log: '效果平平，被吐槽“营业痕迹太重”。' };
        }
      }
    },
    { 
      text: '分享一首emo歌', 
      effect: () => ({ fans: -1, vocal: 1 }), 
      log: '小众歌单，掉粉预警。' 
    },
    { 
      text: '发段清唱挑战', 
      effect: () => ({ fans: 2, health: -1 }), 
      log: '展现实力，但准备到很晚。' 
    }
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
    { 
      text: '发博呼吁“爱是唯一”', 
      effect: (s) => {
        if (s.stats.ethics >= 80) {
          return { fans: 0, ethics: 4, eq: 2, log: '真诚呼吁得到大部分粉丝理解，内战逐渐平息。' };
        } else if (s.stats.ethics >= 50) {
          return { fans: -2, ethics: 3, log: '端水失败，两边都得罪。' };
        } else {
          return { fans: -4, ethics: 2, log: '被双方粉丝认为“和稀泥”、“端水大师”，两边不讨好。' };
        }
      }
    },
    { 
      text: '空降唯粉群安慰', 
      effect: () => ({ fans: 2, ethics: -1 }), 
      log: '唯粉狂喜，CP粉心碎。' 
    },
    { 
      text: '什么都不做', 
      effect: () => ({ fans: -1, eq: 1 }), 
      log: '冷处理，等待自然平息。' 
    }
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
    { 
      text: '顺势玩梗', 
      effect: (s) => {
        if (s.stats.fans < 30) {
          return { fans: 2, health:2, log: '完美接住天降流量，成功将路人转化为粉丝。' };
        } else if (s.stats.fans < 50) {
          return { fans: 1, eq: 2, log: '接住流量，路人缘大涨。' };
        } else {
          return { fans: 1, eq: 1, log: '有效维持热度，巩固粉丝。' };
        }
      }
    },
    { 
      text: '觉得羞耻想删掉', 
      effect: () => ({ fans: -2, ethics: -1 }), 
      log: '被说“又当又立”，错过机会。' 
    },
    { 
      text: '严肃声明维护形象', 
      effect: () => ({ looks: 1, fans: -3 }), 
      log: '梗图变黑图，劝退路人。' 
    }
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
    { 
      text: '欣然接受', 
      effect: (s) => {
        if (s.stats.health >= 30) {
          return { fans: 3, health: -1, eq: 1, log: '大快朵颐展现真性情，圈粉无数，代谢好就是任性。' };
        } else if (s.stats.health >= 10) {
          return { fans: 2, looks:-1, health: -2, log: '展现亲和力，但身材管理告急。' };
        } else {
          return { fans: 1,  looks: -3, log: '肠胃不适，脸肿了一圈，得不偿失。' };
        }
      }
    },
    { 
      text: '以身材管理拒绝', 
      effect: () => ({ looks: 1, fans: -1 }), 
      log: '被夸自律，也被说放不开。' 
    },
    { 
      text: '改成健康餐教程', 
      effect: () => ({ health: 1, fans: 1 }), 
      log: '巧妙转化，符合人设。' 
    }
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
  useAiForOutcome: false, //经典事件，结果固化
  trigger: (s) => chance(20),
  options: [
    { 
      text: '立刻发声明澄清', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 3,health:1, log: '声明措辞严谨又不失温度，迅速平息谣言。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: 2, fans: -1, log: '澄清迅速，但略显无情。' };
        } else {
          return { ethics: 2, fans: -2, log: '澄清语气强硬，反而激起CP粉逆反心理。' };
        }
      }
    },
    { 
      text: '开玩笑式否认', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 1, looks:1, log: '高超的幽默化解尴尬，绯闻变佳话，展现超高人格魅力。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 1,eq:1, log: '一定程度上化解解，展现高情商。' };
        } else {
          return { fans: -1, log: '玩笑开得有点尬，粉丝将信将疑。' };
        }
      }
    },
    { 
      text: '冷处理', 
      effect: () => ({ fans: -3,eq:-1 }), 
      log: '谣言愈演愈烈，这种事可不能马虎。' 
    }
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
    { 
      text: '开心认领“带货王”', 
      effect: (s) => {
        if (s.stats.looks >= 150) {
          return { fans: 4, looks: 2, ethics: 1, log: '“颜值+亲民”双重Buff，商业价值飙升，品牌方排队找你。' };
        } else if (s.stats.looks >= 100) {
          return { fans: 3, looks: 1, log: '时尚感受认可，商业价值初显。' };
        } else {
          return { fans: 2, looks: 0, log: '“人靠衣装”，大家更关注衣服本身。' };
        }
      }
    },
    { 
      text: '呼吁理性消费', 
      effect: () => ({ ethics: 2, fans: 1 }), 
      log: '格局打开，获得好评。' 
    },
    { 
      text: '以后只穿大牌', 
      effect: () => ({ ethics: -1, fans: -1 }), 
      log: '被吐槽“红了就飘”。' 
    }
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
    { 
      text: '比他更早到', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { dance: 3, vocal: 2, health: -1, eq: 1, log: '良性竞争，互相激励，共同进步，身体也撑住了。' };
        } else if (s.stats.eq >= 40) {
          return { dance: 2, vocal: 1, health: -2, log: '实力进步，但身体透支。' };
        } else {
          return { dance: 1, vocal: 0, health: -3, eq: -1, log: '陷入恶性内卷，效率低下，身心俱疲。' };
        }
      }
    },
    { 
      text: '调整自己节奏', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { health: 2, eq: 3, vocal: 1, dance: 1, log: '找到最适合自己的高效方法，心态平稳，进步显著。' };
        } else if (s.stats.eq >= 40) {
          return { health: 1, eq: 2, log: '拒绝内耗，心态平稳。' };
        } else {
          return { health: 1, eq: 0, fans: -1, log: '看似调整，实则躺平，被队友越甩越远。' };
        }
      }
    },
    { 
      text: '散布他开小灶谣言', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: -4, dance: -2, eq: -2, log: '手段阴险但被迅速识破，身败名裂，被公司严肃处理。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -3, dance: -1, log: '心思不正，实力也落下了。' };
        } else {
          return { ethics: -5, dance: -2, health: -1, log: '谣言拙劣，立刻被戳穿，成为全公司公敌。' };
        }
      }
    }
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
  useAiForOutcome: false, //经典事件，结果固化
  trigger: (s) => s.stats.fans > 45 && chance(30),
  options: [
    { 
      text: '发律师函警告', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 1, ethics: 2, log: '雷霆手段，精准打击，黑粉收敛，彰显专业态度。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 1, ethics: 1, log: '态度强硬，吓退一部分人。' };
        } else {
          return { ethics: 1,health:-1, log: '律师函给黑粉增加热度，心累，但也让他闭嘴了。' };
        }
      }
    },
    { 
      text: '用搞笑P图反击', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 3, eq: 3, log: '高级自黑，完美化解恶意，路人缘暴涨，黑粉自讨没趣。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 2, eq: 1, health:1, log: '化戾气为笑料，路人转粉。' };
        } else {
          return { fans: 1, eq:1, log: '用魔法打败魔法。' };
        }
      }
    },
    { 
      text: '视而不见专注练习', 
      effect: () => ({ vocal: 1, dance: 1, health: -2 }), 
      log: '用实力说话，但心情受影响。' 
    }
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
    { 
      text: '哭完继续练', 
      effect: (s) => {
        if (s.stats.vocal >= 100) {
          return { vocal: 4, health: -1, ethics: 1, log: '突破瓶颈，高音技术再上一层楼，老师对你刮目相看。' };
        } else if (s.stats.vocal >= 60) {
          return { vocal: 3, health: -2, log: '铁杵磨成针。' };
        } else {
          return { vocal: 2, health: -3, log: '收效甚微，且过度用嗓导致发炎。' };
        }
      }
    },
    { 
      text: '转攻中低音', 
      effect: () => ({ vocal: 1, ethics: 2 }), 
      log: '找到舒适区。' 
    },
    { 
      text: '怀疑人生', 
      effect: () => ({ ethics: -3, vocal: -1 }), 
      log: '陷入创作瓶颈。' 
    }
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
    { 
      text: '怒晒健身照', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { looks: 3, health: 2, fans: 1, log: '用最健康的方式回击，身材颜值双赢，获得一片赞美。' };
        } else if (s.stats.eq >= 40) {
          return { looks: 2, health: 1, log: '用腹肌说话。' };
        } else {
          return { looks: 1, health: 1, eq: -1, log: '被解读为“破防了”，反而坐实了焦虑。' };
        }
      }
    },
    { 
      text: '发素颜怼脸拍', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { looks: 2, fans: 3, eq: 2, log: '无惧素颜展现自信，真实感拉满，黑评不攻自破。' };
        } else if (s.stats.eq >= 40) {
          return { looks: 1, fans: 2, log: '妈粉护体。' };
        } else {
          return { looks: 0, fans: 1, log: '素颜状态一般，争议仍在。' };
        }
      }
    },
    { 
      text: '删评闭麦', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { health: -1, eq: 1, log: '眼不见为净，专注自我，心态没被影响。' };
        } else if (s.stats.eq >= 40) {
          return { health: -2, log: '玻璃心碎了。' };
        } else {
          return { health: -3, looks: -1, log: '越删越气，陷入内耗，状态更差。' };
        }
      }
    }
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
    { 
      text: '自嘲黑历史', 
      effect: (s) => {
        if (s.stats.ethics >= 70) {
          return { fans: 4, ethics: 3, eq: 2, log: '大方玩梗，自黑出圈，高情商表现赢得满堂彩。' };
        } else if (s.stats.ethics >= 40) {
          return { fans: 3, ethics: 2, log: '沙雕出圈。' };
        } else {
          return { fans: 2, ethics: 1, log: '效果不错，但略显刻意。' };
        }
      }
    },
    { 
      text: '举报删帖', 
      effect: () => ({ fans: -2, ethics: -2 }), 
      log: '被网友说玩不起。' 
    },
    { 
      text: 'P成表情包', 
      effect: () => ({ fans: 2, ethics: 1 }), 
      log: '自黑式营销。' 
    }
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
    { 
      text: '当场落泪', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { vocal: 2, ethics: 3, fans: 1, log: '眼泪不是软弱，而是表明你的在意和决心，老师态度软化并给予鼓励。' };
        } else if (s.stats.eq >= 40) {
          return { vocal: 1, ethics: 2, log: '老师心软了。' };
        } else {
          return { vocal: 0, ethics: 1, fans: -1, log: '被老师认为心理素质太差，更加失望。' };
        }
      }
    },
    { 
      text: '默默练习', 
      effect: (s) => {
        if (s.stats.vocal >= 20) {
          return { vocal: 4, health: -2, log: '知耻而后勇，疯狂加练，下次考核让所有人震惊。' };
        } else {
          return { vocal: 3, health: -1, log: '偷偷努力惊艳所有人。' };
        }
      }
    },
    { 
      text: '顶嘴辩解', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { vocal: -1, ethics: -1, eq: 1, log: '以请教的方式“辩解”，巧妙地把批评转化为深入探讨。' };
        } else if (s.stats.eq >= 40) {
          return { vocal: -1, ethics: -2, log: '被老师标记为“态度差”。' };
        } else {
          return { vocal: -2, ethics: -3, log: '公开顶撞，师生关系破裂，被穿小鞋。' };
        }
      }
    }
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
    { 
      text: '保证会出道', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 2, health: 1, log: '耐心向家人展示你的规划和进步，最终获得理解与支持。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -2, health: -1, log: '压力山大。' };
        } else {
          return { ethics: -3, health: -2, log: '争吵升级，不欢而散，家庭关系紧张。' };
        }
      }
    },
    { 
      text: '撒娇求支持', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 4, fans: 2, log: '用爱和沟通软化家人，他们开始尝试了解你的世界。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: 3, fans: 1, log: '家人心软了。' };
        } else {
          return { ethics: 2, fans: 0, log: '撒娇不成反像抱怨，效果一般。' };
        }
      }
    },
    { 
      text: '沉默挂电话', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: -2, health: 0, log: '需要时间冷静，但事后会好好沟通。' };
        } else if (s.stats.eq >= 40) {
          return { ethics: -3, health: -1, log: '情绪低落。' };
        } else {
          return { ethics: -4, health: -2, vocal: -1, dance: -1, log: '冷战开始，巨大的心理压力影响状态。' };
        }
      }
    }
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
    { 
      text: '亲切合影', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 3, ethics: 2, eq: 1, log: '亲切自然，有求必应，路透照生图能打，口碑爆棚。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 2, ethics: 1, log: '粉丝直呼“哥哥好近人”。' };
        } else {
          return { fans: 1, ethics: 1, log: '合影了但略显疲惫和勉强。' };
        }
      }
    },
    { 
      text: '婉拒但签名', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 1, ethics: 0, log: '礼貌解释不便合影但送上签名，粉丝表示理解。' };
        } else if (s.stats.eq >= 40) {
          return { fans: 1, ethics: -1, log: '被说有点架子。' };
        } else {
          return { fans: 0, ethics: -2, log: '态度冷淡，粉丝感到受伤。' };
        }
      }
    },
    { 
      text: '低头装路人', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: -1, ethics: 0, log: '低调离开未被认出，避免了一场可能的围观。' };
        } else if (s.stats.eq >= 40) {
          return { fans: -1, ethics: -1, log: '被扒出后说“糊咖装大牌”。' };
        } else {
          return { fans: -2, ethics: -2, log: '被认出后仍假装不是，场面极其尴尬。' };
        }
      }
    }
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
  useAiForOutcome: false, //经典事件，结果固化
  trigger: (s) => true,
  options: [
    { 
      text: '喂它根火腿肠', 
      effect: (s) => {
        if (s.stats.eq >= 50) {
          return { ethics: 3, fans: 2, health: -1, log: '你温柔喂食的样子被拍下，“人美心善”上热搜。猫猫跟了你一路。' };
        } else if (s.stats.eq >= 30) {
          return { ethics: 2, fans: 1, log: '它蹭了蹭你的裤脚。' };
        } else {
          return { ethics: 1, log: '猫吃了火腿肠，但对你爱答不理。' };
        }
      }
    },
    { 
      text: '带去宠物医院', 
      effect: () => ({ health: -1, ethics: 3, fans: 1 }), 
      log: '善良的举动被路人拍到了。' 
    },
    { 
      text: '无视走开', 
      effect: () => ({ ethics: -1 }), 
      log: '心里有点过意不去。' 
    }
  ]
},

  // =================================================================
  // 3. SHOW EVENTS (选秀事件 - ONLY SHOW)
  // =================================================================
  {
  id: 'show_daily_training',
  type: 'SHOW',
  title: '训练室日常',
  description: '镜头悄悄对准练习室，你正对着镜子抠动作。选管暗示：这是展现个人特色的好机会”。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => true,
  options: [
    { 
      text: '即兴创作小剧场', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 3, ethics: 1, log: '幽默反应被剪进花絮，网友夸你“综艺感拉满”' };
        } else {
          return { fans: -2, log: '尬演被嘲“硬炒人设”，弹幕吐槽：别加了' };
        }
      }
    },
    { 
      text: '加练高音和舞蹈', 
      effect: () => ({ vocal: 2, dance: 2, fans: -1}), 
      log: '汗水不会骗人，导师悄悄点头，粉丝看不明白' 
    },
    { 
      text: '帮队友调整动作', 
      effect: (s) => {
        if (s.stats.dance >= 100) {
          return { ethics: 3, fans: 2, log: '专业指导被赞“团魂炸裂”，镜头量增加' };
        } else {
          return { ethics: 1, log: '心意到位，但队友表情复杂：要不你先练好自己？' };
        }
      }
    }
  ]
},
{
  id: 'show_cp_event',
  type: 'SHOW',
  title: '强制CP剧本',
  description: '导演组递来小纸条：“和人气选手××多互动，故事线已铺好”。拒绝可能被防爆，配合则可能沦为背景板。',
  stage: GameStage.SHOW,
  useAiForOutcome: false, // 30%设置之一
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 60 && chance(40),
  options: [
    { 
      text: '配合演出深情对视', 
      effect: (s) => {
        if (s.stats.looks >= 120) {
          return { fans: 5, ethics: -1, log: '颜值加成，CP超话一夜涨粉十万' };
        } else {
          return { fans: 1, ethics: -3, log: '被骂“吸血咖”，唯粉脱粉回踩' };
        }
      }
    },
    { 
      text: '保持距离专注舞台', 
      effect: () => ({ votes: -3, ethics: 2, vocal: 1 }), 
      log: '节目组减少镜头，但口碑上升' 
    },
    { 
      text: '用幽默化解尴尬', 
      effect: (s) => {
        if (s.stats.eq >= 60) {
          return { fans: 2, ethics: 1, log: '一句“兄弟情比金坚”成功破局' };
        } else {
          return { fans: -3, eq: 1, log: '玩笑过火，被批“不尊重对手”' };
        }
      }
    }
  ]
},
{
  id: 'show_social_cp',
  type: 'SHOW',
  title: 'CP热搜暴击',
  description: '你和队友的练习室互动被剪成“超甜故事线”，CP粉狂欢，唯粉炸锅。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 60 && chance(50),
  options: [
    { 
      text: '直播发糖固粉', 
      effect: () => ({ fans: 4, ethics: -3 }), 
      log: '话题度暴涨，但毒唯发起抵制' 
    },
    { 
      text: '冷静辟谣拆CP', 
      effect: () => ({ fans: -3, ethics: 3 }), 
      log: '热度下降，但路人夸“清醒”' 
    },
    { 
      text: '沉默让子弹飞', 
      effect: (s) => {
        if (s.stats.eq >= 50) {
          return { fans: 1, ethics: 1, log: '舆论自然平息，安全过关' };
        } else {
          return { fans: -2, log: '被解读为默认，争议升级' };
        }
      }
    }
  ]
},
{
  id: 'show_resource',
  type: 'SHOW',
  title: '资源争夺战',
  description: '你的中插广告被换给“皇族”队友。经纪人叹气：“公司押宝别人了。”',
  stage: GameStage.SHOW,
  useAiForOutcome: false, // 30%设置之一
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 60 && chance(35),
  options: [
    { 
      text: '找导演组争取', 
      effect: (s) => {
        if (s.stats.vocal >= 100) {
          return { ethics: 3, fans: 1, log: '实力背书，争取到备用方案' };
        } else {
          return { ethics: -2, fans: -3, log: '被批“看不清位置”，镜头一剪没' };
        }
      }
    },
    { 
      text: '加练舞台逆袭', 
      effect: () => ({ vocal: 1, dance: 1}), 
      log: '公演表现优秀，口碑提升' 
    },
    { 
      text: '发背影照内涵', 
      effect: () => ({ fans: 2, ethics: -2 }), 
      log: '粉圈心疼打投，但得罪资本' 
    }
  ]
},
{
  id: 'show_fever',
  type: 'SHOW',
  title: '高烧舞台劫',
  description: '公演前夜突发高烧39度，“身体要紧。”',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.health < 50 && chance(40),
  options: [
    { 
      text: '打封闭针上场', 
      effect: (s) => {
        if (s.stats.dance >= 80) {
          return { fans: 4, health: -4, log: '强撑完成高难度动作，热搜#敬业天花板' };
        } else {
          return { vocal: -3, dance: -3, health: -3, log: '舞台失误，被嘲“不自量力”' };
        }
      }
    },
    { 
      text: '晕倒送医抢救', 
      effect: () => ({ethics:-2, vocal:2, fans: 5 }), 
      log: '病床照出圈，虐粉打投暴增' 
    },
    { 
      text: '让位给替补', 
      effect: () => ({ ethics: 2, fans: -3 }), 
      log: '队友感激，但粉丝失望脱粉' 
    }
  ]
},
{
  id: 'show_black_hot',
  type: 'SHOW',
  title: '黑热搜屠榜',
  description: '热搜上榜：#你 黑脸#，片段是你累到发呆的镜头。对家水军下场：“滚出节目！”',
  stage: GameStage.SHOW,
  useAiForOutcome: false, // 30%设置之一
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 90 && chance(40),
  options: [
    { 
      text: '发练习室视频自证', 
      effect: (s) => {
        if (s.stats.vocal >= 90 && s.stats.dance >= 90) {
          return { fans: 4, ethics: 2, log: '实力打脸，路人转粉：黑子睁眼看看' };
        } else {
          return { fans: -1, votes: -2, log: '练习室实力不济，群嘲“越努力越心酸”' };
        }
      }
    },
    { 
      text: '高情商回应化解', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 3, fans: 2, log: '玩梗“谢谢关心下班状态”，风评反转' };
        } else {
          return { fans: -3, log: '回应生硬，被批“茶言茶语”' };
        }
      }
    },
    { 
      text: '沉默等热度过去', 
      effect: () => ({ fans: -2, ethics: 1 }), 
      log: '争议渐熄，但形象受损' 
    }
  ]
},
{
  id: 'show_station_leave',
  type: 'SHOW',
  title: '站姐回踩地震',
  description: '最大站姐发小作文脱粉：“私联粉丝、恋爱实锤！”配图是你和表妹吃饭的模糊照片。',
  stage: GameStage.SHOW,
  useAiForOutcome: false, // 30%设置之一
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 100 && chance(25),
  options: [
    { 
      text: '直播晒聊天记录', 
      effect: (s) => {
        if (s.stats.eq >= 60) {
          return { fans: 3, ethics: 2, log: '冷静澄清获信任，站姐删文道歉' };
        } else {
          return { fans: -4, ethics: -2, log: '情绪失控说错话，塌房盖章' };
        }
      }
    },
    { 
      text: '起诉法律维权', 
      effect: () => ({ ethics: 3, fans: 2 }), 
      log: '律师函警告，黑粉收敛' 
    },
    { 
      text: '冷处理不置可否', 
      effect: () => ({ fans: -5, ethics: -3 }), 
      log: '默认既视感，后援会解散' 
    }
  ]
},
{
  id: 'show_teammate',
  type: 'SHOW',
  title: '队友塌房危机',
  description: '队友被爆恋爱瓜，深夜求你：“就说那晚我们在一起练舞！”镜头正对着你。',
  stage: GameStage.SHOW,
  isMandatory: true,
  repeatable: false,
  trigger: (s) => chance(40),
  options: [
    { 
      text: '仗义出面作证', 
      effect: () => ({ ethics: 2, fans: -2 }), 
      log: '被卷入漩涡，口碑两极' 
    },
    { 
      text: '拒绝并劝分手', 
      effect: (s) => {
        if (s.stats.eq >= 50) {
          return { ethics: 1, fans: 1, log: '队友醒悟止损，关系缓和' };
        } else {
          return { ethics: -2, log: '队友翻脸，内部矛盾曝光' };
        }
      }
    },
    { 
      text: '装傻转移话题', 
      effect: () => ({ fans: 1, ethics: -1 }), 
      log: '独善其身，但被批冷漠' 
    }
  ]
},
{
  id: 'show_education',
  type: 'SHOW',
  title: '学历打假风波',
  description: '网友扒出你母校是“野鸡大学”，话题#学术造假#升温。导师静静看着你。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(20),
  options: [
    { 
      text: '自嘲但秀专业', 
      effect: (s) => {
        if (s.stats.vocal >= 100) {
          return { vocal: 3, fans: 2, log: '一段清唱扭转焦点，网友：实力说话' };
        } else {
          return { fans: -2, ethics: -1, log: '翻车现场，被嘲“九漏鱼”' };
        }
      }
    },
    { 
      text: '晒证书硬刚', 
      effect: () => ({ ethics: -2, fans: -1 }), 
      log: '越描越黑，争议升级' 
    },
    { 
      text: '沉默用舞台回应', 
      effect: () => ({ dance: 2, ethics: 1 }), 
      log: '时间冲淡话题，专注本职' 
    }
  ]
},
{
  id: 'show_love',
  type: 'SHOW',
  title: '恋爱乌龙事件',
  description: '狗仔曝光你与异性聚餐照片，实为表妹探班。营销号带节奏：#偶像失格#。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 80 && chance(30),
  options: [
    { 
      text: '火速晒家属合照', 
      effect: () => ({ fans: 3, ethics: 1 }), 
      log: '澄清及时，反赚一波亲情粉' 
    },
    { 
      text: '让表妹直播说明', 
      effect: (s) => {
        if (s.stats.looks >= 100) {
          return { fans: 2, log: '颜值家族出圈，话题反转' };
        } else {
          return { fans: -2, eq: -2, log: '被疑炒作，路人缘下滑' };
        }
      }
    },
    { 
      text: '冷处理不置可否', 
      effect: () => ({ fans: -4, ethics: -2 }), 
      log: '默认传闻，脱粉潮爆发' 
    }
  ]
},
{
  id: 'scandal_rumor',
  type: 'SHOW',
  title: '黑历史考古',
  description: '论坛爆出你中学时期“非主流”言论截图，黑粉狂欢：“人设崩塌！”',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 50 && chance(30),
  options: [
    { 
      text: '玩梗自黑化解', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 3, ethics: 2, log: '一句“谁没年轻过”拉回好感' };
        } else {
          return { fans: -2, ethics: -1, log: '自黑变真黑，嘲讽加剧' };
        }
      }
    },
    { 
      text: '严肃发声明', 
      effect: () => ({ ethics: 2, fans: -1 }), 
      log: '态度强硬，但被批玻璃心' 
    },
    { 
      text: '沉默等自然冷却', 
      effect: () => ({ fans: -2 }), 
      log: '热度渐退，但留下污点' 
    }
  ]
},
{
  id: 'viral_video',
  type: 'SHOW',
  title: '直拍血洗B站',
  description: '你公演的一个wink镜头被剪成病毒视频，播放量破百万。弹幕：“蛊王降临！”',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => (s.stats.dance > 80 || s.stats.looks > 80) && chance(20),
  options: [
    { 
      text: '翻跳挑战加码', 
      effect: (s) => {
        if (s.stats.dance >= 100) {
          return { fans: 5, dance: 1, log: '专业翻跳引爆二创，热度翻倍' };
        } else {
          return { fans: 2, ethics: -1, log: '画虎不成反类犬，被嘲蹭热度' };
        }
      }
    },
    { 
      text: '谦逊感谢关注', 
      effect: () => ({ ethics: 3, fans: 2 }), 
      log: '路人夸“低调务实”，口碑提升' 
    },
    { 
      text: '买热搜强推', 
      effect: () => ({ fans: 2, ethics: -2 }), 
      log: '数据注水被扒，反噬口碑' 
    }
  ]
},
{
  id: 'evil_editing',
  type: 'SHOW',
  title: '恶剪风暴',
  description: '节目组将你休息时打哈欠的镜头，剪进导师批评段落。热搜：#你 不尊重舞台#。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(25),
  options: [
    { 
      text: '找选管对质', 
      effect: () => ({ ethics: 1, fans: -3, votes: -5 }), 
      log: '硬刚无效，反被剪进“drama合集”' 
    },
    { 
      text: '咬牙更努力', 
      effect: () => ({ vocal: 2, dance: 2 }), 
      log: '用下次舞台证明，谣言不攻自破' 
    },
    { 
      text: '高情商玩梗', 
      effect: (s) => {
        if (s.stats.eq >= 60) {
          return { fans: 3, ethics: 2, log: '微博发“哈欠是怕舞台太燃”，风评逆转' };
        } else {
          return { fans: -2, log: '玩梗失败，被批“不诚恳”' };
        }
      }
    }
  ]
},
{
  id: 'late_night_practice',
  type: 'SHOW',
  title: '通宵练习室',
  description: '凌晨三点，练习室只剩你一人。镜头记录下你反复摔倒又爬起的瞬间。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.health > 60 && chance(40),
  options: [
    { 
      text: '练到昏厥', 
      effect: () => ({ dance: 3, vocal: 2, health: -4 }), 
      log: '汗水铸就直拍出圈，但送医急救' 
    },
    { 
      text: '适度休息', 
      effect: () => ({ health: 3, ethics: 1 }), 
      log: '状态饱满，次日舞台稳定' 
    },
    { 
      text: '开直播虐粉', 
      effect: () => ({ fans: 3, health: -2 }), 
      log: '粉丝心疼打投，但被嘲卖惨' 
    }
  ]
},
{
  id: 'center_battle',
  type: 'SHOW',
  title: 'C位争夺战',
  description: '小组内投票选C位，你是毛遂自荐还是成全队友？镜头对准你的微表情。',
  stage: GameStage.SHOW,
  isMandatory: true,
  repeatable: false,
  trigger: (s) => s.showTurnCount === 2,
  options: [
    { 
      text: '强势争C', 
      effect: (s) => {
        if (s.stats.vocal + s.stats.dance >= 180) {
          return { vocal: 3, dance: 3, fans: 2, log: '实力碾压，C位实至名归' };
        } else {
          return { ethics: -2, fans: -2, log: '野心配不上实力，被骂“皇族”' };
        }
      }
    },
    { 
      text: '让贤辅佐', 
      effect: () => ({ ethics: 4, fans: 1 }), 
      log: '团魂感动全场，口碑暴涨' 
    },
    { 
      text: '服从安排', 
      effect: () => ({ eq: 1 }), 
      log: '安全但透明，镜头寥寥' 
    }
  ]
},
{
  id: 'show_song_selection',
  type: 'SHOW',
  title: '一公选曲博弈',
  description: '选曲决定命运：燃炸舞台易出圈，抒情歌易展现vocal。你如何选择？',
  stage: GameStage.SHOW,
  isMandatory: true,
  repeatable: false,
  trigger: (s) => s.showTurnCount === 2,
  options: [
    { 
      text: '挑战高音主打', 
      effect: (s) => {
        if (s.stats.vocal >= 100) {
          return { vocal: 4, fans: 3, log: '天籁vocal惊艳全场，热搜预定' };
        } else {
          return { vocal: -2, fans: -2, log: '破音翻车，被嘲“不自量力”' };
        }
      }
    },
    { 
      text: '选舞蹈炸场', 
      effect: (s) => {
        if (s.stats.dance >= 100) {
          return { dance: 4, fans: 3, log: '卡点机器燃爆舞台，直拍封神' };
        } else {
          return { dance: -2, health: -2, log: '动作划水，对比惨烈' };
        }
      }
    },
    { 
      text: '挑冷门曲冒险', 
      effect: () => ({ fans: 2, ethics: 1 }), 
      log: '差异化成功，但风险极高' 
    }
  ]
},
{
  id: 'show_dorm_live',
  type: 'SHOW',
  title: '宿舍直播危机',
  description: '突击直播中，队友突然爆料你生活中的糗事。全场起哄，镜头等你反应。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(40),
  options: [
    { 
      text: '幽默接梗反转', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { fans: 3, ethics: 1, log: '金句频出，弹幕：“情商天花板”' };
        } else {
          return { fans: -1, ethics: -1, log: '接梗失败，气氛尴尬' };
        }
      }
    },
    { 
      text: '沉默装傻', 
      effect: () => ({ fans: -1 }), 
      log: '镜头被剪，存在感归零' 
    },
    { 
      text: '怼回去引爆笑', 
      effect: () => ({ fans: 3, ethics: -1 }), 
      log: '综艺感出圈，但被批过火' 
    }
  ]
},
{
  id: 'show_mentor',
  type: 'SHOW',
  title: '导师合作舞台',
  description: '导师邀请你即兴合唱，但你的part涉及高难度转音。机会还是陷阱？',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  useAiForOutcome: false, // 30%设置之一
  trigger: (s) => s.stats.vocal > 50 && chance(30),
  options: [
    { 
      text: '自信接招', 
      effect: (s) => {
        if (s.stats.vocal >= 120) {
          return { vocal: 4, fans: 3, log: '神级转音上热搜，导师点赞' };
        } else {
          return { vocal: -2, fans: -2, log: '破音车祸，口碑暴跌' };
        }
      }
    },
    { 
      text: '婉拒保平安', 
      effect: () => ({ ethics: -1, fans: -1 }), 
      log: '错过曝光，但避免风险' 
    },
    { 
      text: '拉队友共演', 
      effect: () => ({ ethics: 1, fans: 1 }), 
      log: '展现团魂，镜头量增加' 
    }
  ]
},
{
  id: 'show_elimination',
  type: 'SHOW',
  title: '淘汰夜眼泪',
  description: '好友被淘汰，镜头特写你的表情。热搜预定点：#你的反应#。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(50),
  options: [
    { 
      text: '崩溃大哭', 
      effect: () => ({ fans: 3, ethics: -2 }), 
      log: '真情实感虐粉，但被嘲戏多' 
    },
    { 
      text: '强笑祝福', 
      effect: (s) => {
        if (s.stats.eq >= 50) {
          return { ethics: 2, fans: 1, log: '冷静发言被赞“体面人”' };
        } else {
          return { fans: -1, ethics: -1, log: '表情管理失败，被批冷漠' };
        }
      }
    },
    { 
      text: '沉默拥抱', 
      effect: () => ({ ethics: 1 }), 
      log: '镜头一扫而过，无人在意' 
    }
  ]
},
{
  id: 'show_ranking',
  type: 'SHOW',
  title: '卡位圈生死局',
  description: '阶段性顺位发布，你卡在第12名。台下粉丝哭喊你的名字，镜头等你发言。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans >120 && chance(30),
  options: [
    { 
      text: '热血逆袭宣言', 
      effect: () => ({ fans: 4, ethics: 2 }), 
      log: '粉圈打投鸡血，排名飙升' 
    },
    { 
      text: '哭诉压力太大', 
      effect: () => ({ fans: 2, health: -2 }), 
      log: '虐粉成功，但被批卖惨' 
    },
    { 
      text: '鞠躬感谢粉丝', 
      effect: (s) => {
        if (s.stats.looks >= 100) {
          return { fans: 3, ethics: 1, log: '神颜落泪截图出圈，路人怜爱' };
        } else {
          return { fans: 1, log: '标准流程，无惊喜无过错' };
        }
      }
    }
  ]
},
{
  id: 'show_unfair',
  type: 'SHOW',
  title: '皇族の凝视',
  description: '“皇族”队友镜头量是你的三倍，粉丝怒骂黑幕。你如何应对？',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 70 && chance(30),
  options: [
    { 
      text: '练习室暗卷', 
      effect: (s) => {
        if (s.stats.dance >= 110) {
          return { dance: 3, fans: 3, log: '直拍数据反超，用实力打脸' };
        } else {
          return { vocal: 1, dance: 1, log: '努力但无人在意，镜头更少' };
        }
      }
    },
    { 
      text: '采访含蓄开麦', 
      effect: () => ({ fans: 2, ethics: -1 }), 
      log: '粉圈支持，但遭节目组打压' 
    },
    { 
      text: '专注自我', 
      effect: () => ({ ethics: 2, fans: -1 }), 
      log: '口碑提升，但热度下降' 
    }
  ]
},
{
  id: 'show_ad',
  type: 'SHOW',
  title: '中插广告修罗场',
  description: '金主指定你拍中插，但剧本尴尬到脚趾抠地。导演：“要真实！”',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(50),
  options: [
    { 
      text: '放飞自我尬演', 
      effect: () => ({ fans: 1, ethics: -1 }), 
      log: '被做成表情包，黑红也是红' 
    },
    { 
      text: '自然流露真诚', 
      effect: (s) => {
        if (s.stats.eq >= 60) {
          return { fans: 3, ethics: 1, log: '反差萌吸粉，金主追加合作' };
        } else {
          return { fans: -1, log: '演技生硬，广告被嘲' };
        }
      }
    },
    { 
      text: '拒演保口碑', 
      effect: () => ({ fans: -2, ethics: 1 }), 
      log: '得罪品牌，后续资源流失' 
    }
  ]
},
{
  id: 'show_offline',
  type: 'SHOW',
  title: '线下应援对决',
  description: '粉丝租下海岛大屏应援，高调非常，你下班路过，该如何应对？”',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 100 && chance(40),
  options: [
    { 
      text: '开窗比心回应', 
      effect: () => ({ fans: 4, ethics: 2 }), 
      log: '双向奔赴上热搜，死忠固化' 
    },
    { 
      text: '让助理代打招呼', 
      effect: () => ({ fans: 1, ethics: -1 }), 
      log: '被批“耍大牌”，站姐脱粉' 
    },
    { 
      text: '无视快步离开', 
      effect: () => ({ fans: -4, ethics: -2 }), 
      log: '寒心场面出圈，口碑崩盘' 
    }
  ]
},
{
  id: 'show_final',
  type: 'SHOW',
  title: '决赛夜冲刺',
  description: '成团夜倒计时，你加练到嗓音沙哑。队友问：“值得吗？”',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => (s.showTurnCount ===3 ||s.showTurnCount ===4)&& chance(30),
  options: [
    { 
      text: '通宵搏命', 
      effect: () => ({ vocal: 3, dance: 3, health: -5 }), 
      log: '舞台封神，但晕倒送医' 
    },
    { 
      text: '保存实力', 
      effect: () => ({ health: 3, ethics: 1 }), 
      log: '稳定发挥，但缺乏记忆点' 
    },
    { 
      text: '调整心态', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 3, fans: 1, log: '冷静发言圈粉，逆风翻盘' };
        } else {
          return { health: 1, log: '平淡过关，无波无澜' };
        }
      }
    }
  ]
},

{
  id: 'show_training_evaluation',
  type: 'SHOW',
  title: '训练考核危机',
  description: '导师突击考核主题曲，你因连轴转嗓音沙哑。队友小声说：“要不假唱？反正剪辑能修。”',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.health < 30 && chance(40),
  options: [
    { 
      text: '坚持真唱', 
      effect: (s) => {
        if (s.stats.vocal >= 80) {
          return { vocal: 2, ethics: 3, fans: 1, log: '破音也坚持，虐粉成功' };
        } else {
          return { vocal: -2, fans: -2, log: '严重走音，导师皱眉摇头' };
        }
      }
    },
    { 
      text: '假唱混过去', 
      effect: () => ({ ethics: -3, fans: -3 }), 
      log: '被耳尖观众扒出，口碑崩塌' 
    },
    { 
      text: '申请缓考', 
      effect: () => ({ health: 2, ethics: 1, fans: -1 }), 
      log: '弹幕争议：敬业VS矫情' }
    ]
},
{
  id: 'show_fan_meeting',
  type: 'SHOW',
  title: '粉丝见面会',
  description: '线下见面会，粉丝高喊你的名字。一位妈粉哭着说：“宝宝瘦了！”你如何回应？',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  useAiForOutcome: false,
  trigger: (s) => s.stats.fans > 80 && chance(30),
  options: [
    { 
      text: '撒娇说想家', 
      effect: () => ({ fans: 3, ethics: -2, eq: -3 }), 
      log: '妈粉狂欢，但被嘲“巨婴”' 
    },
    { 
      text: '展示肌肉励志', 
      effect: (s) => {
        if (s.stats.looks >= 100) {
          return { fans: 4, ethics: 2, log: '反差感出圈，热搜#猛男落泪#' };
        } else {
          return { fans: -1, log: '反响平平，镜头被剪' };
        }
      }
    },
    { 
      text: '鞠躬感谢沉默', 
      effect: () => ({ ethics: 2, fans: 1, eq: -1 }), 
      log: '被批冷漠，但路人好感up' 
    }
  ]
},
{
  id: 'show_sponsor_gift',
  type: 'SHOW',
  title: '金主送礼风波',
  description: '赞助商送来限量潮鞋，但数量不够分。皇族队友直接拿走最后一双，镜头正拍你反应。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(30),
  options: [
    { 
      text: '调侃式抗议', 
      effect: (s) => {
        if (s.stats.eq >= 70) {
          return { ethics: 2, fans: 2, log: '高情商发言，金主点赞' };
        } else {
          return { ethics: -2, fans: -1, log: '玩笑过火，气氛尴尬' };
        }
      }
    },
    { 
      text: '主动让给他人', 
      effect: () => ({ ethics: 3, fans: 1 }), 
      log: '谦逊人设加固，镜头偏爱' 
    },
    { 
      text: '私下找选管要', 
      effect: () => ({ fans: -2 }), 
      log: '被曝“耍大牌”，资源受损' 
    }
  ]
},
{
  id: 'show_cover_dance',
  type: 'SHOW',
  title: '翻跳挑战赛',
  description: '某顶流男团舞挑战席卷全网，粉丝催你交作业。但原版舞蹈难度极高，容易翻车。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.dance > 60 && chance(30),
  options: [
    { 
      text: '挑战高光片段', 
      effect: (s) => {
        if (s.stats.dance >= 120) {
          return { dance: 3, fans: 4, log: '卡点神级翻跳，原转发认证' };
        } else {
          return { dance: -1, fans: -2, log: '动作变形，遭原粉群嘲' };
        }
      }
    },
    { 
      text: '改编简单版', 
      effect: () => ({ fans: 2, ethics: 1 }), 
      log: '自创风格，意外出圈' 
    },
    { 
      text: '拉队友共跳', 
      effect: () => ({ ethics: 2, fans: 1 }), 
      log: '团魂吸粉，风险分摊' 
    }
  ]
},
{
  id: 'show_midterm_ranking',
  type: 'SHOW',
  title: '中期排名危机',
  description: '排名发布，你疑似被压票，排名骤降。主持人问：“你觉得公平吗？”全场安静。',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => s.stats.fans > 50 && chance(50),
  options: [
    { 
      text: '笑说会更努力', 
      effect: () => ({ ethics: 2, fans: 1 }), 
      log: '体面回应，路人缘上升' 
    },
    { 
      text: '含泪质疑赛制', 
      effect: () => ({ fans: 3, ethics: -2 }), 
      log: '粉圈震怒，节目组施压' 
    },
    { 
      text: '沉默鞠躬十秒', 
      effect: (s) => {
        if (s.stats.looks >= 120) {
          return { fans: 3, ethics: 1, log: '神颜落泪截图疯传' };
        } else {
          return { fans: -1, log: '被批“戏多”，效果平淡' };
        }
      }
    }
  ]
},
{
  id: 'show_group_conflict',
  type: 'SHOW',
  title: '小组内讧',
  description: '排练时队友因part分配吵翻，公演在即。作为队长，你如何调停？',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(35),
  options: [
    { 
      text: '让出自己part', 
      effect: () => ({ ethics: 4, vocal: -1, votes:-1 }), 
      log: '平息争端，但表现受限' 
    },
    { 
      text: '强硬镇压', 
      effect: (s) => {
        if (s.stats.eq >= 60) {
          return { ethics: -1, fans: 1, log: '快速推进，但埋下隐患' };
        } else {
          return { ethics: -3, fans: -2, log: '矛盾激化，舞台垮掉' };
        }
      }
    },
    { 
      text: '找导师调解', 
      effect: () => ({ ethics: 1, fans: -1 }), 
      log: '被嘲“打小报告”，但高效' 
    }
  ]
},
{
  id: 'show_social_media',
  type: 'SHOW',
  title: '社交媒体运营',
  description: '节目组允许发一条微博。staff暗示：“最好有话题度。”你发什么内容？',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  trigger: (s) => chance(50),
  options: [
    { 
      text: '发练习室汗湿照', 
      effect: () => ({ fans: 1, ethics: 1 }), 
      log: '固粉成功，被对家黑“卖惨”' 
    },
    { 
      text: '蹭顶流热点', 
      effect: (s) => {
        if (s.stats.eq >= 50) {
          return { fans: 3, ethics: -1, log: '巧妙玩梗，出圈热度高' };
        } else {
          return { fans: -2, ethics: -2, log: '翻车现场，遭对方粉围攻' };
        }
      }
    },
    { 
      text: '晒队友丑照', 
      effect: () => ({ ethics: -2, fans: 1, eq:2 }), 
      log: '综艺感获赞，但情商受疑' 
    }
  ]
},
{
  id: 'show_mentor_critique',
  type: 'SHOW',
  title: '导师犀利点评',
  description: '导师当众批评你“只有技巧没有感情”。其他选手窃窃私语，你如何回应？',
  stage: GameStage.SHOW,
  isMandatory: false,
  repeatable: false,
  useAiForOutcome: false,
  trigger: (s) => s.stats.vocal > 70 && chance(30),
  options: [
    { 
      text: '鞠躬认错', 
      effect: () => ({ ethics: 2, fans: -1 }), 
      log: '态度谦逊，但缺乏记忆点' 
    },
    { 
      text: '即兴清唱证明', 
      effect: (s) => {
        if (s.stats.vocal >= 150) {
          return { vocal: 3, fans: 3, log: '情感爆发，导师改观赞赏' };
        } else {
          return { vocal: -2, fans: -2, log: '紧张走音，批评加剧' };
        }
      }
    },
    { 
      text: '沉默落泪', 
      effect: (s) => {
        if (s.stats.looks >= 120) {
          return { fans: 2, ethics: -1, log: '破碎感出圈，虐粉成功' };
        } else {
          return { fans: -1, ethics: -1, log: '被嘲“玻璃心”，形象受损' };
        }
      }
    }
  ]
},
{
  id: 'show_final_debut',
  type: 'SHOW',
  title: '成团夜抉择',
  description: '比赛中后段你的粉丝数高涨，公司深夜来电：“让位给皇族，补偿你solo资源。”粉丝在场外哭喊你的名字。',
  stage: GameStage.SHOW,
  isMandatory: true,
  repeatable: false,
  trigger: (s) => s.stats.fans >= 150 && s.showTurnCount ===4,
  options: [
    { 
      text: '拒绝让位', 
      effect: (s) => {
        if (s.stats.vocal + s.stats.dance >= 220) {
          return { fans: 5, ethics: 4, votes: 5, log: '凭绝对实力逆袭，终成团' };
        } else {
          return { fans: -5, ethics: 1, votes: -5, log: '资本封杀，镜头一剪梅' };
        }
      }
    },
    { 
      text: '接受交易', 
      effect: () => ({ ethics: -4, fans: 2 }), 
      log: '资源到手，但终身被嘲“水货”' 
    },
    { 
      text: '现场揭黑幕', 
      effect: () => ({ fans: 4, ethics: -3 }), 
      log: '粉圈暴动，但遭行业抵制' 
    }
  ]
},
{
  // 范本事件
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
    { 
      text: '听导演组安排', 
      effect: (s) => {
        if (s.stats.looks >= 100 && s.stats.fans >= 100 && s.stats.vocal + s.stats.dance >= 150) {
          return { fans: 5, vocal: 2, dance: 2, log: '导演看重你的实力和粉丝基数，给你了剧本' };
        } else {
          return { fans: -8, ethics: -2, flags: {script_candy: true }, log: '实力不足，喜提祭天剧本：糖果超甜。' };
        }
      }
    },
    { text: '展示专业能力的舞台', effect: () => ({ vocal: 2, fans: -2, ethics: 3 }), log: '被一剪梅。' },
    
    { 
      text: '听公司安排', 
      effect: (s) => {
        if (s.company === Company.COFFEE) {
           return { votes: -2, fans: -2, eq: 1, log: '咖啡粒文化不太行，镜头还是被一剪梅' };
        } else if (s.company === Company.NONE) {
           return { fans: -1, eq: -1, log: '你是个人练习生，哪来的公司给你安排？' };
        } else {
           return { looks: 1, eq: 1, fans: 3 , log: '公司发力了，保留了你的高光镜头' };
        }
      }
    }
  ] 
}
];
