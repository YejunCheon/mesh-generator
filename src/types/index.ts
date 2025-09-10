export type RoastLevel = 'light' | 'medium' | 'dark' | 'espresso';

export interface SingleOriginDetails {
  country: string;
  region?: string;
  farm?: string;
  altitude?: string;
  variety?: string;
  processing?: string;
}

export interface BlendComponent {
  country: string;
  ratio: number;
}

export interface BlendDetails {
  components: BlendComponent[];
}

interface CoffeeBeanBase {
  displayName: string;
  beanName: string;
  roastLevel?: RoastLevel;
  flavorNotes: string[];
  intensity: {
    acidity: number; // 1-10
    sweetness: number; // 1-10
    body: number; // 1-10
  };
}

export interface SingleOriginCoffee extends CoffeeBeanBase {
  originType: 'single';
  origin: SingleOriginDetails;
}

export interface BlendedCoffee extends CoffeeBeanBase {
  originType: 'blending';
  blend: BlendDetails;
}

export type CoffeeBean = SingleOriginCoffee | BlendedCoffee;

export interface ColorRecommendation {
  hex: string;
  name: string;
  description: string;
}

export interface MeshGradientParams {
  noiseIntensity: number; // 0-100
  gradientDirection: number; // 0-360
  blendMode: BlendMode;
  colorDistribution: ColorDistribution;
  borderStyle: BorderStyle;
}

export type BlendMode = 'overlay' | 'multiply' | 'screen' | 'normal';
export type ColorDistribution = 'uniform' | 'concentrated' | 'diffused';
export type BorderStyle = 'rounded' | 'sharp' | 'none';

export interface GeneratedCard {
  id: string;
  coffeeBean: CoffeeBean;
  colors: ColorRecommendation[];
  params: MeshGradientParams;
  svgData: string;
  createdAt: Date;
}

export interface FlavorNode {
  name: string;
  children?: FlavorNode[];
}
