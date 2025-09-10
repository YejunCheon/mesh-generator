import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CoffeeBean } from '../types';

interface NewCoffeeInputFormProps {
  onSubmit: (data: CoffeeBean) => void;
}

const NewCoffeeInputForm: React.FC<NewCoffeeInputFormProps> = ({ onSubmit }) => {
  const [originType, setOriginType] = useState<'single' | 'blending'>('single');
  const { register, handleSubmit, formState: { errors } } = useForm<CoffeeBean>({
    defaultValues: {
      origin: {
        country: '',
        region: '',
        altitude: '',
        variety: '',
        processing: '',
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

  const handleFormSubmit = (data: CoffeeBean) => {
    // Here you can process data based on originType
    console.log('Submitting New Form Data:', { ...data, originType });
    onSubmit({ ...data, originType: originType });
  };

  const ToggleButton = ({ label, type }: { label: string, type: 'single' | 'blending' }) => (
    <button
      type="button"
      onClick={() => setOriginType(type)}
      className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
        originType === type
          ? 'bg-black text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

        <div className="flex justify-center space-x-4 p-1 rounded-full">
          <ToggleButton label="싱글 오리진" type="single" />
          <ToggleButton label="블렌드" type="blending" />
        </div>

        {originType === 'single' && (
          <div className="space-y-6 animate-fade-in">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">산지 (국가) *</label>
              <input {...register('origin.country', { required: '국가명은 필수입니다.' })} className="input-field" placeholder="예: 에티오피아" />
              {errors.origin?.country && <p className="text-red-500 text-sm mt-1">{errors.origin.country.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">지역 / 농장명 <span className="text-gray-400 font-normal">(선택)</span></label>
              <input {...register('origin.region')} className="input-field" placeholder="예: 예가체프, 안티구아" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">고도 (m) <span className="text-gray-400 font-normal">(선택)</span></label>
              <input {...register('origin.altitude')} type="number" className="input-field" placeholder="예: 1800" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">품종 <span className="text-gray-400 font-normal">(선택)</span></label>
              <input {...register('origin.variety')} className="input-field" placeholder="예: 게이샤, 버번" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">프로세싱 <span className="text-gray-400 font-normal">(선택)</span></label>
              <input {...register('origin.processing')} className="input-field" placeholder="예: 워시드, 내추럴" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">원두명</label>
              <input {...register('beanName')} className="input-field" placeholder="예: 코케 허니" />
              {errors.beanName && <p className="text-red-500 text-sm mt-1">{errors.beanName.message}</p>}
            </div>

          </div>
        )}

        {originType === 'blending' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <h5 className="text-lg font-medium text-gray-500">블렌드 원두 정보 입력 기능은</h5>
              <p className="text-2xl font-bold text-gray-800 mt-2">향후 개발 예정입니다 🚀</p>
            </div>
          </div>
        )}

        <div className="pt-6 border-t">
          <button type="submit" className="w-full btn-primary py-4 text-base">다음</button>
        </div>
      </form>
    </div>
  );
};

export default NewCoffeeInputForm;