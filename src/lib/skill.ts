// 48 种门派武功
export const skills = [
  // 华山派 (3)
  { name: '独孤九剑', type: 'sword', sect: '华山派', rarity: 5, basePower: 150, specialEffect: '破招概率 +30%' },
  { name: '华山剑法', type: 'sword', sect: '华山派', rarity: 2, basePower: 80, specialEffect: null },
  { name: '紫霞功', type: 'internal', sect: '华山派', rarity: 3, basePower: 100, specialEffect: '剑法伤害 +15%' },
  
  // 武当派 (3)
  { name: '太极拳', type: 'fist', sect: '武当派', rarity: 4, basePower: 120, specialEffect: '反弹 30% 伤害' },
  { name: '太极剑', type: 'sword', sect: '武当派', rarity: 3, basePower: 100, specialEffect: '以柔克刚' },
  { name: '梯云纵', type: 'movement', sect: '武当派', rarity: 3, basePower: 100, specialEffect: '先手 +30%' },
  
  // 少林派 (3)
  { name: '易筋经', type: 'internal', sect: '少林派', rarity: 5, basePower: 140, specialEffect: '防御 +20%' },
  { name: '金刚掌', type: 'fist', sect: '少林派', rarity: 3, basePower: 110, specialEffect: '破防 +10%' },
  { name: '金钟罩', type: 'defense', sect: '少林派', rarity: 4, basePower: 120, specialEffect: '暴击抵抗 +20%' },
  
  // 丐帮 (3)
  { name: '降龙十八掌', type: 'fist', sect: '丐帮', rarity: 5, basePower: 160, specialEffect: '3 回合后 -20%' },
  { name: '打狗棒法', type: 'sword', sect: '丐帮', rarity: 3, basePower: 100, specialEffect: '连击 +15%' },
  { name: '轻功水上漂', type: 'movement', sect: '丐帮', rarity: 3, basePower: 100, specialEffect: null },
  
  // 峨眉派 (3)
  { name: '九阳神功', type: 'internal', sect: '峨眉派', rarity: 5, basePower: 150, specialEffect: '每回合回血 2%' },
  { name: '峨眉剑法', type: 'sword', sect: '峨眉派', rarity: 2, basePower: 85, specialEffect: '女性 +10%' },
  { name: '白虹掌力', type: 'fist', sect: '峨眉派', rarity: 3, basePower: 100, specialEffect: '远程攻击' },
  
  // 逍遥派 (3)
  { name: '北冥神功', type: 'internal', sect: '逍遥派', rarity: 4, basePower: 120, specialEffect: '击败偷取 5% 内力' },
  { name: '凌波微步', type: 'movement', sect: '逍遥派', rarity: 5, basePower: 150, specialEffect: '闪避 +25%' },
  { name: '天山折梅手', type: 'fist', sect: '逍遥派', rarity: 4, basePower: 120, specialEffect: '化用对手武功' },
  
  // 明教 (3)
  { name: '乾坤大挪移', type: 'internal', sect: '明教', rarity: 4, basePower: 120, specialEffect: '30% 概率转移伤害' },
  { name: '圣火令功', type: 'fist', sect: '明教', rarity: 3, basePower: 110, specialEffect: '诡异多变' },
  { name: '光明顶心法', type: 'internal', sect: '明教', rarity: 3, basePower: 100, specialEffect: '抗暴击 +15%' },
  
  // 昆仑派 (3)
  { name: '两仪剑法', type: 'sword', sect: '昆仑派', rarity: 3, basePower: 100, specialEffect: '阴阳双属性' },
  { name: '昆仑心法', type: 'internal', sect: '昆仑派', rarity: 2, basePower: 80, specialEffect: null },
  { name: '飞凤手', type: 'fist', sect: '昆仑派', rarity: 2, basePower: 85, specialEffect: '速度 +10%' },
  
  // 移花宫 (3)
  { name: '移花接木', type: 'internal', sect: '移花宫', rarity: 4, basePower: 120, specialEffect: '反弹 40% 伤害' },
  { name: '嫁衣神功', type: 'internal', sect: '移花宫', rarity: 4, basePower: 120, specialEffect: '可传功' },
  { name: '玉女剑法', type: 'sword', sect: '移花宫', rarity: 3, basePower: 100, specialEffect: '优雅致命' },
  
  // 万梅山庄 (3)
  { name: '天外飞仙', type: 'sword', sect: '万梅山庄', rarity: 5, basePower: 160, specialEffect: '15% 概率一击必杀' },
  { name: '灵犀一指', type: 'defense', sect: '万梅山庄', rarity: 4, basePower: 120, specialEffect: '空手入白刃' },
  { name: '彩带功', type: 'movement', sect: '万梅山庄', rarity: 3, basePower: 100, specialEffect: '闪避 +20%' },
  
  // 炎神殿 (3)
  { name: '焚天诀', type: 'internal', sect: '炎神殿', rarity: 4, basePower: 120, specialEffect: '灼烧伤害/回合' },
  { name: '炎龙掌', type: 'fist', sect: '炎神殿', rarity: 3, basePower: 110, specialEffect: '10% 概率点燃' },
  { name: '火焰刀', type: 'sword', sect: '炎神殿', rarity: 3, basePower: 105, specialEffect: '范围攻击' },
  
  // 海皇阁 (3)
  { name: '御水真经', type: 'internal', sect: '海皇阁', rarity: 4, basePower: 120, specialEffect: '冰冻抗性' },
  { name: '冰魄神针', type: 'sword', sect: '海皇阁', rarity: 3, basePower: 100, specialEffect: '15% 概率冰冻' },
  { name: '海啸功', type: 'fist', sect: '海皇阁', rarity: 3, basePower: 110, specialEffect: '击退效果' },
  
  // 日月神教 (3)
  { name: '吸星大法', type: 'internal', sect: '日月神教', rarity: 5, basePower: 140, specialEffect: '偷取对手 10% 内力' },
  { name: '葵花宝典', type: 'movement', sect: '日月神教', rarity: 5, basePower: 150, specialEffect: '外功 +20%' },
  { name: '化功大法', type: 'special', sect: '日月神教', rarity: 4, basePower: 120, specialEffect: '降低对手 20% 属性' },
  
  // 阴癸派 (3)
  { name: '天魔大法', type: 'internal', sect: '阴癸派', rarity: 4, basePower: 120, specialEffect: '毒素 +20%' },
  { name: '天魔舞', type: 'movement', sect: '阴癸派', rarity: 4, basePower: 120, specialEffect: '10% 概率魅惑' },
  { name: '七阴毒掌', type: 'fist', sect: '阴癸派', rarity: 3, basePower: 110, specialEffect: '中毒 3 回合' },
  
  // 青云门 (3)
  { name: '神剑御雷真诀', type: 'sword', sect: '青云门', rarity: 5, basePower: 160, specialEffect: '15% 概率麻痹' },
  { name: '御剑术', type: 'movement', sect: '青云门', rarity: 4, basePower: 130, specialEffect: '飞行攻击' },
  { name: '太极玄清道', type: 'internal', sect: '青云门', rarity: 4, basePower: 120, specialEffect: '雷法 +20%' },
  
  // 合欢宗 (3)
  { name: '天魔舞', type: 'movement', sect: '合欢宗', rarity: 4, basePower: 120, specialEffect: '声望 +20%' },
  { name: '合欢功', type: 'internal', sect: '合欢宗', rarity: 3, basePower: 100, specialEffect: '魅惑 +15%' },
  { name: '玉女心经', type: 'internal', sect: '合欢宗', rarity: 4, basePower: 120, specialEffect: '双修加成' },
] as const

// 32 种散人武功
export const freeSkills = [
  // 剑法 (6)
  { name: '越女剑法', type: 'sword', rarity: 1, price: 50, baseEffect: { attack: 0.25 }, specialEffect: '先手 +10%' },
  { name: '青萍剑法', type: 'sword', rarity: 2, price: 100, baseEffect: { attack: 0.35 }, specialEffect: '5% 概率连击' },
  { name: '达摩剑法', type: 'sword', rarity: 2, price: 120, baseEffect: { attack: 0.4 }, specialEffect: '对魔教 +10% 伤害' },
  { name: '玄铁剑法', type: 'sword', rarity: 3, price: 200, baseEffect: { attack: 0.5 }, specialEffect: '破防 +15%' },
  { name: '六脉神剑', type: 'sword', rarity: 4, price: 300, baseEffect: { attack: 0.6 }, specialEffect: '10% 概率远程' },
  { name: '万剑归宗', type: 'sword', rarity: 5, price: 400, baseEffect: { attack: 0.7 }, specialEffect: '15% 概率剑雨' },
  
  // 拳掌 (6)
  { name: '长拳', type: 'fist', rarity: 1, price: 50, baseEffect: { attack: 0.2 }, specialEffect: null },
  { name: '通臂拳', type: 'fist', rarity: 2, price: 100, baseEffect: { attack: 0.35 }, specialEffect: '攻击距离 +1' },
  { name: '劈空掌', type: 'fist', rarity: 2, price: 120, baseEffect: { attack: 0.4 }, specialEffect: '10% 概率远程' },
  { name: '大金刚拳', type: 'fist', rarity: 3, price: 200, baseEffect: { attack: 0.5 }, specialEffect: '防御 +10%' },
  { name: '七伤拳', type: 'fist', rarity: 4, price: 300, baseEffect: { attack: 0.65 }, specialEffect: '自损 5% 血量' },
  { name: '翻天印', type: 'fist', rarity: 5, price: 400, baseEffect: { attack: 0.75 }, specialEffect: '20% 概率眩晕' },
  
  // 内功 (6)
  { name: '吐纳术', type: 'internal', rarity: 1, price: 80, baseEffect: { power: 0.2 }, specialEffect: '每回合回血 1%' },
  { name: '禅定功', type: 'internal', rarity: 2, price: 150, baseEffect: { power: 0.35 }, specialEffect: '抗控制 +15%' },
  { name: '混元功', type: 'internal', rarity: 2, price: 180, baseEffect: { power: 0.4 }, specialEffect: '全属性 +5%' },
  { name: '先天功', type: 'internal', rarity: 3, price: 250, baseEffect: { power: 0.5 }, specialEffect: '首回合 +20%' },
  { name: '九阴真经', type: 'internal', rarity: 4, price: 350, baseEffect: { power: 0.6 }, specialEffect: '夜间 +15%' },
  { name: '道心种魔', type: 'internal', rarity: 5, price: 450, baseEffect: { power: 0.7 }, specialEffect: '击败偷取 10% 属性' },
  
  // 身法 (6)
  { name: '草上飞', type: 'movement', rarity: 1, price: 60, baseEffect: { speed: 0.25 }, specialEffect: '先手 +5%' },
  { name: '燕子飞', type: 'movement', rarity: 2, price: 120, baseEffect: { speed: 0.35 }, specialEffect: '闪避 +10%' },
  { name: '神行术', type: 'movement', rarity: 2, price: 150, baseEffect: { speed: 0.4 }, specialEffect: '速度 +10%' },
  { name: '鬼影迷踪', type: 'movement', rarity: 3, price: 220, baseEffect: { speed: 0.5 }, specialEffect: '闪避 +20%' },
  { name: '缩地成寸', type: 'movement', rarity: 4, price: 320, baseEffect: { speed: 0.6 }, specialEffect: '先手 +30%' },
  { name: '咫尺天涯', type: 'movement', rarity: 5, price: 420, baseEffect: { speed: 0.7 }, specialEffect: '20% 概率闪避全部' },
  
  // 奇门 (4)
  { name: '五行步', type: 'special', rarity: 2, price: 100, baseEffect: { defense: 0.25 }, specialEffect: '每回合切换属性' },
  { name: '奇门五行', type: 'special', rarity: 3, price: 200, baseEffect: { all: 0.1 }, specialEffect: '5 回合后 +20%' },
  { name: '周天星辰', type: 'special', rarity: 4, price: 350, baseEffect: { power: 0.4 }, specialEffect: '每 3 回合爆发×1.5' },
  { name: '天地无极', type: 'special', rarity: 5, price: 500, baseEffect: { all: 0.2 }, specialEffect: '持续 5 回合' },
  
  // 医药 (4)
  { name: '金创药', type: 'medical', rarity: 1, price: 80, baseEffect: { heal: 0.15 }, specialEffect: '冷却 2 回合' },
  { name: '清心散', type: 'medical', rarity: 2, price: 150, baseEffect: { cleanse: true }, specialEffect: '抗控制 +20%' },
  { name: '大还丹', type: 'medical', rarity: 3, price: 280, baseEffect: { heal: 0.4 }, specialEffect: '冷却 3 回合' },
  { name: '九转还魂', type: 'medical', rarity: 5, price: 450, baseEffect: { revive: 0.5 }, specialEffect: '限用一次' },
] as const

export type SkillType = typeof skills[number]
export type FreeSkillType = typeof freeSkills[number]

// 根据类型获取武功
export function getSkillsByType(type: string, skillList: readonly any[] = skills) {
  return skillList.filter(s => s.type === type)
}

// 根据稀有度获取武功
export function getSkillsByRarity(rarity: number, skillList: readonly any[] = skills) {
  return skillList.filter(s => s.rarity === rarity)
}
