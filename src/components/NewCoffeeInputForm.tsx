import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { CoffeeBean, SingleOriginDetails, BlendDetails, RoastLevel } from '../types';

interface NewCoffeeInputFormProps {
  onSubmit: (data: CoffeeBean) => void;
}

// A simple, flat shape for the form state
interface CoffeeFormShape {
  originType: 'single' | 'blending';
  beanName: string;
  roastLevel?: RoastLevel;
  flavorNotes: string[];
  intensity: { acidity: number; sweetness: number; body: number; };
  origin: SingleOriginDetails;
  blend: BlendDetails;
}

const NewCoffeeInputForm: React.FC<NewCoffeeInputFormProps> = ({ onSubmit }) => {
  const [originType, setOriginType] = useState<'single' | 'blending'>('single');
  
  const { register, handleSubmit, control, watch } = useForm<CoffeeFormShape>({
    defaultValues: {
      originType: 'single',
      origin: {
        country: '',
        region: '',
        farm: '',
        altitude: '',
        variety: '',
        processing: '',
      },
      beanName: '',
      blend: {
        components: [{ country: '', ratio: 100 }]
      },
      roastLevel: undefined,
      flavorNotes: [],
      intensity: {
        acidity: 5,
        sweetness: 5,
        body: 5
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "blend.components"
  });

  const watchBlendComponents = watch("blend.components");
  const totalRatio = watchBlendComponents?.reduce((acc, curr) => acc + (Number(curr.ratio) || 0), 0) || 0;

  const watchOriginCountry = watch('origin.country');
  const watchOriginRegion = watch('origin.region');
  const watchOriginVariety = watch('origin.variety');
  const watchOriginProcessing = watch('origin.processing');

  const singleOriginDisplayName = [
    watchOriginCountry,
    watchOriginRegion,
    watchOriginVariety,
    watchOriginProcessing
  ].filter(Boolean).join(' ');

  const handleFormSubmit = (data: CoffeeFormShape) => {
    let finalData: CoffeeBean;

    if (originType === 'single') {
      const { country, region, variety, processing } = data.origin;
      const displayName = [country, region, variety, processing].filter(Boolean).join(' ');
      
      finalData = {
        ...data,
        originType: 'single',
        beanName: displayName, // Set beanName to the constructed display name
        displayName: displayName,
        origin: data.origin, // Ensure origin is passed
      };
    } else { // blending
      finalData = {
        ...data,
        originType: 'blending',
        displayName: data.beanName,
        blend: data.blend, // Ensure blend is passed
      };
    }
    
    onSubmit(finalData);
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
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

        <div className="flex justify-center space-x-4 p-1 rounded-full">
          <ToggleButton label="싱글 오리진" type="single" />
          <ToggleButton label="블렌드" type="blending" />
        </div>

        {originType === 'single' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">미리보기 (원두명)</label>
              <p className="input-field bg-gray-100 text-gray-600">
                {singleOriginDisplayName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">산지 (국가) *</label>
              <input {...register('origin.country', { required: originType === 'single' })} className="input-field" placeholder="예: 에티오피아" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">지역 <span className="text-gray-400 font-normal">(선택)</span></label>
              <input {...register('origin.region')} className="input-field" placeholder="예: 예가체프, 안티구아" />
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">고도 (m) <span className="text-gray-400 font-normal">(선택)</span></label>
              <input {...register('origin.altitude')} type="number" className="input-field" placeholder="예: 1800" />
            </div>
          </div>
        )}

        {originType === 'blending' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">블렌드 이름 *</label>
              <input {...register('beanName', { required: originType === 'blending' })} className="input-field" placeholder="예: 하우스 블렌드" />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">블렌드 구성 *</label>
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    {...register(`blend.components.${index}.country`)}
                    placeholder="산지 (국가)"
                    className="input-field w-2/3"
                  />
                  <input
                    {...register(`blend.components.${index}.ratio`, { valueAsNumber: true })}
                    type="number"
                    placeholder="비율(%)"
                    className="input-field w-1/3"
                  />
                  <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 p-2 font-bold text-lg">-</button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => append({ country: '', ratio: 0 })}
                className="text-sm font-medium text-black hover:underline"
              >
                + 산지 추가
              </button>
              <div className={`text-sm font-semibold ${totalRatio !== 100 ? 'text-red-500' : 'text-green-600'}`}>
                총 비율: {totalRatio}%
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 border-t">
          <button type="submit" className="w-full btn-primary py-4 text-base">다음 단계로</button>
        </div>
      </form>
    </div>
  );
};

export default NewCoffeeInputForm;
