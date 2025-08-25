import React, { useState, useCallback } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec } from '../types';
import { generateColorsWithGemini } from '../services/geminiService';

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
  const [colors, setColors] = useState<ColorRec[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const generateColors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const generatedColors = await generateColorsWithGemini(coffeeBean);
      setColors(generatedColors);
      onColorsGenerated(generatedColors);
    } catch (err) {
      setError('컬러 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('컬러 생성 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }, [coffeeBean, onColorsGenerated]);

  const handleColorSelect = (hex: string) => {
    setSelectedColors(prev => 
      prev.includes(hex) 
        ? prev.filter(color => color !== hex)
        : [...prev, hex]
    );
  };

  const handleContinue = () => {
    if (selectedColors.length > 0) {
      const selectedColorObjects = colors.filter(color => selectedColors.includes(color.hex));
      onColorsGenerated(selectedColorObjects);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-3xl font-bold text-black mb-8">AI 컬러 추천</h3>
      
      {/* 커피 정보 요약 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-black mb-4">선택된 커피 정보</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">원산지:</span> 
            <span className="ml-2 text-gray-900">
              {coffeeBean.origin.country}
              {coffeeBean.origin.region && `, ${coffeeBean.origin.region}`}
              {coffeeBean.origin.farm && `, ${coffeeBean.origin.farm}`}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">원두명:</span> 
            <span className="ml-2 text-gray-900">{coffeeBean.beanName}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">배전도:</span> 
            <span className="ml-2 text-gray-900">
              {coffeeBean.roastLevel === 'light' ? '라이트' : 
               coffeeBean.roastLevel === 'medium' ? '미디엄' : 
               coffeeBean.roastLevel === 'dark' ? '다크' : '에스프레소'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">플레이버:</span> 
            <span className="ml-2 text-gray-900">{coffeeBean.flavorNotes.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* 컬러 생성 버튼 */}
      {colors.length === 0 && !isLoading && (
        <div className="text-center mb-8">
          <button
            onClick={generateColors}
            className="btn-primary px-8 py-4 text-lg"
            disabled={isLoading}
          >
            {isLoading ? '컬러 생성 중...' : 'AI 컬러 추천 받기'}
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">AI가 커피 특성을 분석하여 컬러를 추천하고 있습니다...</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={generateColors}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 생성된 컬러들 */}
      {colors.length > 0 && !isLoading && (
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-black mb-4">
            추천된 컬러 (최대 5개 선택)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map((color) => (
              <div
                key={color.hex}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedColors.includes(color.hex)
                    ? 'border-black shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleColorSelect(color.hex)}
              >
                <div 
                  className="w-full h-24 rounded-lg mb-3"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-center">
                  <p className="font-semibold text-black mb-1">{color.name}</p>
                  <p className="text-sm text-gray-600 mb-2">{color.hex}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {color.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 선택된 컬러 요약 */}
          {selectedColors.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                선택된 컬러: <span className="font-semibold">{selectedColors.length}개</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedColors.map(hex => (
                  <div
                    key={hex}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 계속하기 버튼 */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="btn-secondary"
            >
              이전
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedColors.length === 0}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedColors.length > 0
                  ? 'bg-black hover:bg-gray-800 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              선택 완료 ({selectedColors.length}/5)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorRecommendation;
