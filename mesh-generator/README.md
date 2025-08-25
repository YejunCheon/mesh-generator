# ☕ Mesh Gradient Card Generator

커피 원두의 특성을 시각적으로 표현하는 메시 그라디언트 카드를 생성하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **커피 원두 정보 입력**: 산지, 원두명, 배전도, 플레이버 노트, 강도 지표
- **AI 컬러 추천**: 커피 특성에 맞는 컬러 팔레트 자동 생성
- **메시 그라디언트 편집**: 노이즈, 방향, 블렌드 모드 등 세부 조정
- **실시간 미리보기**: SVG 기반 실시간 카드 미리보기
- **다운로드**: SVG 형식으로 카드 다운로드
- **Supabase 저장**: 클라우드에 생성된 카드 저장 (Phase 2)

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Form Management**: React Hook Form
- **Build Tool**: Create React App

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 3. 프로덕션 빌드
```bash
npm run build
```

## 🎯 사용 방법

### Step 1: 원두 정보 입력
- 국가, 지역, 농장명 입력
- 원두명 입력
- 배전도 선택 (라이트/미디엄/다크/에스프레소)
- 플레이버 노트 입력 (최대 5개)
- 산도, 당도, 바디감 강도 설정 (1-10)

### Step 2: AI 컬러 추천
- 입력된 원두 정보를 바탕으로 AI가 컬러 추천
- 3-5개 컬러 중 원하는 컬러 선택

### Step 3: 메시 그라디언트 편집
- 실시간 미리보기로 카드 확인
- 노이즈 강도, 그라디언트 방향 조정
- 블렌드 모드, 컬러 분포, 테두리 스타일 설정
- 표시 옵션 토글 (원두명, 플레이버, 강도 정보)

## 🎨 커스터마이징 옵션

- **노이즈 강도**: 0-100% (텍스처 효과)
- **그라디언트 방향**: 0-360도
- **블렌드 모드**: 일반, 오버레이, 멀티플라이, 스크린
- **컬러 분포**: 균등, 집중, 확산
- **테두리 스타일**: 둥근 모서리, 각진 모서리, 테두리 없음

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── CoffeeInputForm.tsx      # 원두 정보 입력 폼
│   ├── ColorRecommendation.tsx  # AI 컬러 추천
│   └── MeshGradientEditor.tsx   # 메시 그라디언트 편집기
├── types/
│   └── index.ts                 # TypeScript 타입 정의
├── App.tsx                      # 메인 애플리케이션
└── index.tsx                    # 진입점
```

## 🔮 개발 로드맵

### Phase 1: MVP (완료) ✅
- [x] React 프로젝트 설정
- [x] 기본 UI 컴포넌트 개발
- [x] 폼 입력 시스템 구현
- [x] Mock AI 컬러 추천
- [x] 기본 SVG 생성 로직
- [x] 다운로드 기능

### Phase 2: 고급 기능 (진행 예정)
- [ ] 실제 LLM API 연동
- [ ] 고급 파라미터 조정 시스템
- [ ] Supabase 익명 저장
- [ ] 이미지 갤러리

### Phase 3: 사용자 시스템 (진행 예정)
- [ ] 회원가입/로그인
- [ ] 사용자별 이미지 관리
- [ ] 프로필 설정

## 🎨 색상 팔레트

프로젝트는 커피 테마의 커스텀 색상 팔레트를 사용합니다:

- **Coffee 50-900**: 다양한 브라운 톤
- **Gray Scale**: UI 요소용
- **White**: 카드 배경용

## 📱 반응형 디자인

- **Mobile First**: 모바일 우선 설계
- **Tablet**: 태블릿 최적화
- **Desktop**: 데스크톱 확장 기능

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## ☕ 커피 원두 정보

이 애플리케이션은 다음과 같은 커피 원두 정보를 지원합니다:

- **산지**: 에티오피아, 브라질, 콜롬비아, 과테말라 등
- **배전도**: 라이트, 미디엄, 다크, 에스프레소
- **플레이버**: 과일, 초콜릿, 견과류, 카라멜, 바닐라 등
- **강도**: 산도, 당도, 바디감 (1-10 스케일)

---

**Made with ☕ and ❤️ for coffee lovers around the world**
