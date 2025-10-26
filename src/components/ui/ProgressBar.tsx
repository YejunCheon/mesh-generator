import React from 'react';
import { CoffeeFlowStep } from '../../hooks/useCoffeeFlow';

interface ProgressBarProps {
  currentStep: CoffeeFlowStep;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { key: 'coffee-input', label: '원두 정보 입력' },
    { key: 'roast-level', label: '배전도 선택' },
    { key: 'flavor-intensity', label: 'Flavor & 강도' },
    { key: 'color-selection', label: '컬러 선택' },
    { key: 'mesh-gradient-editor', label: '메시 그라디언트 편집' }
  ];

  const getStepStatus = (stepIndex: number) => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    
    // coffee-summary 단계일 때는 color-selection을 가리키도록 처리
    if (currentStep === 'coffee-summary') {
      const colorSelectionIndex = steps.findIndex(step => step.key === 'color-selection');
      if (stepIndex <= colorSelectionIndex) {
        return { isActive: true, isCompleted: true };
      }
      return { isActive: false, isCompleted: false };
    }
    
    if (stepIndex < currentIndex) {
      return { isActive: false, isCompleted: true };
    } else if (stepIndex === currentIndex) {
      return { isActive: true, isCompleted: false };
    } else {
      return { isActive: false, isCompleted: false };
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const { isActive, isCompleted } = getStepStatus(index);
          
          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-sm ${
                  isActive || isCompleted
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={`font-medium hidden md:inline ${
                  isActive || isCompleted ? 'text-black' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200">
                    <div 
                      className="h-full bg-black transition-all duration-500 ease-in-out"
                      style={{ width: `${isCompleted ? 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
