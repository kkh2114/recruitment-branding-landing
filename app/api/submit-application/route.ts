// Netlify Functions에서 googleapis 패키지 사용을 위한 Node.js 런타임 설정
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
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

    // 환경변수에서 Service Account 정보 가져오기 (Netlify 최적화)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    if (!privateKey) {
      console.error('GOOGLE_PRIVATE_KEY 환경변수가 설정되지 않았습니다.')
      return NextResponse.json(
        { 
          success: false, 
          message: '서버 설정 오류입니다. 관리자에게 문의하세요.' 
        },
        { status: 500 }
      )
    }

    // Netlify 환경에서 줄바꿈 문자 처리
    const processedPrivateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')

    const credentials = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID || "recruitment-branding",
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: processedPrivateKey,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
      universe_domain: "googleapis.com"
    }

    // 필수 환경변수 체크
    if (!credentials.private_key || !credentials.client_email) {
      console.error('필수 환경변수가 설정되지 않았습니다:', {
        hasPrivateKey: !!credentials.private_key,
        hasClientEmail: !!credentials.client_email
      })
      return NextResponse.json(
        { 
          success: false, 
          message: '서버 설정 오류입니다. 관리자에게 문의하세요.' 
        },
        { status: 500 }
      )
    }

    console.log('인증 정보 확인:', {
      type: credentials.type,
      project_id: credentials.project_id,
      client_email: credentials.client_email,
      hasPrivateKey: !!credentials.private_key,
      privateKeyLength: credentials.private_key?.length,
      environment: process.env.NODE_ENV || 'development'
    })

    // Google Sheets 인증 설정 (Netlify Functions 최적화)
    let auth, sheets
    try {
      // JWT 방식으로 직접 인증 (Netlify Functions에서 더 안정적)
      const jwtClient = new google.auth.JWT(
        credentials.client_email,
        undefined,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets'],
        undefined
      )

      // 명시적으로 인증 실행
      await jwtClient.authorize()
      console.log('JWT 인증 성공')

      sheets = google.sheets({ 
        version: 'v4', 
        auth: jwtClient 
      })
    } catch (authError) {
      console.error('Google 인증 실패:', authError)
      return NextResponse.json(
        { 
          success: false, 
          message: '구글 인증에 실패했습니다. 관리자에게 문의하세요.' 
        },
        { status: 500 }
      )
    }

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

    // 구글 시트에 추가할 데이터 준비
    const values = [
      [
        timestamp,                              // 신청일시
        applicationData.name,                   // 이름
        applicationData.email,                  // 이메일
        applicationData.phone,                  // 전화번호
        applicationData.company,                // 회사명
        applicationData.position,               // 직책
        applicationData.concern || '',          // 채용 관련 고민
        applicationData.industry || '',         // 업종/산업군
        applicationData.memo || '',             // 기타 문의사항
        '대기',                                 // 처리 상태
        '',                                     // AI생성메시지 (Apps Script에서 처리)
        'FALSE',                                // 검토완료 (체크박스)
        '대기',                                 // 발송상태
      ],
    ]

    console.log('시트에 추가할 데이터:', values)

    // 구글 시트 ID
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID || '1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk'
    console.log('사용할 시트 ID:', sheetId)

    // 먼저 시트 정보 확인
    try {
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      })
      console.log('시트 정보:', {
        title: sheetInfo.data.properties?.title,
        sheets: sheetInfo.data.sheets?.map(sheet => ({
          title: sheet.properties?.title,
          sheetId: sheet.properties?.sheetId
        }))
      })
    } catch (infoError) {
      console.log('시트 정보 조회 실패:', infoError)
    }

    // 구글 시트에 데이터 추가
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: '강의참석자명단!A:M', // 올바른 시트 이름으로 범위 지정
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    })

    console.log('구글 시트 추가 결과:', {
      status: result.status,
      statusText: result.statusText,
      updatedRows: result.data.updates?.updatedRows,
      updatedRange: result.data.updates?.updatedRange,
      updatedCells: result.data.updates?.updatedCells
    })

    return NextResponse.json(
      { 
        success: true, 
        message: '신청이 성공적으로 완료되었습니다.',
        timestamp 
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
        timestamp: new Date().toISOString()
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
      runtime: 'netlify-functions'
    }

    return NextResponse.json(
      { 
        message: 'AI 채용 브랜딩 강의 신청 API',
        methods: ['POST'],
        version: '3.0.0',
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