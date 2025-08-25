# Mesh Gradient Card Generator

커피 원두의 특성을 시각적으로 표현하는 메시 그라디언트 카드를 생성하는 웹 애플리케이션입니다.

## 🚀 시작하기

### 1. 프로젝트 설치

```bash
npm install
```

### 2. Gemini API 키 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키를 발급받으세요
2. 프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## ✨ 주요 기능

- **원두 정보 입력**: 국가, 지역, 농장명, 원두명, 배전도
- **Flavor Note 선택**: SCA 표준 기반의 체계적 분류
- **강도 지표**: 산도, 당도, 바디감 (1-10 스케일)
- **AI 컬러 추천**: Gemini API를 활용한 지능형 컬러 추천
- **메시 그라디언트 생성**: SVG 기반의 고품질 이미지 생성

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI API**: Google Gemini 1.5 Flash
- **UI Components**: Custom DiscreteSlider, 반응형 디자인
- **State Management**: React Hooks, Context API

## 📱 반응형 디자인

- **모바일**: Progress bar에서 step 명칭 숨김, dot만 표시
- **데스크톱**: 모든 정보 표시, 최적화된 레이아웃
- **태블릿**: 중간 크기 화면에 최적화된 UI

## 🔑 API 키 설정 없이 테스트

Gemini API 키를 설정하지 않으면 기본 컬러 팔레트가 제공됩니다:

- 사들 브라운 (#8B4513)
- 초콜릿 (#D2691E)
- 페루 (#CD853F)
- 샌드 (#F4A460)
- 다크 슬레이트 (#2F4F4F)

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── CoffeeInputForm.tsx
│   ├── ColorRecommendation.tsx
│   ├── DiscreteSlider.tsx
│   └── MeshGradientEditor.tsx
├── services/           # API 서비스
│   └── geminiService.ts
├── types/             # TypeScript 타입 정의
│   └── index.ts
├── data/              # 정적 데이터
│   └── flavor-wheel.ts
└── App.tsx           # 메인 애플리케이션
```

## 🎯 사용법

1. **원두 정보 입력**: 국가, 원두명, 배전도 순서로 입력
2. **Flavor & 강도**: SCA 표준 기반의 플레이버 노트 선택 및 강도 조정
3. **AI 컬러 추천**: Gemini API를 활용한 지능형 컬러 추천
4. **컬러 선택**: 추천된 컬러 중 최대 5개 선택
5. **메시 그라디언트 생성**: 선택된 컬러로 고품질 이미지 생성

## 🔧 개발

### 빌드

```bash
npm run build
```

### 테스트

```bash
npm test
```

### 린트

```bash
npm run lint
```

## 📄 라이선스

MIT License

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요.
Pull Request도 환영합니다!
