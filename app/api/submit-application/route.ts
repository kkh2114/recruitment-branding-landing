// Netlify Functions에서 googleapis 패키지 사용을 위한 Node.js 런타임 설정
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { google } from 'googleapis'
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

    // Service Account JSON 파일 읽기
    const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json')
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.log('Service Account 파일이 없습니다:', serviceAccountPath)
      return NextResponse.json(
        { error: 'Service Account 설정이 필요합니다.' },
        { status: 500 }
      )
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID

    if (!sheetId) {
      console.log('환경변수 누락: GOOGLE_SHEETS_SHEET_ID')
      return NextResponse.json(
        { error: '환경변수 설정이 필요합니다.' },
        { status: 500 }
      )
    }

    console.log('Service Account 파일 읽기 완료')
    console.log('Google Sheets API 인증 시작...')

    // Google Sheets API 클라이언트 생성
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    console.log('Google Sheets API 클라이언트 생성 완료')
    console.log('Google Sheets에 데이터 추가 시도...')
    console.log('Sheet ID:', sheetId)

    // 현재 시간 생성
    const now = new Date()
    const timestamp = now.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    // Google Sheets에 데이터 추가
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:M', // A열부터 M열까지
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp,
          applicationData.name,
          applicationData.email,
          applicationData.phone,
          applicationData.company,
          applicationData.position,
          applicationData.concern || '',
          applicationData.industry || '',
          applicationData.memo || '',
          'Web Form',
          'Pending',
          '',
          ''
        ]]
      },
    })

    console.log('Google Sheets 응답:', response.status)

    return NextResponse.json(
      { 
        message: '신청이 성공적으로 제출되었습니다.',
        success: true 
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
    console.error('Google API 에러:', error)

    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Service Account 파일 존재 여부 확인
    const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json')
    const fileExists = fs.existsSync(serviceAccountPath)
    
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID

    return NextResponse.json({
      message: 'Google Sheets API 연결 테스트',
      status: 'OK',
      serviceAccountFile: fileExists,
      sheetId: !!sheetId,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 