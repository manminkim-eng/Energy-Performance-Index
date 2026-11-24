# 매뉴얼 재생성 도구 (EPI 에너지성능지표 산정기 사용자 매뉴얼)

RTS-MANMIN 매뉴얼과 같은 공통 엔진(`manual_engine.py`: CSS·레이아웃·번호 배지)을 쓴다. 화면이 바뀌면 아래 3단계.

| 단계 | 명령 | 결과 |
|---|---|---|
| 1 캡처 | `node capture_epi.js <저장소 경로> <raw 폴더>` | 화면 PNG 14장 + `_marks.json`(번호 배지 % 좌표) + `_example.json`(예제 결과 검증값) |
| 2 변환·생성 | PNG → WebP(품질 82)를 `../images/`, `_marks.json` 복사 → `MANUAL_DIR=.. python gen_manual_epi.py` | `../index.html` |
| 3 PDF | `node pdf_epi.js .. EPI_사용자매뉴얼_Ver-6.1.pdf "EPI 에너지성능지표 산정기 사용자 매뉴얼 Ver-6.1"` | A4 PDF |

- Playwright(Chromium) 필요. `serve.js`가 CDN(React·Babel·html2canvas)과 Google Fonts를 로컬 파일로 대체(경로 `V`를 실행 환경에 맞게 수정).
- 예제 값: 약식 27항목 체크 → 67점 · 정식 배점 20항목 → 76.00점 적합. `_example.json`(cases: 약식 의무 연동 · 공공 74/65 · 법14조의2 리모델링 · 500㎡ 미만 · 판정 보류)으로 매 재캡처마다 확인.
- 윈도우: node = 파이썬 playwright 내장 node, `MM_PW`(playwright package 경로) · `MM_PORT`(포트) 환경변수, serve.js setup()을 빈 함수로 바꾼 CDN 통과 사본으로 실행. 공사명 · 작성자는 웹 기본값이 없어 캡처가 예제 값을 넣는다.
- 배지는 이미지에 그리지 않고 HTML 위에 겹친다 — 재캡처 후 본문 수정 불필요.
