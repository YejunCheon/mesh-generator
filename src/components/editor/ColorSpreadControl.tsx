import React from 'react';

interface ColorSpreadControlProps {
  noiseIntensity: number;
  onNoiseIntensityChange: (value: number) => void;
}

const ColorSpreadControl: React.FC<ColorSpreadControlProps> = ({
  noiseIntensity,
  onNoiseIntensityChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">컬러 스프레드: {noiseIntensity}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={noiseIntensity}
          onChange={(e) => onNoiseIntensityChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>집중</span>
          <span className="font-semibold">{noiseIntensity}%</span>
          <span>확산</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">컬러들이 얼마나 넓게 퍼져서 배치될지 조절합니다. 높을수록 컬러가 더 넓게 분산됩니다.</p>
      </div>
    </div>
  );
};

export default ColorSpreadControl;
