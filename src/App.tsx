import React, { useState } from 'react';
import CoffeeInputForm from './components/CoffeeInputForm';
import ColorRecommendation from './components/ColorRecommendation';
import MeshGradientEditor from './components/MeshGradientEditor';
import DiscreteSlider from './components/DiscreteSlider';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams, FlavorNode } from './types';
import { flavorWheelData } from './data/flavor-wheel';

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
    setCurrentStep(5);
  };

  const handleBackToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            Mesh Gradient Card Generator
          </h1>
          <p className="text-xl text-gray-600">
            커피 원두의 특성을 아름다운 메시 그라디언트로 표현해보세요
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Main Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-sm ${
                  currentStep >= 1 ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className={`font-medium hidden md:inline ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
                  원두 정보 입력
                </span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-black transition-all duration-500 ease-in-out"
                    style={{ width: `${currentStep > 1 ? 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-sm ${
                  currentStep >= 2 ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className={`font-medium hidden md:inline ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
                  원두명 입력
                </span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-black transition-all duration-500 ease-in-out"
                    style={{ width: `${currentStep > 2 ? 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-sm ${
                  currentStep >= 3 ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span className={`font-medium hidden md:inline ${currentStep >= 3 ? 'text-black' : 'text-gray-400'}`}>
                  배전도 선택
                </span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-black transition-all duration-500 ease-in-out"
                    style={{ width: `${currentStep > 3 ? 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-sm ${
                  currentStep >= 4 ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {currentStep > 4 ? '✓' : '4'}
                </div>
                <span className={`font-medium hidden md:inline ${currentStep >= 4 ? 'text-black' : 'text-gray-400'}`}>
                  Flavor & 강도
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <CoffeeInputForm 
              key={`coffee-form-${coffeeBean ? 'with-data' : 'empty'}`}
              onSubmit={handleCoffeeSubmit} 
            />
          )}
          
          {currentStep === 2 && coffeeBean && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-3xl font-bold text-black mb-8">원두명을 입력해주세요</h3>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">원두명 *</label>
                <input
                  type="text"
                  value={coffeeBean.beanName}
                  onChange={(e) => setCoffeeBean({...coffeeBean, beanName: e.target.value})}
                  className="input-field"
                  placeholder="예: 예가체프, 블루마운틴, 게이샤..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && coffeeBean.beanName.trim()) {
                      e.preventDefault();
                      setCurrentStep(3);
                    }
                  }}
                />
              </div>
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!coffeeBean.beanName.trim()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    coffeeBean.beanName.trim()
                      ? 'bg-black hover:bg-gray-800 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  다음
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && coffeeBean && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-3xl font-bold text-black mb-8">배전도를 선택해주세요</h3>
              <div className="mb-8">
                <DiscreteSlider
                  value={coffeeBean.roastLevel || ''}
                  onChange={(value) => setCoffeeBean({...coffeeBean, roastLevel: value as any})}
                  options={[
                    { value: 'light', label: '라이트' },
                    { value: 'medium', label: '미디엄' },
                    { value: 'dark', label: '다크' },
                    { value: 'espresso', label: '에스프레소' }
                  ]}
                />
              </div>
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!coffeeBean.roastLevel}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    coffeeBean.roastLevel
                      ? 'bg-black hover:bg-gray-800 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  다음
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 4 && coffeeBean && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-3xl font-bold text-black mb-8">Flavor Note와 강도를 선택해주세요</h3>
              
              {/* 강도 지표를 Flavor 위쪽으로 이동 */}
              <div className="space-y-8 mb-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-black mb-4">강도 지표 (1-10)</h4>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">산도 (Acidity)</label>
                      <DiscreteSlider
                        value={coffeeBean.intensity.acidity}
                        onChange={(value) => setCoffeeBean({
                          ...coffeeBean, 
                          intensity: {...coffeeBean.intensity, acidity: Number(value)}
                        })}
                        options={[
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
                        ]}
                        showProgressBar={true}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">당도 (Sweetness)</label>
                      <DiscreteSlider
                        value={coffeeBean.intensity.sweetness}
                        onChange={(value) => setCoffeeBean({
                          ...coffeeBean, 
                          intensity: {...coffeeBean.intensity, sweetness: Number(value)}
                        })}
                        options={[
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
                        ]}
                        showProgressBar={true}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">바디감 (Body)</label>
                      <DiscreteSlider
                        value={coffeeBean.intensity.body}
                        onChange={(value) => setCoffeeBean({
                          ...coffeeBean, 
                          intensity: {...coffeeBean.intensity, body: Number(value)}
                        })}
                        options={[
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
                        ]}
                        showProgressBar={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flavor Note 선택 */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-black mb-4">Flavor Note 선택 (최대 5개)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flavorWheelData.children && flavorWheelData.children.map((category: FlavorNode) => (
                    <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-black mb-3">{category.name}</h5>
                      <div className="space-y-2">
                        {category.children && category.children.map((subCategory: FlavorNode) => (
                          <div key={subCategory.name} className="ml-4">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">{subCategory.name}</h6>
                            <div className="ml-4 space-y-1">
                              {subCategory.children && subCategory.children.length > 0 && subCategory.children.map((note: FlavorNode) => (
                                <label key={note.name} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    value={note.name}
                                    checked={coffeeBean.flavorNotes.includes(note.name)}
                                    onChange={(e) => {
                                      const newNotes = e.target.checked 
                                        ? [...coffeeBean.flavorNotes, note.name].slice(0, 5)
                                        : coffeeBean.flavorNotes.filter(n => n !== note.name);
                                      setCoffeeBean({...coffeeBean, flavorNotes: newNotes});
                                    }}
                                    className="mr-2 text-black focus:ring-black w-4 h-4"
                                  />
                                  <span className="text-sm text-gray-600">{note.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-8 border-t border-gray-200">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="btn-secondary"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="btn-primary px-8"
                >
                  컬러 추천 받기
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 5 && coffeeBean && (
            <ColorRecommendation 
              coffeeBean={coffeeBean}
              onColorsGenerated={handleColorsGenerated}
              onBack={() => setCurrentStep(4)}
            />
          )}
          
          {currentStep === 6 && coffeeBean && colors.length > 0 && (
            <MeshGradientEditor
              coffeeBean={coffeeBean}
              colors={colors}
              params={params}
              onParamsChange={setParams}
              onBack={() => setCurrentStep(5)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
