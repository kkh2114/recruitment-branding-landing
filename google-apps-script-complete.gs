/**
 * AI 채용 브랜딩 랜딩페이지 - Google Apps Script 자동화 시스템
 * 버전: 3.0 (완전판)
 * 
 * 주요 기능:
 * 1. 자동 트리거 시스템 (onChange, onEdit, onFormSubmit)
 * 2. AI 메시지 생성 (Gemini API)
 * 3. 자동 이메일 발송
 * 4. 상태 관리 및 추적
 * 5. 수동 처리 메뉴
 */

// ================================
// 설정 및 전역 변수
// ================================

const CONFIG = {
  // Gemini AI API 설정
  GEMINI_API_KEY: 'AIzaSyAQ-Rgzs2qaJ8gFfLCRFjDhKowjCYhhWiQ', // 실제 API 키
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  
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
// 트리거 설정 및 관리
// ================================

/**
 * 모든 트리거 설정
 */
function setupAllTriggers() {
  try {
    // 기존 트리거 삭제
    deleteAllTriggers();
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // onChange 트리거 (시트 변경 감지)
    ScriptApp.newTrigger('onSheetChange')
      .for(sheet)
      .onChange()
      .create();
    
    // onEdit 트리거 (셀 편집 감지)
    ScriptApp.newTrigger('onSheetEdit')
      .for(sheet)
      .onEdit()
      .create();
    
    // 시간 기반 트리거 (5분마다 누락 데이터 체크)
    ScriptApp.newTrigger('checkMissingData')
      .timeBased()
      .everyMinutes(5)
      .create();
    
    console.log('모든 트리거가 성공적으로 설정되었습니다.');
    
  } catch (error) {
    console.error('트리거 설정 오류:', error);
    throw error;
  }
}

/**
 * 모든 트리거 삭제
 */
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  console.log('모든 트리거가 삭제되었습니다.');
}

// ================================
// 이벤트 핸들러
// ================================

/**
 * 시트 변경 이벤트 핸들러
 */
function onSheetChange(e) {
  try {
    console.log('시트 변경 감지:', e);
    
    if (e.changeType === 'INSERT_ROW') {
      // 새 행이 추가된 경우
      const sheet = SpreadsheetApp.getActiveSheet();
      const lastRow = sheet.getLastRow();
      
      if (lastRow > 1) { // 헤더 제외
        console.log('새 행 추가 감지, 행 번호:', lastRow);
        processNewSubmission(lastRow);
      }
    }
    
  } catch (error) {
    console.error('onSheetChange 오류:', error);
  }
}

/**
 * 셀 편집 이벤트 핸들러
 */
function onSheetEdit(e) {
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
    console.error('onSheetEdit 오류:', error);
  }
}

/**
 * 폼 제출 이벤트 핸들러 (웹 앱에서 직접 호출)
 */
function onFormSubmit(formData) {
  try {
    console.log('폼 제출 데이터 수신:', formData);
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const timestamp = new Date();
    
    // 새 행에 데이터 추가
    const newRow = [
      timestamp,
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.company || '',
      formData.position || '',
      formData.concern || '',
      formData.industry || '',
      formData.memo || '',
      '', // AI 메시지 (나중에 생성)
      CONFIG.STATUS_VALUES.NEW, // 상태
      false, // 검토 완료 체크박스
      false  // 이메일 발송 여부
    ];
    
    sheet.appendRow(newRow);
    const lastRow = sheet.getLastRow();
    
    console.log('새 데이터 추가됨, 행 번호:', lastRow);
    
    // AI 메시지 생성 및 처리
    processNewSubmission(lastRow);
    
    return { success: true, row: lastRow };
    
  } catch (error) {
    console.error('onFormSubmit 오류:', error);
    return { success: false, error: error.toString() };
  }
}

// ================================
// 핵심 처리 함수
// ================================

/**
 * 새 제출 데이터 처리
 */
function processNewSubmission(rowNumber) {
  try {
    console.log('새 제출 데이터 처리 시작, 행:', rowNumber);
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // 필수 데이터 확인
    if (!rowData[CONFIG.COLUMNS.NAME] || !rowData[CONFIG.COLUMNS.EMAIL]) {
      console.log('필수 데이터 누락, 처리 중단');
      return;
    }
    
    // 이미 AI 메시지가 생성된 경우 스킵
    if (rowData[CONFIG.COLUMNS.AI_MESSAGE]) {
      console.log('이미 AI 메시지가 존재함, 스킵');
      return;
    }
    
    // AI 메시지 생성
    generateAIMessage(rowNumber);
    
  } catch (error) {
    console.error('processNewSubmission 오류:', error);
    updateStatus(rowNumber, CONFIG.STATUS_VALUES.ERROR);
  }
}

/**
 * AI 메시지 생성
 */
function generateAIMessage(rowNumber) {
  try {
    console.log('AI 메시지 생성 시작, 행:', rowNumber);
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const applicantData = {
      name: rowData[CONFIG.COLUMNS.NAME] || '',
      email: rowData[CONFIG.COLUMNS.EMAIL] || '',
      company: rowData[CONFIG.COLUMNS.COMPANY] || '',
      position: rowData[CONFIG.COLUMNS.POSITION] || '',
      concern: rowData[CONFIG.COLUMNS.CONCERN] || '',
      industry: rowData[CONFIG.COLUMNS.INDUSTRY] || '',
      memo: rowData[CONFIG.COLUMNS.MEMO] || ''
    };
    
    // AI API 호출
    const aiMessage = callGeminiAPI(applicantData);
    
    if (aiMessage) {
      // AI 메시지 저장
      sheet.getRange(rowNumber, CONFIG.COLUMNS.AI_MESSAGE + 1).setValue(aiMessage);
      
      // 검토 완료 체크박스 추가
      const checkboxRange = sheet.getRange(rowNumber, CONFIG.COLUMNS.REVIEW_CHECKBOX + 1);
      checkboxRange.insertCheckboxes();
      
      // 상태 업데이트
      updateStatus(rowNumber, CONFIG.STATUS_VALUES.AI_GENERATED);
      
      console.log('AI 메시지 생성 완료, 행:', rowNumber);
      
    } else {
      throw new Error('AI 메시지 생성 실패');
    }
    
  } catch (error) {
    console.error('generateAIMessage 오류:', error);
    updateStatus(rowNumber, CONFIG.STATUS_VALUES.ERROR);
  }
}

/**
 * Gemini AI API 호출
 */
function callGeminiAPI(applicantData) {
  try {
    const prompt = createPrompt(applicantData);
    
    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
 * AI 프롬프트 생성
 */
function createPrompt(applicantData) {
  return `다음 지원자에게 개인화된 환영 메시지를 작성해주세요:

지원자 정보:
- 이름: ${applicantData.name}
- 이메일: ${applicantData.email}
- 회사: ${applicantData.company}
- 직책: ${applicantData.position}
- 관심사: ${applicantData.concern}
- 업종: ${applicantData.industry}
- 추가 메모: ${applicantData.memo}

다음 가이드라인을 따라주세요:
1. 친근하고 전문적인 톤으로 작성
2. 지원자의 배경과 관심사를 반영
3. 우리 서비스가 어떻게 도움이 될 수 있는지 언급
4. 200-300자 정도의 적절한 길이
5. 이메일 제목과 본문을 모두 포함

형식:
제목: [제목 내용]
본문: [본문 내용]`;
}

/**
 * 이메일 발송
 */
function sendEmailForRow(rowNumber) {
  try {
    console.log('이메일 발송 시작, 행:', rowNumber);
    
    const sheet = SpreadsheetApp.getActiveSheet();
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

/**
 * 상태 업데이트
 */
function updateStatus(rowNumber, status) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.getRange(rowNumber, CONFIG.COLUMNS.STATUS + 1).setValue(status);
    console.log(`상태 업데이트: 행 ${rowNumber}, 상태 ${status}`);
  } catch (error) {
    console.error('updateStatus 오류:', error);
  }
}

// ================================
// 수동 처리 함수
// ================================

/**
 * 누락된 행의 AI 메시지 생성
 */
function generateMissingAIMessages() {
  try {
    console.log('누락된 AI 메시지 생성 시작');
    
    const sheet = SpreadsheetApp.getActiveSheet();
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
        generateAIMessage(row);
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
    
    const sheet = SpreadsheetApp.getActiveSheet();
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

/**
 * 주기적 누락 데이터 체크
 */
function checkMissingData() {
  try {
    console.log('주기적 누락 데이터 체크 시작');
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) return;
    
    for (let row = 2; row <= lastRow; row++) {
      const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // 새 데이터인데 AI 메시지가 없는 경우
      if (rowData[CONFIG.COLUMNS.STATUS] === CONFIG.STATUS_VALUES.NEW &&
          !rowData[CONFIG.COLUMNS.AI_MESSAGE] &&
          rowData[CONFIG.COLUMNS.NAME] &&
          rowData[CONFIG.COLUMNS.EMAIL]) {
        
        console.log('누락된 데이터 처리, 행:', row);
        processNewSubmission(row);
        
        // API 호출 제한
        Utilities.sleep(1000);
      }
    }
    
  } catch (error) {
    console.error('checkMissingData 오류:', error);
  }
}

// ================================
// 유틸리티 함수
// ================================

/**
 * 시트 초기화 (헤더 설정)
 */
function initializeSheet() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
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
 * 디버그 정보 출력
 */
function debugInfo() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    console.log('=== 디버그 정보 ===');
    console.log('시트 이름:', sheet.getName());
    console.log('마지막 행:', lastRow);
    console.log('API 키 설정:', CONFIG.GEMINI_API_KEY ? '있음' : '없음');
    
    // 트리거 정보
    const triggers = ScriptApp.getProjectTriggers();
    console.log('설정된 트리거 수:', triggers.length);
    
    triggers.forEach((trigger, index) => {
      console.log(`트리거 ${index + 1}:`, trigger.getHandlerFunction());
    });
    
    // 최근 데이터 확인
    if (lastRow > 1) {
      const recentData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
      console.log('최근 데이터:', recentData);
    }
    
  } catch (error) {
    console.error('debugInfo 오류:', error);
  }
}

// ================================
// 메뉴 생성
// ================================

/**
 * 사용자 정의 메뉴 생성
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🤖 AI 자동화')
    .addItem('🔧 트리거 설정', 'setupAllTriggers')
    .addItem('🗑️ 트리거 삭제', 'deleteAllTriggers')
    .addSeparator()
    .addItem('📝 누락 행 AI 메시지 생성', 'generateMissingAIMessages')
    .addItem('📧 검토 완료된 이메일 발송', 'sendAllReviewedEmails')
    .addSeparator()
    .addItem('🔍 디버그 정보', 'debugInfo')
    .addItem('🔄 시트 초기화', 'initializeSheet')
    .addToUi();
}

// ================================
// 웹 앱 진입점 (doPost)
// ================================

/**
 * 웹 앱 POST 요청 처리
 */
function doPost(e) {
  try {
    const formData = JSON.parse(e.postData.contents);
    console.log('웹 앱 POST 요청 수신:', formData);
    
    const result = onFormSubmit(formData);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('doPost 오류:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 웹 앱 GET 요청 처리 (테스트용)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('AI 채용 브랜딩 Google Apps Script가 실행 중입니다.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ================================
// 초기 설정 함수
// ================================

/**
 * 최초 설정 실행
 */
function initialSetup() {
  try {
    console.log('최초 설정 시작');
    
    // 시트 초기화
    initializeSheet();
    
    // 트리거 설정
    setupAllTriggers();
    
    console.log('최초 설정 완료');
    
  } catch (error) {
    console.error('initialSetup 오류:', error);
  }
} 