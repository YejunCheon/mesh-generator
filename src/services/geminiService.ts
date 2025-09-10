import { GoogleGenerativeAI } from '@google/generative-ai';
import { CoffeeBean, ColorRecommendation } from '../types';

// Gemini API 키는 환경변수에서 가져옵니다
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

// Gemini 모델 초기화
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateColorsWithGemini = async (coffeeBean: CoffeeBean): Promise<ColorRecommendation[]> => {
  // 시작 로그
  console.log('[Gemini] 컬러 추천 요청 시작');
  try {
    if (!API_KEY) {
      console.error('[Gemini] API 키가 없습니다.');
      throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    // Gemini 모델 가져오기
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 프롬프트 구성
    const originInfo = coffeeBean.originType === 'single'
      ? `- 원산지: ${coffeeBean.origin.country}${coffeeBean.origin.region ? `, ${coffeeBean.origin.region}` : ''}`
      : `- 블렌드 구성: ${coffeeBean.blend.components.map(c => `${c.country} ${c.ratio}%`).join(', ')}`;

    const prompt = `
당신은 커피 전문가이자 컬러 디자이너입니다.
다음 커피 원두의 특성을 분석하여 5개의 컬러를 추천해주세요. 다채로운 컬러를 추천해주셔야합니다. 꼭 커피라고 해서 brown 계열을 추천할 필요없어요.
5개의 컬러는 너무 비슷하면 안되고 조화를 이루어야합니다.

커피 정보:
${originInfo}
- 원두명: ${coffeeBean.beanName}
- 배전도: ${coffeeBean.roastLevel}
- 플레이버 노트: ${coffeeBean.flavorNotes.join(', ')}
- 강도: 산도 ${coffeeBean.intensity.acidity}/10, 당도 ${coffeeBean.intensity.sweetness}/10, 바디감 ${coffeeBean.intensity.body}/10

요구사항:
1. 각 컬러는 HEX 코드와 함께 제공
2. 컬러명은 한국어로 작성
3. 각 컬러가 왜 이 커피에 적합한지 설명
4. 커피의 특성과 감정적 연관성을 고려
5. 모던하고 세련된 컬러 팔레트 구성

응답 형식:
[
  {
    "hex": "#HEX코드",
    "name": "컬러명",
    "description": "이 컬러가 이 커피에 적합한 이유"
  }
]

JSON 형식으로만 응답해주세요.
`;

    // 어떤 프롬프트를 보냈는지 로그
    console.log('[Gemini] 보낸 프롬프트:', prompt);

    // Gemini API 호출
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('[Gemini] Raw API response:', text);

    // JSON 파싱 - 마크다운 코드 블록 제거
    try {
      let jsonText = text;

      // ```json ... ``` 형태의 마크다운 코드 블록 제거
      if (text.includes('```json')) {
        const jsonStart = text.indexOf('```json') + 7;
        const jsonEnd = text.lastIndexOf('```');
        if (jsonEnd > jsonStart) {
          jsonText = text.substring(jsonStart, jsonEnd).trim();
        }
      }

      // ``` ... ``` 형태의 일반 코드 블록 제거 (json 태그가 없는 경우)
      if (text.includes('```') && !text.includes('```json')) {
        const codeStart = text.indexOf('```') + 3;
        const codeEnd = text.lastIndexOf('```');
        if (codeEnd > codeStart) {
          jsonText = text.substring(codeStart, codeEnd).trim();
        }
      }

      console.log('[Gemini] Extracted JSON text:', jsonText);

      const colors = JSON.parse(jsonText);
      console.log('[Gemini] 컬러 추천 완료:', colors);
      return colors.map((color: any) => ({
        hex: color.hex,
        name: color.name,
        description: color.description
      }));
    } catch (parseError) {
      console.error('[Gemini] JSON 파싱 오류:', parseError);
      console.error('[Gemini] 파싱 시도한 텍스트:', text);
      throw new Error('API 응답을 파싱할 수 없습니다.');
    }

  } catch (error: any) {
    console.error('[Gemini] 컬러 추천 실패:', error?.message || error);

    // 에러 발생 시 기본 컬러 반환
    return [
      {
        hex: '#8B4513',
        name: '사들 브라운',
        description: '전통적인 커피의 깊이를 표현하는 클래식한 브라운'
      },
      {
        hex: '#D2691E',
        name: '초콜릿',
        description: '부드러운 커피의 달콤함을 나타내는 따뜻한 톤'
      },
      {
        hex: '#CD853F',
        name: '페루',
        description: '중간 배전도의 균형잡힌 특성을 보여주는 골든 브라운'
      },
      {
        hex: '#F4A460',
        name: '샌드',
        description: '라이트 로스트의 밝고 상쾌한 느낌을 표현'
      },
      {
        hex: '#2F4F4F',
        name: '다크 슬레이트',
        description: '다크 로스트의 강렬하고 깊은 특성을 나타내는 다크 톤'
      }
    ];
  }
};
