import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取礼物列表
export async function GET() {
  try {
    const gifts = await prisma.gift.findMany({
      orderBy: { price: 'asc' },
    })

    return NextResponse.json({ gifts })
  } catch (error) {
    console.error('Get gifts error:', error)
    return NextResponse.json(
      { error: 'Failed to get gifts' },
      { status: 500 }
    )
  }
}

// 赠送礼物
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.secondmeUserId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const senderId = session.user.secondmeUserId as string
    const { receiverId, giftName, message } = await req.json()

    if (!receiverId || !giftName) {
      return NextResponse.json(
        { error: 'Receiver and gift required' },
        { status: 400 }
      )
    }

    // 获取礼物信息
    const gift = await prisma.gift.findUnique({
      where: { name: giftName },
    })

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    // 获取赠送者侠客信息
    const senderHero = await prisma.hero.findUnique({
      where: { userId: senderId },
    })

    if (!senderHero) {
      return NextResponse.json(
        { error: 'Sender hero not found' },
        { status: 404 }
      )
    }

    // 检查积分
    if (senderHero.points < gift.price) {
      return NextResponse.json(
        { error: 'Not enough points', need: gift.price, has: senderHero.points },
        { status: 400 }
      )
    }

    // 获取接收者侠客信息
    const receiverHero = await prisma.hero.findUnique({
      where: { userId: receiverId },
    })

    if (!receiverHero) {
      return NextResponse.json(
        { error: 'Receiver hero not found' },
        { status: 404 }
      )
    }

    // 计算好感度加成
    let intimacyBonus = gift.effect
    
    // 盲盒随机效果
    if (gift.type === 'rare' && giftName === '盲盒') {
      const randomMultiplier = Math.floor(Math.random() * 3) + 1 // 1-3 倍
      intimacyBonus *= randomMultiplier
    }

    // 执行交易
    const newPoints = senderHero.points - gift.price

    await prisma.$transaction([
      // 创建赠送记录
      prisma.giftTransaction.create({
        data: {
          senderId,
          receiverId,
          giftName,
          message: message || null,
        },
      }),
      // 扣除赠送者积分
      prisma.hero.update({
        where: { userId: senderId },
        data: { points: newPoints },
      }),
      // 积分流水
      prisma.pointTransaction.create({
        data: {
          userId: senderId,
          amount: -gift.price,
          type: 'gift',
          description: `赠送礼物：${gift.name} 给 ${receiverHero.name}`,
          balance: newPoints,
        },
      }),
      // 更新好感度
      prisma.relationship.upsert({
        where: {
          userId_targetId: {
            userId: receiverId,
            targetId: senderId,
          },
        },
        create: {
          userId: receiverId,
          targetId: senderId,
          intimacy: intimacyBonus,
          level: getRelationshipLevel(intimacyBonus),
        },
        update: {
          intimacy: { increment: intimacyBonus },
        },
      }),
    ])

    return NextResponse.json({
      message: `成功赠送 ${gift.name}！好感度 +${intimacyBonus}`,
      intimacyBonus,
      newPoints,
    })
  } catch (error) {
    console.error('Send gift error:', error)
    return NextResponse.json(
      { error: 'Failed to send gift' },
      { status: 500 }
    )
  }
}

function getRelationshipLevel(intimacy: number): string {
  if (intimacy >= 1000) return 'soulmate'
  if (intimacy >= 500) return 'close_friend'
  if (intimacy >= 200) return 'friend'
  if (intimacy >= 50) return 'acquaintance'
  return 'stranger'
}
