import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取排行榜
export async function GET() {
  try {
    // 武林盟主榜（综合战力）
    const heroes = await prisma.hero.findMany({
      orderBy: { totalPower: 'desc' },
      take: 100,
      include: {
        sect: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    })

    const leaderboard = heroes.map((hero, index) => ({
      rank: index + 1,
      id: hero.id,
      name: hero.name,
      avatar: hero.avatar,
      sect: hero.sect?.name,
      sectType: hero.sect?.type,
      totalPower: hero.totalPower,
      power: hero.power,
      attack: hero.attack,
      speed: hero.speed,
      defense: hero.defense,
      winStreak: hero.winStreak,
      totalWins: hero.totalWins,
      title: hero.title,
    }))

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}
