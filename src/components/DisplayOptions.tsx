import React from 'react';
import { CoffeeBean } from '../types';

interface DisplayOptionsProps {
  coffeeBean: CoffeeBean;
  backgroundOnly: boolean;
  setBackgroundOnly: (value: boolean) => void;
  showName: boolean;
  setShowName: (value: boolean) => void;
  showFlavor: boolean;
  setShowFlavor: (value: boolean) => void;
  showIntensity: boolean;
  setShowIntensity: (value: boolean) => void;
  showBlend: boolean;
  setShowBlend: (value: boolean) => void;
  toggleLanguage: () => void;
  isTranslating: boolean;
  currentLang: 'ko' | 'en';
}

const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  coffeeBean,
  backgroundOnly,
  setBackgroundOnly,
  showName,
  setShowName,
  showFlavor,
  setShowFlavor,
  showIntensity,
  setShowIntensity,
  showBlend,
  setShowBlend,
  toggleLanguage,
  isTranslating,
  currentLang,
}) => {
  return (
    <div className="space-y-4">
      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
        <input type="checkbox" checked={backgroundOnly} onChange={(e) => setBackgroundOnly(e.target.checked)} className={'mr-4 text-black focus:ring-black w-5 h-5'} />
        <span className="font-medium">배경만 표시</span>
      </label>
      <div className="flex items-center p-4 border border-gray-200 rounded-lg">
        <input type="checkbox" checked={showName} onChange={(e) => setShowName(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
        <span className="font-medium flex-grow">원두 정보 표시</span>
        <button 
          onClick={toggleLanguage} 
          disabled={isTranslating || backgroundOnly || !showName}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTranslating ? '번역 중...' : (currentLang === 'ko' ? '영문으로' : '원본으로')}
        </button>
      </div>
      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
        <input type="checkbox" checked={showFlavor} onChange={(e) => setShowFlavor(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
        <span className="font-medium">플레이버 노트 표시</span>
      </label>
      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
        <input type="checkbox" checked={showIntensity} onChange={(e) => setShowIntensity(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
        <span className="font-medium">강도 정보 표시</span>
      </label>
      {coffeeBean.originType === 'blending' && (
        <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <input type="checkbox" checked={showBlend} onChange={(e) => setShowBlend(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
          <span className="font-medium">블렌드 정보 표시</span>
        </label>
      )}
    </div>
  );
};

export default DisplayOptions;
