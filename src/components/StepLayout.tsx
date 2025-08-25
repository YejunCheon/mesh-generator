import React from 'react';

interface StepLayoutProps {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
  showBackButton?: boolean;
  showNextButton?: boolean;
}

const StepLayout: React.FC<StepLayoutProps> = ({
  title,
  children,
  onBack,
  onNext,
  nextButtonText = '다음',
  nextButtonDisabled = false,
  showBackButton = true,
  showNextButton = true
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-3xl font-bold text-black mb-8">{title}</h3>
      
      {children}
      
      {/* Navigation Buttons */}
      {(showBackButton || showNextButton) && (
        <div className="flex justify-between pt-8 border-t border-gray-200">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="btn-secondary"
            >
              이전
            </button>
          )}
          
          {showNextButton && onNext && (
            <button
              onClick={onNext}
              disabled={nextButtonDisabled}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                nextButtonDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 text-white shadow-lg'
              }`}
            >
              {nextButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StepLayout;
