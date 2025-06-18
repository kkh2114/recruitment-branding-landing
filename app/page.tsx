"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Star, Sparkles, Target, BookOpen, Lightbulb, ArrowRight, CheckCircle, UserCheck, MessageCircle, Heart, Trophy, Gift, Zap, Crown, Rocket, Flame, PartyPopper } from "lucide-react"
import ApplicationForm from "@/components/application-form"

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 via-purple-50 to-blue-50 animate-gradient-x">
      {/* Hero Section - 폭탄급 임팩트! */}
      <section className="relative py-24 px-4 text-center bg-gradient-to-r from-red-500 via-pink-500 via-purple-600 via-blue-600 to-green-500 text-white overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🎯</div>
          <div className="absolute top-20 right-20 text-6xl animate-spin">⭐</div>
          <div className="absolute bottom-20 left-20 text-6xl animate-ping">💎</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-pulse">🚀</div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-2xl animate-bounce">
            <Crown className="h-6 w-6 text-white" />
            <span className="text-lg font-black text-white">🏆 가인지 제주 포럼 VIP 특별강의 🏆</span>
            <Sparkles className="h-6 w-6 text-white animate-spin" />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
            🔥 폭탄급 AI 채용 브랜딩 강의! 🔥
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-yellow-300 animate-bounce">
            💰 인재가 줄 서서 지원하는 회사 되기! 💰
          </h2>
          
          <p className="text-2xl md:text-3xl mb-12 font-bold text-yellow-200 animate-pulse">
            🎉 완전 무료! 100만원 상당의 노하우 대방출! 🎉
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
                         <Badge variant="secondary" className="text-xl px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-2xl animate-bounce">
               <Flame className="h-6 w-6 mr-3" />
               🔥 2025년 7월 15일 D-DAY! 🔥
             </Badge>
                         <Badge variant="secondary" className="text-xl px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-2xl animate-pulse">
               <Zap className="h-6 w-6 mr-3" />
               ⚡ 오후 2시~4시 (2시간 집중!) ⚡
             </Badge>
            <Badge variant="secondary" className="text-xl px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 shadow-2xl animate-bounce">
              <Trophy className="h-6 w-6 mr-3" />
              👑 대표/인사 담당자 VIP 전용! 👑
            </Badge>
          </div>
          
          <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-8 animate-pulse">
            🚨 딱 50명 한정! 선착순 마감! 🚨
          </div>
          
          <Button 
            size="lg" 
            className="text-2xl px-12 py-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-bounce border-4 border-white font-black rounded-2xl"
            onClick={() => setShowForm(true)}
          >
            <Rocket className="h-8 w-8 mr-3 animate-spin" />
            🎯 지금 당장 신청하기! 🎯
            <PartyPopper className="h-8 w-8 ml-3 animate-bounce" />
          </Button>
          
          <p className="mt-6 text-xl font-bold text-yellow-200 animate-pulse">
            ⏰ 늦으면 후회하는 일생일대의 기회! ⏰
          </p>
        </div>
      </section>

      {/* Pain Points Section - 공감 200% */}
      <section className="py-24 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 animate-pulse">
              😱 혹시 이런 고민에 밤잠 못 이루고 계신가요? 😱
            </h2>
            <p className="text-2xl md:text-3xl text-red-600 font-bold animate-bounce">
              🔥 전국 대표님들의 공통 고민 TOP 3! 🔥
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-4 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 hover:scale-105 animate-pulse">
              <CardContent className="pt-8">
                <div className="text-8xl mb-6 animate-bounce">😰💔</div>
                <h3 className="text-2xl font-black text-red-700 mb-6 leading-tight">
                  💸 "채용공고에 돈도 들고<br />시간도 들었는데<br />🤦‍♂️ 지원자가 없어요!" 💸
                </h3>
                <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                  🔥 열정적으로 공고를 작성했는데<br />
                  👻 지원자가 없거나 부족해서<br />
                  😤 속이 터지도록 답답하신 모든 대표님들!
                </p>
                <div className="mt-4 text-3xl animate-spin">💀</div>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-4 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 hover:scale-105 animate-pulse">
              <CardContent className="pt-8">
                <div className="text-8xl mb-6 animate-bounce">📝😵</div>
                <h3 className="text-2xl font-black text-orange-700 mb-6 leading-tight">
                  🤔 "막상 채용공고를 쓸 때<br />뭘 어떻게 써야 할지<br />🤷‍♀️ 완전 막막해요!" 🤔
                </h3>
                <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                  😵 어떤 내용을 어떻게 써야<br />
                  💎 좋은 인재가 관심을 가질지<br />
                  🌪️ 머리가 뱅뱅 도는 모든 분들!
                </p>
                <div className="mt-4 text-3xl animate-spin">🌀</div>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 hover:scale-105 animate-pulse">
              <CardContent className="pt-8">
                <div className="text-8xl mb-6 animate-bounce">🏢😢</div>
                <h3 className="text-2xl font-black text-blue-700 mb-6 leading-tight">
                  😭 "우리 회사를 어떻게<br />멋있게 어필해야 할지<br />🤯 정말 모르겠어요!" 😭
                </h3>
                <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                  💪 대표의 비전을 이해하고<br />
                  🤝 함께 성장해 나갈<br />
                  🌟 최고의 직원이 절실히 필요한 분들!
                </p>
                <div className="mt-4 text-3xl animate-spin">💫</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <div className="text-6xl mb-6 animate-bounce">😤💥</div>
            <h3 className="text-3xl md:text-4xl font-black text-red-600 animate-pulse">
              🔥 이제 그런 고민 끝! 완전 해결! 🔥
            </h3>
          </div>
        </div>
      </section>

      {/* Solution Section - 대혁신! */}
      <section className="py-24 px-4 bg-gradient-to-r from-green-100 via-blue-100 via-purple-100 to-pink-100 animate-gradient-x">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text mb-8 animate-pulse">
              🎯 대혁신! AI 채용 브랜딩의 마법! 🎯
            </h2>
            <p className="text-2xl md:text-3xl text-gray-800 font-bold animate-bounce">
              ✨ 인재가 줄 서서 지원하는 회사로 완전 변신! ✨
            </p>
            <div className="text-6xl mt-6 animate-spin">🌟</div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 animate-pulse">
                🚀 이 강의에서 배우는 인생역전 노하우들! 🚀
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:shadow-xl transition-all duration-300 animate-pulse">
                  <Trophy className="h-8 w-8 text-green-500 mt-2 flex-shrink-0 animate-bounce" />
                  <div>
                    <h4 className="text-xl font-black text-green-700 mb-2">🏆 채용 브랜딩의 핵심 비밀 공개!</h4>
                    <p className="text-lg text-gray-700 font-semibold">💎 인재가 지원하고 싶어 미치는 회사의 특징과 초강력 브랜딩 방법 대공개!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-all duration-300 animate-pulse">
                  <Rocket className="h-8 w-8 text-blue-500 mt-2 flex-shrink-0 animate-bounce" />
                  <div>
                    <h4 className="text-xl font-black text-blue-700 mb-2">🤖 AI 활용 채용공고 작성의 신기술!</h4>
                    <p className="text-lg text-gray-700 font-semibold">⚡ ChatGPT, Claude 등 최신 AI 도구로 완벽한 채용공고 만드는 비법 전수!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 hover:shadow-xl transition-all duration-300 animate-pulse">
                  <Heart className="h-8 w-8 text-purple-500 mt-2 flex-shrink-0 animate-bounce" />
                  <div>
                    <h4 className="text-xl font-black text-purple-700 mb-2">📚 회사 스토리텔링 완전정복!</h4>
                    <p className="text-lg text-gray-700 font-semibold">✨ 우리 회사만의 독특한 매력을 200% 어필하는 스토리 구성법의 모든 것!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 hover:shadow-xl transition-all duration-300 animate-pulse">
                  <Gift className="h-8 w-8 text-yellow-500 mt-2 flex-shrink-0 animate-bounce" />
                  <div>
                    <h4 className="text-xl font-black text-yellow-700 mb-2">🎁 즉시 활용 가능한 초특급 템플릿!</h4>
                    <p className="text-lg text-gray-700 font-semibold">🔥 강의 끝나자마자 바로 사용할 수 있는 검증된 채용공고 템플릿과 완벽 체크리스트!</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-10 bg-gradient-to-br from-red-500 via-pink-500 via-purple-600 to-blue-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 animate-pulse border-4 border-yellow-300">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl mb-4 flex items-center gap-3 font-black">
                  <Crown className="h-10 w-10 text-yellow-300 animate-spin" />
                  🎊 VIP 완전무료 특별혜택! 🎊
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-xl">
                  <div className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                    <Star className="h-8 w-8 text-yellow-300 animate-bounce" />
                    <span className="font-bold">💰 100만원 상당 AI 채용공고 작성 템플릿 무료 증정!</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                    <Star className="h-8 w-8 text-yellow-300 animate-bounce" />
                    <span className="font-bold">👑 1:1 VIP 맞춤 컨설팅 (30분) 완전무료!</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                    <Star className="h-8 w-8 text-yellow-300 animate-bounce" />
                    <span className="font-bold">📋 채용 브랜딩 완벽 체크리스트 독점 제공!</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                    <Star className="h-8 w-8 text-yellow-300 animate-bounce" />
                    <span className="font-bold">💎 강의 자료 평생 소장 + 업데이트 무료!</span>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <div className="text-4xl mb-4 animate-bounce">🎯</div>
                  <p className="text-2xl font-black text-yellow-300 animate-pulse">
                    💥 총 500만원 상당을 완전무료! 💥
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructor Section - 전문가 인증! */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-16 animate-pulse">
            👨‍💼 검증된 최고 전문가가 직접 강의! 👨‍💼
          </h2>
          
          <Card className="p-12 max-w-4xl mx-auto shadow-2xl bg-gradient-to-br from-white to-blue-50 border-4 border-blue-200 hover:shadow-3xl transition-all duration-500">
            <CardContent className="text-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 mx-auto mb-8 flex items-center justify-center shadow-2xl animate-pulse">
                <UserCheck className="h-20 w-20 text-white animate-bounce" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 animate-bounce">🏆 김길호 대표 🏆</h3>
              <p className="text-2xl text-blue-600 mb-8 font-bold">✨ 에스유디자인(주) ✨</p>
              
              <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <Trophy className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0 animate-bounce" />
                    <p className="text-lg text-gray-800 font-bold">🔥 20년+ 브랜딩 및 마케팅 초고수 경험!</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <Target className="h-8 w-8 text-green-500 mt-1 flex-shrink-0 animate-bounce" />
                    <p className="text-lg text-gray-800 font-bold">💎 1000+ 기업 채용 브랜딩 대성공 컨설팅!</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <Rocket className="h-8 w-8 text-purple-500 mt-1 flex-shrink-0 animate-bounce" />
                    <p className="text-lg text-gray-800 font-bold">🤖 AI 마케팅 도구 활용 절대고수!</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                    <Crown className="h-8 w-8 text-yellow-500 mt-1 flex-shrink-0 animate-bounce" />
                    <p className="text-lg text-gray-800 font-bold">👑 전국 실무진 대상 워크샵 대박 성과!</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300">
                <h4 className="text-2xl font-black text-orange-700 mb-4 animate-pulse">
                  🌟 "인재가 줄 서서 지원하는 회사로 변신!" 🌟
                </h4>
                <p className="text-lg text-gray-700 font-bold leading-relaxed">
                  💯 수많은 대표님들이 이미 경험한 기적 같은 변화!<br />
                  🚀 이제 당신 차례입니다!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Urgency Section - 마지막 기회! */}
      <section className="py-24 px-4 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 text-white text-center animate-gradient-x">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-8xl mb-8 animate-bounce">⏰🚨</div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 animate-pulse">
              🔥 마지막 경고! 놓치면 완전 후회! 🔥
            </h2>
            <p className="text-2xl md:text-3xl mb-8 font-bold animate-bounce">
              💥 전국 대표님들이 미친 듯이 신청 중! 💥
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 transition-all duration-300 animate-pulse">
              <CardContent className="text-center">
                <div className="text-6xl mb-4 animate-spin">⏱️</div>
                                 <h3 className="text-2xl font-black mb-2">🚨 선착순 50명 한정! 🚨</h3>
                 <p className="text-lg font-bold">💀 7월 15일까지 단 며칠 남지 않았어요!</p>
              </CardContent>
            </Card>
            
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 transition-all duration-300 animate-pulse">
              <CardContent className="text-center">
                <div className="text-6xl mb-4 animate-bounce">💰</div>
                <h3 className="text-2xl font-black mb-2">💸 완전무료 마지막 기회! 💸</h3>
                <p className="text-lg font-bold">🔥 다음엔 유료로 전환!</p>
              </CardContent>
            </Card>
            
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 transition-all duration-300 animate-pulse">
              <CardContent className="text-center">
                <div className="text-6xl mb-4 animate-ping">🎁</div>
                <h3 className="text-2xl font-black mb-2">🎊 특별혜택 마지막 날! 🎊</h3>
                <p className="text-lg font-bold">✨ 500만원 상당 혜택!</p>
              </CardContent>
            </Card>
          </div>

                     <Button 
             size="lg" 
             className="text-3xl px-16 py-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-bounce border-4 border-white font-black rounded-3xl"
             onClick={() => setShowForm(true)}
           >
             <Flame className="h-10 w-10 mr-4 animate-spin" />
             🎯 지금 당장 신청하고 인생역전! 🎯
             <Rocket className="h-10 w-10 ml-4 animate-bounce" />
           </Button>
          
          <div className="mt-8 space-y-4">
            <p className="text-2xl font-black text-yellow-300 animate-pulse">
              ⚡ 신청 완료까지 단 30초! ⚡
            </p>
            <p className="text-xl font-bold text-yellow-200 animate-bounce">
              💀 선착순 마감, 놓치면 다음 기회는 언제일지... 💀
            </p>
            <div className="text-6xl animate-spin">💫</div>
          </div>
        </div>
      </section>

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
                🏆 VIP 신청 완료까지 단 한 걸음! 🏆
              </h3>
            </div>
            <ApplicationForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
} 