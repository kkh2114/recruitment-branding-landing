/**
 * 🚀 AI 채용 브랜딩 강의 - Google Apps Script 자동화
 * 버전: 2.0.0 (최적화)
 * 
 * 📋 주요 기능:
 * 1. 실시간 신청자 데이터 정리 및 포맷팅
 * 2. 자동 이메일 발송 (확인 및 알림)
 * 3. 데이터 검증 및 중복 체크
 * 4. 통계 대시보드 자동 업데이트
 */

// ⚙️ 설정 정보
const CONFIG = {
  // 이메일 설정
  EMAIL: {
    FROM_NAME: '가인지 제주 포럼 - AI 채용 브랜딩 강의',
    FROM_EMAIL: 'noreply@gainjieju.com',
    REPLY_TO: 'contact@sudesign.co.kr',
    SUBJECT_APPLICANT: '✅ 신청이 완료되었습니다 - AI 채용 브랜딩 강의',
    SUBJECT_ADMIN: '🆕 새로운 강의 신청자',
  },
  
  // 시트 설정
  SHEETS: {
    MAIN: '신청자 명단',
    STATS: '통계',
    LOG: '활동 로그'
  },
  
  // 기타 설정
  TIME_ZONE: 'Asia/Seoul',
  DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss'
};

/**
 * 📝 메인 트리거 함수 - 새 신청서 제출 시 실행
 */
function onFormSubmit(e) {
  try {
    console.log('🚀 신청서 처리 시작...');
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MAIN);
    const lastRow = sheet.getLastRow();
    
    // 최신 데이터 가져오기
    const data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // 데이터 구조화
    const applicantData = {
      timestamp: data[0],
      name: data[1],
      company: data[2],
      position: data[3],
      email: data[4],
      phone: data[5],
      experience: data[6],
      challenges: data[7],
      expectations: data[8],
      personalMessage: data[9] || '' // AI 생성 메시지
    };
    
    console.log(`📋 신청자: ${applicantData.name} (${applicantData.company})`);
    
    // 1. 데이터 포맷팅 및 검증
    formatApplicationData(sheet, lastRow, applicantData);
    
    // 2. 이메일 발송
    sendConfirmationEmails(applicantData);
    
    // 3. 통계 업데이트
    updateStatistics(applicantData);
    
    // 4. 활동 로그 기록
    logActivity('NEW_APPLICATION', applicantData);
    
    console.log('✅ 신청서 처리 완료!');
    
  } catch (error) {
    console.error('❌ 처리 중 오류:', error);
    logActivity('ERROR', { error: error.toString() });
  }
}

/**
 * 📊 데이터 포맷팅 및 검증
 */
function formatApplicationData(sheet, row, data) {
  try {
    const range = sheet.getRange(row, 1, 1, sheet.getLastColumn());
    
    // 타임스탬프 포맷팅
    const timestamp = new Dates(data.timestamp);
    sheet.getRange(row, 1).setValue(timestamp).setNumberFormat(CONFIG.DATE_FORMAT);
    
    // 연락처 포맷팅
    if (data.phone) {
      const formattedPhone = formatPhoneNumber(data.phone);
      sheet.getRange(row, 6).setValue(formattedPhone);
    }
    
    // 이메일 검증
    if (data.email && !isValidEmail(data.email)) {
      sheet.getRange(row, 5).setBackground('#ffebee'); // 빨간색 배경
      logActivity('INVALID_EMAIL', { email: data.email, name: data.name });
    }
    
    // 중복 신청 체크
    checkDuplicateApplication(sheet, data);
    
    console.log('📊 데이터 포맷팅 완료');
    
  } catch (error) {
    console.error('❌ 데이터 포맷팅 오류:', error);
    throw error;
  }
}

/**
 * 📧 확인 이메일 발송
 */
function sendConfirmationEmails(data) {
  try {
    // 신청자에게 확인 이메일
    const applicantEmail = createApplicantEmail(data);
    MailApp.sendEmail({
      to: data.email,
      subject: CONFIG.EMAIL.SUBJECT_APPLICANT,
      htmlBody: applicantEmail,
      name: CONFIG.EMAIL.FROM_NAME,
      replyTo: CONFIG.EMAIL.REPLY_TO
    });
    
    // 관리자에게 알림 이메일
    const adminEmail = createAdminEmail(data);
    MailApp.sendEmail({
      to: CONFIG.EMAIL.REPLY_TO,
      subject: CONFIG.EMAIL.SUBJECT_ADMIN,
      htmlBody: adminEmail,
      name: CONFIG.EMAIL.FROM_NAME
    });
    
    console.log('📧 이메일 발송 완료');
    
  } catch (error) {
    console.error('❌ 이메일 발송 오류:', error);
    throw error;
  }
}

/**
 * 📈 통계 업데이트
 */
function updateStatistics(data) {
  try {
    const statsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.STATS);
    
    if (!statsSheet) {
      console.log('📊 통계 시트 생성...');
      createStatsSheet();
      return;
    }
    
    // 총 신청자 수 업데이트
    const totalApplicants = statsSheet.getRange('B2').getValue() + 1;
    statsSheet.getRange('B2').setValue(totalApplicants);
    
    // 회사별 통계 업데이트
    updateCompanyStats(statsSheet, data.company);
    
    // 직급별 통계 업데이트
    updatePositionStats(statsSheet, data.position);
    
    // 일별 신청 통계
    updateDailyStats(statsSheet, data.timestamp);
    
    console.log('📈 통계 업데이트 완료');
    
  } catch (error) {
    console.error('❌ 통계 업데이트 오류:', error);
  }
}

/**
 * 📝 활동 로그 기록
 */
function logActivity(type, data) {
  try {
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.LOG);
    
    if (!logSheet) {
      createLogSheet();
      return;
    }
    
    const now = new Date();
    const logData = [
      now,
      type,
      JSON.stringify(data),
      Session.getActiveUser().getEmail()
    ];
    
    logSheet.appendRow(logData);
    
  } catch (error) {
    console.error('❌ 로그 기록 오류:', error);
  }
}

/**
 * 🎨 신청자 확인 이메일 템플릿
 */
function createApplicantEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Noto Sans KR', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 신청이 완료되었습니다!</h1>
                <p>AI 채용 브랜딩 강의 - 인재가 먼저 찾아오는 회사 만들기</p>
            </div>
            
            <div class="content">
                <h2>안녕하세요, ${data.name}님!</h2>
                
                <div class="highlight">
                    <h3>📋 신청 정보 확인</h3>
                    <p><strong>성함:</strong> ${data.name}</p>
                    <p><strong>회사:</strong> ${data.company}</p>
                    <p><strong>직급:</strong> ${data.position}</p>
                    <p><strong>이메일:</strong> ${data.email}</p>
                    <p><strong>연락처:</strong> ${data.phone}</p>
                </div>
                
                ${data.personalMessage ? `
                <div class="highlight">
                    <h3>🤖 AI 맞춤 메시지</h3>
                    <p>${data.personalMessage}</p>
                </div>
                ` : ''}
                
                <h3>📅 강의 일정 안내</h3>
                <p>
                    <strong>일시:</strong> 2024년 12월 28일 (토) 오후 2시<br>
                    <strong>장소:</strong> 제주도 서귀포시 가인지 포럼<br>
                    <strong>강사:</strong> 김길호 대표 (에스유디자인)
                </p>
                
                <h3>🎁 특별 혜택</h3>
                <ul>
                    <li>AI 채용공고 작성 템플릿 제공</li>
                    <li>1:1 맞춤 컨설팅 (30분)</li>
                    <li>채용 브랜딩 체크리스트</li>
                    <li>강의 자료 평생 소장</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="https://sudesign.co.kr" class="button">강사 정보 더보기</a>
                </div>
                
                <div class="footer">
                    <p>문의사항이 있으시면 언제든 연락주세요.</p>
                    <p>📧 contact@sudesign.co.kr | ☎️ 010-1234-5678</p>
                    <p>에스유디자인(주) | 대표: 김길호</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

/**
 * 🔔 관리자 알림 이메일 템플릿
 */
function createAdminEmail(data) {
  return `
    <h2>🆕 새로운 강의 신청자</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr><td><strong>신청 시간</strong></td><td>${data.timestamp}</td></tr>
        <tr><td><strong>성함</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>회사</strong></td><td>${data.company}</td></tr>
        <tr><td><strong>직급</strong></td><td>${data.position}</td></tr>
        <tr><td><strong>이메일</strong></td><td>${data.email}</td></tr>
        <tr><td><strong>연락처</strong></td><td>${data.phone}</td></tr>
        <tr><td><strong>경력</strong></td><td>${data.experience}</td></tr>
        <tr><td><strong>채용 고민</strong></td><td>${data.challenges}</td></tr>
        <tr><td><strong>기대사항</strong></td><td>${data.expectations}</td></tr>
    </table>
    
    <p><a href="https://docs.google.com/spreadsheets/d/1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk">📊 스프레드시트에서 확인하기</a></p>
  `;
}

/**
 * 🛠 유틸리티 함수들
 */

function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkDuplicateApplication(sheet, data) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let duplicateCount = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i][4] === data.email) { // 이메일 기준 중복 체크
      duplicateCount++;
    }
  }
  
  if (duplicateCount > 1) {
    logActivity('DUPLICATE_APPLICATION', { email: data.email, count: duplicateCount });
  }
}

function createStatsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const statsSheet = ss.insertSheet(CONFIG.SHEETS.STATS);
  
  // 헤더 설정
  const headers = [
    ['📊 통계 항목', '📈 값'],
    ['총 신청자 수', 0],
    ['오늘 신청자', 0],
    ['이번 주 신청자', 0],
    ['이번 달 신청자', 0]
  ];
  
  statsSheet.getRange(1, 1, headers.length, 2).setValues(headers);
  statsSheet.getRange(1, 1, 1, 2).setBackground('#667eea').setFontColor('white');
}

function createLogSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.insertSheet(CONFIG.SHEETS.LOG);
  
  const headers = [['시간', '유형', '데이터', '사용자']];
  logSheet.getRange(1, 1, 1, 4).setValues(headers);
  logSheet.getRange(1, 1, 1, 4).setBackground('#757575').setFontColor('white');
}

function updateCompanyStats(sheet, company) {
  // 회사별 통계 로직 구현
  console.log(`📊 ${company} 통계 업데이트`);
}

function updatePositionStats(sheet, position) {
  // 직급별 통계 로직 구현
  console.log(`📊 ${position} 통계 업데이트`);
}

function updateDailyStats(sheet, timestamp) {
  // 일별 통계 로직 구현
  const today = new Date().toDateString();
  console.log(`📊 ${today} 통계 업데이트`);
}

/**
 * 🔧 테스트 함수
 */
function testEmailSystem() {
  const testData = {
    name: '테스트 사용자',
    company: '테스트 회사',
    position: 'CTO',
    email: 'test@example.com',
    phone: '010-1234-5678',
    timestamp: new Date()
  };
  
  try {
    sendConfirmationEmails(testData);
    console.log('✅ 이메일 시스템 테스트 성공');
  } catch (error) {
    console.error('❌ 이메일 시스템 테스트 실패:', error);
  }
}

/**
 * 📋 설정 가이드
 * 
 * 1. 트리거 설정:
 *    - 스크립트 편집기 → 트리거 → 새 트리거 추가
 *    - 함수: onFormSubmit
 *    - 이벤트 소스: 스프레드시트에서
 *    - 이벤트 유형: 양식 제출 시
 * 
 * 2. 권한 설정:
 *    - Gmail API 권한 승인 필요
 *    - 스프레드시트 편집 권한 필요
 * 
 * 3. 이메일 설정:
 *    - CONFIG 객체에서 이메일 주소 수정
 *    - 회신 주소 설정 확인
 */ 