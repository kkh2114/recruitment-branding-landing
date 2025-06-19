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

    // 환경변수 확인
    const serviceAccountEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID

    let auth

    // 1. 환경변수 방식 우선 시도 (Netlify 배포용)
    if (serviceAccountEmail && privateKey && sheetId) {
      console.log('환경변수 방식으로 인증 시작...')
      
      // Private Key 처리 (한 줄로 입력된 키의 개행 문자 복원)
      let formattedPrivateKey = privateKey
      
      // 이미 줄바꿈이 있는 경우와 \n으로 표시된 경우 모두 처리
      if (!formattedPrivateKey.includes('\n') && formattedPrivateKey.includes('\\n')) {
        formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n')
      }
      
      // BEGIN과 END가 제대로 줄바꿈되었는지 확인
      if (!formattedPrivateKey.startsWith('-----BEGIN PRIVATE KEY-----\n')) {
        formattedPrivateKey = formattedPrivateKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      }
      if (!formattedPrivateKey.endsWith('\n-----END PRIVATE KEY-----')) {
        formattedPrivateKey = formattedPrivateKey.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----')
      }
      
      console.log('Private Key 포맷 처리 완료')
      
      auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: serviceAccountEmail,
          private_key: formattedPrivateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
    } 
    // 2. Service Account 파일 방식 (로컬 개발용)
    else {
      const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json')
      
      if (!fs.existsSync(serviceAccountPath)) {
        console.log('Service Account 파일 및 환경변수 모두 없음')
        return NextResponse.json(
          { error: 'Service Account 설정이 필요합니다.' },
          { status: 500 }
        )
      }

      console.log('Service Account 파일 방식으로 인증 시작...')
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
      
      auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
    }

    if (!sheetId) {
      console.log('GOOGLE_SHEETS_SHEET_ID 환경변수가 필요합니다.')
      return NextResponse.json(
        { error: '환경변수 설정이 필요합니다.' },
        { status: 500 }
      )
    }

    console.log('Google Sheets API 인증 완료')
    console.log('Google Sheets API 클라이언트 생성...')

    const sheets = google.sheets({ version: 'v4', auth })

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
    // 환경변수 확인
    const envStatus = {
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEETS_SHEET_ID: !!process.env.GOOGLE_SHEETS_SHEET_ID
    }

    // Service Account 파일 존재 여부 확인
    const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json')
    const fileExists = fs.existsSync(serviceAccountPath)

    return NextResponse.json({
      message: 'Google Sheets API 연결 테스트',
      status: 'OK',
      environment: envStatus,
      serviceAccountFile: fileExists,
      authMethod: envStatus.GOOGLE_CLIENT_EMAIL ? 'environment' : (fileExists ? 'file' : 'none'),
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 