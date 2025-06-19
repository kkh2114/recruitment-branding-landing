// Netlify Functions에서 googleapis 패키지 사용을 위한 Node.js 런타임 설정
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 신청 데이터 스키마
const applicationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().min(2),
  position: z.string().min(2),
  concern: z.string().optional(),
  industry: z.string().optional(),
  memo: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 요청 데이터 파싱 및 검증
    const body = await request.json()
    const applicationData = applicationSchema.parse(body)

    // 환경변수 검증
    const requiredEnvVars = {
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_SHEETS_SHEET_ID: process.env.GOOGLE_SHEETS_SHEET_ID || '1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk'
    }

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        console.error(`필수 환경변수 ${key}가 설정되지 않았습니다.`)
        return NextResponse.json(
          { 
            success: false, 
            message: '서버 설정 오류입니다. 관리자에게 문의하세요.',
            missingVar: key
          },
          { status: 500 }
        )
      }
    }

    console.log('환경변수 확인 완료:', {
      hasPrivateKey: !!requiredEnvVars.GOOGLE_PRIVATE_KEY,
      hasClientEmail: !!requiredEnvVars.GOOGLE_CLIENT_EMAIL,
      hasSheetId: !!requiredEnvVars.GOOGLE_SHEETS_SHEET_ID,
      environment: process.env.NODE_ENV || 'development',
      runtime: process.env.AWS_LAMBDA_JS_RUNTIME || 'not-set'
    })

    // Google Sheets API v4 직접 호출 방식
    const { GoogleSpreadsheet } = require('google-spreadsheet')
    
    const doc = new GoogleSpreadsheet(requiredEnvVars.GOOGLE_SHEETS_SHEET_ID!)

    // 서비스 계정 인증 (더 간단한 방식)
    await doc.useServiceAccountAuth({
      client_email: requiredEnvVars.GOOGLE_CLIENT_EMAIL!,
      private_key: requiredEnvVars.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n')
    })

    // 문서 정보 로드
    await doc.loadInfo()
    console.log('구글 시트 연결 성공:', {
      title: doc.title,
      sheetCount: doc.sheetCount
    })

    // 첫 번째 시트 가져오기
    const sheet = doc.sheetsByIndex[0]
    if (!sheet) {
      throw new Error('시트를 찾을 수 없습니다.')
    }

    console.log('시트 정보:', {
      title: sheet.title,
      rowCount: sheet.rowCount,
      columnCount: sheet.columnCount
    })

    // 현재 시간
    const timestamp = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    // 새 행 추가 (google-spreadsheet 방식)
    const newRow = await sheet.addRow({
      '신청일시': timestamp,
      '이름': applicationData.name,
      '이메일': applicationData.email,
      '전화번호': applicationData.phone,
      '회사명': applicationData.company,
      '직책': applicationData.position,
      '채용 관련 고민': applicationData.concern || '',
      '업종/산업군': applicationData.industry || '',
      '기타 문의사항': applicationData.memo || '',
      '처리 상태': '대기',
      'AI생성메시지': '',
      '검토완료': 'FALSE',
      '발송상태': '대기'
    })

    console.log('데이터 추가 성공:', {
      rowNumber: newRow._rowNumber,
      timestamp
    })

    return NextResponse.json(
      { 
        success: true, 
        message: '신청이 성공적으로 완료되었습니다.',
        timestamp,
        rowNumber: newRow._rowNumber
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error submitting application:', error)
    
    // 상세한 에러 정보 로깅 (Netlify Functions 디버깅용)
    if (error instanceof Error) {
      console.error('에러 상세 정보:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: '입력 데이터가 올바르지 않습니다.',
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    // Google API 관련 에러 처리
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Google API 에러:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Google Sheets 연동 중 오류가 발생했습니다. 관리자에게 문의하세요.',
          errorCode: (error as any).code
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date().toISOString(),
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET 요청에 대한 기본 응답 및 연결 테스트
export async function GET() {
  try {
    // 환경변수 확인
    const envCheck = {
      hasGoogleProjectId: !!process.env.GOOGLE_PROJECT_ID,
      hasGooglePrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasGoogleClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasGoogleSheetsId: !!process.env.GOOGLE_SHEETS_SHEET_ID,
      nodeEnv: process.env.NODE_ENV,
      runtime: 'netlify-functions',
      lambdaRuntime: process.env.AWS_LAMBDA_JS_RUNTIME || 'not-set',
      nodeVersion: process.env.NODE_VERSION || 'not-set'
    }

    return NextResponse.json(
      { 
        message: 'AI 채용 브랜딩 강의 신청 API',
        methods: ['POST'],
        version: '4.0.0',
        status: 'running',
        environment: envCheck,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'API 상태 확인 중 오류 발생',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 