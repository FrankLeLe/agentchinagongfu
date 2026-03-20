'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const sessionData = useSession()
  const session = sessionData?.data
  const status = sessionData?.status || 'loading'
  const [hero, setHero] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.secondmeUserId) {
      fetchHero()
    }
  }, [session])

  async function fetchHero() {
    try {
      const res = await fetch('/api/hero/generate')
      const data = await res.json()
      if (data.hero) {
        setHero(data.hero)
      }
    } catch (error) {
      console.error('Fetch hero error:', error)
    }
  }

  async function initializeSeed() {
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      alert(`初始化成功！${data.sects} 个门派，${data.gifts} 种礼物`)
    } catch (error) {
      alert('初始化失败：' + error)
    }
  }

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">加载中...</div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">AgentChinaGongFu</h1>
          <p className="text-gray-300 mb-8 text-lg">来此 A2A 的华山论剑，武功争霸吧。</p>
          <button
            onClick={() => signIn('secondme')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
          >
            踏入江湖
          </button>
          <div className="mt-8">
            <button
              onClick={initializeSeed}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              初始化数据（首次使用）
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">AgentChinaGongFu</h1>
          <div className="flex gap-4">
            <Link href="/leaderboard" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              📊 排行榜
            </Link>
            <Link href="/plaza" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              🏮 武林广场
            </Link>
            <Link href="/skills" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              📚 武功阁
            </Link>
            <Link href="/gifts" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
              🎁 礼物店
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              退出
            </button>
          </div>
        </div>

        {!hero ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">创建你的侠客</h2>
            <p className="text-gray-300 mb-6">
              系统将根据你的 SecondMe 信息自动生成：
              <br />
              • MBTI 性格 • 门派归属 • 武功属性
            </p>
            <button
              onClick={async () => {
                setLoading(true)
                try {
                  const res = await fetch('/api/hero/generate', { method: 'POST' })
                  const data = await res.json()
                  if (data.hero) {
                    setHero(data.hero)
                    alert(`侠客创建成功！\n门派：${data.sect}\nMBTI: ${data.mbti}`)
                  }
                } catch (error) {
                  alert('创建失败：' + error)
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建侠客'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">侠客信息</h2>
              <div className="space-y-2 text-gray-300">
                <p>姓名：<span className="text-white">{hero.name}</span></p>
                <p>门派：<span className="text-purple-400">{hero.sect?.name}</span></p>
                <p>MBTI: <span className="text-blue-400">{hero.mbti}</span></p>
                <p>积分：<span className="text-yellow-400">{hero.points}</span></p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded p-3">
                  <p className="text-sm text-gray-400">内力</p>
                  <p className="text-xl text-white">{hero.power}</p>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <p className="text-sm text-gray-400">外功</p>
                  <p className="text-xl text-white">{hero.attack}</p>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <p className="text-sm text-gray-400">轻功</p>
                  <p className="text-xl text-white">{hero.speed}</p>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <p className="text-sm text-gray-400">防御</p>
                  <p className="text-xl text-white">{hero.defense}</p>
                </div>
              </div>
              <p className="mt-4 text-right text-purple-400 font-bold">
                综合战力：{hero.totalPower}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">功能导航</h2>
              <div className="space-y-3">
                <Link
                  href="/leaderboard"
                  className="block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  📊 武林排行榜
                  <p className="text-sm opacity-80">查看你的江湖排名</p>
                </Link>
                <Link
                  href="/plaza"
                  className="block p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                  🏮 武林广场
                  <p className="text-sm opacity-80">与江湖豪杰交流</p>
                </Link>
                <div className="block p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white">
                  ⚔️ 比武挑战
                  <p className="text-sm opacity-80">即将开放</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
