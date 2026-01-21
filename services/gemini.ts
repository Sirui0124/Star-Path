
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GameState, GameEvent, EventOutcome, GameStage, Company } from "../types";
import { ANNUAL_SUMMARIES } from "../content/narratives";
import { COMPANIES } from "../constants";

const TIMEOUT_MS = 1500; // 1.5 seconds for snappy experience

const getClient = () => {
    if (!process.env.API_KEY) return null;
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- ERROR HANDLING & RETRY LOGIC ---

/**
 * Wraps an API call with exponential backoff retry logic for 429/5xx errors.
 */
const callWithRetry = async <T>(
  apiCall: () => Promise<T>,
  retries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    const errorCode = error?.status || error?.error?.code;
    const errorMessage = error?.message || '';
    
    // Retry on 429 (Too Many Requests) or 5xx (Server Errors)
    const isRetryable = 
      retries > 0 && 
      (errorCode === 429 || errorCode >= 500 || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'));

    if (isRetryable) {
      console.warn(`Gemini API Warning: ${errorCode || 'Unknown'}. Retrying in ${initialDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, initialDelay));
      return callWithRetry(apiCall, retries - 1, initialDelay * 2);
    }
    
    throw error;
  }
};

// Helper: Wrap promise with timeout
const withTimeout = <T>(promise: Promise<T>, fallbackValue: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), TIMEOUT_MS))
  ]);
};

// NEW: Test Connectivity at Game Start
export const testAiConnectivity = async (playerName: string, dream: string): Promise<string | null> => {
  const ai = getClient();
  if (!ai) return null;

  const prompt = `
    你是爱豆养成游戏《星途》的系统精灵。
    玩家名字: ${playerName}
    梦想: ${dream}
    请用温柔、神秘或充满元气的语气（20字以内）跟玩家打个招呼，祝TA星途璀璨。
    不要加任何前缀，直接输出内容。
  `;

  return withTimeout(
    (async () => {
      try {
        const response = await callWithRetry(() => ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
          config: { thinkingConfig: { thinkingBudget: 0 } }
        }), 1, 500) as GenerateContentResponse;
        return response.text ? response.text.trim() : null;
      } catch (error) {
        return null;
      }
    })(),
    null
  );
};

export const generateGameSummary = async (gameState: GameState): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key 未配置。但你的星途依然闪耀！";
  
  // 提取关键历史事件 (过滤掉重复和琐碎的)
  const events = gameState.history.filter(h => h.includes("【") || h.includes("签约") || h.includes("出道"));
  const recentEvents = events.slice(-10); // 取最近的10个关键事件

  const isAmateur = gameState.stage === GameStage.AMATEUR;

  // 根据阶段调整数据展示和 Prompt 侧重点
  let statsDescription = `粉丝: ${gameState.stats.fans}万 (衡量红不红的关键)\n`;
  if (isAmateur) {
      statsDescription += `选秀票数: 无 (玩家止步于练习生阶段，尚未参加选秀)\n`;
  } else {
      statsDescription += `选秀票数: ${gameState.stats.votes}万\n`;
  }

  // Get localized company name
  const companyName = gameState.company === Company.NONE 
      ? '独立艺人' 
      : COMPANIES[gameState.company]?.name || gameState.company;

  // --- NEW: Playstyle Analysis ---
  let styleEvaluation = "";
  if (isAmateur) {
      styleEvaluation = "遗憾止步于练习生阶段，未能登上更大的舞台。";
  } else {
      const { vocal, dance, looks, ethics } = gameState.stats;
      const { hotCp } = gameState.hiddenStats;
      const totalSkill = vocal + dance;
      
      const strategies = [];
      if (totalSkill >= 220) strategies.push("【实力断层】(唱跳能力极强，用舞台说话)");
      else if (looks >= 160) strategies.push("【神颜降临】(凭借惊人颜值大杀四方)");
      
      if (ethics < 40) strategies.push("【黑红路线】(为了热度妥协了道德，争议较大)");
      if (hotCp >= 3) strategies.push("【CP营业】(通过炒CP获得了巨大关注)");
      
      if (strategies.length === 0) strategies.push("【稳扎稳打】(各项均衡，一步一个脚印)");
      
      styleEvaluation = strategies.join(" + ");
  }

  const prompt = `
    你是一位资深的娱乐传记作家，请基于以下档案，为游戏《星途》的主角写一篇**分段清晰、情感真挚、特点分明**的生涯回忆录。字数：300-600字左右。

    【主角档案】
    姓名: ${gameState.name}
    初心梦想: ${gameState.dreamLabel}
    最终结局: ${gameState.gameResult}
    签约公司: ${companyName}
    
    【最终数据】
    ${statsDescription}
    实力: Vocal ${gameState.stats.vocal} / Dance ${gameState.stats.dance} / 颜值 ${gameState.stats.looks} / 情商 ${gameState.stats.eq}
    特殊: CP热度 ${gameState.hiddenStats.hotCp} / 出圈 ${gameState.hiddenStats.viralMoments}
    
    【星途风格分析 (重要)】
    ${styleEvaluation}
    
    【关键经历】
    ${recentEvents.join('\n')}
    
    【写作要求】
    1. **分段结构 (必须遵守)**: 请输出 **3-4 个自然段**，段落之间用空行分隔，阅读感要舒适。
       - **第一段 (起步)**: 回顾16岁时的青涩与初心。
       - **第二段 (征途)**: **重点点评**TA在选秀/奋斗期间的**选择与代价**。
         * 如果是实力派，赞美汗水；如果是颜值派，感叹天赋；
         * **关键**：如果TA走了【黑红】或【CP】路线，请委婉点评这种“为了红的妥协”带来的热度与争议，以及这是否值得。
       - **第三段 (终章)**: 结合结局【${gameState.gameResult}】，送上温暖、有力或释然的寄语。
    
    2. **文风**: 第二人称"你"。深情、有画面感，像一位老友在灯下夜谈。
       ${isAmateur ? '- **注意**: 玩家未参加选秀就结束了，请侧重描写“倒在黎明前”的遗憾，鼓励TA重头再来。' : ''}
    3. **去格式化**: 不要加标题，不要加“亲爱的玩家”等客套前缀，直接开始讲故事。
  `;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: { 
          thinkingConfig: { thinkingBudget:512 }, // Give it some thought for better structure
          maxOutputTokens: 2048
      } 
    }), 2, 2000) as GenerateContentResponse;
    return response.text || "星光虽微，亦有光芒。感谢游玩。";
  } catch (error) {
    console.error("Gemini summary failed after retries", error);
    return "传说在星光深处，由于网络波动，你的故事暂时无法传颂...但你走过的路，每一步都算数。";
  }
};

export const generateAnnualSummary = async (gameState: GameState): Promise<string> => {
  const currentAge = gameState.time.age;
  // Get standardized fallback text based on age
  const fallbackText = ANNUAL_SUMMARIES[currentAge] || "时光飞逝，这一年的努力都化作了成长的印记。新的一年，继续前行。";

  const ai = getClient();
  if (!ai) return fallbackText;

  const yearLogs = gameState.history.filter(h => h.includes(`${currentAge}岁`));

  const prompt = `
    简短总结${currentAge}岁年度(80字内)。
    阶段:${gameState.stage}, 粉丝:${gameState.stats.fans}万
    本年经历:${yearLogs.join(';')}
    请简练并给出一句鼓励。
  `;

  // Use withTimeout to ensure we don't block for too long. 
  return withTimeout(
    (async () => {
        try {
            const response = await callWithRetry(() => ai.models.generateContent({
              model: 'gemini-2.5-flash-lite', // Fast model
              contents: prompt,
              config: { thinkingConfig: { thinkingBudget: 0 } }
            }), 1, 500) as GenerateContentResponse;
            return response.text || fallbackText;
        } catch (error) {
            return fallbackText;
        }
    })(),
    fallbackText
  );
};

export const generateFanComments = async (gameState: GameState, context: 'START' | 'UPDATE'): Promise<string[]> => {
  const ai = getClient();
  const fallback = ["期待！", "加油！", "好看！", "冲鸭！", "支持！"];
  
  if (!ai) return fallback;

  const prompt = `
    生成3条有趣的、抓马的选秀综艺弹幕/评论(每条20字内)。
    选手性别: 男。
    当前排名:${gameState.rank}, 票数:${gameState.stats.votes}万
    
    要求:
    1. 语气要更"笋"、更有趣，像真实的豆瓣/微博/B站评论。
    2. 可以包含一些选秀黑话：如"皇族"、"祭天"、"美丽废物"、"百万修音"、"这就是世界的参差"。
    3. 如果排名低，可以带点同情或嘲讽；如果排名高，可以带点质疑或狂热。
    4. 直接返回纯文本列表。
  `;

  // Strict timeout for comments
  return withTimeout(
    (async () => {
      try {
        const response = await callWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        }), 1, 500) as GenerateContentResponse;
        const text = response.text || "";
        const comments = text.split('\n').map(c => c.trim().replace(/^[-*•\d\.]+\s*/, '')).filter(c => c.length > 0);
        return comments.slice(0, 3);
      } catch (e) {
        return fallback;
      }
    })(),
    fallback
  );
};

// NEW: Purely for generating social comments when the main outcome is hardcoded
export const generateSocialFeedback = async (
    eventTitle: string,
    choiceText: string,
    resultNarrative: string
): Promise<{ socialType: 'WECHAT' | 'WEIBO' | 'SYSTEM', socialSender: string, socialContent: string } | null> => {
    const ai = getClient();
    if (!ai) return null;

    const prompt = `
      RPG游戏事件社交反馈生成。
      事件: "${eventTitle}"
      玩家选择: "${choiceText}"
      结果: "${resultNarrative}"
      
      请生成一条来自粉丝、路人或亲友的简短社交媒体评论(WEIBO)或私信(WECHAT)。
      风格: 饭圈/真实/有趣。
      
      输出JSON:
      {
        "socialType": "WEIBO" | "WECHAT",
        "socialSender": "发送者名字(5字内)",
        "socialContent": "内容(20字内)"
      }
    `;

    return withTimeout(
        (async () => {
            try {
                const response = await callWithRetry(() => ai.models.generateContent({
                    model: 'gemini-2.5-flash-lite',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        thinkingConfig: { thinkingBudget: 0 }
                    }
                }), 1, 500) as GenerateContentResponse;
                if (response.text) {
                    return JSON.parse(response.text);
                }
                return null;
            } catch (e) {
                return null;
            }
        })(),
        null
    );
}

export const generateEventOutcome = async (
  gameState: GameState,
  event: GameEvent,
  choiceLabel: string
): Promise<EventOutcome | null> => {
  const ai = getClient();
  if (!ai) return null;

  // --- NEW STAGE-BASED LUCK & DRAMA MECHANISM ---
  const eq = gameState.stats.eq;
  const luckRoll = Math.random() * 100; // 0 - 100 pure randomness
  const hasCompany = gameState.company !== Company.NONE;
  
  // 1. Determine Stage Benchmark for EQ
  let eqBenchmark = 40; 
  if (gameState.stage === GameStage.SHOW) {
      eqBenchmark = 50; 
  } else if (gameState.stage === GameStage.ENDED) {
      eqBenchmark = 60; 
  }

  // 2. Normalize EQ Score
  const eqPerformance = Math.max(0, Math.min(100, 50 + (eq - eqBenchmark)));

  // 3. Calculate Weighted Score
  const weightedScore = (eqPerformance * 0.6) + (luckRoll * 0.4);
  
  let luckType = "";
  let luckGuidance = "";
  let statRange = "[-3, +6]";

  // 4. Determine Outcome Drama
  if (luckRoll <= 5) {
      luckType = "大凶 (CRITICAL FAILURE)";
      luckGuidance = "【剧本：史诗级翻车/社死现场】无论多努力，强制触发滑稽的失败、被全网群嘲或遭遇不可抗力。结果必须是负面的。";
      statRange = "[-5, -3]";
  } else if (luckRoll >= 95) {
      luckType = "大吉 (CRITICAL SUCCESS)";
      luckGuidance = "【剧本：天选之子/神级救场】触发意想不到的奇迹，比如不仅化解危机还意外吸粉，或者被大佬一眼相中。结果必须是非常正面的。";
      statRange = "[+5, +8]";
  } else {
      if (weightedScore < 35) {
          luckType = "凶 (BAD)";
          luckGuidance = `【剧本：弄巧成拙】虽然尽力了，但效果尴尬或引起了反感。分数${weightedScore.toFixed(0)}(低)。`;
          statRange = "[-3, 0]"; 
      } else if (weightedScore < 75) {
          luckType = "平 (MIXED)";
          luckGuidance = `【剧本：无功无过】事情平淡结束，或者有得有失。分数${weightedScore.toFixed(0)}(中)。`;
          statRange = "[-2, +2]"; 
      } else {
          luckType = "吉 (GOOD)";
          luckGuidance = `【剧本：小出圈】操作得当，获得好评或小范围热度。分数${weightedScore.toFixed(0)}(高)。`;
          statRange = "[+2, +5]"; 
      }
  }

  const isSocialOrRandom = event.type === 'SOCIAL' || event.type === 'RANDOM';
  const isAmateur = gameState.stage === GameStage.AMATEUR;
  let statsInstruction = "";
  
  // 严格控制 AMATEUR 阶段的票数修改
  if (isAmateur) {
      statsInstruction = "⚠️ **绝对禁止修改: votes (票数)**。当前玩家处于练习生阶段，尚未参加选秀，没有投票系统。只能修改: eq, fans, health, ethics, looks, vocal, dance, dream, sincerity。";
  } else if (isSocialOrRandom) {
      // Allow EQ, forbid Votes for SOCIAL/RANDOM in SHOW stage usually, but looser constraint
      statsInstruction = "禁止修改票数(votes)。可以修改: eq, fans, health, ethics, looks, vocal, dance。";
  }

  const companyConstraint = hasCompany 
      ? "" 
      : "⚠️ 玩家目前【未签约】经纪公司，SocialSender 绝对禁止生成 '经纪人'、'公司'、'助理'、'老板' 等官方角色回复。";

  const prompt = `
    角色扮演：你是《星途》游戏的“命运导演”，负责判定玩家行动的结果。
    风格：毒舌、幽默、抓马(Drama)、饭圈梗。拒绝平铺直叙。
    
    事件: "${event.title}"
    玩家选择: "${choiceLabel}"
    当前阶段: ${gameState.stage}
    
    【运势判定】
    命运骰子: ${luckRoll.toFixed(0)} (情商表现: ${eqPerformance})
    最终走向: ${luckType}
    剧情指引: ${luckGuidance}
    
    【生成要求】
    1. **narrative (结果日志)**: 
       - 长度：**15-35字以内** (不要太短，要有点剧情感)。
       - 结合了玩家现在的数据表现情况
       - 内容：有画面感或神转折，语句通顺。可以使用"社死"、"塌房"、"起飞"、"封神"等词汇。
       - 坏例子："你的表现很好，获得了大家的喜欢" (太无聊)。
       - 好例子："操作太下饭，粉丝连夜扛火车跑路。", "凭借一张神图，直接封神。", "试图耍帅，结果把假发片甩飞了。"
    
    2. **changes (数值)**: 
       - 必须符合逻辑。例如：如果narrative是"社死/被嘲"，必须扣Fans/Looks/Eq。如果是"封神/出圈"，必须加Fans。
       - 数值范围参考: ${statRange}。
       - 必须修改2-3个属性。
       - ${statsInstruction}

    3. **socialContent (社交反馈)**:
       - 要有梗，10-20字左右。
       - 如果是坏结局，评论要"笋"、"阴阳怪气"或"恨铁不成钢"。
       - 如果是好结局，评论要"彩虹屁"、"尖叫"或"玩梗"。
       - ${companyConstraint}
    
    输出JSON:
    {
      "narrative": "string (15-35 chars)",
      "changes": { "statName": number },
      "socialType": "WECHAT"|"WEIBO",
      "socialSender": "string (5 chars)",
      "socialContent": "string (20 chars)"
    }
  `;

  return withTimeout(
    (async () => {
      try {
        const response = await callWithRetry(() => ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                narrative: { type: Type.STRING },
                changes: {
                  type: Type.OBJECT,
                  properties: {
                    vocal: { type: Type.INTEGER },
                    dance: { type: Type.INTEGER },
                    looks: { type: Type.INTEGER },
                    eq: { type: Type.INTEGER },
                    ethics: { type: Type.INTEGER },
                    health: { type: Type.INTEGER },
                    fans: { type: Type.INTEGER },
                    votes: { type: Type.INTEGER },
                  },
                },
                socialType: { type: Type.STRING },
                socialSender: { type: Type.STRING },
                socialContent: { type: Type.STRING },
              },
              required: ["narrative", "changes", "socialType", "socialSender", "socialContent"],
            },
            thinkingConfig: { thinkingBudget: 0 }
          }
        }), 1, 500) as GenerateContentResponse;

        if (response.text) {
          return JSON.parse(response.text) as EventOutcome;
        }
        return null;
      } catch (error) {
        return null; // Return null to trigger fallback
      }
    })(),
    null // Fallback value on timeout
  );
};
