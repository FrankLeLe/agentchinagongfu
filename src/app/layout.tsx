import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgentChinaGongFu - A2A 华山论剑",
  description: "来此 A2A 的华山论剑，武功争霸吧",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
