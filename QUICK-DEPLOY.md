# GitHub Pages 빠른 배포 가이드

## 🚀 현재 상황
- ✅ 모든 파일 준비 완료
- ✅ Git CLI 설치 완료
- ⏳ **PowerShell 환경 변수가 아직 업데이트되지 않음**

## ⚡ 빠른 배포 (3가지 방법)

### 방법 1: PowerShell 스크립트 실행 (추천)

```powershell
# PowerShell에서 실행
cd c:\Users\shina\.gemini\antigravity\playground\cryo-nadir
.\deploy.ps1
```

스크립트가 자동으로:
- Git 초기화
- 파일 커밋
- 다음 단계 안내

### 방법 2: Git Bash 사용 (가장 확실함)

1. **Git Bash 열기**
   - 폴더에서 오른쪽 클릭 → "Git Bash Here"
   - 또는 시작 메뉴에서 "Git Bash" 검색

2. **스크립트 실행**
   ```bash
   cd /c/Users/shina/.gemini/antigravity/playground/cryo-nadir
   ./deploy.sh
   ```

### 방법 3: 수동 명령어 (PowerShell 재시작 후)

1. **PowerShell 완전히 종료 후 재시작**

2. **명령어 실행**
   ```powershell
   cd c:\Users\shina\.gemini\antigravity\playground\cryo-nadir
   
   git init
   git config user.name "HEDING"
   git config user.email "heding@example.com"
   git add .
   git commit -m "Initial commit: HEDING landing page"
   git branch -M main
   ```

---

## 📌 다음 단계 (Git 준비 후)

### 1️⃣ GitHub 리포지토리 생성

브라우저에서 https://github.com/new 접속

```
Repository name: heding-landing-page
Description: HEDING 커리어 컨설팅 랜딩페이지
✅ Public 선택
❌ Add a README file (체크 해제)
```

**Create repository** 클릭

### 2️⃣ 리포지토리에 푸시

생성된 페이지에서 **"...or push an existing repository from the command line"** 섹션의 명령어 복사

또는 아래 명령어 실행 (YOUR-USERNAME을 실제 GitHub 사용자명으로 변경):

```bash
git remote add origin https://github.com/YOUR-USERNAME/heding-landing-page.git
git push -u origin main
```

**또는 GitHub CLI 사용** (설치된 경우):
```bash
gh repo create heding-landing-page --public --source=. --push
```

### 3️⃣ GitHub Pages 활성화

1. GitHub 리포지토리 페이지에서 **Settings** 클릭
2. 왼쪽 메뉴 **Pages** 클릭
3. **Source** 설정:
   - Branch: `main`
   - Folder: `/ (root)`
4. **Save** 클릭

1~2분 후 배포 URL 확인:
```
https://YOUR-USERNAME.github.io/heding-landing-page/
```

---

## 🎯 완료 체크리스트

배포 완료 후 확인:

- [ ] GitHub Pages URL 접속 가능
- [ ] Hero 섹션 정상 표시
- [ ] 가격 카드 정렬 확인
- [ ] 헤드헌터 선택 버튼 작동
- [ ] 아코디언 펼침/접힘 작동
- [ ] 폼 검증 작동

---

## ❓ 문제 해결

### "git: command not found" 에러
→ **PowerShell을 완전히 종료했다가 다시 시작**하세요

### PowerShell에서 스크립트 실행 에러
→ **Git Bash를 사용**하세요 (방법 2)

### Authentication 에러 (git push 시)
1. Personal Access Token 생성:
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token → repo 권한 선택
2. Username: GitHub 사용자명
3. Password: 생성한 토큰 입력

### GitHub CLI로 더 쉽게 배포하기
```powershell
# GitHub CLI 설치
winget install GitHub.cli

# GitHub 로그인
gh auth login

# 리포지토리 생성 및 푸시 (한 번에)
gh repo create heding-landing-page --public --source=. --push

# GitHub Pages 활성화도 자동화 가능
```

---

## 📞 도움이 필요하신가요?

- DEPLOYMENT.md 참고 (상세 가이드)
- backend-setup.md 참고 (백엔드 연동)
- walkthrough.md 참고 (프로젝트 전체 설명)

**배포 완료 후 해야 할 일:**
1. Google Sheets 백엔드 설정
2. script.js에 Apps Script URL 추가
3. 실제 이미지 교체
4. 도메인 연결 (선택)
