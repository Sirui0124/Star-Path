// 图片资源库
// 为了区分不同阶段，使用了不同的背景色和文字描述
// 后续请将这些 URL 替换为您准备好的二次元插画链接

export const STORY_IMAGES: Record<string, string> = {
  // --- 练习生阶段 (16-18岁) ---
  default: "https://placehold.co/600x400/ffe4e6/881337?text=Star+Path",
  16: "https://s3.bmp.ovh/imgs/2026/01/14/76df613fa07ca668.png", // 粉色系，懵懂
  17: "https://placehold.co/600x400/fecdd3/9f1239?text=Age+17+Hard+Training", // 深粉，汗水
  18: "https://placehold.co/600x400/fbcfe8/831843?text=Age+18+Coming+of+Age", // 紫粉，成长

  // --- 奋斗阶段 (19-21岁) ---
  19: "https://placehold.co/600x400/e0f2fe/075985?text=Age+19+Dream+Persistence", // 浅蓝，坚持
  20: "https://placehold.co/600x400/bae6fd/0369a1?text=Age+20+Turning+Point", // 蓝色，转折
  21: "https://placehold.co/600x400/7dd3fc/0c4a6e?text=Age+21+Growing+Pains", // 深蓝，成熟

  // --- 蜕变阶段 (22-24岁) ---
  22: "https://placehold.co/600x400/f3e8ff/6b21a8?text=Age+22+Shining+Star", // 浅紫，光芒
  23: "https://placehold.co/600x400/d8b4fe/581c87?text=Age+23+New+Chapter", // 紫色，篇章
  24: "https://placehold.co/600x400/c084fc/3b0764?text=Age+24+True+Strength", // 深紫，实力

  // --- 终章阶段 (25-26岁) ---
  25: "https://placehold.co/600x400/fef9c3/854d0e?text=Age+25+Original+Intention", // 浅黄，初心
  26: "https://placehold.co/600x400/fde047/713f12?text=Age+26+Final+Chapter", // 金色，终章

  // --- 结局插画 ---
  ending_center: "https://placehold.co/600x400/fff7ed/7c2d12?text=Ending:+Center+Debut", // C位-橙金辉煌
  ending_group: "https://placehold.co/600x400/fce7f3/831843?text=Ending:+Group+Debut",   // 成团-花路粉红
  ending_solo_good: "https://placehold.co/600x400/ecfeff/164e63?text=Ending:+Top+Solo",   // Solo好-青色实力
  ending_solo_bad: "https://placehold.co/600x400/eef2ff/312e81?text=Ending:+Solo+Debut",  // Solo普-深沉蓝紫
  ending_eliminated: "https://placehold.co/600x400/f3f4f6/1f2937?text=Ending:+Game+Over", // 淘汰-灰色落寞
};

// 根据结局文本获取对应的图片 Key
export const getEndingImageKey = (result: string): string => {
  if (result.includes("C位")) return 'ending_center';
  if (result.includes("成团")) return 'ending_group';
  if (result.includes("Solo")) return result.includes("优质") ? 'ending_solo_good' : 'ending_solo_bad'; 
  if (result.includes("淘汰") || result.includes("退圈")) return 'ending_eliminated';
  return 'default';
};