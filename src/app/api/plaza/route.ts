import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取广场消息
export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { channelId: 'plaza', isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ messages: messages.reverse() })
  } catch (error) {
    console.error('Get plaza error:', error)
    return NextResponse.json(
      { error: 'Failed to get plaza messages' },
      { status: 500 }
    )
  }
}

// 发送消息
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
    const { content } = await req.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content required' },
        { status: 400 }
      )
    }

    // 获取用户侠客信息
    const hero = await prisma.hero.findUnique({
      where: { userId },
    })

    if (!hero) {
      return NextResponse.json(
        { error: 'Hero not found' },
        { status: 404 }
      )
    }

    // 创建消息
    const message = await prisma.chatMessage.create({
      data: {
        channelId: 'plaza',
        userId,
        userName: hero.name,
        content: content.trim(),
        type: 'text',
      },
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
