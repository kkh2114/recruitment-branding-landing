"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Heart, BookOpen, Target, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import ApplicationForm from "@/components/application-form"

export default function LandingPage() {
  const [clickCount, setClickCount] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([])

  useEffect(() => {
    // 떠다니는 이모티콘 생성
    const emojis = ["🎉", "🚀", "💡", "✨", "🎯", "💝", "🏝️", "🎁", "🤖", "📝"]
    const newFloatingEmojis = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setFloatingEmojis(newFloatingEmojis)
  }, [])

  const handleEmojiClick = (e: React.MouseEvent) => {
    setClickCount((prev) => prev + 1)

    // 클릭 위치에 폭죽 효과
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 임시 폭죽 이모티콘 생성
    const firework = document.createElement("div")
    firework.innerHTML = "🎆"
    firework.style.position = "absolute"
    firework.style.left = `${x}px`
    firework.style.top = `${y}px`
    firework.style.fontSize = "2rem"
    firework.style.pointerEvents = "none"
    firework.style.animation = "firework 1s ease-out forwards"
    e.currentTarget.appendChild(firework)

    setTimeout(() => firework.remove(), 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* 떠다니는 배경 이모티콘들 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute text-2xl opacity-20 animate-float"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              animationDelay: `${item.id * 0.5}s`,
              animationDuration: `${3 + (item.id % 3)}s`,
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 text-white animate-gradient-x">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center z-10">
          <div className="mb-8" onClick={handleEmojiClick}>
            <div className="inline-block bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 text-transparent bg-clip-text animate-rainbow">
              <h3 className="text-2xl md:text-3xl font-black mb-2 animate-bounce">
                <span className="animate-spin-slow inline-block">🏝️</span> 가인지 제주 포럼 기부선물 마련을 위한 특별강의{" "}
                <span className="animate-pulse inline-block">🎁</span>
              </h3>
            </div>
            <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 text-lg px-6 py-2 font-bold shadow-lg animate-wiggle hover:animate-bounce">
              ✅ 경영자 전용 · 100% 기부 프로젝트
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
            사람이 안 오는 채용공고 말고,
            <br />
            <span className="text-yellow-300 animate-glow">사람이 모이고 싶어지는</span>
            <br />
            채용 브랜딩 하세요.
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-300">
            <span className="animate-typing">AI로 만드는 진심 담은 채용 상세페이지</span>
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 text-lg px-8 py-4 animate-pulse hover:animate-bounce transform hover:scale-110 transition-all duration-300"
            onClick={() => setShowForm(true)}
          >
            <Target className="mr-2 h-5 w-5 animate-spin-slow" />
            지금 바로 신청하기 🚀
          </Button>
          {clickCount > 0 && (
            <div className="mt-4 text-yellow-300 animate-bounce">🎉 클릭 {clickCount}번! 열정이 느껴져요! 🎉</div>
          )}
        </div>
      </section>

      {/* Course Info Section */}
      <section className="py-12 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 animate-fade-in-up">
                <span className="animate-bounce inline-block">📌</span> 강의 정보{" "}
                <span className="animate-wiggle inline-block">📌</span>
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-up animation-delay-200">
                놓치면 후회하는 단 한 번의 기회! <span className="animate-pulse inline-block">⚡</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-left border-l-8 border-l-purple-400">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-4 animate-bounce">📅</div>
                    <h3 className="font-bold text-xl mb-2 text-purple-700">강의 일시</h3>
                    <p className="text-gray-700 font-medium">7월 17일전 어느 날 갑자기</p>
                    <div className="mt-3 bg-purple-100 px-3 py-1 rounded-full animate-pulse">
                      <span className="text-purple-700 text-sm font-medium">
                        <span className="animate-spin-slow inline-block">🎲</span> 깜짝 공지 예정!
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-200 border-l-8 border-l-blue-400">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-4 animate-wiggle">⏱️</div>
                    <h3 className="font-bold text-xl mb-2 text-blue-700">소요시간</h3>
                    <p className="text-gray-700 font-medium">2시간 내외</p>
                    <div className="mt-3 bg-blue-100 px-3 py-1 rounded-full animate-pulse">
                      <span className="text-blue-700 text-sm font-medium">
                        <span className="animate-bounce inline-block">☕</span> 커피 한 잔 타임!
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-right animation-delay-400 border-l-8 border-l-green-400">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-4 animate-pulse">🌐</div>
                    <h3 className="font-bold text-xl mb-2 text-green-700">장소</h3>
                    <p className="text-gray-700 font-medium">온라인 ZOOM</p>
                    <div className="mt-3 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                      <span className="text-green-700 text-sm font-medium">
                        <span className="animate-wiggle inline-block">🏢</span> 장소 있으면 OFF 병행
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center animate-fade-in-up animation-delay-600">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg animate-pulse hover:animate-bounce transform hover:scale-105 transition-all duration-300">
                <span className="animate-spin-slow inline-block">🔔</span> 신청하시면 상세 일정 안내드립니다!{" "}
                <span className="animate-bounce inline-block">📨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 text-white animate-gradient-x relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in-up">
            <span className="animate-bounce inline-block">📩</span> 지금 바로 신청하세요{" "}
            <span className="animate-wiggle inline-block">🚀</span>
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
            선착순 100명, 기부는 가볍게, 배움은 깊게 <span className="animate-bounce inline-block">🎯</span>
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 text-xl px-12 py-6 animate-pulse hover:animate-bounce transform hover:scale-110 transition-all duration-300"
            onClick={() => setShowForm(true)}
          >
            <BookOpen className="mr-3 h-6 w-6 animate-wiggle" />
            AI 채용 브랜딩 강의 신청하기 <span className="animate-bounce inline-block">🎉</span>
            <ArrowRight className="ml-3 h-6 w-6 animate-bounce" />
          </Button>
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-red-900/30 border border-red-500 p-8 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
              <p className="text-xl mb-4 animate-fade-in-up">
                "이번에도 지원자에게 외면받는 채용공고로 남을 것인가?"{" "}
                <span className="animate-bounce inline-block">😞</span>
              </p>
              <p className="text-xl font-bold text-yellow-300 animate-glow animation-delay-200">
                "아니면 당신의 회사가 '일하고 싶은 곳'이 되게 만들 것인가?"{" "}
                <span className="animate-bounce inline-block">🌟</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-300 text-center relative z-10">
        <div className="container mx-auto px-4">
          <p>
            &copy; 2025 가인지 AI 채용 브랜딩 강의. All rights reserved.{" "}
            <span className="animate-bounce inline-block">💝</span>
          </p>
        </div>
      </footer>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl border-4 border-blue-200">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-3xl leading-none font-black bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-3xl font-black text-blue-600 animate-pulse">
                🏆 AI 채용 브랜딩 강의 신청! 🏆
              </h3>
            </div>
            <ApplicationForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          
        }
        
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px currentColor; }
          50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes firework {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(3) rotate(360deg); opacity: 0; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%; 
          animation: gradient-x 3s ease infinite; 
        }
        .animate-rainbow { 
          background-size: 200% 200%; 
          animation: rainbow 2s ease infinite; 
        }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-typing { 
          overflow: hidden;
          white-space: nowrap;
          animation: typing 3s steps(40, end);
        }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in-left { animation: fade-in-left 0.6s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.6s ease-out; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  )
} 