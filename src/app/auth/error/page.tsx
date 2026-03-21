'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <>
      <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
        <p className="font-semibold">发生错误</p>
        <p className="text-sm mt-2">错误代码：{error || 'Unknown'}</p>
      </div>

      <Link href="/" className="text-gray-400 hover:text-white transition-colors">
        ← 返回首页
      </Link>
    </>
  )
}

export default function AuthError() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">认证错误</h1>
        
        <Suspense fallback={<div>加载中...</div>}>
          <ErrorContent />
        </Suspense>
      </div>
    </main>
  )
}
