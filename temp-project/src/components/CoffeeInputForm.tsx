import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CoffeeBean, RoastLevel } from '../types';

interface CoffeeInputFormProps {
  onSubmit: (coffeeBean: CoffeeBean) => void;
}

const CoffeeInputForm: React.FC<CoffeeInputFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CoffeeBean>();
  
  const roastLevels: RoastLevel[] = ['light', 'medium', 'dark', 'espresso'];
  const roastLevelLabels = {
    light: '라이트 로스트',
    medium: '미디엄 로스트', 
    dark: '다크 로스트',
    espresso: '에스프레소 로스트'
  };

  const handleFormSubmit = (data: CoffeeBean) => {
    onSubmit(data);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Step 1: Origin */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-coffee-800 mb-6">
              어느 나라 원두에요? 🗺️
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                국가 *
              </label>
              <input
                type="text"
                {...register('origin.country', { required: '국가를 입력해주세요' })}
                className="input-field"
                placeholder="예: 에티오피아, 브라질, 콜롬비아..."
              />
              {errors.origin?.country && (
                <p className="text-red-500 text-sm mt-1">{errors.origin.country.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역 (선택사항)
              </label>
              <input
                type="text"
                {...register('origin.region')}
                className="input-field"
                placeholder="예: 예가체프, 산타로사..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                농장명 (선택사항)
              </label>
              <input
                type="text"
                {...register('origin.farm')}
                className="input-field"
                placeholder="예: 코나, 블루마운틴..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Bean Name */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-coffee-800 mb-6">
              원두 이름이 뭐예요? ☕
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                원두명 *
              </label>
              <input
                type="text"
                {...register('beanName', { required: '원두명을 입력해주세요' })}
                className="input-field"
                placeholder="예: 예가체프, 블루마운틴, 게이샤..."
              />
              {errors.beanName && (
                <p className="text-red-500 text-sm mt-1">{errors.beanName.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Roast Level */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-coffee-800 mb-6">
              배전도는 어느 정도인가요? 🔥
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {roastLevels.map((level) => (
                <label key={level} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-coffee-300 transition-colors">
                  <input
                    type="radio"
                    value={level}
                    {...register('roastLevel', { required: '배전도를 선택해주세요' })}
                    className="mr-3 text-coffee-600 focus:ring-coffee-500"
                  />
                  <span className="font-medium">{roastLevelLabels[level]}</span>
                </label>
              ))}
            </div>
            {errors.roastLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.roastLevel.message}</p>
            )}
          </div>
        )}

        {/* Step 4: Flavor Notes & Intensity */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-coffee-800 mb-6">
              어떤 맛이 나나요? 🍊
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                플레이버 노트 (최대 5개)
              </label>
              <input
                type="text"
                {...register('flavorNotes.0')}
                className="input-field mb-2"
                placeholder="예: 레몬, 베르가못, 플로럴..."
              />
              <input
                type="text"
                {...register('flavorNotes.1')}
                className="input-field mb-2"
                placeholder="예: 초콜릿, 견과류..."
              />
              <input
                type="text"
                {...register('flavorNotes.2')}
                className="input-field mb-2"
                placeholder="예: 카라멜, 바닐라..."
              />
              <input
                type="text"
                {...register('flavorNotes.3')}
                className="input-field mb-2"
                placeholder="예: 스파이시, 우드..."
              />
              <input
                type="text"
                {...register('flavorNotes.4')}
                className="input-field"
                placeholder="예: 허브, 토바코..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  산도 (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  {...register('intensity.acidity', { valueAsNumber: true })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  당도 (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  {...register('intensity.sweetness', { valueAsNumber: true })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  바디감 (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  {...register('intensity.body', { valueAsNumber: true })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary"
            >
              이전
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary ml-auto"
            >
              다음
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary ml-auto"
            >
              컬러 추천 받기 ✨
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CoffeeInputForm;
