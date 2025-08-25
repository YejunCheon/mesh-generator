import React, { useState } from 'react';
import CoffeeInputForm from './components/CoffeeInputForm';
import ColorRecommendation from './components/ColorRecommendation';
import MeshGradientEditor from './components/MeshGradientEditor';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [coffeeBean, setCoffeeBean] = useState<CoffeeBean | null>(null);
  const [colors, setColors] = useState<ColorRec[]>([]);
  const [params, setParams] = useState<MeshGradientParams>({
    noiseIntensity: 50,
    gradientDirection: 45,
    blendMode: 'normal',
    colorDistribution: 'uniform',
    borderStyle: 'rounded'
  });

  const handleCoffeeSubmit = (bean: CoffeeBean) => {
    setCoffeeBean(bean);
    setCurrentStep(2);
  };

  const handleColorsGenerated = (generatedColors: ColorRec[]) => {
    setColors(generatedColors);
    setCurrentStep(3);
  };

  const handleBackToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-coffee-800 mb-4">
            ☕ Mesh Gradient Card Generator
          </h1>
          <p className="text-lg text-coffee-600">
            커피 원두의 특성을 아름다운 메시 그라디언트로 표현해보세요
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-coffee-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-coffee-600 bg-coffee-600 text-white' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">원두 정보 입력</span>
              </div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-coffee-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-coffee-600 bg-coffee-600 text-white' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">컬러 추천</span>
              </div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-coffee-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-coffee-600 bg-coffee-600 text-white' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">카드 생성</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-coffee-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <CoffeeInputForm onSubmit={handleCoffeeSubmit} />
          )}
          
          {currentStep === 2 && coffeeBean && (
            <ColorRecommendation 
              coffeeBean={coffeeBean}
              onColorsGenerated={handleColorsGenerated}
              onBack={() => handleBackToStep(1)}
            />
          )}
          
          {currentStep === 3 && coffeeBean && colors.length > 0 && (
            <MeshGradientEditor
              coffeeBean={coffeeBean}
              colors={colors}
              params={params}
              onParamsChange={setParams}
              onBack={() => handleBackToStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
