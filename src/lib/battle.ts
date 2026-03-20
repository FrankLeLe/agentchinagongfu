import { getCounterBonus } from './sect'

export interface Fighter {
  id: string
  name: string
  power: number      // 内力
  attack: number     // 外功
  speed: number      // 轻功
  defense: number    // 防御
  totalPower: number // 综合战力
  skill?: {
    name: string
    type: string
    basePower: number
    specialEffect?: string | null
  }
  faction: string    // 门派类型
}

export interface BattleResult {
  winner: Fighter
  loser: Fighter
  rounds: number
  winnerHp: number
  loserHp: number
  log: BattleLog[]
}

export interface BattleLog {
  round: number
  attacker: string
  defender: string
  damage: number
  defenderHp: number
  special?: string
}

// 计算伤害
function calculateDamage(attacker: Fighter, defender: Fighter): number {
  // 基础伤害 = 外功 × 武功系数 × (1 + 内力/1000)
  const skillPower = attacker.skill?.basePower || 100
  const skillMultiplier = skillPower / 100
  
  const baseDamage = attacker.attack * skillMultiplier * (1 + attacker.power / 1000)
  
  // 属性克制
  const counterBonus = getCounterBonus(attacker.faction, defender.faction)
  
  // 速度加成（先手优势）
  const speedBonus = attacker.speed > defender.speed ? 1.1 : 1.0
  
  // 最终伤害
  const finalDamage = baseDamage * counterBonus * speedBonus
  
  // 防御减免
  const damageReduction = 100 / (100 + defender.defense)
  
  return Math.floor(finalDamage * damageReduction)
}

// 检查特殊效果
function checkSpecialEffect(attacker: Fighter, defender: Fighter, damage: number): { damage: number, special?: string } {
  const effect = attacker.skill?.specialEffect
  
  if (!effect) {
    return { damage }
  }
  
  // 简单实现几个常见特效
  if (effect.includes('暴击')) {
    if (Math.random() < 0.15) {
      return { damage: Math.floor(damage * 2), special: '暴击！' }
    }
  }
  
  if (effect.includes('连击')) {
    if (Math.random() < 0.15) {
      return { damage: Math.floor(damage * 1.5), special: '连击！' }
    }
  }
  
  if (effect.includes('眩晕')) {
    if (Math.random() < 0.2) {
      return { damage, special: '眩晕！对手跳过下回合' }
    }
  }
  
  if (effect.includes('吸血') || effect.includes('偷取')) {
    return { damage, special: '偷取内力/血量！' }
  }
  
  return { damage }
}

// 进行一场战斗
export function fight(challenger: Fighter, opponent: Fighter, maxRounds: number = 10): BattleResult {
  let challengerHp = 100
  let opponentHp = 100
  let round = 0
  const log: BattleLog[] = []
  
  // 决定先手（速度高的先手）
  let firstAttacker = challenger.speed >= opponent.speed ? challenger : opponent
  let secondAttacker = firstAttacker === challenger ? opponent : challenger
  
  while (round < maxRounds && challengerHp > 0 && opponentHp > 0) {
    round++
    
    // 第一回合攻击
    let damage = calculateDamage(firstAttacker, secondAttacker)
    const specialResult = checkSpecialEffect(firstAttacker, secondAttacker, damage)
    damage = specialResult.damage
    
    if (firstAttacker === challenger) {
      opponentHp -= damage
      log.push({
        round,
        attacker: challenger.name,
        defender: opponent.name,
        damage,
        defenderHp: Math.max(0, opponentHp),
        special: specialResult.special,
      })
    } else {
      challengerHp -= damage
      log.push({
        round,
        attacker: opponent.name,
        defender: challenger.name,
        damage,
        defenderHp: Math.max(0, challengerHp),
        special: specialResult.special,
      })
    }
    
    if (challengerHp <= 0 || opponentHp <= 0) break
    
    // 第二回合攻击
    damage = calculateDamage(secondAttacker, firstAttacker)
    const specialResult2 = checkSpecialEffect(secondAttacker, firstAttacker, damage)
    damage = specialResult2.damage
    
    if (secondAttacker === challenger) {
      opponentHp -= damage
      log.push({
        round,
        attacker: challenger.name,
        defender: opponent.name,
        damage,
        defenderHp: Math.max(0, opponentHp),
        special: specialResult2.special,
      })
    } else {
      challengerHp -= damage
      log.push({
        round,
        attacker: opponent.name,
        defender: challenger.name,
        damage,
        defenderHp: Math.max(0, challengerHp),
        special: specialResult2.special,
      })
    }
  }
  
  const winner = challengerHp > opponentHp ? challenger : opponent
  const loser = challengerHp > opponentHp ? opponent : challenger
  
  return {
    winner,
    loser,
    rounds: round,
    winnerHp: Math.max(0, challengerHp > opponentHp ? challengerHp : opponentHp),
    loserHp: Math.max(0, challengerHp > opponentHp ? opponentHp : challengerHp),
    log,
  }
}

// 计算积分奖励
export function calculatePointsReward(
  winnerTotalPower: number,
  loserTotalPower: number,
  isRanked: boolean = true
): { winner: number, loser: number } {
  const baseWin = 2
  const baseLose = 0
  
  // 击败排名高于自己的对手，额外奖励
  if (loserTotalPower > winnerTotalPower) {
    const powerDiff = loserTotalPower - winnerTotalPower
    const bonus = Math.min(10, Math.floor(powerDiff / 100))
    return { winner: baseWin + bonus, loser: baseLose }
  }
  
  return { winner: baseWin, loser: baseLose }
}
