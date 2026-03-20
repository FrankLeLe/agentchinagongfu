import { NextResponse } from 'next/server'
import { freeSkills } from '@/lib/skill'

// 获取散人武功列表
export async function GET() {
  try {
    const skills = freeSkills.map(s => ({
      name: s.name,
      type: s.type,
      rarity: s.rarity,
      price: s.price,
      baseEffect: s.baseEffect,
      specialEffect: s.specialEffect,
    }))

    return NextResponse.json({ skills })
  } catch (error) {
    console.error('Get free skills error:', error)
    return NextResponse.json(
      { error: 'Failed to get skills' },
      { status: 500 }
    )
  }
}
