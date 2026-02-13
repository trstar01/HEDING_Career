# HEDING 랜딩페이지 백엔드 설정 가이드

## 개요

이 가이드는 Google Sheets와 Apps Script를 사용하여 고객 신청 데이터와 코치 지원 데이터를 수집하고, 관리자에게 알림을 보내는 방법을 설명합니다.

## 1단계: Google Sheets 생성

1. [Google Sheets](https://sheets.google.com)에 접속
2. 새 스프레드시트 생성
3. 스프레드시트 이름: "HEDING 랜딩페이지 데이터"

### 시트 구성

두 개의 시트를 생성합니다:

#### 시트 1: 고객신청

첫 번째 행에 다음 헤더를 입력:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 타임스탬프 | 이름 | 이메일 | 휴대폰 | 신청서비스 | 패키지 | 현재직무연차 | 목표 | 헤드헌터선호 | 이력서링크 | 희망시간대 | 메모 | UTM |

#### 시트 2: 코치지원

첫 번째 행에 다음 헤더를 입력:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| 타임스탬프 | 이름 | 연락처 | 현직직무산업 | 경력연차 | 전문분야 | 가능시간대 | 코칭형태 | 포트폴리오 | 희망단가 | 코칭경험 |

## 2단계: Apps Script 설정

1. Google Sheets에서 **확장 프로그램 > Apps Script** 클릭
2. 기본 코드 삭제하고 아래 코드 붙여넣기

### Apps Script 코드

```javascript
// =============================================
// HEDING 랜딩페이지 백엔드 Apps Script
// =============================================

// 설정: 관리자 이메일 주소 (알림 받을 이메일)
const ADMIN_EMAIL = 'your-email@example.com';

// 설정: 슬랙 웹훅 URL (선택 사항)
const SLACK_WEBHOOK_URL = ''; // 빈 문자열이면 슬랙 알림 비활성화

// =============================================
// 메인 함수: POST 요청 처리
// =============================================
function doPost(e) {
  try {
    // JSON 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 데이터 타입에 따라 처리
    if (data.type === 'customer') {
      handleCustomerSubmission(data);
    } else if (data.type === 'coach') {
      handleCoachSubmission(data);
    } else {
      throw new Error('Invalid data type');
    }
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =============================================
// 고객 신청 처리
// =============================================
function handleCustomerSubmission(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('고객신청');
  
  // UTM 데이터 포맷팅
  const utmString = data.utm ? 
    `source:${data.utm.source} | medium:${data.utm.medium} | campaign:${data.utm.campaign}` : 
    '';
  
  // 시트에 데이터 추가
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.phone,
    data.services,
    data.package,
    data.currentRole,
    data.goals,
    data.headhunterPreference,
    data.resumeLink,
    data.preferredTime,
    data.memo,
    utmString
  ]);
  
  // 이메일 알림 전송
  sendCustomerNotificationEmail(data);
  
  // 슬랙 알림 전송 (선택)
  if (SLACK_WEBHOOK_URL) {
    sendSlackNotification('고객 신청', data.name, data.email);
  }
}

// =============================================
// 코치 지원 처리
// =============================================
function handleCoachSubmission(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('코치지원');
  
  // 시트에 데이터 추가
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.contact,
    data.role,
    data.experience,
    data.expertise,
    data.availability,
    data.coachingType,
    data.portfolio,
    data.rate,
    data.pastExperience
  ]);
  
  // 이메일 알림 전송
  sendCoachNotificationEmail(data);
  
  // 슬랙 알림 전송 (선택)
  if (SLACK_WEBHOOK_URL) {
    sendSlackNotification('코치 지원', data.name, data.contact);
  }
}

// =============================================
// 고객 신청 이메일 알림
// =============================================
function sendCustomerNotificationEmail(data) {
  const subject = `[HEDING] 새로운 고객 신청: ${data.name}님`;
  
  const body = `
안녕하세요,

새로운 고객 신청이 접수되었습니다.

=== 신청자 정보 ===
이름: ${data.name}
이메일: ${data.email}
휴대폰: ${data.phone}

=== 신청 내용 ===
신청 서비스: ${data.services}
패키지: ${data.package}
현재 직무/연차: ${data.currentRole}
커리어 목표: ${data.goals}

=== 헤드헌터 선호 ===
${data.headhunterPreference}

=== 추가 정보 ===
이력서 링크: ${data.resumeLink}
희망 시간대: ${data.preferredTime}
메모: ${data.memo}

=== 접수 시간 ===
${new Date(data.timestamp).toLocaleString('ko-KR')}

Google Sheets에서 확인:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

---
HEDING 자동 알림
  `;
  
  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

// =============================================
// 코치 지원 이메일 알림
// =============================================
function sendCoachNotificationEmail(data) {
  const subject = `[HEDING] 새로운 코치 지원: ${data.name}님`;
  
  const body = `
안녕하세요,

새로운 현직자 코치 지원이 접수되었습니다.

=== 지원자 정보 ===
이름: ${data.name}
연락처: ${data.contact}

=== 경력 정보 ===
현직 직무/산업: ${data.role}
경력 연차: ${data.experience}
전문 분야: ${data.expertise}

=== 코칭 정보 ===
가능 시간대: ${data.availability}
코칭 형태: ${data.coachingType}
희망 단가: ${data.rate}

=== 추가 정보 ===
포트폴리오: ${data.portfolio}
코칭 경험: ${data.pastExperience}

=== 접수 시간 ===
${new Date(data.timestamp).toLocaleString('ko-KR')}

Google Sheets에서 확인:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

---
HEDING 자동 알림
  `;
  
  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

// =============================================
// 슬랙 알림 (선택 사항)
// =============================================
function sendSlackNotification(type, name, contact) {
  if (!SLACK_WEBHOOK_URL) return;
  
  const payload = {
    text: `🔔 새로운 ${type}`,
    attachments: [{
      color: '#2563eb',
      fields: [
        { title: '이름', value: name, short: true },
        { title: '연락처', value: contact, short: true }
      ],
      footer: 'HEDING 자동 알림',
      ts: Math.floor(Date.now() / 1000)
    }]
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
}

// =============================================
// GET 요청 처리 (테스트용)
// =============================================
function doGet() {
  return ContentService
    .createTextOutput('HEDING Backend is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## 3단계: Apps Script 배포

1. Apps Script 에디터에서 **배포 > 새 배포** 클릭
2. 설정:
   - **유형 선택**: 웹 앱
   - **설명**: HEDING 랜딩페이지 백엔드
   - **실행 계정**: 나
   - **액세스 권한**: 모든 사용자
3. **배포** 클릭
4. **웹 앱 URL** 복사 (이 URL을 `script.js`에 붙여넣어야 합니다)

## 4단계: 프론트엔드 연결

`script.js` 파일을 열고 다음 부분을 수정하세요:

```javascript
// 라인 358 부근
const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

이 부분을 3단계에서 복사한 웹 앱 URL로 교체합니다:

```javascript
const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

그리고 `simulateSubmission` 함수를 실제 제출로 변경:

```javascript
async function simulateSubmission(data) {
  const response = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  
  // no-cors 모드에서는 응답 상태를 확인할 수 없으므로 성공으로 간주
  return { success: true };
}
```

## 5단계: 환경 변수 설정

Apps Script 코드 상단의 설정을 수정하세요:

```javascript
// 관리자 이메일 (필수)
const ADMIN_EMAIL = 'admin@heding.co.kr';

// 슬랙 웹훅 URL (선택 사항)
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';
```

## 6단계: 테스트

1. 로컬에서 `index.html` 파일을 브라우저로 열기
2. 고객 신청 폼 작성 및 제출
3. Google Sheets에서 데이터 확인
4. 이메일 수신 확인

### 테스트 체크리스트

- [ ] 고객 신청 폼 제출 → 시트에 데이터 저장됨
- [ ] 이메일 알림 수신됨
- [ ] 코치 지원 폼 제출 → 시트에 데이터 저장됨
- [ ] 이메일 알림 수신됨
- [ ] 슬랙 알림 수신됨 (설정한 경우)

## 문제 해결

### 데이터가 저장되지 않는 경우

1. Apps Script 로그 확인: **실행 > 실행 로그 보기**
2. 시트 이름이 정확한지 확인 (`고객신청`, `코치지원`)
3. 배포 URL이 올바르게 복사되었는지 확인

### 이메일이 오지 않는 경우

1. `ADMIN_EMAIL`이 올바르게 설정되었는지 확인
2. Gmail 스팸 폴더 확인
3. Apps Script 권한 확인 (Gmail 전송 권한 필요)

### CORS 에러

- `mode: 'no-cors'` 옵션을 사용하므로 CORS 에러는 발생하지 않아야 합니다
- 브라우저 콘솔에 에러가 표시되더라도 실제로는 데이터가 전송될 수 있습니다

## 보안 고려사항

1. **Apps Script URL 보호**: URL이 공개되면 누구나 데이터를 전송할 수 있습니다
2. **스팸 방지**: reCAPTCHA 추가 고려
3. **데이터 보관**: 정기적으로 백업하고 6개월 후 삭제
4. **개인정보**: Google Sheets 접근 권한을 관리자로 제한

## 고급 기능 (선택)

### 자동 응답 이메일

고객/코치에게 자동 응답 이메일을 보내려면:

```javascript
function sendCustomerNotificationEmail(data) {
  // 관리자에게 알림
  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
  
  // 고객에게 자동 응답
  if (data.email) {
    const customerSubject = '[HEDING] 신청이 접수되었습니다';
    const customerBody = `
${data.name}님, 안녕하세요.

HEDING 커리어 컨설팅 신청이 정상적으로 접수되었습니다.
24~48시간 내에 헤드헌터 매칭 결과를 안내드리겠습니다.

감사합니다.
HEDING 팀
    `;
    MailApp.sendEmail(data.email, customerSubject, customerBody);
  }
}
```

### 데이터 검증

Apps Script에서 추가 검증을 수행하려면:

```javascript
function validateCustomerData(data) {
  if (!data.name || data.name.trim() === '') {
    throw new Error('이름이 필요합니다');
  }
  
  if (!data.email && !data.phone) {
    throw new Error('이메일 또는 휴대폰이 필요합니다');
  }
  
  // 추가 검증...
}

function handleCustomerSubmission(data) {
  validateCustomerData(data);
  // ... 나머지 코드
}
```

## 배포 체크리스트

- [ ] Google Sheets 생성 및 헤더 설정
- [ ] Apps Script 코드 복사 및 붙여넣기
- [ ] `ADMIN_EMAIL` 설정
- [ ] 슬랙 웹훅 URL 설정 (선택)
- [ ] Apps Script 배포 (웹 앱)
- [ ] 배포 URL 복사
- [ ] `script.js`에 URL 붙여넣기
- [ ] 테스트 제출 및 확인
- [ ] 이메일 알림 확인
- [ ] 프로덕션 배포

---

이제 HEDING 랜딩페이지가 완전히 작동합니다! 🎉
