# 🚀 AI 채용 브랜딩 강의 랜딩페이지

**인재가 먼저 찾아오는 회사 만들기** - 가인지 제주 포럼 특별강의

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)

## ✨ 프로젝트 소개

**AI 채용 브랜딩 강의**를 위한 완전한 한국어 랜딩페이지입니다. Next.js 15와 TypeScript로 구축되었으며, Google Sheets 자동 연동과 Gemini AI를 활용한 개인 맞춤 환영 메시지 시스템을 포함합니다.

### 🎯 주요 특징

- ✅ **완전한 한국어 UI/UX** - 한국 기업 대상 최적화
- 🤖 **AI 기반 자동화** - Gemini API 연동 개인 맞춤 메시지
- 📊 **Google Sheets 연동** - 실시간 신청자 데이터 관리
- 📱 **반응형 디자인** - 모든 디바이스 완벽 지원
- 🔐 **보안 최적화** - 환경변수 기반 인증 시스템
- ⚡ **초고속 배포** - Netlify 원클릭 배포

## 🛠 기술 스택

### **Frontend**
- **Next.js 15** - React 서버 컴포넌트 및 App Router
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 퍼스트 스타일링
- **shadcn/ui** - 모던 UI 컴포넌트
- **Lucide React** - 아이콘 시스템

### **Backend & APIs**
- **Google Sheets API** - 데이터 저장 및 관리
- **Google Apps Script** - 자동화 워크플로우
- **Gemini AI API** - 개인 맞춤 메시지 생성
- **Zod** - 런타임 데이터 검증

### **배포 & DevOps**
- **Netlify** - 서버리스 배포
- **GitHub** - 버전 관리
- **환경변수** - 보안 설정 관리

## 📋 강의 내용

### 🎓 **학습 목표**
- 채용 브랜딩의 핵심 원리 이해
- AI 도구를 활용한 효과적인 채용공고 작성법
- 회사만의 매력적인 스토리텔링 기법
- 실무에서 바로 적용 가능한 템플릿 활용

### 💎 **특별 혜택**
- AI 채용공고 작성 템플릿 제공
- 1:1 맞춤 컨설팅 (30분)
- 채용 브랜딩 체크리스트
- 강의 자료 평생 소장

## 🚀 빠른 시작

### **1. 저장소 클론**
```bash
git clone https://github.com/kkh2114/recruitment-branding-landing.git
cd recruitment-branding-landing
```

### **2. 의존성 설치**
```bash
npm install
# 또는
yarn install
```

### **3. 환경변수 설정**
`.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Google Sheets 인증
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[여기에 실제 키 입력]\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL="sheets-service@recruitment-branding.iam.gserviceaccount.com"
GOOGLE_SHEETS_ID="1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk"

# Gemini AI
GEMINI_API_KEY="AIzaSyAQ-Rgzs2qaJ8gFfLCRFjDhKowjCYhhWiQ"
```

### **4. 개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📦 배포

### **Netlify 배포 (권장)**

1. **GitHub에 푸시**
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. **Netlify 연결**
   - https://netlify.com → GitHub 로그인
   - `New site from Git` → 저장소 선택
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **환경변수 설정**
   - Site settings → Environment variables
   - 위의 환경변수들을 모두 추가

### **기타 배포 옵션**
- **Vercel**: `vercel --prod`
- **AWS Amplify**: Git 연동 지원
- **Google Cloud Run**: 컨테이너 배포

## 🔧 설정 및 커스터마이징

### **Google Sheets 설정**
1. Google Cloud Console에서 프로젝트 생성
2. Sheets API 활성화
3. Service Account 생성 및 키 다운로드
4. Sheets에 Service Account 이메일 편집 권한 부여

### **Gemini AI 설정**
1. Google AI Studio에서 API 키 생성
2. 환경변수에 API 키 추가

### **디자인 커스터마이징**
- `tailwind.config.js`: 색상 및 테마 수정
- `app/globals.css`: 글로벌 스타일
- `components/ui/`: UI 컴포넌트 수정

## 📊 프로젝트 구조

```
recruitment-branding-landing/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   └── application-form.tsx # 신청 폼
├── lib/                   # 유틸리티 함수
├── google-apps-script-optimized.gs # 자동화 스크립트
├── netlify.toml          # Netlify 설정
└── DEPLOYMENT_GUIDE.md   # 배포 가이드
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💼 강사 정보

**김길호 대표** - 에스유디자인(주)
- 📧 이메일: contact@sudesign.co.kr
- 🌐 웹사이트: https://sudesign.co.kr
- 💼 LinkedIn: [김길호](https://linkedin.com/in/gilho-kim)

## 🆘 지원 및 문의

- 📖 **문서**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🐛 **버그 리포트**: [Issues](https://github.com/kkh2114/recruitment-branding-landing/issues)
- 💬 **문의**: recruitment-support@sudesign.co.kr

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요! ⭐**

![Footer](https://img.shields.io/badge/Made%20with-❤️-red.svg)
![Korean](https://img.shields.io/badge/Made%20for-🇰🇷%20Korean%20Companies-blue.svg)

</div> 