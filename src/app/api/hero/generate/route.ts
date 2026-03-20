import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { determineMBTI, recommendSect } from '@/lib/mbti'
import { skills } from '@/lib/skill'

// 生成侠客
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
    const userName = session.user.name as string
    const userAvatar = session.user.image as string | undefined
    const userRoute = (session as any).secondmeRoute as string | undefined
    const userBio = session.user.bio as string | undefined

    // 检查是否已存在
    const existing = await prisma.hero.findUnique({
      where: { userId },
    })

    if (existing) {
      return NextResponse.json({ hero: existing })
    }

    // 判定 MBTI
    const mbti = determineMBTI(userBio || '', userName)
    const sectName = recommendSect(mbti)

    // 获取门派
    const sect = await prisma.sect.findUnique({
      where: { name: sectName },
    })

    if (!sect) {
      return NextResponse.json(
        { error: 'Sect not found' },
        { status: 404 }
      )
    }

    // 计算属性
    const bonus = JSON.parse(sect.bonus)
    const baseValue = 100
    const power = Math.floor(baseValue * (1 + (bonus.power || 0)))
    const attack = Math.floor(baseValue * (1 + (bonus.attack || 0)))
    const speed = Math.floor(baseValue * (1 + (bonus.speed || 0)))
    const defense = Math.floor(baseValue * (1 + (bonus.defense || 0)))
    const totalPower = power + attack + speed + defense

    // 创建侠客
    const hero = await prisma.hero.create({
      data: {
        userId,
        name: userName,
        avatar: userAvatar,
        route: userRoute,
        mbti,
        sectId: sect.id,
        faction: sect.type,
        power,
        attack,
        speed,
        defense,
        totalPower,
        points: 0,
      },
    })

    // 分配门派武功（3 种）
    const sectSkills = skills.filter(s => s.sect === sectName)
    // 这里简化处理，实际应该创建 HeroSkill 记录

    // 每日登录奖励
    await prisma.pointTransaction.create({
      data: {
        userId,
        amount: 10,
        type: 'daily_login',
        description: '首次登录奖励',
        balance: 10,
      },
    })

    // 更新积分
    await prisma.hero.update({
      where: { userId },
      data: { points: 10 },
    })

    return NextResponse.json({ 
      hero,
      mbti,
      sect: sectName,
      message: '侠客生成成功！获得 10 积分！',
    })
  } catch (error) {
    console.error('Generate hero error:', error)
    return NextResponse.json(
      { error: 'Failed to generate hero' },
      { status: 500 }
    )
  }
}

// 获取当前侠客
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
      include: { sect: true },
    })

    if (!hero) {
      return NextResponse.json(
        { error: 'Hero not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ hero })
  } catch (error) {
    console.error('Get hero error:', error)
    return NextResponse.json(
      { error: 'Failed to get hero' },
      { status: 500 }
    )
  }
}
