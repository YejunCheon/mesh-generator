import React from 'react';

interface DiscreteSliderProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string }>;
  className?: string;
  showProgressBar?: boolean;
}

const DiscreteSlider: React.FC<DiscreteSliderProps> = ({
  value,
  onChange,
  options,
  className = '',
  showProgressBar = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, optionValue: string | number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // 스페이스바로 인한 스크롤 방지
      onChange(optionValue);
    }
  };

  const currentIndex = options.findIndex(option => option.value === value);
  const progressPercentage = currentIndex >= 0 ? ((currentIndex + 1) / options.length) * 100 : 0;

  return (
    <div className={`w-full pb-5 ${className}`}>
      {/* Progress Bar (선택적) */}
      {false && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-black rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="relative flex items-center justify-between">
        {/* 점들을 연결하는 배경 라인 */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 bg-gray-300" />

        {/* 각 옵션 버튼과 라벨 */}
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            // 1. 클릭 핸들러와 접근성 속성을 부모 div로 이동
            <div
              key={option.value}
              className="relative z-10 flex h-5 w-5 items-center justify-center cursor-pointer"
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={option.label}
            >
              {/* 2. 기존 button을 시각적 표시만을 위한 div로 변경 */}
              <div
                className={`
                  rounded-full transition-all duration-200 ease-in-out
                  ${
                    isSelected
                      ? 'w-5 h-5 bg-black' // 선택 시 검은색으로 채움
                      : 'w-3 h-3 bg-gray-400'
                  }
                `}
              />
              <span
                className={`
                  absolute top-full mt-2 text-xs text-center whitespace-nowrap
                  left-1/2 -translate-x-1/2
                  ${
                    isSelected
                      ? 'font-semibold text-black'
                      : 'text-gray-500'
                  }
                `}
              >
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscreteSlider;