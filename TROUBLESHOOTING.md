# 신청폼 서버 오류 해결 가이드

## 🚨 현재 문제 상황

**에러 메시지**: "서버 오류가 발생했습니다"  
**발생 위치**: 신청폼 제출 시  
**예상 원인**: Google API 인증 실패 (Netlify 환경변수 미설정)

## 🔍 문제 진단

### 1. 에러 로그 확인
- 브라우저 개발자 도구 → Console 탭에서 상세 에러 확인
- 개선된 에러 로깅으로 구체적 원인 파악 가능

### 2. API 엔드포인트 상태
- **파일 위치**: `app/api/submit-application/route.ts`
- **기능**: Google Sheets API 연동을 통한 신청 데이터 저장
- **의존성**: Google Service Account 인증

## 🛠️ 해결 방법

### Step 1: Netlify 환경변수 설정

1. **Netlify 대시보드 접속**
   - https://app.netlify.com
   - 해당 사이트 선택

2. **환경변수 설정 페이지**
   - Site settings → Environment variables

3. **필수 환경변수 추가**
   ```bash
   GOOGLE_PROJECT_ID = recruitment-branding
   GOOGLE_PRIVATE_KEY_ID = [service-account-key.json의 private_key_id]
   GOOGLE_PRIVATE_KEY = [service-account-key.json의 private_key 전체]
   GOOGLE_CLIENT_EMAIL = [service-account-key.json의 client_email]
   GOOGLE_CLIENT_ID = [service-account-key.json의 client_id]
   GOOGLE_CLIENT_X509_CERT_URL = [service-account-key.json의 client_x509_cert_url]
   GOOGLE_SHEETS_SHEET_ID = 1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk
   ```

### Step 2: Google Sheets 권한 설정

1. **Google Sheets 파일 열기**
   - Sheet ID: `1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk`

2. **공유 설정**
   - "공유" 버튼 클릭
   - Service Account 이메일 주소 추가
   - 권한: "편집자" 선택

3. **시트 구조 확인**
   - 시트 이름: `강의참석자명단`
   - 컬럼 순서: A(신청일시) ~ M(발송상태)

### Step 3: 재배포 및 테스트

1. **환경변수 설정 후 자동 재배포 대기**
2. **신청폼 테스트**
3. **Google Sheets에 데이터 저장 확인**

## 📁 관련 파일들

### 로컬 파일 위치
```
recruitment-branding-landing/
├── service-account-key.json           # 메인 Google API 키
├── recruitment-branding-19688c507be4.json  # 백업 키
├── app/api/submit-application/route.ts      # API 엔드포인트
├── components/application-form.tsx          # 신청 폼 컴포넌트
└── google-apps-script-optimized.gs         # Apps Script 코드
```

### API 엔드포인트 구조
```typescript
// POST /api/submit-application
{
  name: string,
  email: string,
  phone: string,
  company: string,
  position: string,
  concern?: string,
  industry?: string,
  memo?: string
}
```

## 🔧 고급 디버깅

### 환경변수 확인 코드
```typescript
// route.ts에 임시 추가하여 환경변수 확인
console.log('Environment check:', {
  hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
  hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
  projectId: process.env.GOOGLE_PROJECT_ID
})
```

### 로컬 테스트
```bash
# 로컬에서 개발 서버 실행
npm run dev

# .env.local 파일 생성하여 환경변수 설정 (로컬 테스트용)
GOOGLE_PROJECT_ID=recruitment-branding
GOOGLE_PRIVATE_KEY_ID=...
# ... 기타 환경변수들
```

## ✅ 해결 확인 체크리스트

- [ ] Netlify 환경변수 설정 완료
- [ ] Google Sheets 공유 권한 부여 완료
- [ ] 사이트 자동 재배포 완료
- [ ] 신청폼 테스트 성공
- [ ] Google Sheets에 데이터 저장 확인
- [ ] 이메일 자동 발송 확인 (Apps Script)

## 🆘 추가 지원

### 예상 해결 시간
- **환경변수 설정**: 5-10분
- **재배포 대기**: 2-3분
- **테스트 및 확인**: 5분
- **총 소요시간**: 15-20분

### 문제 지속 시 확인사항
1. Service Account 키 파일 유효성
2. Google Sheets API 활성화 상태
3. 네트워크 연결 상태
4. Netlify 빌드 로그 확인

---

> **중요**: 환경변수 설정은 한 번만 하면 되며, 설정 후에는 모든 신청폼이 정상 작동합니다. 