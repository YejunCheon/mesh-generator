import { useState, useCallback } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from '../types';

export type CoffeeFlowStep = 
  | 'coffee-input'
  | 'roast-level'
  | 'flavor-intensity'
  | 'coffee-summary'
  | 'color-selection'
  | 'mesh-gradient-editor';

interface CoffeeFlowState {
  currentStep: CoffeeFlowStep;
  coffeeBean: CoffeeBean | null;
  colors: ColorRec[];
  selectedColors: ColorRec[];
  meshGradientParams: MeshGradientParams;
}

export const useCoffeeFlow = () => {
  const [flowState, setFlowState] = useState<CoffeeFlowState>({
    currentStep: 'coffee-input',
    coffeeBean: null,
    colors: [],
    selectedColors: [],
    meshGradientParams: {
      noiseIntensity: 50,
      gradientDirection: 0,
      blendMode: 'overlay',
      colorDistribution: 'uniform',
      borderStyle: 'rounded',
    }
  });

  const startCoffeeInputFlow = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 'coffee-input'
    }));
  }, []);

  const startRoastLevelFlow = useCallback((coffeeBean: CoffeeBean) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 'roast-level',
      coffeeBean
    }));
  }, []);

  const startFlavorIntensityFlow = useCallback((coffeeBean: CoffeeBean) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 'flavor-intensity',
      coffeeBean
    }));
  }, []);

  const startCoffeeSummaryFlow = useCallback((coffeeBean: CoffeeBean) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 'coffee-summary',
      coffeeBean
    }));
  }, []);

  const startColorSelectionFlow = useCallback((colors: ColorRec[]) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 'color-selection',
      colors
    }));
  }, []);

  const startMeshGradientEditorFlow = useCallback((selectedColors: ColorRec[]) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 'mesh-gradient-editor',
      selectedColors
    }));
  }, []);

  const startMeshGradientEditorWithImportedData = useCallback((data: { coffeeBean: CoffeeBean, colors: ColorRec[], params: MeshGradientParams }) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 'mesh-gradient-editor',
      coffeeBean: data.coffeeBean,
      colors: data.colors,
      selectedColors: data.colors,
      meshGradientParams: data.params,
    }));
  }, []);

  const goBack = useCallback(() => {
    const stepOrder: CoffeeFlowStep[] = [
      'coffee-input',
      'roast-level',
      'flavor-intensity',
      'coffee-summary',
      'color-selection',
      'mesh-gradient-editor'
    ];
    
    const currentIndex = stepOrder.indexOf(flowState.currentStep);
    if (currentIndex > 0) {
      const previousStep = stepOrder[currentIndex - 1];
      setFlowState(prev => ({
        ...prev,
        currentStep: previousStep
      }));
    }
  }, [flowState.currentStep]);

  const canGoBack = useCallback(() => {
    const stepOrder: CoffeeFlowStep[] = [
      'coffee-input',
      'roast-level',
      'flavor-intensity',
      'coffee-summary',
      'color-selection',
      'mesh-gradient-editor'
    ];
    
    const currentIndex = stepOrder.indexOf(flowState.currentStep);
    return currentIndex > 0;
  }, [flowState.currentStep]);

  const updateCoffeeBean = useCallback((updates: Partial<CoffeeBean>) => {
    if (flowState.coffeeBean) {
      setFlowState(prev => ({
        ...prev,
        coffeeBean: { ...prev.coffeeBean!, ...updates } as CoffeeBean
      }));
    }
  }, [flowState.coffeeBean]);

  const setColors = useCallback((colors: ColorRec[]) => {
    setFlowState(prev => ({
      ...prev,
      colors
    }));
  }, []);

  const setSelectedColors = useCallback((selectedColors: ColorRec[]) => {
    setFlowState(prev => ({
      ...prev,
      selectedColors
    }));
  }, []);

  const updateMeshGradientParams = useCallback((params: MeshGradientParams) => {
    setFlowState(prev => ({
      ...prev,
      meshGradientParams: params,
    }));
  }, []);

  return {
    // State
    currentStep: flowState.currentStep,
    coffeeBean: flowState.coffeeBean,
    colors: flowState.colors,
    selectedColors: flowState.selectedColors,
    meshGradientParams: flowState.meshGradientParams,
    
    // Flow control
    startCoffeeInputFlow,
    startRoastLevelFlow,
    startFlavorIntensityFlow,
    startCoffeeSummaryFlow,
    startColorSelectionFlow,
    startMeshGradientEditorFlow,
    startMeshGradientEditorWithImportedData,
    
    // Navigation
    goBack,
    canGoBack,
    
    // State updates
    updateCoffeeBean,
    setColors,
    setSelectedColors,
    updateMeshGradientParams
  };
};
