import React from 'react';
import NewCoffeeInputForm from './components/NewCoffeeInputForm';
import CoffeeSummary from './components/CoffeeSummary';
import ColorSelection from './components/ColorSelection';
import MeshGradientEditor from './components/MeshGradientEditor';
import DiscreteSlider from './components/DiscreteSlider';
import StepLayout from './components/StepLayout';
import IntensitySelector from './components/IntensitySelector';
import FlavorNoteSelector from './components/FlavorNoteSelector';
import ProgressBar from './components/ProgressBar';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from './types';
import { useCoffeeFlow } from './hooks/useCoffeeFlow';
import { generateColorsWithGemini } from './services/geminiService';

function App() {
  const {
    currentStep,
    coffeeBean,
    colors,
    selectedColors,
    startCoffeeInputFlow,
    startRoastLevelFlow,
    startFlavorIntensityFlow,
    startCoffeeSummaryFlow,
    startColorSelectionFlow,
    startMeshGradientEditorFlow,
    updateCoffeeBean,
    setColors,
    setSelectedColors
  } = useCoffeeFlow();

  const [params, setParams] = React.useState<MeshGradientParams>({
    noiseIntensity: 50,
    gradientDirection: 45,
    blendMode: 'normal',
    colorDistribution: 'uniform',
    borderStyle: 'rounded'
  });

  const handleCoffeeSubmit = (bean: CoffeeBean) => {
    startRoastLevelFlow(bean);
  };

  const handleRoastLevelSubmit = () => {
    if (coffeeBean) {
      startFlavorIntensityFlow(coffeeBean);
    }
  };

  const handleFlavorIntensitySubmit = () => {
    if (coffeeBean) {
      startCoffeeSummaryFlow(coffeeBean);
    }
  };

  const handleCoffeeSummaryConfirm = async () => {
    if (coffeeBean) {
      try {
        const generatedColors = await generateColorsWithGemini(coffeeBean);
        setColors(generatedColors);
        startColorSelectionFlow(generatedColors);
      } catch (error) {
        console.error('컬러 생성 오류:', error);
      }
    }
  };

  const handleColorSelectionConfirm = (selectedColors: ColorRec[]) => {
    setSelectedColors(selectedColors);
    startMeshGradientEditorFlow(selectedColors);
  };

  const handleIntensityChange = (updates: Partial<CoffeeBean['intensity']>) => {
    if (coffeeBean) {
      updateCoffeeBean({
        intensity: { ...coffeeBean.intensity, ...updates }
      });
    }
  };

  const handleFlavorNotesChange = (flavorNotes: string[]) => {
    updateCoffeeBean({ flavorNotes });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'coffee-input':
        return <NewCoffeeInputForm onSubmit={handleCoffeeSubmit} />;
        
      case 'roast-level':
        return (
          <StepLayout
            title="배전도를 선택해주세요"
            onBack={() => startCoffeeInputFlow()}
            onNext={handleRoastLevelSubmit}
            nextButtonDisabled={!coffeeBean?.roastLevel}
          >
            <div className="mb-8">
              <DiscreteSlider
                value={coffeeBean?.roastLevel || ''}
                onChange={(value) => updateCoffeeBean({ roastLevel: value as any })}
                options={[
                  { value: 'light', label: '라이트' },
                  { value: 'medium', label: '미디엄' },
                  { value: 'dark', label: '다크' },
                  { value: 'espresso', label: '에스프레소' }
                ]}
              />
            </div>
          </StepLayout>
        );
        
      case 'flavor-intensity':
        return (
          <StepLayout
            title="Flavor Note와 강도를 선택해주세요"
            onBack={() => startRoastLevelFlow(coffeeBean!)}
            onNext={handleFlavorIntensitySubmit}
          >
            <IntensitySelector
              coffeeBean={coffeeBean!}
              onIntensityChange={handleIntensityChange}
            />
            
            <FlavorNoteSelector
              coffeeBean={coffeeBean!}
              onFlavorNotesChange={handleFlavorNotesChange}
            />
          </StepLayout>
        );
        
      case 'coffee-summary':
        return (
          <CoffeeSummary
            coffeeBean={coffeeBean!}
            onConfirm={handleCoffeeSummaryConfirm}
            onBack={() => startFlavorIntensityFlow(coffeeBean!)}
          />
        );
        
      case 'color-selection':
        return (
          <ColorSelection
            colors={colors}
            onConfirm={handleColorSelectionConfirm}
            onBack={() => startCoffeeSummaryFlow(coffeeBean!)}
          />
        );
        
      case 'mesh-gradient-editor':
        return (
          <MeshGradientEditor
            coffeeBean={coffeeBean!}
            colors={selectedColors}
            params={params}
            onParamsChange={setParams}
            onBack={() => startColorSelectionFlow(colors)}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            Mesh Gradient Card Generator
          </h1>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} />

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
