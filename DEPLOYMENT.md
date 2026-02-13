# GitHub Pages 배포 가이드 (웹 인터페이스 사용)

Git CLI가 설치되어 있지 않으므로, GitHub 웹 인터페이스를 사용하여 배포하는 방법을 안내합니다.

## 📋 배포 전 체크리스트

아래 파일들이 준비되어 있습니다:
- ✅ `index.html` - 메인 HTML 파일
- ✅ `styles.css` - 스타일시트
- ✅ `script.js` - JavaScript
- ✅ `backend-setup.md` - 백엔드 가이드
- ✅ `README.md` - 프로젝트 설명
- ✅ `.gitignore` - Git 제외 파일

모든 파일 위치: `c:\Users\shina\.gemini\antigravity\playground\cryo-nadir`

## 🚀 방법 1: GitHub 웹 인터페이스로 업로드 (가장 쉬움)

### 1단계: GitHub 리포지토리 생성

1. [GitHub](https://github.com)에 로그인
2. 오른쪽 상단 **+** 버튼 클릭 → **New repository** 선택
3. 리포지토리 정보 입력:
   ```
   Repository name: heding-landing-page
   Description: HEDING 커리어 컨설팅 랜딩페이지
   Public 선택 (GitHub Pages는 Public만 무료)
   ✅ Add a README file (체크하지 않음)
   ```
4. **Create repository** 클릭

### 2단계: 파일 업로드

1. 생성된 리포지토리 페이지에서 **uploading an existing file** 링크 클릭
2. 다음 파일들을 드래그 앤 드롭:
   ```
   c:\Users\shina\.gemini\antigravity\playground\cryo-nadir\index.html
   c:\Users\shina\.gemini\antigravity\playground\cryo-nadir\styles.css
   c:\Users\shina\.gemini\antigravity\playground\cryo-nadir\script.js
   c:\Users\shina\.gemini\antigravity\playground\cryo-nadir\backend-setup.md
   c:\Users\shina\.gemini\antigravity\playground\cryo-nadir\README.md
   c:\Users\shina\.gemini\antigravity\playground\cryo-nadir\.gitignore
   ```
3. Commit message에 입력: `Initial commit: HEDING landing page`
4. **Commit changes** 클릭

### 3단계: GitHub Pages 활성화

1. 리포지토리에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source** 섹션에서:
   - Branch: `main` (또는 `master`) 선택
   - Folder: `/ (root)` 선택
4. **Save** 클릭
5. 1~2분 후 페이지 상단에 배포 URL이 표시됩니다:
   ```
   Your site is live at https://YOUR-USERNAME.github.io/heding-landing-page/
   ```

### 4단계: 확인

- 배포 URL을 브라우저에서 열어 확인
- 첫 배포는 최대 10분 정도 소요될 수 있습니다

---

## 🚀 방법 2: GitHub Desktop 사용 (Git GUI)

### 1단계: GitHub Desktop 설치

1. [GitHub Desktop](https://desktop.github.com/) 다운로드 및 설치
2. GitHub 계정으로 로그인

### 2단계: 로컬 리포지토리 생성

1. GitHub Desktop에서 **File** → **Add local repository**
2. 폴더 선택: `c:\Users\shina\.gemini\antigravity\playground\cryo-nadir`
3. "The directory does not appear to be a Git repository" 오류 시:
   - **create a repository** 클릭
   - **Create repository** 확인

### 3단계: 커밋 및 푸시

1. 왼쪽에 모든 파일이 표시됨
2. 하단 Summary에 입력: `Initial commit`
3. **Commit to main** 클릭
4. 상단 **Publish repository** 클릭
5. 설정:
   ```
   Name: heding-landing-page
   Description: HEDING 커리어 컨설팅 랜딩페이지
   ⬜ Keep this code private (체크 해제 - Public으로)
   ```
6. **Publish repository** 클릭

### 4단계: GitHub Pages 활성화

- 방법 1의 3단계와 동일

---

## 🚀 방법 3: Git CLI 설치 후 배포 (권장)

### Git 설치

1. [Git for Windows](https://git-scm.com/download/win) 다운로드
2. 설치 후 PowerShell 재시작

### Git을 사용한 배포

```powershell
# 프로젝트 폴더로 이동
cd c:\Users\shina\.gemini\antigravity\playground\cryo-nadir

# Git 초기화
git init

# 사용자 정보 설정 (최초 1회)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: HEDING landing page"

# GitHub에서 리포지토리를 먼저 생성하고 URL을 복사한 후:
git remote add origin https://github.com/YOUR-USERNAME/heding-landing-page.git

# 푸시
git branch -M main
git push -u origin main
```

그 다음 방법 1의 3단계로 GitHub Pages 활성화

---

## 🎯 배포 후 확인 사항

### ✅ 배포 성공 확인

1. GitHub 리포지토리 → **Actions** 탭에서 배포 진행 상황 확인
2. 초록색 체크 표시가 뜨면 배포 완료
3. 배포 URL 접속하여 확인

### ✅ 테스트 항목

- [ ] Hero 섹션 정상 표시
- [ ] 가격 카드 레이아웃 확인
- [ ] 헤드헌터 선택 버튼 작동
- [ ] 아코디언 펼침/접힘 작동
- [ ] 고객 신청 폼 검증 작동
- [ ] 코치 지원 폼 검증 작동
- [ ] 모바일 반응형 확인 (개발자 도구 F12)

### ⚠️ 문제 해결

#### 404 에러가 나는 경우
- Settings → Pages에서 Source가 올바르게 설정되었는지 확인
- 파일 이름이 `index.html`인지 확인 (대소문자 주의)

#### CSS/JS가 적용되지 않는 경우
- 브라우저 개발자 도구(F12) → Console 탭에서 에러 확인
- `index.html`에서 CSS/JS 파일 경로가 상대 경로인지 확인

#### 폼 제출이 작동하지 않는 경우
- `script.js`의 Google Apps Script URL을 설정했는지 확인
- `backend-setup.md`를 참고하여 백엔드 설정

---

## 🔄 파일 수정 및 재배포

### GitHub 웹 인터페이스 사용

1. GitHub 리포지토리에서 파일 클릭
2. 연필 아이콘(Edit) 클릭
3. 수정 후 **Commit changes** 클릭
4. 자동으로 재배포됨 (1~2분 소요)

### GitHub Desktop 사용

1. 로컬에서 파일 수정
2. GitHub Desktop에서 변경 사항 확인
3. Summary 입력 후 **Commit**
4. **Push origin** 클릭

### Git CLI 사용

```powershell
# 파일 수정 후
git add .
git commit -m "Update: describe your changes"
git push
```

---

## 📊 배포 후 추가 작업

### 1. 커스텀 도메인 설정 (선택)

1. Settings → Pages → Custom domain에 도메인 입력
2. DNS 설정에서 CNAME 레코드 추가:
   ```
   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```

### 2. Google Analytics 추가

`index.html`의 `<head>` 섹션에 추가:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. 백엔드 연동

1. `backend-setup.md` 파일 참고
2. Google Sheets 및 Apps Script 설정
3. `script.js`에 Apps Script URL 추가
4. GitHub에 푸시하여 재배포

---

## 🎉 완료!

이제 HEDING 랜딩페이지가 GitHub Pages에 배포되었습니다!

**다음 단계:**
1. 위 방법 중 하나를 선택하여 배포
2. 배포 URL을 확인
3. 백엔드 설정 (Google Sheets)
4. 실제 이미지 추가
5. 도메인 연결 (선택)

## 📞 문의

배포 과정에서 문제가 발생하면:
- GitHub Pages 문서: https://pages.github.com/
- GitHub Desktop 문서: https://docs.github.com/en/desktop
- Git 문서: https://git-scm.com/doc
