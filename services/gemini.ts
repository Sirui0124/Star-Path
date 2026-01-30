
import { GameState, GameEvent, EventOutcome, GameStage, Company } from "../types";
import { ANNUAL_SUMMARIES } from "../content/narratives";
import { COMPANIES } from "../constants";

// Configuration for the new Model API (GLM-4)
const API_KEY = "c26b9e9d3af3495f86910ef79cccc08b.w2TAJcdvlykmKB1Z";
const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
// Using glm-4-flash as it is the standard fast/free model for Zhipu AI Cloud API. 
// "glm-4-7b-chat" is typically for local deployments; mapping to cloud equivalent for stability.
const MODEL_NAME = "glm-4-flash"; 

const TIMEOUT_MS = 10000; // Increased timeout slightly for HTTP fetch

// --- HTTP CLIENT HELPER ---

const callGLM = async (messages: { role: string, content: string }[], jsonMode: boolean = false): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        stream: false,
        temperature: 0.7,
        top_p: 0.8,
        // GLM API often accepts 'json_object' in response_format if newer, but standard prompt engineering is safer across versions
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}) 
      }),
      signal: controller.signal
    });

    clearTimeout(id);

    if (!response.ok) {
      console.warn(`GLM API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;

  } catch (error) {
    console.error("GLM API Call Failed:", error);
    return null;
  }
};

// Helper to strip Markdown code blocks if the model returns them around JSON
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\s*|\s*```/g, "").trim();
};


// --- GENERATORS ---

export const generateGameSummary = async (gameState: GameState): Promise<string> => {
  // 提取关键历史事件
  const events = gameState.history.filter(h => h.includes("【") || h.includes("签约") || h.includes("出道"));
  const recentEvents = events.slice(-10);

  const isAmateur = gameState.stage === GameStage.AMATEUR;
  const companyName = gameState.company === Company.NONE 
      ? '独立艺人' 
      : COMPANIES[gameState.company]?.name || gameState.company;

  let styleEvaluation = "";
  if (isAmateur) {
      styleEvaluation = "遗憾止步于练习生阶段，未能登上更大的舞台。";
  } else {
      const { vocal, dance, looks, ethics } = gameState.stats;
      const { hotCp } = gameState.hiddenStats;
      const totalSkill = vocal + dance;
      
      const strategies = [];
      if (totalSkill >= 220) strategies.push("【实力断层】");
      else if (looks >= 160) strategies.push("【神颜降临】");
      if (ethics < 40) strategies.push("【黑红路线】");
      if (hotCp >= 3) strategies.push("【CP营业】");
      if (strategies.length === 0) strategies.push("【稳扎稳打】");
      styleEvaluation = strategies.join(" + ");
  }

  const prompt = `
    你是一位资深的娱乐传记作家，你深谙选秀和偶像圈的真谛。请为游戏《星途》的主角写一篇**分段清晰、尖锐而深刻、锐评与动情共存**的生涯回忆录。300字左右。

    【主角档案】
    姓名: ${gameState.name}
    结局: ${gameState.gameResult}
    签约: ${companyName}
    风格: ${styleEvaluation}
    粉丝: ${gameState.stats.fans}万
    
    【写作要求】
    1. **结构**: 分三段（起步、征途、终章）。
    2. **文风**: 第二人称"你"。深情、有画面感。
    3. **内容**: 结合TA的风格（如实力派或黑红）点评得失，最后送上祝福。
    4. 不要加标题。不要过于鸡汤，而是深刻、尖锐、言之有物。
  `;

  const result = await callGLM([{ role: "user", content: prompt }]);
  
  if (!result) {
    // Fallback text if AI fails (Network issue or Filter)
    return "传说在星光深处，由于网络波动，你的故事暂时无法传颂...但你走过的路，每一步都算数。";
  }
  
  return result;
};

export const generateAnnualSummary = async (gameState: GameState): Promise<string> => {
  const currentAge = gameState.time.age;
  const fallbackText = ANNUAL_SUMMARIES[currentAge] || "时光飞逝，新的一年，继续前行。";

  const yearLogs = gameState.history.filter(h => h.includes(`${currentAge}岁`));
  const prompt = `
    简短总结${currentAge}岁年度(80字内)。
    阶段:${gameState.stage}, 粉丝:${gameState.stats.fans}万
    本年经历:${yearLogs.join(';')}
    请简练，并给出一句鼓励。
  `;

  const result = await callGLM([{ role: "user", content: prompt }]);
  return result || fallbackText;
};

export const generateFanComments = async (gameState: GameState, context: 'START' | 'UPDATE'): Promise<string[]> => {
  const fallback = ["期待！", "加油！", "好看！", "冲鸭！", "支持！"];
  
  const prompt = `
    生成3条有趣的选秀综艺弹幕(每条20字内)。
    选手排名:${gameState.rank}, 票数:${gameState.stats.votes}万
    风格: 饭圈语气，笋言笋语，或者狂热。
    格式: 纯文本列表，每行一条。
  `;

  const result = await callGLM([{ role: "user", content: prompt }]);
  
  if (!result) return fallback;
  
  return result.split('\n')
    .map(c => c.trim().replace(/^[-*•\d\.]+\s*/, ''))
    .filter(c => c.length > 0)
    .slice(0, 3);
};

export const generateSocialFeedback = async (
    eventTitle: string,
    choiceText: string,
    resultNarrative: string
): Promise<{ socialType: 'WECHAT' | 'WEIBO' | 'SYSTEM', socialSender: string, socialContent: string } | null> => {
    
    const prompt = `
      生成一条RPG游戏社交反馈。
      事件: "${eventTitle}"
      选择: "${choiceText}"
      结果: "${resultNarrative}"
      
      输出JSON格式:
      {
        "socialType": "WEIBO" | "WECHAT",
        "socialSender": "名字(5字内)",
        "socialContent": "内容(20字内)"
      }
    `;

    const result = await callGLM([{ role: "user", content: prompt }], true);
    if (!result) return null;

    try {
        return JSON.parse(cleanJsonString(result));
    } catch (e) {
        return null;
    }
}

export const generateEventOutcome = async (
  gameState: GameState,
  event: GameEvent,
  choiceLabel: string
): Promise<EventOutcome | null> => {
  
  // Logic helpers
  const eq = gameState.stats.eq;
  const luckRoll = Math.random() * 100;
  let eqBenchmark = gameState.stage === GameStage.SHOW ? 50 : 40;
  const eqPerformance = Math.max(0, Math.min(100, 50 + (eq - eqBenchmark)));
  const weightedScore = (eqPerformance * 0.6) + (luckRoll * 0.4);
  
  let luckType = weightedScore < 35 ? "凶" : weightedScore < 75 ? "平" : "吉";
  if (luckRoll <= 5) luckType = "大凶";
  if (luckRoll >= 95) luckType = "大吉";

  const isAmateur = gameState.stage === GameStage.AMATEUR;
  const statsInstruction = isAmateur 
      ? "⚠️禁止修改votes(票数)。" 
      : "禁止修改votes(票数)，除非事件与舞台直接相关。";

  const prompt = `
    你是《星途》游戏的命运导演。请生成JSON结果。
    事件: "${event.title}"
    选择: "${choiceLabel}"
    运势: ${luckType} (分数${weightedScore.toFixed(0)})
    
    要求:
    1. narrative: 15-35字，有剧情感，毒舌或幽默。
    2. changes: 2-3个属性变化(vocal/dance/looks/eq/ethics/health/fans/votes)。${statsInstruction}
    3. 请你严格控制单个指标的变化值在-3～5之间。不要太极端。要有逻辑！
    4. socialContent: 15字内社交评论。
    
    输出JSON:
    {
      "narrative": "string",
      "changes": { "statName": number },
      "socialType": "WECHAT"|"WEIBO",
      "socialSender": "string",
      "socialContent": "string"
    }
  `;

  const result = await callGLM([{ role: "user", content: prompt }], true);
  if (!result) return null;

  try {
    return JSON.parse(cleanJsonString(result)) as EventOutcome;
  } catch (error) {
    console.error("JSON Parse Error", error);
    return null;
  }
};

export const testAiConnectivity = async (): Promise<{ success: boolean; message: string }> => {
  const result = await callGLM([{ role: "user", content: "Ping" }]);
  if (result) return { success: true, message: "Connected to GLM-4" };
  return { success: false, message: "Connection Failed" };
};
