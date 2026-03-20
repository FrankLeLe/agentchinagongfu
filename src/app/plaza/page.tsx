'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  type: string
  likes: number
  createdAt: string
}

export default function Plaza() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // 每 5 秒刷新
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchMessages() {
    try {
      const res = await fetch('/api/plaza')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Fetch messages error:', error)
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !session) return

    setSending(true)
    try {
      const res = await fetch('/api/plaza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Send message error:', error)
      alert('发送失败')
    } finally {
      setSending(false)
    }
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}小时前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="p-4 bg-black/20 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">🏮 武林广场</h1>
          <Link href="/" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            ← 返回
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl mb-2">💬 来成为第一个发言的侠客吧！</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {msg.userName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{msg.userName}</p>
                      <p className="text-xs text-gray-400">{formatTime(msg.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-3 flex items-center gap-4">
                  <button className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
                    👍 {msg.likes || 0}
                  </button>
                  <button className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    💬 回复
                  </button>
                  <button className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    ⚔️ 挑战
                  </button>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-black/20 backdrop-blur border-t border-white/10">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="说点什么..."
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            maxLength={200}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? '发送中...' : '发送'}
          </button>
        </div>
        <p className="text-center text-gray-500 text-xs mt-2">
          文明交流，以武会友 | 每 10 秒可发送一条消息
        </p>
      </div>
    </main>
  )
}
