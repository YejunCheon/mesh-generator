import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CoffeeBean } from '../types';

interface CoffeeInputFormProps {
  onSubmit: (coffeeBean: CoffeeBean) => void;
}

const CoffeeInputForm: React.FC<CoffeeInputFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState<'origin' | 'bean-name'>('origin');
  const [showRegionFields, setShowRegionFields] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CoffeeBean>({
    defaultValues: {
      origin: {
        country: '',
        region: '',
        farm: ''
      },
      beanName: '',
      roastLevel: undefined,
      flavorNotes: [],
      intensity: {
        acidity: 5,
        sweetness: 5,
        body: 5
      }
    }
  });

  const regionRef = useRef<HTMLInputElement>(null);
  const farmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showRegionFields && regionRef.current) {
      // Use a timeout to ensure the field is focusable after the render.
      setTimeout(() => regionRef.current?.focus(), 0);
    }
  }, [showRegionFields]);

  const handleFormSubmit = (data: CoffeeBean) => {
    const cleanedData = {
      ...data,
      flavorNotes: data.flavorNotes.filter(note => note.trim() !== ''),
      intensity: {
        acidity: Number(data.intensity.acidity) || 5,
        sweetness: Number(data.intensity.sweetness) || 5,
        body: Number(data.intensity.body) || 5
      }
    };
    onSubmit(cleanedData);
  };

  const nextStep = () => {
    if (currentStep === 'origin') {
      if (!watch('origin.country').trim()) {
        return;
      }
      if (!showRegionFields) {
        setShowRegionFields(true);
        return;
      }
      setCurrentStep('bean-name');
      return;
    }
    
    if (currentStep === 'bean-name') {
      if (!watch('beanName').trim()) {
        return;
      }
      handleSubmit(handleFormSubmit)();
    }
  };
  
  const prevStep = () => {
    if (currentStep === 'bean-name') {
      setCurrentStep('origin');
    } else if (showRegionFields) {
      setShowRegionFields(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 'origin') {
      return watch('origin.country').trim() !== '';
    }
    if (currentStep === 'bean-name') {
      return watch('beanName').trim() !== '';
    }
    return false;
  };

  const getStepTitle = () => {
    if (currentStep === 'origin') {
      if (!showRegionFields) {
        return '어느 나라 원두에요?';
      }
      return '혹시 지역/농장 정보도 아시나요?';
    }
    return '원두명을 입력해주세요';
  };

  const getNextButtonText = () => {
    if (currentStep === 'origin') {
      return '다음';
    }
    return '완료';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <h3 className="text-3xl font-bold text-black mb-8">{getStepTitle()}</h3>
        
        {currentStep === 'origin' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                국가 *
              </label>
              <input
                type="text"
                {...register('origin.country', { required: '국가를 입력해주세요' })}
                className="input-field"
                placeholder="예: 에티오피아, 브라질, 콜롬비아..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (watch('origin.country').trim()) {
                      if (showRegionFields) {
                        regionRef.current?.focus();
                      } else {
                        setShowRegionFields(true);
                      }
                    }
                  }
                }}
              />
              {errors.origin?.country && (
                <p className="text-red-500 text-sm mt-2">{errors.origin.country.message}</p>
              )}
            </div>

            {showRegionFields && (
              <div className="space-y-4 transition-all duration-300 opacity-100 max-h-96">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    지역 (선택사항)
                  </label>
                  <input
                    type="text"
                    {...register('origin.region')}
                    ref={regionRef}
                    className="input-field"
                    placeholder="예: 예가체프, 산타로사..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        farmRef.current?.focus();
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    농장명 (선택사항)
                  </label>
                  <input
                    type="text"
                    {...register('origin.farm')}
                    ref={farmRef}
                    className="input-field"
                    placeholder="예: 코나, 블루마운틴..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        nextStep();
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 'bean-name' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">원두명 *</label>
            <input
              type="text"
              {...register('beanName', { required: '원두명을 입력해주세요' })}
              className="input-field"
              placeholder="예: 예가체프, 블루마운틴, 게이샤..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && watch('beanName').trim()) {
                  e.preventDefault();
                  nextStep();
                }
              }}
            />
            {errors.beanName && (
              <p className="text-red-500 text-sm mt-2">{errors.beanName.message}</p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          {(currentStep === 'bean-name' || showRegionFields) && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary"
            >
              이전
            </button>
          )}
          
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className={`ml-auto px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              canProceed()
                ? 'bg-black hover:bg-gray-800 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {getNextButtonText()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoffeeInputForm;