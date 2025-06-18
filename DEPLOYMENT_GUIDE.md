# 🚀 AI 채용 브랜딩 강의 랜딩페이지 배포 가이드

## 📋 1단계: GitHub 저장소 생성 및 연결

### 1.1 GitHub 저장소 생성
1. https://github.com 접속
2. 우측 상단 `+` 버튼 → `New repository` 클릭
3. Repository name: `recruitment-branding-landing`
4. **Public** 선택
5. ⚠️ **아무것도 체크하지 말고** `Create repository` 클릭

### 1.2 로컬 저장소와 연결
```bash
# 새로 생성한 저장소 URL로 변경
git remote add origin https://github.com/YOUR_USERNAME/recruitment-branding-landing.git
git push -u origin main
```

## 🌐 2단계: Netlify 배포

### 2.1 Netlify 계정 생성 및 연결
1. https://netlify.com 접속
2. GitHub 계정으로 로그인
3. `New site from Git` 클릭
4. GitHub 선택
5. `recruitment-branding-landing` 저장소 선택

### 2.2 빌드 설정
```
Build command: npm run build
Publish directory: .next
```

### 2.3 환경 변수 설정 (중요!)
Netlify 대시보드에서 **Site settings → Environment variables**에 다음 추가:

```env
# Google Sheets 인증
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[여기에 실제 키 입력]\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL="sheets-service@recruitment-branding.iam.gserviceaccount.com"
GOOGLE_SHEETS_ID="1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk"

# Gemini AI
GEMINI_API_KEY="AIzaSyAQ-Rgzs2qaJ8gFfLCRFjDhKowjCYhhWiQ"

# 기타 설정
NODE_VERSION="18.17.0"
```

⚠️ **중요:** 환경 변수 설정 없이는 신청 폼이 작동하지 않습니다!

## 🔗 3단계: 도메인 설정 (선택사항)

### 3.1 무료 Netlify 도메인
- 자동 생성: `https://amazing-name-123456.netlify.app`

### 3.2 커스텀 도메인 연결
1. Netlify 대시보드 → Domain settings
2. Add custom domain
3. DNS 설정 업데이트

## ✅ 배포 확인 체크리스트

- [ ] GitHub 저장소 생성 완료
- [ ] 코드 푸시 완료
- [ ] Netlify 연결 완료
- [ ] 환경 변수 설정 완료
- [ ] 빌드 성공 확인
- [ ] 신청 폼 테스트 완료
- [ ] Google Sheets 연동 확인

## 🆘 문제 해결

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build
```

### 환경 변수 오류
- Netlify 환경 변수가 올바르게 설정되었는지 확인
- Private Key에 `\n` 개행 문자가 포함되어 있는지 확인

### API 오류
- Google Sheets ID 확인
- Service Account 권한 확인

## 📞 지원

배포 중 문제가 있으면 언제든 말씀해주세요!

---
**최종 배포 URL:** https://recruitment-branding.netlify.app 