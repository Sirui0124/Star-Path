
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, GameEvent, EventOutcome, GameStage } from "../types";

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
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
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
      model: 'gemini-2.5-flash',
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
    选手:${gameState.gender}, 排名:${gameState.rank}, 票数:${gameState.stats.votes}万
    风格: 饭圈用语/路人吃瓜/颜狗/事业粉。
    直接返回纯文本列表。
  `;

  // Strict timeout for comments
  return withTimeout(
    (async () => {
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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

  // Determine Luck Level based on EQ thresholds
  const eq = gameState.stats.eq;
  let luckDescription = "普通";
  let luckGuidance = "结果中立随机";

  if (eq < 20) {
    luckDescription = "极低";
    luckGuidance = "极易倒霉，遭遇意外坏事，属性大概率减少";
  } else if (eq < 40) {
    luckDescription = "较低";
    luckGuidance = "运气欠佳，容易碰壁或引发小麻烦";
  } else if (eq < 70) {
    luckDescription = "较高";
    luckGuidance = "运势不错，大概率顺利，可能获得额外收益";
  } else {
    luckDescription = "极高";
    luckGuidance = "锦鲤附体，逢凶化吉，触发奇迹般的极好结果";
  }

  const isAmateur = gameState.stage === GameStage.AMATEUR;
  const voteInstruction = isAmateur ? "禁止修改票数(votes)。" : "";

  const prompt = `
    RPG事件结算。
    事件: "${event.title}"
    选择: "${choiceLabel}"
    当前情商: ${eq} (系统判定运气: ${luckDescription})。
    生成指导: ${luckGuidance}。
    数值约束: 必须修改2-3个属性，单项数值变化严格控制在[-3, +6]之间(整数)。${voteInstruction}
    
    输出JSON:
    1. narrative: 结果描述(20字内)。
    2. changes: 属性变化(对象, 包含2-3个属性)。
    3. socialType: "WECHAT"|"WEIBO"。
    4. socialSender: 发送者(5字内)。
    5. socialContent: 反馈(15字内)。
  `;

  // Strict timeout for events
  return withTimeout(
    (async () => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
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
                    morale: { type: Type.INTEGER },
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
