import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sects } from '@/lib/sect'
import { skills, freeSkills } from '@/lib/skill'

// 初始化种子数据
export async function POST() {
  try {
    // 检查是否已初始化
    const sectCount = await prisma.sect.count()
    if (sectCount > 0) {
      return NextResponse.json({ message: 'Already seeded', sects: sectCount })
    }

    // 创建 16 门派
    for (const sect of sects) {
      await prisma.sect.create({
        data: {
          name: sect.name,
          type: sect.type,
          mbtiTypes: JSON.stringify(sect.mbtiTypes),
          location: sect.location,
          source: sect.source,
          bonus: JSON.stringify(sect.bonus),
          counter: sect.counter,
          weakTo: sect.weakTo,
          description: sect.description,
        },
      })
    }

    // 创建礼物数据
    const gifts = [
      { name: '奶茶', type: 'food', price: 20, effect: 10, description: '请你喝奶茶~' },
      { name: '披萨', type: 'food', price: 35, effect: 25, description: '一起干饭吗？' },
      { name: '火锅', type: 'food', price: 50, effect: 40, description: '火锅走起！' },
      { name: '电影票', type: 'entertainment', price: 30, effect: 20, description: '新片上映，一起看？' },
      { name: '游戏皮肤', type: 'entertainment', price: 60, effect: 45, description: '送你个皮肤~' },
      { name: '演唱会门票', type: 'entertainment', price: 80, effect: 60, description: '前排 VIP！' },
      { name: '手写情书', type: 'heart', price: 50, effect: 50, description: '纸短情长...' },
      { name: '定制相册', type: 'heart', price: 100, effect: 80, description: '我们的回忆' },
      { name: '情侣对戒', type: 'heart', price: 150, effect: 120, description: '一生一世' },
      { name: '盲盒', type: 'rare', price: 200, effect: 100, description: '随机开出 1~3 倍效果' },
      { name: '生日蛋糕', type: 'rare', price: 300, effect: 200, description: '生日专属，双倍好感' },
      { name: '限定皮肤', type: 'rare', price: 500, effect: 350, description: '绝版外观，永久纪念' },
    ]

    for (const gift of gifts) {
      await prisma.gift.create({ data: gift })
    }

    return NextResponse.json({ 
      message: 'Seed data created', 
      sects: sects.length,
      gifts: gifts.length,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed', details: String(error) },
      { status: 500 }
    )
  }
}

// 获取种子数据状态
export async function GET() {
  try {
    const sectCount = await prisma.sect.count()
    const giftCount = await prisma.gift.count()
    
    return NextResponse.json({
      sects: sectCount,
      gifts: giftCount,
      initialized: sectCount > 0,
    })
  } catch (error) {
    console.error('Get seed status error:', error)
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    )
  }
}
