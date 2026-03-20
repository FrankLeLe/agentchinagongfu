// 16 大门派数据
export const sects = [
  // 金庸武侠 (8)
  {
    name: '华山派',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['INTJ'],
    location: '陕西华山',
    bonus: { attack: 0.15 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「华山自古一条路」，剑法冠绝天下',
  },
  {
    name: '武当派',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['INTP'],
    location: '湖北武当山',
    bonus: { power: 0.15 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「太极生两仪」，以柔克刚',
  },
  {
    name: '少林派',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['ENTJ'],
    location: '河南嵩山',
    bonus: { defense: 0.15 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「天下武功出少林」',
  },
  {
    name: '丐帮',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['ENTP'],
    location: '各地',
    bonus: { attack: 0.1, speed: 0.05 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「降龙十八掌」威震江湖',
  },
  {
    name: '峨眉派',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['INFJ'],
    location: '四川峨眉山',
    bonus: { power: 0.1, defense: 0.05 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「峨眉九阳功」独步天下',
  },
  {
    name: '逍遥派',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['INFP'],
    location: '天山',
    bonus: { power: 0.1, speed: 0.05 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「北冥神功」吸人内力',
  },
  {
    name: '明教',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['ENFJ'],
    location: '光明顶',
    bonus: { power: 0.1, attack: 0.05 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「乾坤大挪移」借力打力',
  },
  {
    name: '昆仑派',
    type: 'traditional',
    source: '金庸',
    mbtiTypes: ['ESFJ'],
    location: '昆仑山',
    bonus: { attack: 0.1, power: 0.05 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「两仪剑法」阴阳相生',
  },
  // 古龙武侠 (2)
  {
    name: '移花宫',
    type: 'traditional',
    source: '古龙',
    mbtiTypes: ['ESTJ'],
    location: '移花宫',
    bonus: { attack: 0.15, defense: 0.05 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「移花接木」借力打力',
  },
  {
    name: '万梅山庄',
    type: 'traditional',
    source: '古龙',
    mbtiTypes: ['ESTP'],
    location: '江南',
    bonus: { speed: 0.15, attack: 0.05 },
    counter: 'demon',
    weakTo: 'fantasy',
    description: '「天外飞仙」一剑破万法',
  },
  // 玄幻 (2)
  {
    name: '炎神殿',
    type: 'fantasy',
    source: '玄幻',
    mbtiTypes: ['ISTJ'],
    location: '火山深处',
    bonus: { attack: 0.2 },
    counter: 'traditional',
    weakTo: 'cultivation',
    description: '掌控焚天烈焰',
  },
  {
    name: '海皇阁',
    type: 'fantasy',
    source: '玄幻',
    mbtiTypes: ['ISFJ'],
    location: '深海秘境',
    bonus: { power: 0.2 },
    counter: 'traditional',
    weakTo: 'cultivation',
    description: '驾驭万水之力',
  },
  // 魔教 (2)
  {
    name: '日月神教',
    type: 'demon',
    source: '魔教',
    mbtiTypes: ['ISTP'],
    location: '黑木崖',
    bonus: { attack: 0.1, speed: 0.1 },
    counter: 'cultivation',
    weakTo: 'traditional',
    description: '「吸星大法」吸人内力',
  },
  {
    name: '阴癸派',
    type: 'demon',
    source: '魔教',
    mbtiTypes: ['ISFP'],
    location: '苗疆秘境',
    bonus: { power: 0.1, speed: 0.1 },
    counter: 'cultivation',
    weakTo: 'traditional',
    description: '「天魔大法」阴毒无比',
  },
  // 修仙 (2)
  {
    name: '青云门',
    type: 'cultivation',
    source: '修仙',
    mbtiTypes: ['ENFP'],
    location: '青云山',
    bonus: { power: 0.15, speed: 0.1 },
    counter: 'fantasy',
    weakTo: 'demon',
    description: '「神剑御雷真诀」引动天雷',
  },
  {
    name: '合欢宗',
    type: 'cultivation',
    source: '修仙',
    mbtiTypes: ['ESFP'],
    location: '极乐谷',
    bonus: { attack: 0.1, reputation: 0.2 },
    counter: 'fantasy',
    weakTo: 'demon',
    description: '「天魔舞」魅惑众生',
  },
] as const

export type SectType = typeof sects[number]

// MBTI 到门派映射
export function getSectByMBTI(mbti: string): SectType | null {
  return sects.find(sect => (sect.mbtiTypes as readonly string[]).includes(mbti)) || null
}

// 获取门派类型克制关系
export function getCounterBonus(attackerType: string, defenderType: string): number {
  const counterMap: Record<string, string> = {
    traditional: 'demon',
    demon: 'cultivation',
    cultivation: 'fantasy',
    fantasy: 'traditional',
  }
  
  if (counterMap[attackerType] === defenderType) {
    return 1.15 // 克制 +15%
  }
  if (counterMap[defenderType] === attackerType) {
    return 0.9 // 被克 -10%
  }
  return 1.0 // 无克制
}
