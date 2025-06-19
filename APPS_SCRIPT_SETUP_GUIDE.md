# 방법 1: 웹폼에서 Apps Script 직접 호출 설정 가이드

## 개요
이 방법은 웹폼에서 Google Sheets API를 거치지 않고 Google Apps Script 웹 앱을 직접 호출하여 데이터 저장과 AI 자동화를 동시에 실행하는 방식입니다.

## 장점
- ✅ 완전한 자동화 (데이터 저장 + AI 메시지 생성 + 이메일 발송)
- ✅ 트리거 문제 해결 (직접 호출)
- ✅ 단일 요청으로 모든 처리 완료
- ✅ 실시간 처리 및 즉시 피드백

## 설정 단계

### 1단계: Google Apps Script 웹 앱 생성

1. **Google Apps Script 접속**
   - https://script.google.com 접속
   - 새 프로젝트 생성

2. **스크립트 코드 추가**
   - 기존 Code.gs 내용을 모두 삭제
   - `google-apps-script-webapp.gs` 파일의 내용을 복사하여 붙여넣기

3. **설정 확인**
   ```javascript
   const CONFIG = {
     GEMINI_API_KEY: 'AIzaSyAQ-Rgzs2qaJ8gFfLCRFjDhKowjCYhhWiQ',
     SHEET_ID: '1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk',
     // ... 기타 설정
   };
   ```

### 2단계: 웹 앱 배포

1. **배포 준비**
   - 스크립트 저장 (Ctrl+S)
   - 프로젝트 이름 설정: "AI 채용 브랜딩 웹 앱"

2. **배포 실행**
   - 우상단 "배포" → "새 배포" 클릭
   - 유형 선택: "웹 앱"
   - 설명: "AI 채용 브랜딩 폼 처리"
   - 실행 계정: "나"
   - 액세스 권한: "모든 사용자"
   - **중요**: "모든 사용자"로 설정해야 외부 웹사이트에서 접근 가능

3. **웹 앱 URL 복사**
   - 배포 완료 후 웹 앱 URL 복사
   - 형식: `https://script.google.com/macros/s/AKfycby...../exec`

### 3단계: 환경변수 설정

1. **로컬 개발환경 (.env.local 파일)**
   ```env
   # Google Apps Script 웹 앱 URL
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```

2. **Netlify 배포환경**
   - Netlify 대시보드 → Site settings → Environment variables
   - 새 변수 추가:
     - Name: `GOOGLE_APPS_SCRIPT_URL`
     - Value: `https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec`

### 4단계: Google Sheets 권한 설정

1. **Sheets 접근**
   - Google Sheets ID: `1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk`
   - 스크립트 실행 시 권한 승인 필요

2. **권한 승인**
   - Apps Script에서 "testFunction" 실행
   - Google 계정 로그인 및 권한 승인
   - Sheets, Gmail 액세스 권한 허용

### 5단계: 테스트 실행

1. **Apps Script 테스트**
   ```javascript
   // Apps Script 편집기에서 실행
   function testFunction() {
     // 테스트 코드 실행
   }
   ```

2. **웹 앱 테스트**
   - 브라우저에서 웹 앱 URL 접속
   - 상태 확인 메시지 출력 확인

3. **웹폼 테스트**
   - 로컬 개발 서버 실행: `npm run dev`
   - 폼 제출 테스트
   - 콘솔에서 "Apps Script 처리 성공" 메시지 확인

### 6단계: 동작 확인

1. **데이터 저장 확인**
   - Google Sheets에서 새 행 추가 확인
   - 타임스탬프, 사용자 데이터 정확성 확인

2. **AI 메시지 생성 확인**
   - J열에 AI 생성 메시지 확인
   - L열에 체크박스 생성 확인
   - K열에 "AI 메시지 생성됨" 상태 확인

3. **이메일 발송 테스트**
   - L열 체크박스 체크
   - 자동 이메일 발송 확인
   - M열에 이메일 발송 여부 확인

## 문제 해결

### 일반적인 오류

1. **CORS 오류**
   ```
   Access to fetch at '...' from origin '...' has been blocked by CORS policy
   ```
   - **해결책**: Apps Script 배포 시 "모든 사용자" 권한 설정

2. **Apps Script 404 오류**
   ```
   Apps Script 응답 오류: 404
   ```
   - **해결책**: 웹 앱 URL 확인 및 재배포

3. **권한 오류**
   ```
   Exception: You do not have permission to call...
   ```
   - **해결책**: Apps Script에서 권한 재승인

### 디버깅 방법

1. **Apps Script 로그 확인**
   - Apps Script 편집기 → 실행 → 로그 확인
   - `console.log()` 출력 내용 검토

2. **웹 브라우저 개발자 도구**
   - Network 탭에서 Apps Script 요청/응답 확인
   - Console 탭에서 오류 메시지 확인

3. **단계별 테스트**
   ```javascript
   // 1. 기본 연결 테스트
   GET https://your-apps-script-url/exec
   
   // 2. 데이터 전송 테스트
   POST https://your-apps-script-url/exec
   Content-Type: application/json
   Body: {"name":"테스트","email":"test@test.com",...}
   ```

## 보안 고려사항

1. **API 키 보안**
   - Gemini API 키는 Apps Script 내부에서만 사용
   - 웹 클라이언트에 노출되지 않음

2. **CORS 설정**
   - Apps Script에서 적절한 CORS 헤더 설정
   - 필요시 특정 도메인으로 제한 가능

3. **입력 검증**
   - Apps Script에서 입력 데이터 검증
   - 악의적인 요청 필터링

## 유지보수

1. **정기 점검**
   - AI API 호출 한도 모니터링
   - 이메일 발송 한도 확인
   - 에러 로그 정기 검토

2. **백업 계획**
   - Apps Script 코드 백업
   - Google Sheets 데이터 백업
   - 환경변수 설정 문서화

## 다음 단계

구현이 완료되면:
1. 실제 운영환경에서 테스트
2. 모니터링 및 로깅 강화
3. 사용자 피드백 수집
4. 성능 최적화 검토 