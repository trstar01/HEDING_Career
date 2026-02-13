# HEDING Landing Page - GitHub Pages 배포 스크립트 (PowerShell)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "HEDING Landing Page 배포 시작" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Git 실행 파일 경로 확인
$gitPaths = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
)

$gitExe = $null
foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitExe = $path
        break
    }
}

if (-not $gitExe) {
    # 환경변수에서 찾기
    try {
        $gitExe = (Get-Command git -ErrorAction Stop).Source
    } catch {
        Write-Host "❌ Git을 찾을 수 없습니다!" -ForegroundColor Red
        Write-Host ""
        Write-Host "다음 중 하나를 선택하세요:" -ForegroundColor Yellow
        Write-Host "1. Git Bash를 열고 deploy.sh 스크립트 실행" -ForegroundColor Yellow
        Write-Host "2. PowerShell을 재시작한 후 다시 시도" -ForegroundColor Yellow
        Write-Host "3. DEPLOYMENT.md의 수동 배포 방법 참고" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✓ Git 찾음: $gitExe" -ForegroundColor Green
Write-Host ""

# 1. Git 초기화
Write-Host "[1/6] Git 리포지토리 초기화..." -ForegroundColor Yellow
& $gitExe init

# 2. 사용자 정보 설정
Write-Host "[2/6] Git 사용자 정보 설정..." -ForegroundColor Yellow
& $gitExe config user.name "HEDING"
& $gitExe config user.email "heding@example.com"

# 3. 파일 스테이징
Write-Host "[3/6] 파일 추가..." -ForegroundColor Yellow
& $gitExe add .

# 4. 커밋
Write-Host "[4/6] 커밋 생성..." -ForegroundColor Yellow
& $gitExe commit -m "Initial commit: HEDING landing page"

# 5. 브랜치 이름 변경
Write-Host "[5/6] 메인 브랜치 설정..." -ForegroundColor Yellow
& $gitExe branch -M main

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "✓ 로컬 Git 리포지토리 준비 완료!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "📌 다음 단계를 진행해주세요:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. GitHub에서 새 리포지토리 생성" -ForegroundColor White
Write-Host "   - https://github.com/new 접속" -ForegroundColor Gray
Write-Host "   - Repository name: heding-landing-page" -ForegroundColor Gray
Write-Host "   - Public 선택" -ForegroundColor Gray
Write-Host "   - Create repository 클릭" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 생성된 리포지토리 URL을 복사한 후 아래 명령어 실행:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin <YOUR_REPO_URL>" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "   예시:" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/heding-landing-page.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. GitHub Pages 활성화" -ForegroundColor White
Write-Host "   - 리포지토리 Settings → Pages" -ForegroundColor Gray
Write-Host "   - Source: main 브랜치, / (root) 선택" -ForegroundColor Gray
Write-Host "   - Save 클릭" -ForegroundColor Gray
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 팁: GitHub CLI(gh)를 사용하면 더 쉽게 배포할 수 있습니다!" -ForegroundColor DarkGray
Write-Host "   winget install GitHub.cli" -ForegroundColor DarkGray
Write-Host ""
