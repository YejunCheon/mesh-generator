import React, { useState } from 'react';
import NewCoffeeInputForm from './components/coffee-flow/NewCoffeeInputForm';
import CoffeeSummary from './components/coffee-flow/CoffeeSummary';
import ColorSelection from './components/coffee-flow/ColorSelection';
import MeshGradientEditor from './components/editor/MeshGradientEditor';
import StepLayout from './components/ui/StepLayout';
import IntensitySelector from './components/coffee-flow/IntensitySelector';
import FlavorNoteSelector from './components/coffee-flow/FlavorNoteSelector';
import ProgressBar from './components/ui/ProgressBar';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from './types';
import { useCoffeeFlow } from './hooks/useCoffeeFlow';
import { generateColorsWithGemini } from './services/geminiService';
import RoastLevelSelector from './components/coffee-flow/RoastLevelSelector';
import { useAuth } from './contexts/AuthContext';

import Header from './components/layout/Header';

import Modal from './components/ui/Modal';
import Auth from './components/auth/Auth';

function App() {
  const { loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    currentStep,
    coffeeBean,
    colors,
    selectedColors,
    meshGradientParams,
    startCoffeeInputFlow,
    startRoastLevelFlow,
    startFlavorIntensityFlow,
    startCoffeeSummaryFlow,
    startColorSelectionFlow,
    startMeshGradientEditorFlow,
    startMeshGradientEditorWithImportedData,
    updateCoffeeBean,
    setColors,
    setSelectedColors,
    updateMeshGradientParams
  } = useCoffeeFlow();

  const handleParamsChange = (params: MeshGradientParams) => {
    updateMeshGradientParams(params);
  };

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
        return <NewCoffeeInputForm onSubmit={handleCoffeeSubmit} onImport={startMeshGradientEditorWithImportedData} />;
      
      case 'roast-level':
        return (
          <RoastLevelSelector
            roastLevel={coffeeBean?.roastLevel}
            onRoastLevelChange={(roastLevel) => updateCoffeeBean({ roastLevel })}
            onBack={() => startCoffeeInputFlow()}
            onNext={handleRoastLevelSubmit}
          />
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
            params={meshGradientParams}
            onParamsChange={handleParamsChange}
            onBack={() => startColorSelectionFlow(colors)}
            onSaveClick={() => setIsAuthModalOpen(true)}
          />
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="h-screen w-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onSignInClick={() => setIsAuthModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            Typed Brew
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <>
            {/* Progress Bar */}
            <ProgressBar currentStep={currentStep} />

            {/* Step Content */}
            {renderStepContent()}
          </>
        </div>
      </main>
      
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <Auth onSuccess={() => setIsAuthModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default App;
