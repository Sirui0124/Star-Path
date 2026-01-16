
// 图片资源库
// 为了区分不同阶段，使用了不同的背景色和文字描述
// 后续请将这些 URL 替换为您准备好的二次元插画链接

export const STORY_IMAGES: Record<string, string> = {
  // --- 系统背景 ---
  setup_bg: "https://s3.bmp.ovh/imgs/2026/01/14/d68fd5a5272fc14a.png", // 角色创建页背景
  guide_bg: "https://s3.bmp.ovh/imgs/2026/01/17/a0d0b82303a01c29.png", // 指引页背景 (使用唯美星空图)

  // --- 事件背景 ---
  event_social: "https://s3.bmp.ovh/imgs/2026/01/14/b181aebe7ab7fa01.png", // 社媒营业
  event_random: "https://s3.bmp.ovh/imgs/2026/01/14/c234302c56b34c0a.png", // 突发事件
  event_show: "https://s3.bmp.ovh/imgs/2026/01/14/d4275123ddcdeddb.png",    // 选秀事件
  
  // --- 签约事件背景 (各公司) ---
  // 请在此处替换为您为各家公司准备的插画
  signing_coffee: "https://s3.bmp.ovh/imgs/2026/01/15/3d0e54476e7d4844.png",    // 咖啡粒文化
  signing_origin: "https://s3.bmp.ovh/imgs/2026/01/15/0d19cabb03f829ae.png",    // 原计划
  signing_starlight: "https://s3.bmp.ovh/imgs/2026/01/15/09018cd0cedc25f5.png", // 星华娱乐
  signing_agray: "https://s3.bmp.ovh/imgs/2026/01/16/339996571040d5d4.png",     // 艾灰音乐

  // --- 练习生阶段 (16-18岁) ---
  default: "https://s3.bmp.ovh/imgs/2026/01/14/76df613fa07ca668.png",
  16: "https://s3.bmp.ovh/imgs/2026/01/14/76df613fa07ca668.png", // 粉色系，懵懂
  17: "https://s3.bmp.ovh/imgs/2026/01/15/c26bca5e78bb8700.png", // 深粉，汗水
  18: "https://s3.bmp.ovh/imgs/2026/01/15/900fb73b79ed0b23.png", // 紫粉，成长

  // --- 奋斗阶段 (19-21岁) ---
  19: "https://s3.bmp.ovh/imgs/2026/01/15/af2ac27bddcadbd5.png", // 浅蓝，坚持
  20: "https://s3.bmp.ovh/imgs/2026/01/15/49329851e46e00e4.png", // 蓝色，转折
  21: "https://s3.bmp.ovh/imgs/2026/01/15/900fb73b79ed0b23.png", // 深蓝，成熟

  // --- 蜕变阶段 (22-24岁) ---暂时以后先都用22岁的
  22: "https://s3.bmp.ovh/imgs/2026/01/15/5984a86c28e48793.png", // 浅紫，光芒
  23: "https://s3.bmp.ovh/imgs/2026/01/15/5984a86c28e48793.png", // 紫色，篇章
  24: "https://s3.bmp.ovh/imgs/2026/01/15/5984a86c28e48793.png", // 深紫，实力

  // --- 终章阶段 (25-26岁) ---
  25: "https://s3.bmp.ovh/imgs/2026/01/15/5984a86c28e48793.png", // 浅黄，初心
  26: "https://s3.bmp.ovh/imgs/2026/01/15/5984a86c28e48793.png", // 金色，终章

  // --- 结局插画 ---
  ending_center: "https://s3.bmp.ovh/imgs/2026/01/14/00917a62999f88b8.png", // C位-橙金辉煌
  ending_group: "https://s3.bmp.ovh/imgs/2026/01/14/1bfa0f89a987ead3.png",   // 成团-花路粉红
  ending_solo_good: "https://s3.bmp.ovh/imgs/2026/01/14/e346da09ae4386da.png",   // Solo好-青色实力
  ending_solo_bad: "https://s3.bmp.ovh/imgs/2026/01/14/e346da09ae4386da.png",  // Solo普-未来无限可能
  ending_eliminated: "https://s3.bmp.ovh/imgs/2026/01/14/0e7af0bf4b3d5fc1.png", // 淘汰-灰色落寞
};

// 根据结局文本获取对应的图片 Key
export const getEndingImageKey = (result: string): string => {
  if (result.includes("C位")) return 'ending_center';
  if (result.includes("成团")) return 'ending_group';
  if (result.includes("Solo")) return result.includes("优质") ? 'ending_solo_good' : 'ending_solo_bad'; 
  if (result.includes("淘汰") || result.includes("退圈")) return 'ending_eliminated';
  return 'default';
};