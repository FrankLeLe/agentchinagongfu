import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { freeSkills } from '@/lib/skill'

// 购买武功
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
    const { skillName } = await req.json()

    if (!skillName) {
      return NextResponse.json(
        { error: 'Skill name required' },
        { status: 400 }
      )
    }

    // 查找武功
    const skill = freeSkills.find(s => s.name === skillName)
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      )
    }

    // 获取侠客信息
    const hero = await prisma.hero.findUnique({
      where: { userId },
    })

    if (!hero) {
      return NextResponse.json(
        { error: 'Hero not found' },
        { status: 404 }
      )
    }

    // 检查积分
    if (hero.points < skill.price) {
      return NextResponse.json(
        { error: 'Not enough points', need: skill.price, has: hero.points },
        { status: 400 }
      )
    }

    // 检查是否已拥有
    const existing = await prisma.playerSkill.findUnique({
      where: {
        userId_skillName: {
          userId,
          skillName,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already owned' },
        { status: 400 }
      )
    }

    // 扣除积分并添加武功
    const newPoints = hero.points - skill.price

    await prisma.$transaction([
      prisma.playerSkill.create({
        data: {
          userId,
          skillName,
        },
      }),
      prisma.hero.update({
        where: { userId },
        data: { points: newPoints },
      }),
      prisma.pointTransaction.create({
        data: {
          userId,
          amount: -skill.price,
          type: 'purchase',
          description: `购买武功：${skill.name}`,
          balance: newPoints,
        },
      }),
    ])

    return NextResponse.json({
      message: `成功购买 ${skill.name}！`,
      skill,
      newPoints,
    })
  } catch (error) {
    console.error('Purchase skill error:', error)
    return NextResponse.json(
      { error: 'Failed to purchase skill' },
      { status: 500 }
    )
  }
}

// 获取我的武功
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

    // 获取已拥有的散人武功
    const playerSkills = await prisma.playerSkill.findMany({
      where: { userId },
      orderBy: { purchasedAt: 'desc' },
    })

    // 获取侠客信息（含门派武功）
    const hero = await prisma.hero.findUnique({
      where: { userId },
      include: { sect: true },
    })

    return NextResponse.json({
      playerSkills,
      hero,
    })
  } catch (error) {
    console.error('Get my skills error:', error)
    return NextResponse.json(
      { error: 'Failed to get skills' },
      { status: 500 }
    )
  }
}
