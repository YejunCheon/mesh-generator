import { useState, useCallback } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec } from '../types';

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
}

export const useCoffeeFlow = () => {
  const [flowState, setFlowState] = useState<CoffeeFlowState>({
    currentStep: 'coffee-input',
    coffeeBean: null,
    colors: [],
    selectedColors: []
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

  return {
    // State
    currentStep: flowState.currentStep,
    coffeeBean: flowState.coffeeBean,
    colors: flowState.colors,
    selectedColors: flowState.selectedColors,
    
    // Flow control
    startCoffeeInputFlow,
    startRoastLevelFlow,
    startFlavorIntensityFlow,
    startCoffeeSummaryFlow,
    startColorSelectionFlow,
    startMeshGradientEditorFlow,
    
    // Navigation
    goBack,
    canGoBack,
    
    // State updates
    updateCoffeeBean,
    setColors,
    setSelectedColors
  };
};
