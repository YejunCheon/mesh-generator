import React from 'react';
import { RoastLevel } from '../../types';
import DiscreteSlider from '../ui/DiscreteSlider';
import StepLayout from '../ui/StepLayout';

interface RoastLevelSelectorProps {
  roastLevel: RoastLevel | undefined;
  onRoastLevelChange: (roastLevel: RoastLevel) => void;
  onBack: () => void;
  onNext: () => void;
}

const roastLevelOptions: { value: RoastLevel; label: string }[] = [
  { value: 'light', label: '라이트' },
  { value: 'medium', label: '미디엄' },
  { value: 'full-city', label: '풀 시티' },
  { value: 'vienna', label: '비엔나' },
  { value: 'dark', label: '다크' },
];

const RoastLevelSelector: React.FC<RoastLevelSelectorProps> = ({
  roastLevel,
  onRoastLevelChange,
  onBack,
  onNext,
}) => {
  return (
    <StepLayout
      title="배전도를 선택해주세요"
      onBack={onBack}
      onNext={onNext}
      nextButtonDisabled={!roastLevel}
    >
      <div className="mb-8">
        <DiscreteSlider
          value={roastLevel || ''}
          onChange={(value) => onRoastLevelChange(value as RoastLevel)}
          options={roastLevelOptions}
        />
      </div>
    </StepLayout>
  );
};

export default RoastLevelSelector;
