import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取当前侠客信息
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
      include: { 
        sect: true,
        ownedSkills: true,
      },
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
