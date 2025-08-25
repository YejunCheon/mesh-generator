import React, { useState } from 'react';
import { CoffeeBean } from '../types';

interface CoffeeSummaryProps {
  coffeeBean: CoffeeBean;
  onConfirm: () => void;
  onBack: () => void;
}

const CoffeeSummary: React.FC<CoffeeSummaryProps> = ({ coffeeBean, onConfirm, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-3xl font-bold text-black mb-8">입력한 커피 정보를 확인해주세요</h3>
      
      {/* 커피 정보 요약 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-black mb-4">커피 정보</h4>
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
        
        {/* 강도 정보 */}
        <div className="mt-6">
          <h5 className="font-medium text-gray-700 mb-3">강도 지표</h5>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-black">{coffeeBean.intensity.acidity}/10</div>
              <div className="text-xs text-gray-600">산도</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">{coffeeBean.intensity.sweetness}/10</div>
              <div className="text-xs text-gray-600">당도</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">{coffeeBean.intensity.body}/10</div>
              <div className="text-xs text-gray-600">바디감</div>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="btn-secondary"
          disabled={isLoading}
        >
          이전
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800 text-white shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              AI 컬러 생성 중...
            </div>
          ) : (
            'AI 컬러 추천 받기'
          )}
        </button>
      </div>
    </div>
  );
};

export default CoffeeSummary;
