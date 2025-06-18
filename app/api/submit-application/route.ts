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

    // 환경변수에서 Service Account 정보 가져오기
    const credentials = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID || "recruitment-branding",
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
      hasPrivateKey: !!credentials.private_key
    })

    // Google Sheets 인증 설정
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

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

    return NextResponse.json(
      { 
        success: false, 
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      },
      { status: 500 }
    )
  }
}

// GET 요청에 대한 기본 응답
export async function GET() {
  return NextResponse.json(
    { 
      message: 'AI 채용 브랜딩 강의 신청 API',
      methods: ['POST'],
      version: '2.0.0'
    },
    { status: 200 }
  )
} 