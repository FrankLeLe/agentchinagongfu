import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 随机匹配对手
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.secondmeUserId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = session.user.secondmeUserId as string

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

    // 获取所有其他英雄（排除自己）
    const allHeroes = await prisma.hero.findMany({
      where: {
        NOT: {
          userId,
        },
      },
      include: { sect: true },
    })

    if (allHeroes.length === 0) {
      return NextResponse.json(
        { error: 'No opponents available' },
        { status: 404 }
      )
    }

    // 随机选择一个起始点
    const randomIndex = Math.floor(Math.random() * allHeroes.length)
    const randomHero = allHeroes[randomIndex]

    // 计算战力差值，找到战力相近的对手
    const challengerPower = challenger.totalPower
    
    // 计算所有候选者与挑战者的战力差
    const candidates = allHeroes.map(hero => ({
      hero,
      powerDiff: Math.abs(hero.totalPower - challengerPower),
    }))

    // 按战力差排序，找到最接近的对手
    candidates.sort((a, b) => a.powerDiff - b.powerDiff)

    // 从前 10 个最接近的对手中随机选择一个（增加随机性）
    const topCandidates = candidates.slice(0, Math.min(10, candidates.length))
    const selectedCandidate = topCandidates[Math.floor(Math.random() * topCandidates.length)]

    const opponent = selectedCandidate.hero

    // 返回对手信息
    return NextResponse.json({
      opponent: {
        id: opponent.id,
        name: opponent.name,
        power: opponent.power,
        attack: opponent.attack,
        speed: opponent.speed,
        defense: opponent.defense,
        totalPower: opponent.totalPower,
        faction: opponent.faction,
        totalBattles: opponent.totalBattles,
        totalWins: opponent.totalWins,
        winStreak: opponent.winStreak,
        points: opponent.points,
        sect: opponent.sect ? {
          id: opponent.sect.id,
          name: opponent.sect.name,
          description: opponent.sect.description,
        } : null,
      },
      powerDiff: selectedCandidate.powerDiff,
      message: `找到对手：${opponent.name}（战力差：${selectedCandidate.powerDiff}）`,
    })
  } catch (error) {
    console.error('Random match error:', error)
    return NextResponse.json(
      { error: 'Random match failed', details: String(error) },
      { status: 500 }
    )
  }
}
