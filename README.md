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

## v5.4 (2026-09-05) — 별지서식 산정서 별도창
| 항목 | 기존(v5.3) | 변경(v5.4) |
|---|---|---|
| 상단 탭바 | ⌨️ EPI 점수 산정 · 📑 정식 산정 · 📄 A4 검토서 | + 4번째 「🗗 별지서식 산정서 ↗」(우측 정렬·파란 강조) → `openFormalWin()` |
| 별도창 | — | `index.html?view=formal` : `body.mm-formal-win` — 헤더·탭·점수바·FAB·배너·입력폼 숨김, 별지 제1호서식 A4(794px)만 표시 + 상단 고정바(🔄 갱신 · 🖨️ 인쇄/PDF · ✕ 닫기) |
| 동기화 | 탭 진입 시 pull | 본창 React 상태(proj·cfg·sel) 변경 시 `localStorage['epi54_formal_snap']` 저장 → 별도창 `storage` 이벤트로 실시간 반영(+ 수동 갱신) |
| 팝업 차단 | — | `window.open` 실패 시 토스트 후 정식 산정 탭으로 폴백 |
| PDF 파일명 | — | 별도창 document.title = `EPI_산정서_별지1호서식_공사명_YYYYMMDD` |
| sw.js | epi-v5.3.0 | epi-v5.4.0 |
