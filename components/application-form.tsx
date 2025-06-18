"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Send, CheckCircle } from "lucide-react"

interface ApplicationFormProps {
  onClose: () => void
}

export default function ApplicationForm({ onClose }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    concern: '',
    industry: '',
    memo: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const error = await response.json()
        alert(error.message || '신청 중 오류가 발생했습니다.')
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">신청 완료!</h3>
          <p className="text-gray-600 mb-4">
            강의 신청이 성공적으로 완료되었습니다.<br />
            곧 확인 메일을 보내드리겠습니다.
          </p>
          <p className="text-sm text-gray-500">
            이 창은 자동으로 닫힙니다...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          AI 채용 브랜딩 강의 신청
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@company.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호 *
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                회사명 *
              </label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="(주)회사명"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                직책 *
              </label>
              <Input
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="대표이사 / 인사팀장 등"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                업종/산업군
              </label>
              <Input
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="IT / 제조업 / 서비스업 등"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              현재 채용 관련 고민
            </label>
            <Textarea
              name="concern"
              value={formData.concern}
              onChange={handleChange}
              placeholder="예: 좋은 개발자를 구하기 어려워요, 채용공고 작성이 막막해요 등"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기타 문의사항
            </label>
            <Textarea
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="강의에 대한 궁금한 점이나 특별히 알고 싶은 내용이 있으시면 적어주세요"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  신청 중...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  신청하기
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 