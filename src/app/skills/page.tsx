'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Skill {
  name: string
  type: string
  rarity: number
  price: number
  baseEffect?: any
  specialEffect?: string | null
}

interface PlayerSkill {
  id: string
  skillName: string
  purchasedAt: string
}

interface Hero {
  points: number
}

export default function Skills() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [skills, setSkills] = useState<Skill[]>([])
  const [playerSkills, setPlayerSkills] = useState<PlayerSkill[]>([])
  const [hero, setHero] = useState<Hero | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [skillsRes, myRes] = await Promise.all([
        fetch('/api/skills/free'),
        fetch('/api/skills/my'),
      ])
      const skillsData = await skillsRes.json()
      const myData = await myRes.json()
      
      setSkills(skillsData.skills || [])
      setPlayerSkills(myData.playerSkills || [])
      setHero(myData.hero || null)
    } catch (error) {
      console.error('Fetch skills error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function purchaseSkill(skillName: string) {
    if (!confirm(`确定要购买 ${skillName} 吗？`)) return

    setPurchasing(skillName)
    try {
      const res = await fetch('/api/skills/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName }),
      })
      const data = await res.json()
      
      if (data.message) {
        alert(data.message)
        fetchData() // 刷新数据
      } else {
        alert(data.error || '购买失败')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('购买失败')
    } finally {
      setPurchasing(null)
    }
  }

  function getRarityStars(rarity: number): string {
    return '⭐'.repeat(rarity)
  }

  function getTypeName(type: string): string {
    const map: Record<string, string> = {
      sword: '剑法',
      fist: '拳掌',
      internal: '内功',
      movement: '身法',
      special: '奇门',
      medical: '医药',
    }
    return map[type] || type
  }

  function getTypeColor(type: string): string {
    const map: Record<string, string> = {
      sword: 'from-blue-500 to-cyan-500',
      fist: 'from-red-500 to-orange-500',
      internal: 'from-purple-500 to-pink-500',
      movement: 'from-green-500 to-emerald-500',
      special: 'from-yellow-500 to-amber-500',
      medical: 'from-teal-500 to-cyan-500',
    }
    return map[type] || 'from-gray-500 to-gray-600'
  }

  function isOwned(skillName: string): boolean {
    return playerSkills.some(ps => ps.skillName === skillName)
  }

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(s => s.type === filter)

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
          <div>
            <h1 className="text-3xl font-bold text-white">📚 武功阁</h1>
            <p className="text-gray-400 mt-1">
              积分：<span className="text-yellow-400 font-bold">{hero?.points || 0}</span>
            </p>
          </div>
          <Link href="/" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            ← 返回
          </Link>
        </div>

        {/* 筛选器 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'sword', 'fist', 'internal', 'movement', 'special', 'medical'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === type
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {type === 'all' ? '全部' : getTypeName(type)}
            </button>
          ))}
        </div>

        {/* 武功列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => {
            const owned = isOwned(skill.name)
            const canAfford = (hero?.points || 0) >= skill.price
            
            return (
              <div
                key={skill.name}
                className={`bg-white/10 backdrop-blur rounded-2xl p-6 transition-all hover:bg-white/15 ${
                  owned ? 'border border-green-500/50' : ''
                }`}
              >
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gradient-to-r ${getTypeColor(skill.type)} text-white`}>
                  {getTypeName(skill.type)}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
                
                <div className="text-yellow-400 text-sm mb-3">
                  {getRarityStars(skill.rarity)}
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {skill.specialEffect || '无特殊效果'}
                </p>
                
                {skill.baseEffect && (
                  <div className="bg-white/5 rounded p-3 mb-4">
                    <p className="text-xs text-gray-400">属性加成</p>
                    <p className="text-sm text-white">
                      {Object.entries(skill.baseEffect)
                        .map(([k, v]) => `${k}: +${typeof v === 'number' ? (v * 100).toFixed(0) : v}%`)
                        .join(', ')}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{skill.price} 积分</span>
                  
                  {owned ? (
                    <span className="px-4 py-2 bg-green-600/50 text-green-400 rounded-full text-sm">
                      已拥有
                    </span>
                  ) : (
                    <button
                      onClick={() => purchaseSkill(skill.name)}
                      disabled={purchasing === skill.name || !canAfford}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {purchasing === skill.name ? '购买中...' : '购买'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">📭 暂无武功</p>
          </div>
        )}
      </div>
    </main>
  )
}
