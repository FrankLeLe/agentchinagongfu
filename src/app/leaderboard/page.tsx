'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  avatar?: string
  sect?: string
  sectType?: string
  totalPower: number
  power: number
  attack: number
  speed: number
  defense: number
  winStreak: number
  totalWins: number
  title?: string
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard')
      const data = await res.json()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Fetch leaderboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  function getRankIcon(rank: number): string {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  function getSectColor(sectType?: string): string {
    switch (sectType) {
      case 'traditional': return 'text-yellow-400'
      case 'fantasy': return 'text-red-400'
      case 'demon': return 'text-purple-400'
      case 'cultivation': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">加载中...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">🏆 武林排行榜</h1>
          <Link href="/" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            ← 返回
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl mb-2">📭 暂无数据</p>
              <p>成为第一个创建侠客的武者吧！</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-gray-400">排名</th>
                    <th className="text-left py-3 px-4 text-gray-400">侠客</th>
                    <th className="text-left py-3 px-4 text-gray-400">门派</th>
                    <th className="text-right py-3 px-4 text-gray-400">内力</th>
                    <th className="text-right py-3 px-4 text-gray-400">外功</th>
                    <th className="text-right py-3 px-4 text-gray-400">轻功</th>
                    <th className="text-right py-3 px-4 text-gray-400">防御</th>
                    <th className="text-right py-3 px-4 text-purple-400 font-bold">战力</th>
                    <th className="text-right py-3 px-4 text-gray-400">胜场</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-xl">{getRankIcon(entry.rank)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt={entry.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                              {entry.name[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">{entry.name}</p>
                            {entry.title && (
                              <p className="text-xs text-yellow-400">{entry.title}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={getSectColor(entry.sectType)}>{entry.sect}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-300">{entry.power}</td>
                      <td className="text-right py-3 px-4 text-gray-300">{entry.attack}</td>
                      <td className="text-right py-3 px-4 text-gray-300">{entry.speed}</td>
                      <td className="text-right py-3 px-4 text-gray-300">{entry.defense}</td>
                      <td className="text-right py-3 px-4 text-purple-400 font-bold">
                        {entry.totalPower}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-300">
                        {entry.totalWins}
                        {entry.winStreak > 0 && (
                          <span className="ml-2 text-xs text-orange-400">
                            🔥{entry.winStreak}连胜
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          共 {leaderboard.length} 位侠客 | 每小时更新
        </div>
      </div>
    </main>
  )
}
