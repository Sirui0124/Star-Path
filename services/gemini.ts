import { GoogleGenAI } from "@google/genai";
import { GameState } from "../types";

const getClient = () => {
    if (!process.env.API_KEY) return null;
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateGameSummary = async (gameState: GameState): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API Key 未配置，无法生成详细总结。但你的星途依然闪耀！";
  }
  
  // Adjusted score calculation removing acting
  const finalScore = 
    gameState.stats.fans + 
    gameState.stats.votes + 
    (gameState.stats.vocal + gameState.stats.dance + gameState.stats.looks + gameState.stats.eq) * 0.5;

  const prompt = `
    你是一个偶像养成游戏《星途》的旁白叙述者。请根据以下玩家的游戏数据和历史记录，写一段300字左右的游戏结局总结。
    
    【玩家数据】
    - 最终身份: ${gameState.gameResult || '未知'}
    - 最终粉丝数: ${gameState.stats.fans}万
    - 最终票数: ${gameState.stats.votes}万
    - 核心能力: Vocal ${gameState.stats.vocal}, Dance ${gameState.stats.dance}, 颜值 ${gameState.stats.looks}, 情商 ${gameState.stats.eq}
    - 隐藏属性: 真诚 ${gameState.hiddenStats.sincerity}, 梦想 ${gameState.hiddenStats.dream}
    - 综合得分: ${finalScore.toFixed(0)}
    
    【关键经历日志】
    ${gameState.history.join('\n')}
    
    请根据结局的好坏（成团出道/Solo出道/被淘汰），结合数值，用富有情感、或励志或遗憾的语调，总结TA的星途人生。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "星光虽微，亦有光芒。感谢游玩。";
  } catch (error) {
    console.error("Gemini generation failed", error);
    return "传说在星光深处，由于网络波动，你的故事暂时无法传颂... (AI生成失败)";
  }
};

export const generateAnnualSummary = async (gameState: GameState): Promise<string> => {
  const ai = getClient();
  if (!ai) return "这一年过去了，你离梦想又近了一步。";

  // Filter logs for the current year/age
  const currentAge = gameState.time.age;
  const yearLogs = gameState.history.filter(h => h.includes(`${currentAge}岁`));

  const prompt = `
    你是一个养成游戏《星途》的旁白。玩家刚刚结束了 ${currentAge}岁 这一年的练习生生活。
    请根据本年度发生的事件和数值变化，写一段简短的年度总结（100字以内）。
    
    【当前状态】
    - 身份: ${gameState.stage}
    - 粉丝: ${gameState.stats.fans}万
    - 核心数值: Vocal ${gameState.stats.vocal}, Dance ${gameState.stats.dance}, 颜值 ${gameState.stats.looks}, 情商 ${gameState.stats.eq}
    
    【本年度经历】
    ${yearLogs.join('\n')}
    
    要求：
    1. 语言简练，富有感染力。
    2. 如果有重要事件（如签约公司、选秀报名成功），请在总结中提及。
    3. 对下一年的发展给出简短的鼓励或警示。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "时光飞逝，新的一年即将开始。";
  } catch (error) {
    console.error("Gemini annual summary failed", error);
    return "这一年的汗水洒在练习室的地板上，虽然辛苦，但每一步都算数。";
  }
};

export const generateFanComments = async (gameState: GameState, context: 'START' | 'UPDATE'): Promise<string[]> => {
  const ai = getClient();
  // Fallback comments if AI fails or key missing
  const fallback = [
      "期待你的表现！", 
      "这个颜值我先入股了！", 
      "希望能看到不一样的舞台。",
      "弟弟/妹妹加油啊！",
      "有人看过路透吗？感觉不错。"
  ];
  
  if (!ai) return fallback;

  const { vocal, dance, looks, eq, fans, votes } = gameState.stats;
  const { viralMoments, hotCp } = gameState.hiddenStats;
  const rank = gameState.rank;

  const prompt = `
    你正在扮演选秀节目《青春404》的社交媒体（微博/小红书/推特）粉丝群体。
    请根据选手（玩家）当前的属性和排名，生成 3-5 条 简短的、风格各异的粉丝热评。
    
    【选手数据】
    - 阶段: ${context === 'START' ? '刚刚官宣入营/初舞台' : '顺位发布/公演结束'}
    - 排名: ${context === 'START' ? '未知' : rank}
    - 能力: Vocal ${vocal}, Dance ${dance}, 颜值 ${looks}, 情商 ${eq}
    - 热度: 粉丝 ${fans}万, 票数 ${votes}万
    - 特殊: 出圈镜头 ${viralMoments}, CP热度 ${hotCp}
    
    【要求】
    1. 必须使用“秀粉”（选秀粉丝）的常用语和语气，例如：“入股不亏”、“绝美”、“皇族”、“祭天”、“全能ACE”、“妈妈爱你”、“救救孩子”、“只有我一个人觉得...”等。
    2. 风格要多样：可以是颜粉发疯、事业粉催票、路人吃瓜、或者是对排名的质疑/惊喜。
    3. 如果数值高（如Vocal/Dance高），称赞实力；如果颜值高，称赞脸；如果数值低但排名高，可以有人质疑“皇族”；如果排名低，要有虐粉/捞人的评论。
    4. 直接返回评论列表，每行一条，不要带编号或额外解说。
    5. 每条评论不超过25个字。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    const text = response.text || "";
    // Split by newlines and filter empty strings
    const comments = text.split('\n').map(c => c.trim().replace(/^[-*•\d\.]+\s*/, '')).filter(c => c.length > 0);
    return comments.slice(0, 5);
  } catch (error) {
    console.error("Gemini comment generation failed", error);
    return fallback;
  }
};