#!/bin/bash
# HEDING Landing Page - GitHub Pages 배포 스크립트

echo "======================================"
echo "HEDING Landing Page 배포 시작"
echo "======================================"
echo ""

# 1. Git 초기화
echo "[1/6] Git 리포지토리 초기화..."
git init

# 2. 사용자 정보 설정
echo "[2/6] Git 사용자 정보 설정..."
git config user.name "HEDING"
git config user.email "heding@example.com"

# 3. 파일 스테이징
echo "[3/6] 파일 추가..."
git add .

# 4. 커밋
echo "[4/6] 커밋 생성..."
git commit -m "Initial commit: HEDING landing page"

# 5. 브랜치 이름 변경
echo "[5/6] 메인 브랜치 설정..."
git branch -M main

echo ""
echo "======================================"
echo "로컬 Git 리포지토리 준비 완료!"
echo "======================================"
echo ""
echo "다음 단계를 진행해주세요:"
echo ""
echo "1. GitHub에서 새 리포지토리 생성"
echo "   - https://github.com/new 접속"
echo "   - Repository name: heding-landing-page"
echo "   - Public 선택"
echo "   - Create repository 클릭"
echo ""
echo "2. 생성된 리포지토리 URL을 복사한 후 아래 명령어 실행:"
echo ""
echo "   git remote add origin <YOUR_REPO_URL>"
echo "   git push -u origin main"
echo ""
echo "   예시:"
echo "   git remote add origin https://github.com/YOUR-USERNAME/heding-landing-page.git"
echo "   git push -u origin main"
echo ""
echo "3. GitHub Pages 활성화"
echo "   - 리포지토리 Settings → Pages"
echo "   - Source: main 브랜치, / (root) 선택"
echo "   - Save 클릭"
echo ""
echo "======================================"
