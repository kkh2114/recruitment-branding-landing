// Apps Script 웹 앱 직접 호출 방식
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { z } from 'zod'
import path from 'path'
import fs from 'fs'

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

    console.log('신청 데이터 수신:', applicationData)

    // 환경변수 확인
    const serviceAccountKeyPath = path.join(process.cwd(), 'service-account-key.json')
    const hasServiceAccountFile = fs.existsSync(serviceAccountKeyPath)
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID

    console.log('환경변수 확인:', {
      hasServiceAccountFile,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey,
      sheetId: !!sheetId
    })

    if (!sheetId) {
      throw new Error('Google Sheets ID가 설정되지 않았습니다.')
    }

    let auth

    // Service Account 인증 (파일 우선, 환경변수 대체)
    if (hasServiceAccountFile) {
      console.log('Service Account 파일 사용')
      auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountKeyPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      })
    } else if (clientEmail && privateKey) {
      console.log('환경변수 Service Account 사용')
      const processedPrivateKey = privateKey.replace(/\\n/g, '\n')
      
      auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: processedPrivateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      })
    } else {
      throw new Error('Google 인증 정보가 설정되지 않았습니다.')
    }

    console.log('Google Sheets API 인증 시작...')
    
    const sheets = google.sheets({ version: 'v4', auth })
    console.log('Google Sheets API 클라이언트 생성 완료')

    // 현재 시간
    const now = new Date()
    const timestamp = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })

    // Google Sheets에 추가할 데이터
    const values = [
      [
        timestamp,
        applicationData.name,
        applicationData.email,
        applicationData.phone,
        applicationData.company,
        applicationData.position,
        applicationData.concern || '',
        applicationData.industry || '',
        applicationData.memo || '',
        '신규', // 상태
        '', // AI 메시지
        '', // 검토 완료
        '' // 이메일 발송
      ]
    ]

    console.log('Google Sheets에 데이터 추가 시도...')
    console.log('Sheet ID:', sheetId)

    // Google Sheets에 데이터 추가
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:M', // A열부터 M열까지
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values
      }
    })

    console.log('Google Sheets 응답:', response.status)
    console.log('추가된 행:', response.data.updates?.updatedRows)

    return NextResponse.json(
      { 
        message: '신청이 성공적으로 제출되었습니다.',
        success: true,
        timestamp: timestamp
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Error submitting application:', error)
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })

    // 에러 타입별 처리
    let errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    let statusCode = 500

    if (error.name === 'ZodError') {
      errorMessage = '입력 데이터가 올바르지 않습니다. 모든 필수 필드를 확인해주세요.'
      statusCode = 400
    } else if (error.message.includes('Login Required') || error.message.includes('인증')) {
      errorMessage = 'Google Sheets 인증에 실패했습니다. 관리자에게 문의해주세요.'
      statusCode = 401
    } else if (error.message.includes('DECODER routines')) {
      errorMessage = 'Google 인증 키 설정에 문제가 있습니다. 관리자에게 문의해주세요.'
      statusCode = 500
    }

    console.log('Google API 에러:', error)

    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    )
  }
}

export async function GET() {
  try {
    console.log('API 상태 확인 요청')
    
    // 환경변수 확인
    const serviceAccountKeyPath = path.join(process.cwd(), 'service-account-key.json')
    const hasServiceAccountFile = fs.existsSync(serviceAccountKeyPath)
    
    const apiKey = process.env.GOOGLE_API_KEY
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY

    return NextResponse.json(
      { 
        status: 'healthy',
        message: 'API가 정상적으로 작동 중입니다.',
        config: {
          hasServiceAccountFile,
          hasApiKey: !!apiKey,
          hasSheetId: !!sheetId,
          hasClientEmail: !!clientEmail,
          hasPrivateKey: !!privateKey
        },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('API 상태 확인 오류:', error)
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'API 연결에 문제가 있습니다.',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 