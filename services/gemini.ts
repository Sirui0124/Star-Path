
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, GameEvent, EventOutcome, GameStage, Company } from "../types";

const TIMEOUT_MS = 3500; // 3.5 seconds timeout

const getClient = () => {
    if (!process.env.API_KEY) return null;
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper: Wrap promise with timeout
const withTimeout = <T>(promise: Promise<T>, fallbackValue: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), TIMEOUT_MS))
  ]);
};

export const generateGameSummary = async (gameState: GameState): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key 未配置。但你的星途依然闪耀！";
  
  const prompt = `
    简短总结养成游戏《星途》结局(200字内)。
    玩家:${gameState.name}, 性别:${gameState.gender}, 梦想:${gameState.dreamLabel}
    结局:${gameState.gameResult}, 粉丝:${gameState.stats.fans}万
    经历:${gameState.history.slice(-5).join(';')}
    请用旁白语气，富有情感地总结。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: -1 } }
    });
    return response.text || "星光虽微，亦有光芒。感谢游玩。";
  } catch (error) {
    console.error("Gemini summary failed", error);
    return "传说在星光深处，由于网络波动，你的故事暂时无法传颂...";
  }
};

export const generateAnnualSummary = async (gameState: GameState): Promise<string> => {
  const ai = getClient();
  if (!ai) return "这一年过去了，你离梦想又近了一步。";

  const currentAge = gameState.time.age;
  const yearLogs = gameState.history.filter(h => h.includes(`${currentAge}岁`));

  const prompt = `
    简短总结${currentAge}岁年度(80字内)。
    阶段:${gameState.stage}, 粉丝:${gameState.stats.fans}万
    本年经历:${yearLogs.join(';')}
    请简练并给出一句鼓励。
  `;

  // Allow slightly longer timeout for annual summary as it's a major transition
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "时光飞逝，新的一年即将开始。";
  } catch (error) {
    return "这一年的汗水洒在练习室的地板上，虽然辛苦，但每一步都算数。";
  }
};

export const generateFanComments = async (gameState: GameState, context: 'START' | 'UPDATE'): Promise<string[]> => {
  const ai = getClient();
  const fallback = ["期待！", "加油！", "好看！", "冲鸭！", "支持！"];
  
  if (!ai) return fallback;

  const prompt = `
    生成3条简短的选秀粉丝评论(每条15字内)。
    选手性别: 男 (务必使用多样化称呼，如: 老公/哥哥/崽崽/大帅哥/全名，尽量少用"弟弟")。
    当前排名:${gameState.rank}, 票数:${gameState.stats.votes}万
    
    要求:
    1. 混合不同粉丝属性: 女友粉(喊老公/想嫁)、妈粉(喊崽崽/心疼)、事业粉(喊哥哥/冲榜)、路人(喊帅哥/吃瓜)。
    2. 语气要有"饭圈味"，可以使用适量黑话(如: 绝绝子/入股不亏/紫微星/鲨疯了)。
    3. 直接返回纯文本列表。
  `;

  // Strict timeout for comments
  return withTimeout(
    (async () => {
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
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
  // Amateur: 40 is average. Show: 50 is average. Ended: 60 is average.
  let eqBenchmark = 40; 
  if (gameState.stage === GameStage.SHOW) {
      eqBenchmark = 50; 
  } else if (gameState.stage === GameStage.ENDED) {
      eqBenchmark = 60; 
  }

  // 2. Normalize EQ Score (Center around 50 based on benchmark)
  // If EQ == Benchmark, normalized score is 50.
  // If EQ is 20 points higher than benchmark, score is 70.
  const eqPerformance = Math.max(0, Math.min(100, 50 + (eq - eqBenchmark)));

  // 3. Calculate Weighted Score
  // 60% EQ Competence + 40% Pure Luck
  const weightedScore = (eqPerformance * 0.6) + (luckRoll * 0.4);
  
  let luckType = "";
  let luckGuidance = "";
  let statRange = "[-3, +6]"; // Default range reference

  // 4. Determine Outcome
  if (luckRoll <= 5) {
      // 5% Chance: Critical Failure (Drama!)
      luckType = "大凶 (CRITICAL FAILURE)";
      luckGuidance = "【戏剧性转折-恶】无论玩家选择多明智、情商多高，强制触发意外背锅、恶意剪辑或突发灾难。虽然你做得对，但世界对你不公。";
      statRange = "[-4, -2]"; // Reduced range to fit the -8 sum constraint safely
  } else if (luckRoll >= 95) {
      // 5% Chance: Critical Success (Miracle!)
      luckType = "大吉 (CRITICAL SUCCESS)";
      luckGuidance = "【戏剧性转折-喜】无论情商高低，触发意想不到的奇迹（如被大佬赏识、黑红出圈、锦鲤附体）。傻人有傻福，结果出奇的好。";
      statRange = "[+4, +7]"; // Adjusted to fit the +15 sum constraint
  } else {
      // Standard Logic (Weighted Score)
      if (weightedScore < 35) {
          luckType = "凶 (BAD)";
          luckGuidance = `综合判定分${weightedScore.toFixed(0)} (低)。情商表现不足(基准${eqBenchmark})或运气太差。试图解决问题但搞砸了，或者被误解。`;
          statRange = "[-3, +1]"; 
      } else if (weightedScore < 75) {
          luckType = "平 (MIXED)";
          luckGuidance = `综合判定分${weightedScore.toFixed(0)} (中)。结果中规中矩，有得有失。情商发挥了作用但运气一般，或者运气好但情商没跟上。`;
          statRange = "[-2, +2]"; 
      } else {
          luckType = "吉 (GOOD)";
          luckGuidance = `综合判定分${weightedScore.toFixed(0)} (高)。情商在线(基准${eqBenchmark})且运势不错。完美化解危机，或者因得当的应对获得了额外收益。`;
          statRange = "[+1, +5]"; 
      }
  }

  const isSocialOrRandom = event.type === 'SOCIAL' || event.type === 'RANDOM';
  let statsInstruction = "";
  
  if (isSocialOrRandom) {
      statsInstruction = "⚠️ 绝对禁止修改: votes (票数), eq (情商)。必须从以下属性中选择2-3个修改: fans, health, ethics, looks, vocal, dance。";
  } else {
      const isAmateur = gameState.stage === GameStage.AMATEUR;
      statsInstruction = isAmateur ? "禁止修改票数(votes)。" : "";
  }

  const companyConstraint = hasCompany 
      ? "" 
      : "⚠️ 玩家目前【未签约】经纪公司，SocialSender 绝对禁止生成 '经纪人'、'公司'、'助理'、'老板' 等官方角色回复。请生成粉丝、路人、家人或朋友的回复。";

  const prompt = `
    RPG事件结算。
    事件: "${event.title}"
    玩家选择: "${choiceLabel}"
    玩家性别: 男 (粉丝称呼多样化: 老公/崽崽/哥哥/宝宝/大帅哥, 拒绝单一)
    
    【运势判定数据】
    当前阶段: ${gameState.stage} (情商基准线: ${eqBenchmark})
    玩家情商: ${eq} (表现分: ${eqPerformance})
    命运骰子: ${luckRoll.toFixed(0)}
    最终判定: ${luckType}
    
    【生成指导】
    ${luckGuidance}
    
    【数值约束】
    1. 必须修改2-3个属性。
    2. 单项属性变化范围推荐: ${statRange}。
    3. ⚠️ 绝对约束：所有属性变化的数值之和 (Sum of all changes) 必须在 [-8, 15] 之间。
    4. ${statsInstruction}
    5. 如果判定为“大凶”或“大吉”，请让narrative极具戏剧性。
    
    【社交反馈约束】
    ${companyConstraint}
    socialContent应简短有力，符合当代饭圈文化(女友粉/妈粉/事业粉/路人/黑粉)。
    
    输出JSON:
    1. narrative: 结果描述(25字内，剧情要有起伏)。
    2. changes: 属性变化(对象, 包含2-3个属性)。
    3. socialType: "WECHAT"|"WEIBO"。
    4. socialSender: 发送者(5字内)。
    5. socialContent: 社交反馈(20字内，符合运势判定)。
  `;

  // Strict timeout for events
  return withTimeout(
    (async () => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-lite',
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
        });

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
