import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sects } from '@/lib/sect'

// 初始化门派数据
export async function POST() {
  try {
    // 检查是否已初始化
    const existing = await prisma.sect.findFirst()
    if (existing) {
      return NextResponse.json({ message: 'Already initialized' })
    }

    // 创建门派
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

    return NextResponse.json({ 
      message: 'Sects initialized', 
      count: sects.length 
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize' },
      { status: 500 }
    )
  }
}

// 获取门派列表
export async function GET() {
  try {
    const sects = await prisma.sect.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ sects })
  } catch (error) {
    console.error('Get sects error:', error)
    return NextResponse.json(
      { error: 'Failed to get sects' },
      { status: 500 }
    )
  }
}
