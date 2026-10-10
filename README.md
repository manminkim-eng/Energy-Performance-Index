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

## v5.4.2 (2026-09-06) — 별지서식 산정서 미리보기 좌측 쏠림 정정
| 항목 | 기존 | 변경 |
|---|---|---|
| A4 시트 정렬(모바일·별도창) | `offset = scale<1 ? 0 : 중앙` → 축소 시 좌측 0px, 우측 16px 여백(쏠림) | `offset = max(0,(outerW−scaledW)/2)` — 전 폭 중앙 정렬(좌우 8px) |
| 별도창 outer 여백 | 20px 0 | 16px 0 20px |
| sw.js | epi-v5.4.0 | epi-v5.4.1 |

## v5.4.3 (2026-10-10) — 사용자 매뉴얼 연결
| 항목 | 위치 | 기존 | 변경 |
|---|---|---|---|
| 매뉴얼 링크 | 탭 막대 `.tab-bar-inner` (별지서식 산정서 다음) | — | `<a class="tb tb-manual" href="https://manminkim-eng.github.io/Energy-Performance-Index/manual/" target="_blank">📘 매뉴얼</a>` — 오른쪽 끝 정렬, 고정 URL(설치앱·로컬 사본에서도 공개 매뉴얼로). 헤더 버튼 0개 규격(§18-1) 유지 |
| `mmOpenManual(e)` | 스크립트(`openFormalWin` 앞) | — | 오프라인이면 이동 차단 + 토스트 「📘 매뉴얼은 인터넷 연결 시 열립니다」 |
| CSS | `.tb.tb-manual` 신설 | — | `margin-left:auto; text-decoration:none` |
| 사용자 매뉴얼 | `manual/` 신설 | — | `index.html`(목차·그림 14장·번호 배지·기술기준 해설·FAQ) · `images/`(WebP·`_marks.json`) · `assets/fonts/` · `EPI_사용자매뉴얼_Ver-5.4.pdf`(A4 31쪽) · `_tools/`(재캡처·재생성 도구) |
| sw.js | CACHE | epi-v5.4.1 | epi-v5.4.2 (index.html 변경 한 쌍) |
| 화면 버전 표기 | 헤더·제목 | Ver-5.4 | **Ver-5.4 유지** — 매뉴얼 판 = 화면 표기 Ver-5.4 |

계산 로직 변경 없음(index.html 변경 4행: CSS 2 · 탭 링크 1 · 함수 1 + 주석). 매뉴얼 4장 조문은 「건축물의 에너지절약설계기준」 국토교통부고시 제2026-360호(2026.7.8. 시행) 제6조·제15조·별지 제1호서식을 LawMCP 원문으로 대조(2026-10-10).

## v5.4.4 (2026-10-10) — 이용안내 창 문구 정정
| 항목 | 위치 | 기존 | 변경 |
|---|---|---|---|
| 사용방법 06 | 이용안내 창 「웹 사용 방법」 | 「열관류율 검토 연동」 — 헤더 [열관류율 검토 ↗] 버튼(존재하지 않음) | 「사용자 매뉴얼」 — 탭 막대 오른쪽 「📘 매뉴얼」 버튼 안내 |
| 목표 점수 제목 | 「EPI 목표 점수 기준」 | (제2025-738호) | (제15조① · 고시 제2026-360호) |
| 65점 기준 | 같은 섹션 1행 | 민간 건축물 (연면적 1,000㎡ 이상) | 일반 건축물 — 평점합계 65점 이상 (연면적과 무관) |
| 74점 기준 | 같은 섹션 2행 | 공공기관 건축물 (연면적 1,000㎡ 이상) | 공공기관 신축 건축물 (별동 증축 포함) — 74점 이상 |
| sw.js | CACHE | epi-v5.4.2 | epi-v5.4.3 (index.html 변경 한 쌍) |

근거: 「건축물의 에너지절약설계기준」 국토교통부고시 제2026-360호(2026.7.8. 시행) 제15조① — LawMCP 원문 대조(2026-10-10). 계산 로직 변경 없음(판정 로직은 이미 원문 기준).
