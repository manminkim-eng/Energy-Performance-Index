# 성능지표 — MANMIN-Ver3.0 PWA 파일 세트

## GitHub Pages 배포 방법

1. 이 폴더의 **모든 파일**을 GitHub 저장소 루트에 업로드하세요.
2. Settings → Pages → Branch: `main`, folder: `/ (root)` 설정 후 Save.
3. 배포된 URL (예: `https://username.github.io/repo/`)에서 접속하면 설치 버튼이 활성화됩니다.

## 파일 구조
```
/
├── index.html          ← 메인 앱
├── manifest.json       ← PWA 매니페스트 (앱 이름: 성능지표)
├── sw.js               ← Service Worker (오프라인 캐싱)
├── favicon.ico         ← 브라우저 탭 아이콘
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png  ← iOS iPad
    ├── icon-180x180.png  ← iOS iPhone (apple-touch-icon)
    ├── icon-192x192.png  ← Android / Chrome (maskable)
    ├── icon-384x384.png
    └── icon-512x512.png  ← Splash / Maskable
```

## PWA 설치 방법
- **Android/Chrome**: 헤더의 [설치] 버튼 클릭 또는 하단 설치 배너 → [설치하기]
- **iOS Safari**: 헤더의 [설치] 버튼 클릭 → 안내 팝업에 따라 공유→홈화면에 추가
- **PC Chrome/Edge**: 주소창 오른쪽 설치 아이콘 클릭

## 앱 정보
- 앱 이름: **성능지표**
- 테마 색상: #10b981 (에메랄드 그린)
- 배경 색상: #0f1a2e (딥 네이비)
- 오프라인 지원: ✓ (Service Worker 캐싱)
