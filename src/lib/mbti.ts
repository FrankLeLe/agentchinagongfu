// MBTI 关键词匹配
const mbtiKeywords = {
  E: ['社交', '朋友', '团队', '分享', '交流', '热闹', '外向', '开朗', '活泼', '合群'],
  I: ['独处', '思考', '内心', '安静', '深度', '内省', '内向', '独立', '沉思', '自省'],
  
  S: ['细节', '实际', '经验', '现实', '具体', '务实', '实在', '踏实', '稳定', '传统'],
  N: ['想象', '未来', '概念', '抽象', '创意', '理想', '梦想', '创新', '变革', '宏观'],
  
  T: ['逻辑', '分析', '理性', '效率', '客观', '策略', '冷静', '理智', '批判', '推理'],
  F: ['情感', '共情', '价值', '和谐', '善良', '感受', '温暖', '体贴', '关怀', '爱'],
  
  J: ['计划', '目标', '秩序', '完成', '组织', '结构', '规律', '控制', '决定', '执行'],
  P: ['自由', '灵活', '探索', '随性', '开放', '适应', '变化', '体验', '好奇', '尝试'],
}

// 计算维度得分
function calculateDimension(text: string, posKeywords: string[], negKeywords: string[]): number {
  let score = 0
  const lowerText = text.toLowerCase()
  
  for (const word of posKeywords) {
    if (lowerText.includes(word.toLowerCase())) {
      score += 1
    }
  }
  
  for (const word of negKeywords) {
    if (lowerText.includes(word.toLowerCase())) {
      score -= 1
    }
  }
  
  return score
}

// 根据签名/自我介绍判定 MBTI
export function determineMBTI(bio: string, name: string = ''): string {
  const text = `${bio} ${name}`
  
  if (!text || text.trim().length < 2) {
    // 无法判定，随机返回
    const mbtis = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                   'ISTJ', 'ISFJ', 'ESTJ', 'ESTP', 'ISTP', 'ISFP', 'ESFJ', 'ESFP']
    return mbtis[Math.floor(Math.random() * mbtis.length)]
  }
  
  // E vs I
  const eiScore = calculateDimension(text, mbtiKeywords.E, mbtiKeywords.I)
  const eOrI = eiScore >= 0 ? 'E' : 'I'
  
  // S vs N
  const snScore = calculateDimension(text, mbtiKeywords.S, mbtiKeywords.N)
  const sOrN = snScore >= 0 ? 'S' : 'N'
  
  // T vs F
  const tfScore = calculateDimension(text, mbtiKeywords.T, mbtiKeywords.F)
  const tOrF = tfScore >= 0 ? 'T' : 'F'
  
  // J vs P
  const jpScore = calculateDimension(text, mbtiKeywords.J, mbtiKeywords.P)
  const jOrP = jpScore >= 0 ? 'J' : 'P'
  
  return `${eOrI}${sOrN}${tOrF}${jOrP}`
}

// 根据 MBTI 推荐门派
export function recommendSect(mbti: string): string {
  const sectMap: Record<string, string> = {
    'INTJ': '华山派',
    'INTP': '武当派',
    'ENTJ': '少林派',
    'ENTP': '丐帮',
    'INFJ': '峨眉派',
    'INFP': '逍遥派',
    'ENFJ': '明教',
    'ESFJ': '昆仑派',
    'ESTJ': '移花宫',
    'ESTP': '万梅山庄',
    'ISTJ': '炎神殿',
    'ISFJ': '海皇阁',
    'ISTP': '日月神教',
    'ISFP': '阴癸派',
    'ENFP': '青云门',
    'ESFP': '合欢宗',
  }
  
  return sectMap[mbti] || '华山派'
}

// 根据签名关键词推荐武功类型
export function recommendSkillTypes(bio: string): string[] {
  const text = bio.toLowerCase()
  const types: string[] = []
  
  const keywordMap: Record<string, string[]> = {
    sword: ['剑', '锋', '锐', '刺', '斩', '刀', '刃', '快', '速'],
    fist: ['拳', '掌', '刚', '猛', '力', '强', '硬', '破'],
    internal: ['气', '心', '神', '元', '静', '内', '功', '修'],
    movement: ['风', '影', '速', '轻', '飞', '跑', '跳', '动'],
    special: ['奇', '幻', '阵', '术', '法', '秘', '秘', '诡'],
    medical: ['药', '医', '毒', '治', '养', '生', '康', '复'],
  }
  
  for (const [type, keywords] of Object.entries(keywordMap)) {
    for (const word of keywords) {
      if (text.includes(word.toLowerCase())) {
        types.push(type)
        break
      }
    }
  }
  
  // 如果没有匹配，返回默认
  if (types.length === 0) {
    return ['internal', 'sword', 'fist']
  }
  
  // 返回前 3 个匹配类型
  return types.slice(0, 3)
}
