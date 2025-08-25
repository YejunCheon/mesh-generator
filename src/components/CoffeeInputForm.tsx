import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CoffeeBean, RoastLevel } from '../types';

interface CoffeeInputFormProps {
  onSubmit: (coffeeBean: CoffeeBean) => void;
}

const CoffeeInputForm: React.FC<CoffeeInputFormProps> = ({ onSubmit }) => {
  const [showRegionFields, setShowRegionFields] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CoffeeBean>({
    defaultValues: {
      origin: {
        country: '',
        region: '',
        farm: ''
      },
      beanName: '',
      roastLevel: undefined,
      flavorNotes: ['', '', '', '', ''],
      intensity: {
        acidity: 5,
        sweetness: 5,
        body: 5
      }
    }
  });

  const handleFormSubmit = (data: CoffeeBean) => {
    // 데이터 검증 및 정리
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
    if (!watch('origin.country')) {
      setValue('origin.country', watch('origin.country') || '');
      return;
    }
    if (watch('origin.country') && !showRegionFields) {
      setShowRegionFields(true);
      return;
    }
    handleSubmit(handleFormSubmit)();
  };
  
  const prevStep = () => {
    if (showRegionFields) {
      setShowRegionFields(false);
      return;
    }
  };

  const canProceed = () => {
    if (!watch('origin.country')) return false;
    if (watch('origin.country') && !showRegionFields) return true;
    return true;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Origin Information */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-black mb-8">
            {!showRegionFields ? '어느 나라 원두에요?' : '혹시 지역/농장 정보도 아시나요?'}
          </h3>
          
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
                if (e.key === 'Enter' && watch('origin.country').trim()) {
                  e.preventDefault();
                  nextStep();
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
                  className="input-field"
                  placeholder="예: 예가체프, 산타로사..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      nextStep();
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

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          {showRegionFields && (
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
            다음
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoffeeInputForm;
