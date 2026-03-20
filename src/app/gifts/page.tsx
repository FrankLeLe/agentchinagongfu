'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Gift {
  name: string
  type: string
  price: number
  effect: number
  description: string
  isLimited: boolean
}

interface Hero {
  points: number
  name: string
}

export default function Gifts() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [gifts, setGifts] = useState<Gift[]>([])
  const [hero, setHero] = useState<Hero | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)
  const [selectedReceiver, setSelectedReceiver] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [giftsRes, heroRes] = await Promise.all([
        fetch('/api/gifts'),
        fetch('/api/hero/me'),
      ])
      const giftsData = await giftsRes.json()
      const heroData = await heroRes.json()
      
      setGifts(giftsData.gifts || [])
      setHero(heroData.hero || null)
    } catch (error) {
      console.error('Fetch data error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function sendGift(gift: Gift) {
    if (!selectedReceiver) {
      alert('请选择赠送对象')
      return
    }

    if (!confirm(`确定要赠送 ${gift.name} 吗？消耗 ${gift.price} 积分`)) return

    setSending(gift.name)
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedReceiver,
          giftName: gift.name,
          message: message || null,
        }),
      })
      const data = await res.json()
      
      if (data.message) {
        alert(data.message)
        fetchData()
        setMessage('')
      } else {
        alert(data.error || '赠送失败')
      }
    } catch (error) {
      console.error('Send gift error:', error)
      alert('赠送失败')
    } finally {
      setSending(null)
    }
  }

  function getTypeEmoji(type: string): string {
    const map: Record<string, string> = {
      food: '🍔',
      entertainment: '🎮',
      heart: '💝',
      rare: '🎁',
    }
    return map[type] || '🎁'
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
          <div>
            <h1 className="text-3xl font-bold text-white">🎁 礼物店</h1>
            <p className="text-gray-400 mt-1">
              积分：<span className="text-yellow-400 font-bold">{hero?.points || 0}</span>
            </p>
          </div>
          <Link href="/" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            ← 返回
          </Link>
        </div>

        {/* 赠送对象选择 */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">💌 赠送设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">赠送对象（用户 ID）</label>
              <input
                type="text"
                value={selectedReceiver}
                onChange={(e) => setSelectedReceiver(e.target.value)}
                placeholder="输入对方的 SecondMe 用户 ID"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">祝福语（可选）</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="写点什么..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                maxLength={100}
              />
            </div>
          </div>
        </div>

        {/* 礼物列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map(gift => {
            const canAfford = (hero?.points || 0) >= gift.price
            
            return (
              <div
                key={gift.name}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 transition-all hover:bg-white/15"
              >
                <div className="text-4xl mb-3">{getTypeEmoji(gift.type)}</div>
                
                <h3 className="text-xl font-bold text-white mb-2">{gift.name}</h3>
                
                <p className="text-gray-300 text-sm mb-4">
                  {gift.description}
                </p>
                
                <div className="bg-white/5 rounded p-3 mb-4">
                  <p className="text-xs text-gray-400">效果</p>
                  <p className="text-sm text-pink-400 font-semibold">
                    ❤️ 好感度 +{gift.effect}
                    {gift.name === '盲盒' && ' (随机 1-3 倍)'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{gift.price} 积分</span>
                  
                  <button
                    onClick={() => sendGift(gift)}
                    disabled={sending === gift.name || !canAfford || !selectedReceiver}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      canAfford && selectedReceiver
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                        : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {sending === gift.name ? '赠送中...' : '赠送'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {gifts.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">🎁 暂无礼物</p>
          </div>
        )}
      </div>
    </main>
  )
}
