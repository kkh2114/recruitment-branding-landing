/**
 * AI 채용 브랜딩 랜딩페이지 - Google Apps Script 웹 앱
 * 버전: 4.0 (웹 앱 직접 호출)
 * 
 * 이 스크립트를 Google Apps Script에 배포하여 웹 앱으로 사용
 * 웹폼에서 직접 이 웹 앱을 호출하여 데이터 저장 + AI 자동화 실행
 */

// ================================
// 설정 및 전역 변수
// ================================

const CONFIG = {
  // Gemini AI API 설정
  GEMINI_API_KEY: 'AIzaSyAQ-Rgzs2qaJ8gFfLCRFjDhKowjCYhhWiQ', // 실제 API 키
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  
  // 시트 설정
  SHEET_ID: '1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk', // Google Sheets ID
  
  // 시트 컬럼 매핑 (0-based index)
  COLUMNS: {
    TIMESTAMP: 0,     // A열: 타임스탬프
    NAME: 1,          // B열: 이름
    EMAIL: 2,         // C열: 이메일
    PHONE: 3,         // D열: 전화번호
    COMPANY: 4,       // E열: 회사명
    POSITION: 5,      // F열: 직책
    CONCERN: 6,       // G열: 관심사
    INDUSTRY: 7,      // H열: 업종
    MEMO: 8,          // I열: 메모
    AI_MESSAGE: 9,    // J열: AI 메시지
    STATUS: 10,       // K열: 처리 상태
    REVIEW_CHECKBOX: 11, // L열: 검토 완료 체크박스
    EMAIL_SENT: 12    // M열: 이메일 발송 여부
  },
  
  // 상태 값
  STATUS_VALUES: {
    NEW: '신규',
    AI_GENERATED: 'AI 메시지 생성됨',
    REVIEWED: '검토 완료',
    EMAIL_SENT: '이메일 발송됨',
    ERROR: '오류'
  }
};

// ================================
// 웹 앱 진입점
// ================================

/**
 * 웹 앱 POST 요청 처리 (웹폼에서 호출)
 */
function doPost(e) {
  try {
    console.log('웹 앱 POST 요청 수신');
    
    // CORS 헤더 설정
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }
    };
    
    let formData;
    
    // POST 데이터 파싱
    if (e.postData && e.postData.contents) {
      formData = JSON.parse(e.postData.contents);
    } else if (e.parameters) {
      // URL 매개변수로 전달된 경우
      formData = {};
      Object.keys(e.parameters).forEach(key => {
        formData[key] = e.parameters[key][0]; // 첫 번째 값 사용
      });
    } else {
      throw new Error('요청 데이터가 없습니다.');
    }
    
    console.log('수신된 폼 데이터:', formData);
    
    // 데이터 검증
    if (!formData.name || !formData.email) {
      throw new Error('필수 필드가 누락되었습니다.');
    }
    
    // Google Sheets에 데이터 저장 및 자동화 실행
    const result = processFormSubmission(formData);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '신청이 성공적으로 제출되었습니다.',
        data: result
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(response.headers);
      
  } catch (error) {
    console.error('doPost 오류:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: '서버 오류가 발생했습니다.'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

/**
 * 웹 앱 GET 요청 처리 (테스트용)
 */
function doGet(e) {
  try {
    // OPTIONS 요청 처리 (CORS)
    if (e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'AI 채용 브랜딩 Google Apps Script 웹 앱이 실행 중입니다.',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('doGet 오류:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ================================
// 핵심 처리 함수
// ================================

/**
 * 폼 제출 데이터 처리 (메인 함수)
 */
function processFormSubmission(formData) {
  try {
    console.log('폼 제출 데이터 처리 시작:', formData);
    
    // Google Sheets 열기
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    
    // 타임스탬프 생성
    const timestamp = new Date();
    
    // 새 행에 데이터 추가
    const newRow = [
      timestamp,                          // A열: 타임스탬프
      formData.name || '',               // B열: 이름
      formData.email || '',              // C열: 이메일
      formData.phone || '',              // D열: 전화번호
      formData.company || '',            // E열: 회사명
      formData.position || '',           // F열: 직책
      formData.concern || '',            // G열: 관심사
      formData.industry || '',           // H열: 업종
      formData.memo || '',               // I열: 메모
      '',                                // J열: AI 메시지 (나중에 생성)
      CONFIG.STATUS_VALUES.NEW,          // K열: 상태
      false,                             // L열: 검토 완료 체크박스
      false                              // M열: 이메일 발송 여부
    ];
    
    // 시트에 데이터 추가
    sheet.appendRow(newRow);
    const lastRow = sheet.getLastRow();
    
    console.log('데이터 추가 완료, 행 번호:', lastRow);
    
    // 즉시 AI 메시지 생성 시도
    try {
      console.log('AI 메시지 생성 시작...');
      generateAIMessage(lastRow, formData);
      console.log('AI 메시지 생성 완료');
    } catch (aiError) {
      console.error('AI 메시지 생성 오류:', aiError);
      // AI 생성 실패해도 데이터 저장은 성공으로 처리
      updateStatus(lastRow, CONFIG.STATUS_VALUES.ERROR);
    }
    
    return {
      row: lastRow,
      timestamp: timestamp,
      status: 'success'
    };
    
  } catch (error) {
    console.error('processFormSubmission 오류:', error);
    throw error;
  }
}

/**
 * AI 메시지 생성
 */
function generateAIMessage(rowNumber, formData) {
  try {
    console.log('AI 메시지 생성 시작, 행:', rowNumber);
    
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    
    // AI API 호출
    const aiMessage = callGeminiAPI(formData);
    
    if (aiMessage) {
      // AI 메시지 저장 (J열)
      sheet.getRange(rowNumber, CONFIG.COLUMNS.AI_MESSAGE + 1).setValue(aiMessage);
      
      // 검토 완료 체크박스 추가 (L열)
      const checkboxRange = sheet.getRange(rowNumber, CONFIG.COLUMNS.REVIEW_CHECKBOX + 1);
      checkboxRange.insertCheckboxes();
      
      // 상태 업데이트
      updateStatus(rowNumber, CONFIG.STATUS_VALUES.AI_GENERATED);
      
      console.log('AI 메시지 생성 및 저장 완료');
      return aiMessage;
      
    } else {
      throw new Error('AI 메시지 생성 실패');
    }
    
  } catch (error) {
    console.error('generateAIMessage 오류:', error);
    updateStatus(rowNumber, CONFIG.STATUS_VALUES.ERROR);
    throw error;
  }
}

/**
 * Gemini AI API 호출
 */
function callGeminiAPI(applicantData) {
  try {
    const prompt = `다음 지원자에게 개인화된 환영 메시지를 작성해주세요:

지원자 정보:
- 이름: ${applicantData.name}
- 이메일: ${applicantData.email}
- 회사: ${applicantData.company}
- 직책: ${applicantData.position}
- 관심사: ${applicantData.concern}
- 업종: ${applicantData.industry}
- 추가 메모: ${applicantData.memo}

가이드라인:
1. 친근하고 전문적인 톤
2. 지원자의 배경과 관심사를 반영
3. AI 채용 브랜딩 서비스 소개
4. 200-300자 정도
5. 이메일 제목과 본문 포함

형식:
제목: [제목 내용]
본문: [본문 내용]`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024
      }
    };
    
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload)
    };
    
    const url = `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`;
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`AI API 오류: ${response.getResponseCode()}`);
    }
    
    const jsonResponse = JSON.parse(response.getContentText());
    if (jsonResponse.candidates && jsonResponse.candidates[0] && jsonResponse.candidates[0].content) {
      return jsonResponse.candidates[0].content.parts[0].text;
    } else {
      throw new Error('AI 응답 형식 오류');
    }
  } catch (error) {
    console.error('Gemini API 호출 오류:', error);
    return null;
  }
}

/**
 * 상태 업데이트
 */
function updateStatus(rowNumber, status) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    sheet.getRange(rowNumber, CONFIG.COLUMNS.STATUS + 1).setValue(status);
    console.log(`상태 업데이트: 행 ${rowNumber}, 상태 ${status}`);
  } catch (error) {
    console.error('updateStatus 오류:', error);
  }
}

// ================================
// 트리거 및 이벤트 핸들러
// ================================

/**
 * 셀 편집 이벤트 핸들러 (검토 완료 체크박스 감지)
 */
function onEdit(e) {
  try {
    const range = e.range;
    const row = range.getRow();
    const col = range.getColumn();
    
    console.log(`셀 편집 감지: 행 ${row}, 열 ${col}`);
    
    // 검토 완료 체크박스가 체크된 경우 (L열)
    if (col === CONFIG.COLUMNS.REVIEW_CHECKBOX + 1 && row > 1) {
      const isChecked = range.getValue();
      if (isChecked === true) {
        console.log('검토 완료 체크박스 체크됨, 행:', row);
        sendEmailForRow(row);
      }
    }
    
  } catch (error) {
    console.error('onEdit 오류:', error);
  }
}

/**
 * 이메일 발송
 */
function sendEmailForRow(rowNumber) {
  try {
    console.log('이메일 발송 시작, 행:', rowNumber);
    
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    const rowData = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const email = rowData[CONFIG.COLUMNS.EMAIL];
    const name = rowData[CONFIG.COLUMNS.NAME];
    const aiMessage = rowData[CONFIG.COLUMNS.AI_MESSAGE];
    
    if (!email || !aiMessage) {
      throw new Error('이메일 주소 또는 AI 메시지가 없습니다');
    }
    
    // AI 메시지에서 제목과 본문 분리
    const messageParts = aiMessage.split('\n본문:');
    const subject = messageParts[0].replace('제목:', '').trim();
    const body = messageParts[1] ? messageParts[1].trim() : aiMessage;
    
    // 이메일 발송
    GmailApp.sendEmail(
      email,
      subject || `${name}님, AI 채용 브랜딩 서비스에 관심을 가져주셔서 감사합니다`,
      body,
      {
        htmlBody: body.replace(/\n/g, '<br>'),
        name: 'AI 채용 브랜딩팀'
      }
    );
    
    // 발송 상태 업데이트
    sheet.getRange(rowNumber, CONFIG.COLUMNS.EMAIL_SENT + 1).setValue(true);
    updateStatus(rowNumber, CONFIG.STATUS_VALUES.EMAIL_SENT);
    
    console.log('이메일 발송 완료:', email);
    
  } catch (error) {
    console.error('sendEmailForRow 오류:', error);
    updateStatus(rowNumber, CONFIG.STATUS_VALUES.ERROR);
  }
}

// ================================
// 수동 처리 함수 (메뉴용)
// ================================

/**
 * 누락된 행의 AI 메시지 생성
 */
function generateMissingAIMessages() {
  try {
    console.log('누락된 AI 메시지 생성 시작');
    
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      console.log('처리할 데이터가 없습니다');
      return;
    }
    
    let processedCount = 0;
    
    for (let row = 2; row <= lastRow; row++) {
      const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // AI 메시지가 없고 필수 데이터가 있는 경우
      if (!rowData[CONFIG.COLUMNS.AI_MESSAGE] && 
          rowData[CONFIG.COLUMNS.NAME] && 
          rowData[CONFIG.COLUMNS.EMAIL]) {
        
        console.log('누락된 AI 메시지 생성, 행:', row);
        
        const formData = {
          name: rowData[CONFIG.COLUMNS.NAME],
          email: rowData[CONFIG.COLUMNS.EMAIL],
          phone: rowData[CONFIG.COLUMNS.PHONE],
          company: rowData[CONFIG.COLUMNS.COMPANY],
          position: rowData[CONFIG.COLUMNS.POSITION],
          concern: rowData[CONFIG.COLUMNS.CONCERN],
          industry: rowData[CONFIG.COLUMNS.INDUSTRY],
          memo: rowData[CONFIG.COLUMNS.MEMO]
        };
        
        generateAIMessage(row, formData);
        processedCount++;
        
        // API 호출 제한을 위한 지연
        Utilities.sleep(1000);
      }
    }
    
    console.log(`누락된 AI 메시지 생성 완료: ${processedCount}개 처리`);
    
  } catch (error) {
    console.error('generateMissingAIMessages 오류:', error);
  }
}

/**
 * 모든 검토 완료된 행에 이메일 발송
 */
function sendAllReviewedEmails() {
  try {
    console.log('검토 완료된 이메일 발송 시작');
    
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      console.log('처리할 데이터가 없습니다');
      return;
    }
    
    let processedCount = 0;
    
    for (let row = 2; row <= lastRow; row++) {
      const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // 검토 완료되었지만 이메일 미발송인 경우
      if (rowData[CONFIG.COLUMNS.REVIEW_CHECKBOX] === true && 
          !rowData[CONFIG.COLUMNS.EMAIL_SENT]) {
        
        console.log('검토 완료된 이메일 발송, 행:', row);
        sendEmailForRow(row);
        processedCount++;
        
        // 이메일 발송 제한을 위한 지연
        Utilities.sleep(2000);
      }
    }
    
    console.log(`검토 완료된 이메일 발송 완료: ${processedCount}개 처리`);
    
  } catch (error) {
    console.error('sendAllReviewedEmails 오류:', error);
  }
}

// ================================
// 유틸리티 및 설정
// ================================

/**
 * 시트 초기화 (헤더 설정)
 */
function initializeSheet() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    
    const headers = [
      '타임스탬프',
      '이름',
      '이메일',
      '전화번호',
      '회사명',
      '직책',
      '관심사',
      '업종',
      '메모',
      'AI 메시지',
      '처리 상태',
      '검토 완료',
      '이메일 발송'
    ];
    
    // 헤더 설정
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f0f0f0');
    
    // 컬럼 너비 조정
    sheet.setColumnWidth(1, 150); // 타임스탬프
    sheet.setColumnWidth(2, 100); // 이름
    sheet.setColumnWidth(3, 200); // 이메일
    sheet.setColumnWidth(4, 120); // 전화번호
    sheet.setColumnWidth(5, 150); // 회사명
    sheet.setColumnWidth(6, 100); // 직책
    sheet.setColumnWidth(7, 150); // 관심사
    sheet.setColumnWidth(8, 100); // 업종
    sheet.setColumnWidth(9, 200); // 메모
    sheet.setColumnWidth(10, 300); // AI 메시지
    sheet.setColumnWidth(11, 100); // 처리 상태
    sheet.setColumnWidth(12, 80);  // 검토 완료
    sheet.setColumnWidth(13, 80);  // 이메일 발송
    
    console.log('시트 초기화 완료');
    
  } catch (error) {
    console.error('initializeSheet 오류:', error);
  }
}

/**
 * 사용자 정의 메뉴 생성
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🤖 AI 자동화')
    .addItem('📝 누락 행 AI 메시지 생성', 'generateMissingAIMessages')
    .addItem('📧 검토 완료된 이메일 발송', 'sendAllReviewedEmails')
    .addSeparator()
    .addItem('🔄 시트 초기화', 'initializeSheet')
    .addItem('🧪 테스트 실행', 'testFunction')
    .addToUi();
}

/**
 * 테스트 함수
 */
function testFunction() {
  console.log('테스트 함수 실행');
  
  const testData = {
    name: '테스트 사용자',
    email: 'test@example.com',
    phone: '010-1234-5678',
    company: '테스트 회사',
    position: '개발자',
    concern: 'AI 채용',
    industry: 'IT',
    memo: '테스트 메모'
  };
  
  try {
    const result = processFormSubmission(testData);
    console.log('테스트 결과:', result);
    console.log('테스트 완료');
  } catch (error) {
    console.error('테스트 오류:', error);
  }
} 