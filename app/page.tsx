"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Star, Sparkles, Target, BookOpen, Lightbulb, ArrowRight, CheckCircle, UserCheck, MessageCircle, Heart } from "lucide-react"
import ApplicationForm from "@/components/application-form"

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">가인지 제주 포럼 특별강의</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI 채용 브랜딩 강의
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            인재가 먼저 찾아오는 회사 만들기
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
              <Calendar className="h-4 w-4 mr-2" />
              2025년 1월
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
              <Clock className="h-4 w-4 mr-2" />
              2시간 집중 강의
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
              <Users className="h-4 w-4 mr-2" />
              대표/인사 담당자
            </Badge>
          </div>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowForm(true)}
          >
            <Star className="h-5 w-5 mr-2" />
            지금 신청하기
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              이런 고민, 혹시 당신도? 🤔
            </h2>
            <p className="text-xl text-gray-600">
              많은 대표님들이 똑같은 채용 고민을 안고 계십니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-red-100 bg-red-50/50">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">😰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  "채용공고에 성의는 있는데,<br />효과는 왜 없죠?"
                </h3>
                <p className="text-gray-600">
                  열심히 공고를 작성했는데<br />
                  지원자가 없거나 부족해서<br />
                  답답하신 경우
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-orange-100 bg-orange-50/50">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  "막상 채용공고를 쓸 말이나<br />사진이 없어요"
                </h3>
                <p className="text-gray-600">
                  어떤 내용을 어떻게 써야<br />
                  좋은 인재가 관심을 가질지<br />
                  막막하신 경우
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-blue-100 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  "우리 회사를 어떻게<br />어필해야 할지 모르겠어요"
                </h3>
                <p className="text-gray-600">
                  대표의 고민을 이해하고<br />
                  함께 해결해 나갈<br />
                  직원이 부족한 경우
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              해답은 바로 '채용 브랜딩'입니다 ✨
            </h2>
            <p className="text-xl text-gray-600">
              AI를 활용한 체계적인 채용 브랜딩으로 인재가 먼저 찾아오는 회사를 만드세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🎯 이 강의에서 배우게 될 것들
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">채용 브랜딩의 핵심 원리</h4>
                    <p className="text-gray-600">인재가 지원하고 싶어하는 회사의 특징과 브랜딩 방법</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AI를 활용한 채용공고 작성법</h4>
                    <p className="text-gray-600">ChatGPT, Claude 등 AI 도구로 효과적인 채용공고 만들기</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">회사 스토리텔링 기법</h4>
                    <p className="text-gray-600">우리 회사만의 매력을 어필하는 스토리 구성법</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">실무 적용 가능한 템플릿</h4>
                    <p className="text-gray-600">바로 사용할 수 있는 채용공고 템플릿과 체크리스트</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  특별 혜택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>AI 채용공고 작성 템플릿 제공</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>1:1 맞춤 컨설팅 (30분)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>채용 브랜딩 체크리스트</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>강의 자료 평생 소장</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            강사 소개 👨‍💼
          </h2>
          
          <Card className="p-8 max-w-3xl mx-auto">
            <CardContent className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center">
                <UserCheck className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">김길호 대표</h3>
              <p className="text-lg text-blue-600 mb-4">에스유디자인(주)</p>
              
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">20년+ 브랜딩 및 마케팅 경험</p>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">다수 기업 채용 브랜딩 컨설팅 진행</p>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">AI 마케팅 도구 활용 전문가</p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">실무진 대상 워크샵 다수 진행</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            더 이상 좋은 인재를 기다리지 마세요 🚀
          </h2>
          <p className="text-xl mb-8 opacity-90">
            AI 채용 브랜딩으로 인재가 먼저 찾아오는 회사를 만들어보세요
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowForm(true)}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            지금 바로 신청하기
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="mt-6 text-sm opacity-75">
            * 선착순 마감, 놓치면 다음 기회는 언제일지...
          </p>
        </div>
      </section>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
            <ApplicationForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
} 