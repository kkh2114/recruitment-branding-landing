// Netlify Functions에서 googleapis 패키지 사용을 위한 Node.js 런타임 설정
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { google } from 'googleapis'

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

    // 상세한 환경변수 디버깅
    console.log('환경변수 상세 확인:', {
      hasPrivateKey: !!requiredEnvVars.GOOGLE_PRIVATE_KEY,
      privateKeyLength: requiredEnvVars.GOOGLE_PRIVATE_KEY?.length || 0,
      hasClientEmail: !!requiredEnvVars.GOOGLE_CLIENT_EMAIL,
      clientEmail: requiredEnvVars.GOOGLE_CLIENT_EMAIL,
      hasSheetId: !!requiredEnvVars.GOOGLE_SHEETS_SHEET_ID,
      sheetId: requiredEnvVars.GOOGLE_SHEETS_SHEET_ID,
      environment: process.env.NODE_ENV || 'development'
    })

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        console.error(`필수 환경변수 ${key}가 설정되지 않았습니다.`)
        return NextResponse.json(
          { 
            success: false, 
            message: `서버 설정 오류입니다. 환경변수 ${key}가 누락되었습니다.`,
            missingVar: key,
            debug: {
              hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
              hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
              hasSheetId: !!process.env.GOOGLE_SHEETS_SHEET_ID
            }
          },
          { status: 500 }
        )
      }
    }

    console.log('환경변수 확인 완료')

    // Google Sheets API 설정
    console.log('Google Sheets API 인증 시작...')
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: requiredEnvVars.GOOGLE_CLIENT_EMAIL!,
        private_key: requiredEnvVars.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    console.log('Google Sheets API 인증 성공')

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

    // 새 행 데이터
    const values = [[
      timestamp, // A: 신청일시
      applicationData.name, // B: 이름
      applicationData.email, // C: 이메일
      applicationData.phone, // D: 전화번호
      applicationData.company, // E: 회사명
      applicationData.position, // F: 직책
      applicationData.concern || '', // G: 채용 관련 고민
      applicationData.industry || '', // H: 업종/산업군
      applicationData.memo || '', // I: 기타 문의사항
      '대기', // J: 처리 상태
      '', // K: AI생성메시지
      'FALSE', // L: 검토완료
      '대기' // M: 발송상태
    ]]

    console.log('Google Sheets에 데이터 추가 시도...')
    
    // Google Sheets에 데이터 추가
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: requiredEnvVars.GOOGLE_SHEETS_SHEET_ID!,
      range: 'A:M', // A열부터 M열까지
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: values,
      },
    })

    console.log('데이터 추가 성공:', {
      updatedRows: response.data.updates?.updatedRows,
      updatedRange: response.data.updates?.updatedRange,
      timestamp
    })

    return NextResponse.json(
      { 
        success: true, 
        message: '신청이 성공적으로 완료되었습니다.',
        timestamp,
        updatedRange: response.data.updates?.updatedRange
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error submitting application:', error)
    
    // 상세한 에러 정보 로깅
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
          errorCode: (error as any).code,
          errorMessage: (error as any).message
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
      hasGooglePrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasGoogleClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasGoogleSheetsId: !!process.env.GOOGLE_SHEETS_SHEET_ID,
      nodeEnv: process.env.NODE_ENV,
      runtime: 'netlify-functions'
    }

    return NextResponse.json(
      { 
        message: 'AI 채용 브랜딩 강의 신청 API',
        methods: ['POST'],
        version: '5.0.0',
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