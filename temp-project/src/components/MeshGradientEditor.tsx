import React, { useState, useEffect } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from '../types';

interface MeshGradientEditorProps {
  coffeeBean: CoffeeBean;
  colors: ColorRec[];
  params: MeshGradientParams;
  onParamsChange: (params: MeshGradientParams) => void;
  onBack: () => void;
}

const MeshGradientEditor: React.FC<MeshGradientEditorProps> = ({
  coffeeBean,
  colors,
  params,
  onParamsChange,
  onBack
}) => {
  const [svgData, setSvgData] = useState<string>('');
  const [showName, setShowName] = useState(true);
  const [showFlavor, setShowFlavor] = useState(true);
  const [showIntensity, setShowIntensity] = useState(true);
  const [backgroundOnly, setBackgroundOnly] = useState(false);

  useEffect(() => {
    generateSVG();
  }, [params, colors, showName, showFlavor, showIntensity, backgroundOnly]);

  const generateSVG = () => {
    const width = 800;
    const height = 600;
    
    // Create mesh gradient with selected colors
    const gradientStops = colors.map((color, index) => {
      const offset = (index / (colors.length - 1)) * 100;
      return `${color.hex} ${offset}%`;
    }).join(', ');

    // Generate noise pattern based on noise intensity
    const noisePattern = generateNoisePattern(params.noiseIntensity);
    
    // Create SVG content
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="meshGradient" cx="50%" cy="50%" r="70%">
            ${colors.map((color, index) => `
              <stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color.hex}" />
            `).join('')}
          </radialGradient>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="1">
              <animate attributeName="baseFrequency" values="0.8;1.2;0.8" dur="10s" repeatCount="indefinite"/>
            </feTurbulence>
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${params.noiseIntensity / 100} 0"/>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#meshGradient)" filter="url(#noise)"/>
        
        ${!backgroundOnly ? `
          <g transform="rotate(${params.gradientDirection})">
            ${showName ? `
              <text x="50%" y="30%" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.5))">
                ${coffeeBean.beanName}
              </text>
            ` : ''}
            
            ${showFlavor && coffeeBean.flavorNotes.length > 0 ? `
              <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.5))">
                ${coffeeBean.flavorNotes.slice(0, 3).join(' • ')}
              </text>
            ` : ''}
            
            ${showIntensity ? `
              <g transform="translate(50%, 60%)">
                <text text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="white" filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.5))">
                  산도 ${coffeeBean.intensity.acidity}/10 • 당도 ${coffeeBean.intensity.sweetness}/10 • 바디감 ${coffeeBean.intensity.body}/10
                </text>
              </g>
            ` : ''}
          </g>
        ` : ''}
      </svg>
    `;

    setSvgData(svgContent);
  };

  const generateNoisePattern = (intensity: number) => {
    // Simple noise pattern generation
    return Array.from({ length: 20 }, () => Math.random() * intensity / 100).join(' ');
  };

  const handleDownload = () => {
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${coffeeBean.beanName}_${new Date().toISOString().split('T')[0]}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveToSupabase = () => {
    // TODO: Implement Supabase save functionality
    alert('Supabase 저장 기능은 Phase 2에서 구현됩니다!');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-coffee-800 mb-2">
          메시 그라디언트 카드 편집 🎨
        </h3>
        <p className="text-gray-600">
          선택한 컬러로 아름다운 카드를 만들어보세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-700">미리보기</h4>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
            <div 
              className="w-full h-96 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgData }}
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="btn-primary flex-1"
            >
              SVG 다운로드 💾
            </button>
            <button
              onClick={handleSaveToSupabase}
              className="btn-secondary flex-1"
            >
              Supabase 저장 ☁️
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-700">편집 옵션</h4>
          
          {/* Display Toggles */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-700">표시 옵션</h5>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={backgroundOnly}
                  onChange={(e) => setBackgroundOnly(e.target.checked)}
                  className="mr-3 text-coffee-600 focus:ring-coffee-500"
                />
                <span>배경만 표시</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                  disabled={backgroundOnly}
                  className="mr-3 text-coffee-600 focus:ring-coffee-500 disabled:opacity-50"
                />
                <span>원두명 표시</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFlavor}
                  onChange={(e) => setShowFlavor(e.target.checked)}
                  disabled={backgroundOnly}
                  className="mr-3 text-coffee-600 focus:ring-coffee-500 disabled:opacity-50"
                />
                <span>플레이버 노트 표시</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showIntensity}
                  onChange={(e) => setShowIntensity(e.target.checked)}
                  disabled={backgroundOnly}
                  className="mr-3 text-coffee-600 focus:ring-coffee-500 disabled:opacity-50"
                />
                <span>강도 정보 표시</span>
              </label>
            </div>
          </div>

          {/* Gradient Parameters */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-700">그라디언트 파라미터</h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                노이즈 강도: {params.noiseIntensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={params.noiseIntensity}
                onChange={(e) => onParamsChange({ ...params, noiseIntensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                그라디언트 방향: {params.gradientDirection}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={params.gradientDirection}
                onChange={(e) => onParamsChange({ ...params, gradientDirection: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                블렌드 모드
              </label>
              <select
                value={params.blendMode}
                onChange={(e) => onParamsChange({ ...params, blendMode: e.target.value as any })}
                className="input-field"
              >
                <option value="normal">일반</option>
                <option value="overlay">오버레이</option>
                <option value="multiply">멀티플라이</option>
                <option value="screen">스크린</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                컬러 분포
              </label>
              <select
                value={params.colorDistribution}
                onChange={(e) => onParamsChange({ ...params, colorDistribution: e.target.value as any })}
                className="input-field"
              >
                <option value="uniform">균등</option>
                <option value="concentrated">집중</option>
                <option value="diffused">확산</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                테두리 스타일
              </label>
              <select
                value={params.borderStyle}
                onChange={(e) => onParamsChange({ ...params, borderStyle: e.target.value as any })}
                className="input-field"
              >
                <option value="rounded">둥근 모서리</option>
                <option value="sharp">각진 모서리</option>
                <option value="none">테두리 없음</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          이전
        </button>
        
        <div className="text-sm text-gray-500">
          완성된 카드를 다운로드하거나 Supabase에 저장할 수 있어요
        </div>
      </div>
    </div>
  );
};

export default MeshGradientEditor;
