import React, { useState, useEffect } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec } from '../types';

interface ColorRecommendationProps {
  coffeeBean: CoffeeBean;
  onColorsGenerated: (colors: ColorRec[]) => void;
  onBack: () => void;
}

const ColorRecommendation: React.FC<ColorRecommendationProps> = ({ 
  coffeeBean, 
  onColorsGenerated, 
  onBack 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [colors, setColors] = useState<ColorRec[]>([]);
  const [selectedColors, setSelectedColors] = useState<ColorRec[]>([]);

  // Mock AI color generation (실제로는 LLM API 호출)
  const generateColors = async () => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock color recommendations based on coffee characteristics
    const mockColors: ColorRec[] = generateMockColors(coffeeBean);
    setColors(mockColors);
    setSelectedColors(mockColors.slice(0, 3)); // Default select first 3
    setIsGenerating(false);
  };

  const generateMockColors = (bean: CoffeeBean): ColorRec[] => {
    const colorPalettes = {
      light: [
        { hex: '#FFD700', name: '골든 옐로우', description: '밝고 상큼한 느낌' },
        { hex: '#FF6B35', name: '코랄 오렌지', description: '과일의 달콤함' },
        { hex: '#98FB98', name: '팔레 그린', description: '신선한 초록빛' },
        { hex: '#FFB6C1', name: '라이트 핑크', description: '부드러운 로맨틱' },
        { hex: '#87CEEB', name: '스카이 블루', description: '맑고 시원한 느낌' }
      ],
      medium: [
        { hex: '#8B4513', name: '사들 브라운', description: '고소한 견과류' },
        { hex: '#D2691E', name: '초콜릿 브라운', description: '달콤한 초콜릿' },
        { hex: '#CD853F', name: '페루 브라운', description: '부드러운 카라멜' },
        { hex: '#DEB887', name: '버번 우드', description: '따뜻한 우드톤' },
        { hex: '#F4A460', name: '샌디 브라운', description: '자연스러운 느낌' }
      ],
      dark: [
        { hex: '#2F1B14', name: '다크 브라운', description: '깊은 로스트' },
        { hex: '#1C1C1C', name: '차콜 블랙', description: '강렬한 바디감' },
        { hex: '#4A4A4A', name: '스모키 그레이', description: '스모키한 향' },
        { hex: '#654321', name: '에스프레소', description: '집중된 맛' },
        { hex: '#8B0000', name: '버건디 레드', description: '와인같은 깊이' }
      ],
      espresso: [
        { hex: '#000000', name: '퓨어 블랙', description: '순수한 강렬함' },
        { hex: '#1a1a1a', name: '미드나잇', description: '깊은 어둠' },
        { hex: '#2d1810', name: '다크 에스프레소', description: '집중된 에너지' },
        { hex: '#3c2f2f', name: '리치 브라운', description: '풍부한 바디' },
        { hex: '#654321', name: '에스프레소 브라운', description: '클래식한 맛' }
      ]
    };

    return colorPalettes[bean.roastLevel] || colorPalettes.medium;
  };

  const toggleColorSelection = (color: ColorRec) => {
    if (selectedColors.find(c => c.hex === color.hex)) {
      setSelectedColors(selectedColors.filter(c => c.hex !== color.hex));
    } else if (selectedColors.length < 5) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleContinue = () => {
    if (selectedColors.length >= 3) {
      onColorsGenerated(selectedColors);
    }
  };

  useEffect(() => {
    generateColors();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-coffee-800 mb-2">
          AI가 추천한 컬러 🎨
        </h3>
        <p className="text-gray-600">
          {coffeeBean.beanName}의 특성을 바탕으로 {colors.length}개의 컬러를 추천했어요
        </p>
      </div>

      {isGenerating ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">AI가 컬러를 분석하고 있어요...</p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-3">
              추천 컬러 (3-5개 선택)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colors.map((color) => (
                <div
                  key={color.hex}
                  onClick={() => toggleColorSelection(color)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedColors.find(c => c.hex === color.hex)
                      ? 'border-coffee-600 bg-coffee-50'
                      : 'border-gray-200 hover:border-coffee-300'
                  }`}
                >
                  <div 
                    className="w-full h-20 rounded-md mb-3"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="text-center">
                    <p className="font-medium text-gray-800">{color.name}</p>
                    <p className="text-sm text-gray-600">{color.description}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">{color.hex}</p>
                  </div>
                  {selectedColors.find(c => c.hex === color.hex) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-coffee-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">선택된 컬러</h4>
            <div className="flex flex-wrap gap-2">
              {selectedColors.map((color) => (
                <div
                  key={color.hex}
                  className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200"
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className="text-sm font-medium">{color.name}</span>
                  <button
                    onClick={() => toggleColorSelection(color)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {selectedColors.length}/5 컬러 선택됨
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="btn-secondary"
            >
              이전
            </button>
            
            <button
              onClick={handleContinue}
              disabled={selectedColors.length < 3}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedColors.length >= 3
                  ? 'bg-coffee-600 hover:bg-coffee-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              메시 그라디언트 생성하기 ✨
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorRecommendation;
