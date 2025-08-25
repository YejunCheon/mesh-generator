import React from 'react';
import DiscreteSlider from './DiscreteSlider';
import { CoffeeBean } from '../types';

interface IntensitySelectorProps {
  coffeeBean: CoffeeBean;
  onIntensityChange: (updates: Partial<CoffeeBean['intensity']>) => void;
}

const IntensitySelector: React.FC<IntensitySelectorProps> = ({ coffeeBean, onIntensityChange }) => {
  const intensityOptions = [
    { value: 1, label: '1 (약함)' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10 (강함)' }
  ];

  return (
    <div className="space-y-8 mb-8">
      <div className="space-y-6">
        <h4 className="text-xl font-semibold text-black mb-4">강도 지표 (1-10)</h4>
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">산도 (Acidity)</label>
            <DiscreteSlider
              value={coffeeBean.intensity.acidity}
              onChange={(value) => onIntensityChange({ acidity: Number(value) })}
              options={intensityOptions}
              showProgressBar={true}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">당도 (Sweetness)</label>
            <DiscreteSlider
              value={coffeeBean.intensity.sweetness}
              onChange={(value) => onIntensityChange({ sweetness: Number(value) })}
              options={intensityOptions}
              showProgressBar={true}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">바디감 (Body)</label>
            <DiscreteSlider
              value={coffeeBean.intensity.body}
              onChange={(value) => onIntensityChange({ body: Number(value) })}
              options={intensityOptions}
              showProgressBar={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntensitySelector;
