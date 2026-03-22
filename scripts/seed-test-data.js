#!/usr/bin/env node
/**
 * AgentChinaGongFu 测试数据生成脚本
 * 用于创建测试侠客和排行榜数据
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始生成测试数据...')

  // 获取所有门派
  const sects = await prisma.sect.findMany()
  console.log(`✅ 找到 ${sects.length} 个门派`)

  // 创建测试侠客
  const testHeroes = [
    { name: '令狐冲', mbti: 'INTJ', sectName: '华山派' },
    { name: '张无忌', mbti: 'INFP', sectName: '明教' },
    { name: '郭靖', mbti: 'ISFJ', sectName: '丐帮' },
    { name: '杨过', mbti: 'INTP', sectName: '古墓派' },
    { name: '乔峰', mbti: 'ESTJ', sectName: '丐帮' },
  ]

  for (const heroData of testHeroes) {
    const sect = sects.find(s => s.name === heroData.sectName)
    if (!sect) {
      console.log(`⚠️  未找到门派：${heroData.sectName}`)
      continue
    }

    const hero = await prisma.hero.upsert({
      where: { userId: `test_${heroData.name}` },
      update: {
        power: Math.floor(Math.random() * 50) + 100,
        attack: Math.floor(Math.random() * 50) + 100,
        speed: Math.floor(Math.random() * 50) + 100,
        defense: Math.floor(Math.random() * 50) + 100,
        points: Math.floor(Math.random() * 1000),
      },
      create: {
        userId: `test_${heroData.name}`,
        name: heroData.name,
        mbti: heroData.mbti,
        sectId: sect.id,
        faction: sect.type,
        power: Math.floor(Math.random() * 50) + 100,
        attack: Math.floor(Math.random() * 50) + 100,
        speed: Math.floor(Math.random() * 50) + 100,
        defense: Math.floor(Math.random() * 50) + 100,
        totalPower: 0,
        points: Math.floor(Math.random() * 1000),
      },
    })

    // 更新总战力
    const totalPower = hero.power + hero.attack + hero.speed + hero.defense
    await prisma.hero.update({
      where: { id: hero.id },
      data: { totalPower },
    })

    console.log(`✅ 创建侠客：${hero.name} (${hero.sectId}) - 战力：${totalPower}`)
  }

  console.log('\n🎉 测试数据生成完成！')
  console.log('\n📊 排行榜预览:')
  const leaderboard = await prisma.hero.findMany({
    orderBy: { totalPower: 'desc' },
    take: 5,
    include: { sect: true },
  })
  leaderboard.forEach((hero, i) => {
    console.log(`${i + 1}. ${hero.name} (${hero.sect.name}) - 战力：${hero.totalPower}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
