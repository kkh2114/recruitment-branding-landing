# 🚀 빠른 배포 가이드

## 📋 GitHub + Netlify 배포 (5분 완성)

### 1️⃣ GitHub 저장소 생성
1. **GitHub 접속**: https://github.com/new
2. **저장소 설정**:
   - Repository name: `recruitment-branding-landing`
   - Description: `AI 채용 브랜딩 강의 랜딩페이지`
   - ✅ Public
   - ❌ **모든 체크박스 해제** (README, .gitignore, license)
3. **"Create repository" 클릭**

### 2️⃣ GitHub에 코드 업로드
```bash
# GitHub 사용자명을 입력하세요
git remote remove origin
git remote add origin https://github.com/{YOUR_USERNAME}/recruitment-branding-landing.git
git push -u origin main
```

### 3️⃣ Netlify 자동 배포
1. **Netlify 접속**: https://app.netlify.com
2. **"New site from Git" 클릭**
3. **GitHub 연결**: "GitHub" 선택
4. **저장소 선택**: `recruitment-branding-landing` 선택
5. **빌드 설정**:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **"Deploy site" 클릭**

### 4️⃣ 배포 완료! 🎉
- 📊 **빌드 시간**: 2-3분
- 🔄 **자동 배포**: GitHub 푸시 시마다 자동 재배포
- 🔒 **SSL**: 자동 제공
- 🌐 **도메인**: `{random-name}.netlify.app`

---

## 🔧 환경 변수 설정 (선택사항)

Netlify 사이트 설정 → Environment variables:
- `GOOGLE_SHEETS_API_KEY`: Google Sheets API 키
- `GEMINI_API_KEY`: Google Gemini AI API 키
- `NEXT_PUBLIC_SITE_URL`: 배포된 사이트 URL

---

## 📱 주요 기능
✨ **AI 채용 신청서**: Gemini AI 연동  
📊 **Google Sheets**: 자동 데이터 저장  
📧 **이메일 자동화**: Apps Script 연동  
🎨 **반응형 디자인**: 모바일 최적화  
⚡ **실시간 검증**: 폼 유효성 검사  

---

## 🆘 문제 해결

### GitHub 푸시 실패 시:
```bash
# 저장소가 올바르게 생성되었는지 확인
git remote -v
git push -u origin main --force
```

### Netlify 빌드 실패 시:
1. Node.js 버전: 18.17.0 이상 확인
2. Build command: `npm run build` 확인
3. Publish directory: `.next` 확인

---

**🎯 배포 성공하면 랜딩페이지가 완성됩니다!** 