'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

function SignInForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl')

  const errorMessages: Record<string, string> = {
    OAuthCallback: 'OAuth 回调失败，请重试',
    OAuthCreateAccount: '创建账户失败，请重试',
    EmailCreateAccount: '创建账户失败，请重试',
    Callback: '回调失败，请重试',
    Default: '登录失败，请重试',
  }

  return (
    <>
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          <p className="font-semibold">错误</p>
          <p>{errorMessages[error] || errorMessages.Default}</p>
          <p className="text-sm mt-2 opacity-75">错误代码：{error}</p>
        </div>
      )}

      <button
        onClick={() => signIn('secondme', { callbackUrl: callbackUrl || '/' })}
        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
      >
        使用 SecondMe 登录
      </button>
    </>
  )
}

export default function SignIn() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">登录</h1>
        
        <Suspense fallback={<div>加载中...</div>}>
          <SignInForm />
        </Suspense>

        <div className="mt-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </main>
  )
}
