# HEDING Landing Page

커리어 컨설팅 서비스 랜딩페이지

## 🌐 Live Demo

[GitHub Pages에서 보기](https://YOUR-USERNAME.github.io/cryo-nadir/)

## 📋 프로젝트 개요

HEDING 커리어 컨설팅 서비스를 위한 모바일 퍼스트 랜딩페이지입니다.

### 주요 기능
- ✅ 11개 섹션 (Hero, 서비스 소개, 가격, 폼, FAQ 등)
- ✅ 고객 신청 폼 + 현직자 코치 지원 폼
- ✅ 헤드헌터 선택 시스템 (1~3지망, 무관)
- ✅ 실시간 폼 검증
- ✅ Google Sheets 백엔드 연동
- ✅ 이메일/슬랙 알림

### 기술 스택
- HTML5
- CSS3 (모바일 퍼스트 반응형)
- JavaScript (Vanilla)
- Google Apps Script (백엔드)

## 🚀 배포 방법

### 로컬 실행
```bash
# 파일을 브라우저에서 직접 열기
index.html

# 또는 로컬 서버 실행
python -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

### GitHub Pages 배포
이 리포지토리는 GitHub Pages로 자동 배포됩니다.

## 📁 파일 구조

```
cryo-nadir/
├── index.html          # 메인 HTML 파일
├── styles.css          # 스타일시트
├── script.js           # JavaScript 로직
├── backend-setup.md    # 백엔드 설정 가이드
└── README.md          # 이 파일
```

## ⚙️ 백엔드 설정

Google Sheets와 Apps Script를 사용한 폼 데이터 수집:

1. `backend-setup.md` 파일 참고
2. Google Sheets 생성 및 헤더 설정
3. Apps Script 코드 배포
4. `script.js`에 Apps Script URL 추가

자세한 내용은 [backend-setup.md](backend-setup.md)를 확인하세요.

## 📝 라이선스

© 2026 HEDING. All rights reserved.

## 📞 문의

- 이메일: contact@heding.co.kr
- 카카오톡: @heding
