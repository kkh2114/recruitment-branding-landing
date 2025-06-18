"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Star, Sparkles, Target, BookOpen, Lightbulb, ArrowRight, CheckCircle, UserCheck, MessageCircle, Heart, Trophy, Zap, Brain, Rocket, Gift, Crown, Flame, ThumbsUp, TrendingUp, Award, Coffee, Briefcase, Megaphone, Globe, Camera, PenTool, Smile, PartyPopper } from "lucide-react"
import ApplicationForm from "@/components/application-form"

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 via-blue-50 to-green-50 overflow-hidden">
      {/* 🎉 초특급 히어로 섹션 */}
      <section className="relative py-24 px-4 text-center bg-gradient-to-r from-pink-500 via-purple-600 via-blue-600 to-green-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-white/30 shadow-2xl">
            <PartyPopper className="h-5 w-5 animate-bounce" />
            <span className="text-lg font-bold">🎊 가인지 제주 포럼 2025 🌺 초특급 강의 🎊</span>
            <Sparkles className="h-5 w-5 animate-spin" />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
              🚀 AI 채용 브랜딩 🚀
            </span>
            <br />
            <span className="text-4xl md:text-6xl animate-pulse">
              ✨ 대혁신 강의 ✨
            </span>
          </h1>
          
          <p className="text-2xl md:text-4xl mb-12 font-bold leading-relaxed">
            🌟 인재가 <span className="text-yellow-300 animate-pulse">먼저 찾아오는</span> 🌟<br />
            💎 <span className="text-pink-300">꿈의 회사</span> 만들기 💎
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Badge className="text-xl px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black border-4 border-white shadow-2xl transform hover:scale-105 transition-all">
              <Calendar className="h-6 w-6 mr-3" />
              🗓️ 2025년 1월 제주도
            </Badge>
            <Badge className="text-xl px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-black border-4 border-white shadow-2xl transform hover:scale-105 transition-all">
              <Clock className="h-6 w-6 mr-3" />
              ⏰ 2시간 집중 폭탄강의
            </Badge>
            <Badge className="text-xl px-6 py-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-black border-4 border-white shadow-2xl transform hover:scale-105 transition-all">
              <Users className="h-6 w-6 mr-3" />
              👔 CEO/인사담당자 전용
            </Badge>
          </div>
          
          <div className="space-y-6 mb-12">
            <Button 
              size="lg" 
              className="text-2xl px-12 py-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-300 hover:via-pink-400 hover:to-purple-500 text-black font-black shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 border-4 border-white rounded-full"
              onClick={() => setShowForm(true)}
            >
              <Trophy className="h-8 w-8 mr-4 animate-bounce" />
              🎯 지금 바로 신청하기! 🎯
              <Rocket className="h-8 w-8 ml-4 animate-bounce" />
            </Button>
            
            <p className="text-xl font-bold text-yellow-300 animate-pulse">
              ⚡ 선착순 한정! 놓치면 후회 100% ⚡
            </p>
          </div>
        </div>
      </section>

      {/* 🤔 고민폭발 섹션 */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                😱 이런 고민들... 😱<br />
                <span className="text-red-600 animate-pulse">혹시 당신도?!</span>
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-2xl text-gray-700 font-bold">
              🔥 전국 사장님들의 🔥<br />
              💥 <span className="text-red-600">채용 고민 BEST 3</span> 💥
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-4 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 transform hover:scale-105 hover:rotate-1">
              <CardContent className="pt-6">
                <div className="text-8xl mb-6 animate-bounce">😰</div>
                <div className="bg-red-100 rounded-lg p-4 mb-6">
                  <h3 className="text-2xl font-black text-red-800 mb-4 leading-tight">
                    💸 "돈은 들어가는데,<br />
                    👻 지원자는 왜 없죠?!" 👻
                  </h3>
                </div>
                <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                  💰 채용 광고비만 날리고<br />
                  📭 텅 빈 지원서함만 바라보며<br />
                  😭 <span className="text-red-600 font-black">속상하신 분들!</span>
                </p>
                <div className="mt-6 flex justify-center">
                  <Badge className="bg-red-500 text-white px-4 py-2 text-lg font-bold">
                    🚨 긴급상황 🚨
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-4 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 transform hover:scale-105 hover:rotate-1">
              <CardContent className="pt-6">
                <div className="text-8xl mb-6 animate-bounce delay-300">🤯</div>
                <div className="bg-orange-100 rounded-lg p-4 mb-6">
                  <h3 className="text-2xl font-black text-orange-800 mb-4 leading-tight">
                    ✍️ "채용공고 쓸 말이<br />
                    🤷‍♂️ 도대체 뭐가 있죠?!" 🤷‍♀️
                  </h3>
                </div>
                <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                  📝 빈 종이만 쳐다보며<br />
                  💭 머리 싸매고 고민만<br />
                  ⏰ <span className="text-orange-600 font-black">시간만 흘러가는 분들!</span>
                </p>
                <div className="mt-6 flex justify-center">
                  <Badge className="bg-orange-500 text-white px-4 py-2 text-lg font-bold">
                    📝 글쓰기 공포 📝
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 transform hover:scale-105 hover:rotate-1">
              <CardContent className="pt-6">
                <div className="text-8xl mb-6 animate-bounce delay-700">😵‍💫</div>
                <div className="bg-blue-100 rounded-lg p-4 mb-6">
                  <h3 className="text-2xl font-black text-blue-800 mb-4 leading-tight">
                    🏢 "우리 회사 어필포인트가<br />
                    ❓ 도대체 뭔가요?!" ❓
                  </h3>
                </div>
                <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                  🤔 우리만의 매력을 모르겠고<br />
                  💡 어떻게 어필해야 할지<br />
                  😵 <span className="text-blue-600 font-black">막막하신 분들!</span>
                </p>
                <div className="mt-6 flex justify-center">
                  <Badge className="bg-blue-500 text-white px-4 py-2 text-lg font-bold">
                    🎯 정체성 혼란 🎯
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-2xl">
              <p className="text-2xl font-black">
                🔥 이 모든 고민들의 해답이 여기에! 🔥
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ 솔루션 대폭발 섹션 */}
      <section className="py-24 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-block mb-8">
              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text mb-6">
                🎉 해답은 바로 🎉<br />
                ⚡ '채용 브랜딩' ⚡
              </h2>
              <div className="flex justify-center gap-4">
                <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-16 h-2 bg-purple-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-2xl md:text-3xl text-gray-800 font-bold leading-relaxed">
              🚀 AI 혁신 기술로 🚀<br />
              💎 <span className="text-blue-600">인재자석 회사</span> 완성! 💎
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
                🎯 이 강의에서 배우는<br />
                <span className="text-green-600">💰 돈 되는 스킬들 💰</span>
              </h3>
              
              <div className="space-y-6">
                <Card className="p-6 border-4 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500 rounded-full p-3">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-green-800 mb-2">
                        🎯 채용 브랜딩 핵심 비밀
                      </h4>
                      <p className="text-gray-700 font-semibold text-lg">
                        💡 인재들이 <span className="text-green-600 font-black">"이 회사 꼭 가고 싶다!"</span><br />
                        라고 외치게 만드는 마법의 공식
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-4 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500 rounded-full p-3">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-blue-800 mb-2">
                        🤖 AI 채용공고 작성 마스터
                      </h4>
                      <p className="text-gray-700 font-semibold text-lg">
                        ⚡ ChatGPT, Claude로 <span className="text-blue-600 font-black">10분만에</span><br />
                        프로급 채용공고 완성하는 극비 노하우
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500 rounded-full p-3">
                      <Megaphone className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-purple-800 mb-2">
                        📖 회사 스토리텔링 신공
                      </h4>
                      <p className="text-gray-700 font-semibold text-lg">
                        🎭 평범한 회사도 <span className="text-purple-600 font-black">드라마틱하게</span><br />
                        포장하는 감동 스토리 제작법
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-4 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500 rounded-full p-3">
                      <Gift className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-orange-800 mb-2">
                        📋 실전 템플릿 대방출
                      </h4>
                      <p className="text-gray-700 font-semibold text-lg">
                        💎 <span className="text-orange-600 font-black">복사만 하면 끝!</span><br />
                        바로 써먹는 채용 템플릿 10종 세트
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-10 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white shadow-2xl border-4 border-white transform hover:scale-105 transition-all">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">🎁</div>
                <CardTitle className="text-3xl mb-4 font-black">
                  💝 초특급 보너스 💝
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="h-6 w-6 text-yellow-300" />
                      <span className="text-xl font-black">VIP 혜택 1</span>
                    </div>
                    <p className="text-lg font-semibold">🎯 AI 채용공고 황금 템플릿 (가치 50만원)</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Coffee className="h-6 w-6 text-yellow-300" />
                      <span className="text-xl font-black">VIP 혜택 2</span>
                    </div>
                    <p className="text-lg font-semibold">☕ 1:1 맞춤 컨설팅 30분 (가치 30만원)</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-yellow-300" />
                      <span className="text-xl font-black">VIP 혜택 3</span>
                    </div>
                    <p className="text-lg font-semibold">📋 채용 브랜딩 체크리스트 (가치 20만원)</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="h-6 w-6 text-yellow-300" />
                      <span className="text-xl font-black">VIP 혜택 4</span>
                    </div>
                    <p className="text-lg font-semibold">📚 강의 자료 평생 소장 (무가치 측정)</p>
                  </div>

                  <div className="text-center mt-8 p-4 bg-red-500 rounded-lg border-2 border-white">
                    <p className="text-2xl font-black animate-pulse">
                      🔥 총 가치 100만원+ 🔥<br />
                      💸 완전 무료 제공! 💸
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 👨‍💼 강사 소개 VIP 섹션 */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-20 right-20 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              👑 <span className="text-yellow-400">강사 소개</span> 👑
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          </div>
          
          <Card className="p-12 max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
            <CardContent className="text-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 mx-auto mb-8 flex items-center justify-center shadow-2xl border-4 border-white">
                <UserCheck className="h-20 w-20 text-white" />
              </div>
              
              <div className="mb-8">
                <h3 className="text-4xl font-black text-yellow-400 mb-4">김길호 대표</h3>
                <p className="text-2xl text-blue-300 font-bold mb-6">에스유디자인(주) CEO</p>
                
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-xl">
                  🏆 20년+ 브랜딩 마스터 🏆
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Trophy className="h-8 w-8 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-black text-yellow-400 mb-2">브랜딩 구루</h4>
                      <p className="text-lg text-white">🎯 수백 개 기업 브랜딩 성공 신화 창조</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Briefcase className="h-8 w-8 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-black text-blue-400 mb-2">채용 컨설팅 전문가</h4>
                      <p className="text-lg text-white">💼 대기업부터 스타트업까지 채용 혁신</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Brain className="h-8 w-8 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-black text-purple-400 mb-2">AI 마케팅 선구자</h4>
                      <p className="text-lg text-white">🤖 ChatGPT 활용 국내 1위 전문가</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Megaphone className="h-8 w-8 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-black text-green-400 mb-2">강의 대세</h4>
                      <p className="text-lg text-white">🎤 전국 기업 대상 1000회+ 강의</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <p className="text-2xl font-black text-white leading-relaxed">
                  💡 "채용이 어려우신가요? 그 고민, 제가 해결해드릴게요!" 💡<br />
                  🔥 <span className="text-yellow-300">20년 노하우를 2시간에 압축 전수!</span> 🔥
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 🚀 마지막 어필 폭탄 섹션 */}
      <section className="py-24 px-4 bg-gradient-to-r from-red-600 via-pink-600 via-purple-600 to-blue-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* 폭죽 애니메이션 효과 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-pink-400 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-20 left-20 w-5 h-5 bg-blue-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-10 right-10 w-3 h-3 bg-green-400 rounded-full animate-ping delay-1500"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              🔥 더 이상 기다리지 마세요! 🔥<br />
              <span className="text-yellow-300 animate-pulse">⚡ 지금이 바로 그때! ⚡</span>
            </h2>
            
            <p className="text-2xl md:text-3xl mb-8 font-bold leading-relaxed">
              🌟 AI 채용 브랜딩으로 🌟<br />
              💎 <span className="text-pink-300">인재자석 회사</span> 완성하세요! 💎
            </p>
          </div>
          
          <div className="space-y-8 mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 border-2 border-white/30">
                <Flame className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-black mb-2">🎯 즉시 적용</h3>
                <p className="text-lg">강의 듣자마자 바로 써먹는 실전 노하우!</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 border-2 border-white/30">
                <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-black mb-2">📈 효과 보장</h3>
                <p className="text-lg">적용 후 30일 내 지원자 급증 보장!</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 border-2 border-white/30">
                <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-black mb-2">👑 VIP 대우</h3>
                <p className="text-lg">100만원 상당 보너스 자료 무료 증정!</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <Button 
              size="lg" 
              className="text-3xl px-16 py-10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-black font-black shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 border-4 border-white rounded-full"
              onClick={() => setShowForm(true)}
            >
              <PartyPopper className="h-10 w-10 mr-6 animate-bounce" />
              🎊 지금 바로 신청하고 인생 역전! 🎊
              <Rocket className="h-10 w-10 ml-6 animate-bounce" />
            </Button>
            
            <div className="space-y-4">
              <p className="text-xl font-black text-yellow-300 animate-pulse">
                ⚡ 선착순 한정! 늦으면 1년 대기! ⚡
              </p>
              <p className="text-lg font-bold">
                ⏰ 신청 마감까지 얼마 남지 않았어요! ⏰
              </p>
              <div className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-black text-xl animate-pulse border-2 border-white">
                🚨 지금 신청하지 않으면 100% 후회! 🚨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎉 신청 폼 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl border-4 border-yellow-400">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none font-black bg-red-100 hover:bg-red-200 rounded-full w-10 h-10 flex items-center justify-center transition-all"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4">
                🎊 신청서 작성 🎊
              </h3>
              <p className="text-lg font-bold text-gray-700">
                🚀 인재자석 회사로 변신할 준비 되셨나요? 🚀
              </p>
            </div>
            
            <ApplicationForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
} 