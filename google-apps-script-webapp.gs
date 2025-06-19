/**
 * AI 채용 브랜딩 랜딩페이지 - Google Apps Script 웹 앱
 * 버전: 4.0 (웹 앱 직접 호출)
 * 
 * 이 스크립트를 Google Apps Script에 배포하여 웹 앱으로 사용
 * 웹폼에서 직접 이 웹 앱을 호출하여 데이터 저장 + AI 자동화 실행
 */

const CACHE = CacheService.getScriptCache();

const CONFIG = {
  GEMINI_API_KEY: 'AIzaSyAQ-Rgzs2qaJ8gFfLCRFjDhKowjCYhhWiQ',
  SHEET_ID: '1M0ZzjdY7kvYXZfWhyyOANTHsa6HIBcvJ2g71CgjIkDk',
  SENDER_EMAIL: 'sudesigmgo@gmail.com',
  SENDER_NAME: '에스유디자인(주) 대표 김길호 드림',
  API_TIMEOUT: 10000,
  RETRY_COUNT: 3,
  BATCH_DELAY: 2000,
  COLUMNS: {
    TIMESTAMP: 1, NAME: 2, EMAIL: 3, PHONE: 4,
    COMPANY: 5, POSITION: 6, CONCERN: 7, INDUSTRY: 8,
    MEMO: 9, STATUS: 10, AI_MESSAGE: 11, REVIEWED: 12,
    SENT_STATUS: 13
  }
};

function getSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  return ss.getSheetByName('강의참석자명단') || ss.getSheets()[0];
}

function hasGeminiQuota() {
  return Number(CACHE.get('gHits') || 0) < 1950;
}

function countGeminiHit() {
  CACHE.put('gHits', String(Number(CACHE.get('gHits') || 0) + 1), 21600);
}

function withLock(cb) {
  const lock = LockService.getScriptLock();
  if (lock.tryLock(5000)) {
    try {
      return cb();
    } finally {
      lock.releaseLock();
    }
  } else {
    logError('Lock 획득 실패');
  }
}

function setupHeaders(sheet) {
  const h = ['신청일시','이름','이메일','전화번호','회사명','직책',
             '채용관련고민','업종/산업군','기타문의','처리상태',
             'AI생성메시지','검토완료','발송상태'];
  sheet.getRange(1,1,1,h.length).setValues([h])
       .setFontWeight('bold')
       .setBackground('#f0f0f0');
}

function setupCheckboxForRow(sheet, row) {
  const cell = sheet.getRange(row, CONFIG.COLUMNS.REVIEWED);
  cell.setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  if (cell.getValue() === '') cell.setValue(false);
}

function setupAllCheckboxes(sheet) {
  const lr = Math.min(sheet.getLastRow(), 100);
  for (let r = 2; r <= lr; r++) {
    setupCheckboxForRow(sheet, r);
  }
}

function getRowData(sheet, row) {
  const v = sheet.getRange(row,1,1,13).getValues()[0];
  return {
    timestamp: v[0], name: v[1], email: v[2], phone: v[3],
    company: v[4], position: v[5], concern: v[6], industry: v[7],
    memo: v[8], status: v[9], aiMessage: v[10],
    reviewed: v[11], sentStatus: v[12]
  };
}

function updateStatus(sheet, row, status, color) {
  sheet.getRange(row, CONFIG.COLUMNS.STATUS).setValue(status).setBackground(color || '#ffffff');
}

function logError(message) {
  const sheet = getSheet();
  const lr = sheet.getLastRow() + 1;
  sheet.getRange(lr, CONFIG.COLUMNS.TIMESTAMP).setValue(new Date());
  sheet.getRange(lr, CONFIG.COLUMNS.MEMO).setValue(`ERROR: ${message}`);
}

function processNewRowsBatch(sheet) {
  const lr = sheet.getLastRow();
  for (let r = 2; r <= lr; r++) {
    const name = sheet.getRange(r, CONFIG.COLUMNS.NAME).getValue();
    const aiMessage = sheet.getRange(r, CONFIG.COLUMNS.AI_MESSAGE).getValue();
    if (
      name &&
      (
        !aiMessage ||
        aiMessage === '' ||
        aiMessage.includes('생성') ||
        aiMessage === '정보부족' ||
        aiMessage.startsWith('오류') ||
        aiMessage === 'Pending'
      )
    ) {
      processNewRowOptimized(sheet, r);
    }
  }
}

function processNewRowOptimized(sheet, row) {
  try {
    const status = sheet.getRange(row, CONFIG.COLUMNS.STATUS).getValue();
    if (!status) updateStatus(sheet, row, '대기', '#ffffcc');
    sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('메시지 생성중...');
    setupCheckboxForRow(sheet, row);
    Utilities.sleep(500);

    const ok = generateAIMessageOptimized(sheet, row);
    if (ok) {
      updateStatus(sheet, row, '검토대기', '#ccffcc');
      sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('검토 후 발송가능');
    } else {
      updateStatus(sheet, row, '메시지생성실패', '#ffcccc');
      sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('메시지 재생성 필요');
    }
  } catch (e) {
    logError(`processNewRowOptimized Row ${row}: ${e.message}`);
  }
}

function generateAIMessageOptimized(sheet, row) {
  const d = getRowData(sheet, row);
  if (!d.name || !d.email) {
    sheet.getRange(row, CONFIG.COLUMNS.AI_MESSAGE).setValue('정보부족');
    return false;
  }
  sheet.getRange(row, CONFIG.COLUMNS.AI_MESSAGE).setValue('AI 메시지 생성 중...');
  if (!hasGeminiQuota()) {
    sheet.getRange(row, CONFIG.COLUMNS.AI_MESSAGE).setValue('쿼터초과');
    return false;
  }

  try {
    const prompt = buildPrompt(d);
    const msg = callGeminiAPIWithRetry(prompt);
    sheet.getRange(row, CONFIG.COLUMNS.AI_MESSAGE).setValue(msg);
    countGeminiHit();
    return true;
  } catch (e) {
    sheet.getRange(row, CONFIG.COLUMNS.AI_MESSAGE).setValue('오류: ' + (e.message || '').slice(0,80));
    logError(`AI 생성 Row ${row}: ${e.message}`);
    return false;
  }
}

function buildPrompt(d) {
  return `당신은 AI 채용 브랜딩 강의의 전문 강사입니다.  
아래 신청자에게 보낼 깔끔하고 신뢰감 있는 환영 이메일 본문을 작성해주세요.

**신청자 정보**
- 이름: ${d.name}
- 회사: ${d.company || '미제공'}
- 직책: ${d.position || '미제공'}
- 채용 고민: ${d.concern || '없음'}
- 업종: ${d.industry || '미제공'}
- 기타 문의: ${d.memo || '없음'}

**신청자 정보**
- 이름: ${d.name}
- 회사: ${d.company || '미제공'}
- 직책: ${d.position || '미제공'}
- 채용 고민: ${d.concern || '없음'}
- 업종: ${d.industry || '미제공'}
- 기타 문의: ${d.memo || '없음'}

**작성 규칙**
1️⃣ "안녕하세요 ${d.name}${d.position || ''}님," 으로 시작  
2️⃣ 강사 소개:
저는 김길호 대표입니다. 현재 인테리어·건설업 기반의 중소기업을 23년 이상 경영하며,
AI를 접목한 채용 브랜딩 전략을 설계하고 실행해 온 경험이 있습니다.  
이러한 경험과 노하우를 나누고자 합니다.

3️⃣ 강의 개설 취지:
저 또한 유사한 고민을 경험하며 많은 시행착오를 겪어왔기에,  
동병상련의 마음으로 대표님과 같은 경영자분들과 함께 고민하고  
함께 해결책을 찾아보고자 이 강의를 준비하게 되었습니다.

4️⃣ 신청자의 고민에 공감  
5️⃣ AI 채용 전략, 도구 활용법, 최신 트렌드 등 강의 주요 내용 간략 언급  
6️⃣ 강의가 상호 학습과 맞춤형 전략을 함께 찾아가는 과정임을 설명  
7️⃣ 강의 중 자료 제공, 지속적 소통과 피드백을 위해 오픈 카톡방 참여 필요 안내  
8️⃣ 오픈 카톡방 링크, 입장코드 제공  
9️⃣ 카톡방 참여 시 **실명 + 직함 / 업종 / 회사명** 포함된 프로필 사용 당부  
🔟 350~450자 이내, 따뜻하고 협력적 어투, 단락 구분  
⓫ 이메일 본문만 작성

📱 https://open.kakao.com/o/gDj947Bh  
🔑 입장코드: leaders  

이 가이드를 기반으로 이메일 본문을 작성해주세요.`;
}

function callGeminiAPIWithRetry(prompt, retry) {
  retry = retry || 0;
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + CONFIG.GEMINI_API_KEY;
  try {
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
      muteHttpExceptions: true
    });
    if (res.getResponseCode() === 200) {
      const j = JSON.parse(res.getContentText());
      const t = j.candidates && j.candidates[0] && j.candidates[0].content.parts[0].text;
      if (t) return t;
    }
    throw new Error('Gemini 응답 ' + res.getResponseCode());
  } catch (e) {
    if (retry < CONFIG.RETRY_COUNT) {
      Utilities.sleep(1000 * (retry + 1));
      return callGeminiAPIWithRetry(prompt, retry + 1);
    }
    throw e;
  }
}

function sendEmailForRowOptimized(sheet, row) {
  const d = getRowData(sheet, row);
  if (!d.email || !d.aiMessage || d.aiMessage.includes('생성') || d.aiMessage.startsWith('오류') || d.aiMessage === '정보부족') {
    sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('메시지 미생성');
    return false;
  }
  if (d.sentStatus === '발송완료') return true;
  if (MailApp.getRemainingDailyQuota() <= 0) {
    sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('쿼터초과');
    return false;
  }

  try {
    GmailApp.sendEmail(d.email, `[AI 강의] ${d.name}님, 환영합니다`, '', {
      htmlBody: wrapHtml(d.aiMessage),
      name: CONFIG.SENDER_NAME
    });
    sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('발송완료');
    updateStatus(sheet, row, '발송완료', '#ccccff');
    return true;
  } catch (e) {
    sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('발송실패');
    logError(`이메일 발송 Row ${row}: ${e.message}`);
    return false;
  }
}

function wrapHtml(text) {
  return `<div style="font-family:sans-serif;">${text.replace(/\n/g,'<br>')}</div>`;
}

function clearAllTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
}

function setupOptimizedTriggers() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  clearAllTriggers();
  ScriptApp.newTrigger('onSheetChangeOptimized').forSpreadsheet(ss).onChange().create();
  ScriptApp.newTrigger('onCellEditOptimized').forSpreadsheet(ss).onEdit().create();
  try {
    ScriptApp.newTrigger('onFormSubmitOptimized').forSpreadsheet(ss).onFormSubmit().create();
  } catch (e) {
    logError(`트리거 생성: ${e.message}`);
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('✉️ AI 메일 도구')
    .addItem('시스템 초기화', 'initializeSystem')
    .addItem('체크박스 세팅', 'safeSetupAllCheckboxes')
    .addItem('새 행 처리', 'safeProcessNewRows')
    .addItem('테스트 데이터 생성', 'generateTestData')
    .addItem('트리거 재설정', 'setupOptimizedTriggers')
    .addToUi();
}

function initializeSystem() {
  const sheet = getSheet();
  setupHeaders(sheet);
  setupAllCheckboxes(sheet);
  setupOptimizedTriggers();
  SpreadsheetApp.getUi().alert('초기화 완료');
}

function safeProcessNewRows() {
  withLock(() => processNewRowsBatch(getSheet()));
}

function safeSetupAllCheckboxes() {
  setupAllCheckboxes(getSheet());
}

function generateTestData() {
  const sheet = getSheet();
  sheet.appendRow([new Date(), '홍길동', 'test@example.com', '010-1234-5678', '테스트회사', '대표',
                   '우수 인재 확보', 'IT', '없음', '', '', '', '']);
}

function onSheetChangeOptimized(e) {
  safeProcessNewRows();
}

function onFormSubmitOptimized(e) {
  safeProcessNewRows();
}

function onCellEditOptimized(e) {
  const sheet = getSheet();
  const row = e.range.getRow();
  const col = e.range.getColumn();
  if (row > 1 && col === CONFIG.COLUMNS.REVIEWED && (e.value === 'TRUE' || e.value === true)) {
    withLock(() => {
      sheet.getRange(row, CONFIG.COLUMNS.SENT_STATUS).setValue('발송중...');
      Utilities.sleep(100);
      sendEmailForRowOptimized(sheet, row);
    });
  }
} 