import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { fight, calculatePointsReward } from '@/lib/battle'

// 发起挑战
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.secondmeUserId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = session.user.secondmeUserId as string
    const { opponentId, skill } = await req.json()

    // 获取挑战者
    const challenger = await prisma.hero.findUnique({
      where: { userId },
      include: { sect: true },
    })

    if (!challenger) {
      return NextResponse.json(
        { error: 'Hero not found' },
        { status: 404 }
      )
    }

    // 获取对手
    const opponent = await prisma.hero.findUnique({
      where: { id: opponentId },
      include: { sect: true },
    })

    if (!opponent) {
      return NextResponse.json(
        { error: 'Opponent not found' },
        { status: 404 }
      )
    }

    // 进行战斗
    const battleResult = fight(
      {
        id: challenger.id,
        name: challenger.name,
        power: challenger.power,
        attack: challenger.attack,
        speed: challenger.speed,
        defense: challenger.defense,
        totalPower: challenger.totalPower,
        faction: challenger.faction,
        skill: skill ? {
          name: skill.name,
          type: skill.type,
          basePower: skill.basePower,
          specialEffect: skill.specialEffect,
        } : undefined,
      },
      {
        id: opponent.id,
        name: opponent.name,
        power: opponent.power,
        attack: opponent.attack,
        speed: opponent.speed,
        defense: opponent.defense,
        totalPower: opponent.totalPower,
        faction: opponent.faction,
        skill: undefined, // 对手默认武功
      }
    )

    // 计算积分奖励
    const pointsReward = calculatePointsReward(
      challenger.totalPower,
      opponent.totalPower,
      true
    )

    const isWinner = battleResult.winner.id === challenger.id
    const earnedPoints = isWinner ? pointsReward.winner : pointsReward.loser

    // 保存战斗记录
    await prisma.battle.create({
      data: {
        challengerId: challenger.id,
        opponentId: opponent.id,
        winnerId: battleResult.winner.id,
        challengerSkill: skill?.name,
        rounds: battleResult.rounds,
        challengerHp: battleResult.winnerHp,
        opponentHp: battleResult.loserHp,
        pointsEarned: earnedPoints,
        type: 'ranked',
      },
    })

    // 更新挑战者数据
    await prisma.hero.update({
      where: { userId },
      data: {
        totalBattles: challenger.totalBattles + 1,
        totalWins: isWinner ? challenger.totalWins + 1 : challenger.totalWins,
        winStreak: isWinner ? challenger.winStreak + 1 : 0,
        points: challenger.points + earnedPoints,
      },
    })

    // 记录积分流水
    if (earnedPoints !== 0) {
      await prisma.pointTransaction.create({
        data: {
          userId,
          amount: earnedPoints,
          type: 'battle',
          description: isWinner ? '挑战胜利' : '挑战失败',
          balance: challenger.points + earnedPoints,
        },
      })
    }

    return NextResponse.json({
      battle: {
        winner: battleResult.winner.name,
        loser: battleResult.loser.name,
        rounds: battleResult.rounds,
        winnerHp: battleResult.winnerHp,
        loserHp: battleResult.loserHp,
        log: battleResult.log,
      },
      earnedPoints,
      isWinner,
    })
  } catch (error) {
    console.error('Battle error:', error)
    return NextResponse.json(
      { error: 'Battle failed', details: String(error) },
      { status: 500 }
    )
  }
}

// 获取战斗历史
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.secondmeUserId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = session.user.secondmeUserId as string
    const hero = await prisma.hero.findUnique({
      where: { userId },
    })

    if (!hero) {
      return NextResponse.json(
        { error: 'Hero not found' },
        { status: 404 }
      )
    }

    const battles = await prisma.battle.findMany({
      where: {
        OR: [
          { challengerId: hero.id },
          { opponentId: hero.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ battles })
  } catch (error) {
    console.error('Get battles error:', error)
    return NextResponse.json(
      { error: 'Failed to get battles' },
      { status: 500 }
    )
  }
}
