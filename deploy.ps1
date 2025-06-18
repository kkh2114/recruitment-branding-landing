# 🚀 AI 채용 브랜딩 강의 - 자동 배포 스크립트
# PowerShell 스크립트

Write-Host "🚀 AI 채용 브랜딩 강의 - GitHub + Netlify 자동 배포" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green

# 1. GitHub 저장소 생성 안내
Write-Host "`n📋 1단계: GitHub 저장소 생성" -ForegroundColor Yellow
Write-Host "다음 링크를 클릭하여 GitHub 저장소를 생성해주세요:" -ForegroundColor White
Write-Host "🔗 https://github.com/new" -ForegroundColor Cyan

Write-Host "`n⚙️ 저장소 설정:" -ForegroundColor White
Write-Host "  - Repository name: recruitment-branding-landing" -ForegroundColor Gray
Write-Host "  - Description: AI 채용 브랜딩 강의 랜딩페이지" -ForegroundColor Gray
Write-Host "  - ✅ Public" -ForegroundColor Gray
Write-Host "  - ❌ Add a README file (체크 해제!)" -ForegroundColor Gray
Write-Host "  - ❌ Add .gitignore (체크 해제!)" -ForegroundColor Gray
Write-Host "  - ❌ Choose a license (체크 해제!)" -ForegroundColor Gray

# 사용자 입력 대기
Write-Host "`n⏳ GitHub 저장소 생성이 완료되면 아무 키나 눌러주세요..." -ForegroundColor Yellow
Read-Host "Press Enter to continue"

# 2. Git 설정
Write-Host "`n📋 2단계: Git 설정 및 커밋" -ForegroundColor Yellow

# 필요한 파일만 추가
Write-Host "📁 필요한 파일들을 Git에 추가 중..." -ForegroundColor White
git add .gitignore
git add package.json
git add package-lock.json
git add next.config.mjs
git add tailwind.config.js
git add postcss.config.js
git add tsconfig.json
git add netlify.toml
git add google-apps-script-optimized.gs
git add README.md
git add DEPLOYMENT_GUIDE.md
git add app/
git add components/
git add lib/

# 커밋
Write-Host "💾 변경사항 커밋 중..." -ForegroundColor White
git commit -m "feat: complete AI recruitment branding landing page

✨ Features:
- Next.js 15 + TypeScript + Tailwind CSS
- AI-powered application form with Gemini integration
- Google Sheets automation with Apps Script
- Responsive design with modern UI components
- Email automation system
- Real-time form validation
- SEO optimized

🔧 Technical:
- Server-side API routes
- Google APIs integration
- Automated email templates
- Statistics tracking
- Error handling and logging

🚀 Deployment ready for Netlify"

# 3. GitHub 사용자명 입력
Write-Host "`n📋 3단계: GitHub 정보 입력" -ForegroundColor Yellow
$githubUsername = Read-Host "GitHub 사용자명을 입력해주세요"

# 원격 저장소 설정
$repoUrl = "https://github.com/$githubUsername/recruitment-branding-landing.git"
Write-Host "🔗 원격 저장소 설정: $repoUrl" -ForegroundColor White

git remote remove origin 2>$null
git remote add origin $repoUrl

# 4. GitHub에 푸시
Write-Host "`n📋 4단계: GitHub에 푸시" -ForegroundColor Yellow
Write-Host "📤 코드를 GitHub에 업로드 중..." -ForegroundColor White

try {
    git push -u origin main
    Write-Host "✅ GitHub 푸시 성공!" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub 푸시 실패. 저장소가 올바르게 생성되었는지 확인해주세요." -ForegroundColor Red
    Write-Host "수동으로 다음 명령어를 실행해주세요:" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Cyan
    exit 1
}

# 5. Netlify 배포 안내
Write-Host "`n📋 5단계: Netlify 배포" -ForegroundColor Yellow
Write-Host "🌐 Netlify에서 자동 배포를 설정합니다:" -ForegroundColor White
Write-Host "1. https://app.netlify.com 접속" -ForegroundColor Gray
Write-Host "2. 'New site from Git' 클릭" -ForegroundColor Gray
Write-Host "3. 'GitHub' 선택" -ForegroundColor Gray
Write-Host "4. 'recruitment-branding-landing' 저장소 선택" -ForegroundColor Gray
Write-Host "5. 빌드 설정:" -ForegroundColor Gray
Write-Host "   - Build command: npm run build" -ForegroundColor Gray
Write-Host "   - Publish directory: .next" -ForegroundColor Gray
Write-Host "6. 'Deploy site' 클릭" -ForegroundColor Gray

Write-Host "`n🔗 Netlify 배포 링크:" -ForegroundColor Cyan
Write-Host "https://app.netlify.com/start/deploy?repository=$repoUrl" -ForegroundColor Cyan

# 6. 환경 변수 설정 안내
Write-Host "`n📋 6단계: 환경 변수 설정 (선택사항)" -ForegroundColor Yellow
Write-Host "Netlify 사이트 설정에서 다음 환경 변수를 설정해주세요:" -ForegroundColor White
Write-Host "- GOOGLE_SHEETS_API_KEY: Google Sheets API 키" -ForegroundColor Gray
Write-Host "- GEMINI_API_KEY: Google Gemini AI API 키" -ForegroundColor Gray
Write-Host "- NEXT_PUBLIC_SITE_URL: 배포된 사이트 URL" -ForegroundColor Gray

# 완료 메시지
Write-Host "`n🎉 배포 프로세스 완료!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green
Write-Host "✅ GitHub 저장소: $repoUrl" -ForegroundColor Green
Write-Host "🚀 Netlify에서 자동 빌드 및 배포가 진행됩니다." -ForegroundColor Green
Write-Host "📊 배포 상태는 Netlify 대시보드에서 확인할 수 있습니다." -ForegroundColor Green

Write-Host "`n📚 추가 정보:" -ForegroundColor Yellow
Write-Host "- 빌드 시간: 약 2-3분" -ForegroundColor Gray
Write-Host "- 자동 배포: GitHub 푸시 시마다 자동 재배포" -ForegroundColor Gray
Write-Host "- SSL 인증서: Netlify에서 자동 제공" -ForegroundColor Gray
Write-Host "- 커스텀 도메인: Netlify 설정에서 추가 가능" -ForegroundColor Gray

Write-Host "`n배포 가이드가 완료되었습니다!" -ForegroundColor Yellow 