import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI 채용 브랜딩 강의 | 인재가 먼저 찾아오는 회사 만들기',
  description: '가인지 제주 포럼 특별강의 - AI를 활용한 채용 브랜딩으로 좋은 인재를 유치하는 방법을 배워보세요',
  keywords: 'AI, 채용, 브랜딩, 인재, 채용공고, 강의',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 