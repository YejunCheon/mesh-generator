import React, { useState, useCallback, useMemo } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from '../types';
import DiscreteSlider from './DiscreteSlider';

// 헥스 컬러를 RGBA로 변환하는 헬퍼 함수 추가
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  const [showName, setShowName] = useState(true);
  const [showFlavor, setShowFlavor] = useState(true);
  const [showIntensity, setShowIntensity] = useState(true);
  const [backgroundOnly, setBackgroundOnly] = useState(false);

  // 컬러 스프레드 기반 mesh gradient 생성 함수
  const generateMeshGradient = useCallback(() => {
    if (colors.length === 0) {
      return {
        background: '#000000',
        backgroundImage: 'none',
      };
    }

    // 기본 포인트 정의 (4개 모서리)
    const basePoints = [
      [0.0, 0.0], [1.0, 0.0],
      [0.0, 1.0], [1.0, 1.0]
    ];

    // 컬러 스프레드 값에 따라 추가 중간점 생성
    const additionalPoints = [];
    if (colors.length > 4) {
      additionalPoints.push(
        [0.5, 0.0], [0.0, 0.5], [1.0, 0.5], [0.5, 1.0], [0.5, 0.5],
        [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]
      );
    }

    const allPoints = [...basePoints, ...additionalPoints];
    
    // 각 컬러를 points 배열의 위치에 배치
    const gradients = colors.map((color, index) => {
      const point = allPoints[index % allPoints.length];
      const [x, y] = point;
      
      // 0.0~1.0 범위를 퍼센트로 변환
      const xPercent = x * 100;
      const yPercent = y * 100;
      
      // 컬러 스프레드 값에 따른 크기 조절
      const baseSize = 40;
      const colorSpread = params.noiseIntensity / 20; // 0-5 범위
      const size = baseSize + (colorSpread * 10) + (index * 5);
      
      // 각 컬러의 투명도를 다르게 하여 mesh 효과 강화
      const opacity = Math.min(0.8 + (index * 0.1), 1);
      
      return `radial-gradient(at ${xPercent}% ${yPercent}%, ${hexToRgba(color.hex, opacity)} 0%, transparent ${size}%)`;
    });

    // 첫 번째 컬러를 기본 배경으로 사용
    const baseColor = colors[0]?.hex || '#000000';
    
    // 모든 그라디언트를 결합하여 mesh 구조 생성
    const backgroundImage = gradients.join(', ');
    
    return {
      background: baseColor,
      backgroundImage: backgroundImage,
    };
  }, [colors, params.noiseIntensity]);

  // PNG 이미지 다운로드 함수
  const handleDownload = useCallback(async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        alert('Canvas를 지원하지 않는 브라우저입니다.');
        return;
      }

      canvas.width = 800;
      canvas.height = 600;

      // 기본 배경색 설정
      ctx.fillStyle = colors[0]?.hex || '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 컬러 스프레드 기반 그라디언트 생성
      const basePoints = [
        [0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0]
      ];
      
      const additionalPoints = [
        [0.5, 0.0], [0.0, 0.5], [1.0, 0.5], [0.5, 1.0], [0.5, 0.5],
        [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]
      ];
      
      const allPoints = [...basePoints, ...additionalPoints];

      // 각 컬러를 정확한 위치에 그라디언트 원으로 그리기
      colors.forEach((color, index) => {
        const point = allPoints[index % allPoints.length];
        const [x, y] = point;
        
        // 0.0~1.0 범위를 픽셀 좌표로 변환
        const pixelX = x * canvas.width;
        const pixelY = y * canvas.height;
        
        // 컬러 스프레드 기반 크기 조절
        const baseRadius = 100;
        const colorSpread = params.noiseIntensity / 20;
        const radius = baseRadius + (colorSpread * 20) + (index * 15);
        
        // opacity 적용
        const opacity = Math.min(0.8 + (index * 0.1), 1);
        ctx.globalAlpha = opacity;
        
        // 그라디언트 원 생성
        const gradient = ctx.createRadialGradient(pixelX, pixelY, 0, pixelX, pixelY, radius);
        gradient.addColorStop(0, color.hex);
        gradient.addColorStop(0.7, hexToRgba(color.hex, 0.4));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pixelX, pixelY, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.globalAlpha = 1; // 리셋
      });

      // 텍스트 추가 - 새로운 레이아웃 적용
      if (!backgroundOnly) {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        
        // 원두 정보 (좌측 정렬, 작은 사이즈)
        if (showName) {
          ctx.font = 'bold 24px Arial';
          const beanInfo = `${coffeeBean.origin.country}${coffeeBean.origin.region ? ` (${coffeeBean.origin.region})` : ''}${coffeeBean.origin.farm ? ` (${coffeeBean.origin.farm})` : ''} ${coffeeBean.beanName}`;
          ctx.fillText(beanInfo, 40, 80);
        }
        
        // Flavor notes (좌측 하단)
        if (showFlavor && coffeeBean.flavorNotes.length > 0) {
          ctx.font = '20px Arial';
          ctx.fillText(coffeeBean.flavorNotes.slice(0, 3).join(' • '), 40, 500);
        }
        
        // 강도 정보 (우측 하단)
        if (showIntensity) {
          ctx.textAlign = 'left';
          ctx.font = '16px Arial';
          
          // 산도
          ctx.fillText('산도', 600, 200);
          ctx.fillStyle = '#e5e7eb';
          ctx.fillRect(600, 210, 200, 4);
          ctx.fillStyle = '#000000';
          ctx.fillRect(600, 210, (coffeeBean.intensity.acidity / 10) * 200, 4);
          
          // 당도
          ctx.fillText('당도', 600, 250);
          ctx.fillStyle = '#e5e7eb';
          ctx.fillRect(600, 260, 200, 4);
          ctx.fillStyle = '#000000';
          ctx.fillRect(600, 260, (coffeeBean.intensity.sweetness / 10) * 200, 4);
          
          // 바디감
          ctx.fillText('바디감', 600, 300);
          ctx.fillStyle = '#e5e7eb';
          ctx.fillRect(600, 310, 200, 4);
          ctx.fillStyle = '#000000';
          ctx.fillRect(600, 310, (coffeeBean.intensity.body / 10) * 200, 4);
        }
      }

      // PNG 다운로드
      const link = document.createElement('a');
      link.download = `${coffeeBean.beanName}_mesh_gradient.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (error) {
      console.error('PNG 생성 중 오류:', error);
      alert('PNG 이미지 생성에 실패했습니다.');
    }
  }, [colors, backgroundOnly, showName, showFlavor, showIntensity, coffeeBean, params.noiseIntensity]);

  const handleSaveToSupabase = () => {
    alert('Supabase 저장 기능은 Phase 2에서 구현됩니다!');
  };

  // 현재 gradient 스타일
  const gradientStyles = useMemo(() => generateMeshGradient(), [generateMeshGradient]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-black mb-3">
          메시 그라디언트 카드 편집
        </h3>
        <p className="text-lg text-gray-600">
          선택한 컬러로 아름다운 카드를 만들어보세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-black">미리보기</h4>
          </div>
          
            {/* CSS 기반 mesh gradient */}
            <div 
              className="w-full h-80 relative"
              style={{
                background: gradientStyles.background,
                backgroundImage: gradientStyles.backgroundImage,
                borderRadius: '16px'
              }}
            >
              {!backgroundOnly && (
                <>
                  {/* 원두 정보 (좌측 정렬, 작은 사이즈) */}
                  {showName && (
                    <div className="absolute top-6 left-6 text-left">
                      <h3 className="text-white text-2xl font-bold drop-shadow-md leading-tight">
                        {[coffeeBean.origin.country, coffeeBean.origin.region, coffeeBean.origin.farm, coffeeBean.beanName].filter(Boolean).join(' ')}
                      </h3>
                    </div>
                  )}
                  
                  {/* Flavor notes (좌측 하단, max-width로 오버플로우 방지) */}
                  {showFlavor && coffeeBean.flavorNotes.length > 0 && (
                    <div 
                      className="absolute bottom-6 left-6 text-left"
                      style={{ 
                        maxWidth: 'calc(100% - 12rem)' // Intensity 영역 (w-48 ≈ 12rem) + 패딩 (right-6 + 여유) 고려
                      }}
                    >
                      <p className="text-white text-md drop-shadow-md whitespace-normal break-words">
                        {coffeeBean.flavorNotes.slice(0, 3).map((note, idx) => (
                          <span key={idx} className="block">{note}</span>
                        ))}
                      </p>
                    </div>
                  )}
                  
                  {/* 강도 정보 (우측 하단) */}
                  {showIntensity && (
                    <div className="absolute right-6 bottom-6">
                      {/* 산도 */}
                      <div className="mt-4">
                        <span className="text-white text-sm font-medium drop-shadow-md block mb-2">Acidity</span>
                        <div className="w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-300"
                            style={{ width: `${(coffeeBean.intensity.acidity / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Sweetness */}
                      <div className="mt-4">
                        <span className="text-white text-sm font-medium drop-shadow-md block mb-2">Sweetness</span>
                        <div className="w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-300"
                            style={{ width: `${(coffeeBean.intensity.sweetness / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Body */}
                      <div className="mt-4">
                        <span className="text-white text-sm font-medium drop-shadow-md block mb-2">Body</span>
                        <div className="w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-300"
                            style={{ width: `${(coffeeBean.intensity.body / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleDownload}
              className="btn-primary flex-1"
            >
              PNG 이미지 다운로드
            </button>
            <button
              onClick={handleSaveToSupabase}
              className="btn-secondary flex-1"
            >
              Supabase 저장
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-8">
          <h4 className="text-xl font-semibold text-black">편집 옵션</h4>
          
          {/* Display Toggles */}
          <div className="space-y-6">
            <h5 className="text-lg font-semibold text-black">표시 옵션</h5>
            
            <div className="space-y-4">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={backgroundOnly}
                  onChange={(e) => setBackgroundOnly(e.target.checked)}
                  className="mr-4 text-black focus:ring-black w-5 h-5"
                />
                <span className="font-medium">배경만 표시</span>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                  disabled={backgroundOnly}
                  className="mr-4 text-black focus:ring-black w-5 h-5 disabled:opacity-50"
                />
                <span className="font-medium">원두 정보 표시</span>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={showFlavor}
                  onChange={(e) => setShowFlavor(e.target.checked)}
                  disabled={backgroundOnly}
                  className="mr-4 text-black focus:ring-black w-5 h-5 disabled:opacity-50"
                />
                <span className="font-medium">플레이버 노트 표시</span>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={showIntensity}
                  onChange={(e) => setShowIntensity(e.target.checked)}
                  disabled={backgroundOnly}
                  className="mr-4 text-black focus:ring-black w-5 h-5 disabled:opacity-50"
                />
                <span className="font-medium">강도 정보 표시</span>
              </label>
            </div>
          </div>

          {/* Mesh Gradient Parameters */}
          <div className="space-y-6">
            <h5 className="text-lg font-semibold text-black">메시 그라디언트 설정</h5>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                컬러 스프레드: {params.noiseIntensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={params.noiseIntensity}
                onChange={(e) => onParamsChange({ ...params, noiseIntensity: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>집중</span>
                <span className="font-semibold">{params.noiseIntensity}%</span>
                <span>확산</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                컬러들이 얼마나 넓게 퍼져서 배치될지 조절합니다. 높을수록 컬러가 더 넓게 분산됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          ← 이전
        </button>
        
        <div className="text-sm text-gray-500">
          완성된 카드를 PNG 이미지로 다운로드하거나 Supabase에 저장할 수 있어요
        </div>
      </div>
    </div>
  );
};

export default MeshGradientEditor;