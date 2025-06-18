/** @type {import('next').NextConfig} */
const nextConfig = {
  // 📱 이미지 최적화
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 🔧 빌드 최적화
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 📦 서버 외부 패키지
  serverExternalPackages: ['googleapis'],
  

  
  // ⚡ 성능 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 프로덕션에서 console.log 제거
  },
  
  // 🔒 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // 🔄 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // 📊 웹팩 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // googleapis 패키지 외부 처리
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // 🎯 환경변수 설정
  env: {
    SITE_NAME: 'AI 채용 브랜딩 강의',
    SITE_DESCRIPTION: '인재가 먼저 찾아오는 회사 만들기',
    SITE_URL: 'https://recruitment-branding.netlify.app',
  },
};

export default nextConfig; 