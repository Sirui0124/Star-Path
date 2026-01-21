
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GameState, GameEvent, EventOutcome, GameStage, Company } from "../types";
import { ANNUAL_SUMMARIES } from "../content/narratives";
import { COMPANIES } from "../constants";

const TIMEOUT_MS = 2500; // Increased timeout slightly to allow for network latency, but keep it snappy

const getClient = () => {
    if (!process.env.API_KEY) return null;
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- ERROR HANDLING & RETRY LOGIC ---

/**
 * Wraps an API call with logic to HANDLE RATE LIMITS smoothly.
 * Strategy: If we hit a 429 (Rate Limit), DO NOT RETRY. Fail immediately to fallback.
 * This prevents one user from clogging the pipe for everyone else.
 */
const callWithRetry = async <T>(
  apiCall: () => Promise<T>,
  retries: number = 1, // Reduced default retries to prevent queue buildup
  initialDelay: number = 1000
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    const errorCode = error?.status || error?.error?.code;
    const errorMessage = error?.message || '';
    const errorStr = JSON.stringify(error);

    // CRITICAL OPTIMIZATION:
    // If quota is exhausted (429) or service overloaded (503), DO NOT RETRY.
    // Return to fallback immediately to keep the game running smooth for the user.
    if (
        errorCode === 429 || 
        errorCode === 503 || 
        errorMessage.includes('429') || 
        errorMessage.includes('RESOURCE_EXHAUSTED') ||
        errorMessage.includes('Overloaded') ||
        errorStr.includes('429')
    ) {
        console.warn("Gemini Rate Limit Hit - Switching to Basic Mode immediately.");
        throw error; // Throwing here effectively cancels the retry loop
    }
    
    // Only retry for network glitches (fetch errors)
    if (retries > 0) {
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
  // Silent fail for connectivity test
  return null; 
};

export const generateGameSummary = async (gameState: GameState): Promise<string> => {
  const ai = getClient();
  
  // Define a failure signal string that App.tsx can recognize to trigger local fallback
  const FAILURE_SIGNAL = "AI_GENERATION_FAILED";

  if (!ai) return FAILURE_SIGNAL;
  
  const events = gameState.history.filter(h => h.includes("【") || h.includes("签约") || h.includes("出道"));
  const recentEvents = events.slice(-8); // Reduce context to save tokens

  const isAmateur = gameState.stage === GameStage.AMATEUR;
  const companyName = gameState.company === Company.NONE 
      ? '独立艺人' 
      : COMPANIES[gameState.company]?.name || gameState.company;

  const prompt = `
    为《星途》主角写一篇300-500字的结局回忆录。
    
    档案: ${gameState.name}, 梦想:${gameState.dreamLabel}, 结局:${gameState.gameResult}
    公司: ${companyName}
    数据: 粉丝${gameState.stats.fans}万, 票数${gameState.stats.votes}万
    实力: 唱${gameState.stats.vocal}/跳${gameState.stats.dance}/颜${gameState.stats.looks}/情商${gameState.stats.eq}
    
    经历:
    ${recentEvents.join('; ')}
    
    要求:
    1. 分三段：起步、征途、终章。
    2. 文风深情，第二人称"你"。
    3. 结合结局"${gameState.gameResult}"升华主题。
  `;

  try {
    // 5s timeout for summary since it's longer text, but strict fallback
    const response = await Promise.race([
        callWithRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash', // Use Flash Lite for speed and higher limits
            contents: prompt,
            config: { 
                thinkingConfig: { thinkingBudget: 0 } // Disable thinking to save tokens
            } 
        }), 0, 0), // 0 retries for summary to avoid hanging
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000))
    ]) as GenerateContentResponse;

    return response.text || FAILURE_SIGNAL;
  } catch (error) {
    console.error("Gemini summary failed", error);
    return FAILURE_SIGNAL;
  }
};

export const generateAnnualSummary = async (gameState: GameState): Promise<string> => {
  const currentAge = gameState.time.age;
  const fallbackText = ANNUAL_SUMMARIES[currentAge] || "时光飞逝，这一年的努力都化作了成长的印记。";

  const ai = getClient();
  if (!ai) return fallbackText;

  // Extremely simplified prompt to reduce token count
  const prompt = `总结${currentAge}岁年度(50字内)。粉丝:${gameState.stats.fans}万。给一句鼓励。`;

  return withTimeout(
    (async () => {
        try {
            const response = await callWithRetry(() => ai.models.generateContent({
              model: 'gemini-2.5-flash-lite',
              contents: prompt,
              config: { thinkingConfig: { thinkingBudget: 0 } }
            }), 0, 0) as GenerateContentResponse; // 0 retries
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
  const fallback = ["期待！", "加油！", "好看！"];
  
  if (!ai) return fallback;

  // Minimal prompt
  const prompt = `生成3条简短(15字内)的选秀综艺有趣弹幕。选手排名:${gameState.rank}。直接返回列表。`;

  return withTimeout(
    (async () => {
      try {
        const response = await callWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        }), 0, 0) as GenerateContentResponse;
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

export const generateSocialFeedback = async (
    eventTitle: string,
    choiceText: string,
    resultNarrative: string
): Promise<{ socialType: 'WECHAT' | 'WEIBO' | 'SYSTEM', socialSender: string, socialContent: string } | null> => {
    const ai = getClient();
    if (!ai) return null;

    // Use JSON schema to ensure strictly formatted output with minimal tokens
    const prompt = `
      Event: "${eventTitle}" -> "${choiceText}" -> "${resultNarrative}"
      Generate 1 short social media comment (JSON).
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
                                socialType: { type: Type.STRING, enum: ["WEIBO", "WECHAT"] },
                                socialSender: { type: Type.STRING },
                                socialContent: { type: Type.STRING }
                            }
                        },
                        thinkingConfig: { thinkingBudget: 0 }
                    }
                }), 0, 0) as GenerateContentResponse;
                
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

  const eq = gameState.stats.eq;
  const luckRoll = Math.random() * 100;
  
  // Simplified logic for prompt construction
  let luckType = "平";
  if (luckRoll <= 10) luckType = "凶";
  if (luckRoll >= 90) luckType = "大吉";

  const prompt = `
    你是RPG判定系统。
    事件: "${event.title}"
    选择: "${choiceLabel}"
    当前情商:${eq}, 运势:${luckType}
    
    请生成结果(JSON):
    1. narrative: 15-30字剧情。
    2. changes: 属性变化(vocal,dance,looks,eq,ethics,health,fans,votes)。
    3. socialContent: 15字以内社交评论。
  `;

  return withTimeout(
    (async () => {
      try {
        // Use Flash Lite for maximum throughput
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
                socialType: { type: Type.STRING, enum: ["WEIBO", "WECHAT", "SYSTEM"] },
                socialSender: { type: Type.STRING },
                socialContent: { type: Type.STRING },
              },
              required: ["narrative", "changes", "socialType", "socialSender", "socialContent"],
            },
            thinkingConfig: { thinkingBudget: 0 }
          }
        }), 0, 0) as GenerateContentResponse; // 0 Retries - Fail Fast!

        if (response.text) {
          return JSON.parse(response.text) as EventOutcome;
        }
        return null;
      } catch (error) {
        return null; // Return null triggers the hardcoded fallback in App.tsx
      }
    })(),
    null 
  );
};
