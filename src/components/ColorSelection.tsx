import React, { useState } from 'react';
import { ColorRecommendation as ColorRec } from '../types';

interface ColorSelectionProps {
  colors: ColorRec[];
  onConfirm: (selectedColors: ColorRec[]) => void;
  onBack: () => void;
}

const ColorSelection: React.FC<ColorSelectionProps> = ({ colors, onConfirm, onBack }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleColorSelect = (hex: string) => {
    setSelectedColors(prev => 
      prev.includes(hex) 
        ? prev.filter(color => color !== hex)
        : [...prev, hex]
    );
  };

  const handleConfirm = () => {
    if (selectedColors.length > 0) {
      const selectedColorObjects = colors.filter(color => selectedColors.includes(color.hex));
      onConfirm(selectedColorObjects);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-3xl font-bold text-black mb-8">원하는 컬러를 선택해주세요</h3>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          AI가 추천한 컬러 중에서 마음에 드는 컬러를 선택하세요. (최대 5개)
        </p>
      </div>

      {/* 생성된 컬러들 */}
      <div className="space-y-6 mb-8">
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
      </div>

      {/* 선택된 컬러 요약 */}
      {selectedColors.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
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

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          이전
        </button>
        <button
          onClick={handleConfirm}
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
  );
};

export default ColorSelection;
