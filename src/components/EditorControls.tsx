import React from 'react';
import { CoffeeBean, MeshGradientParams } from '../types';
import DisplayOptions from './DisplayOptions';
import FontSelector from './FontSelector';
import ColorSpreadControl from './ColorSpreadControl';

interface EditorControlsProps {
  coffeeBean: CoffeeBean;
  showName: boolean;
  setShowName: (value: boolean) => void;
  showFlavor: boolean;
  setShowFlavor: (value: boolean) => void;
  showIntensity: boolean;
  setShowIntensity: (value: boolean) => void;
  showBlend: boolean;
  setShowBlend: (value: boolean) => void;
  backgroundOnly: boolean;
  setBackgroundOnly: (value: boolean) => void;
  selectedFont: string;
  setSelectedFont: (fontClass: string) => void;
  params: MeshGradientParams;
  onParamsChange: (params: MeshGradientParams) => void;
  toggleLanguage: () => void;
  isTranslating: boolean;
  currentLang: 'ko' | 'en';
  availableFonts: { name: string; className: string }[];
}

const EditorControls: React.FC<EditorControlsProps> = ({
  coffeeBean,
  showName,
  setShowName,
  showFlavor,
  setShowFlavor,
  showIntensity,
  setShowIntensity,
  showBlend,
  setShowBlend,
  backgroundOnly,
  setBackgroundOnly,
  selectedFont,
  setSelectedFont,
  params,
  onParamsChange,
  toggleLanguage,
  isTranslating,
  currentLang,
  availableFonts,
}) => {
  return (
    <div className="space-y-8">
      <DisplayOptions
        coffeeBean={coffeeBean}
        backgroundOnly={backgroundOnly}
        setBackgroundOnly={setBackgroundOnly}
        showName={showName}
        setShowName={setShowName}
        showFlavor={showFlavor}
        setShowFlavor={setShowFlavor}
        showIntensity={showIntensity}
        setShowIntensity={setShowIntensity}
        showBlend={showBlend}
        setShowBlend={setShowBlend}
        toggleLanguage={toggleLanguage}
        isTranslating={isTranslating}
        currentLang={currentLang}
      />
      <FontSelector
        availableFonts={availableFonts}
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
      />
      <ColorSpreadControl
        noiseIntensity={params.noiseIntensity}
        onNoiseIntensityChange={(value) => onParamsChange({ ...params, noiseIntensity: value })}
      />
    </div>
  );
};

export default EditorControls;
