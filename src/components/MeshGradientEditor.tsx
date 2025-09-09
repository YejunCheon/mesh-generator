import React, { useState, useCallback, useMemo, useRef} from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from '../types';
import * as htmlToImage from 'html-to-image';
import { HiPhotograph,HiArchive } from 'react-icons/hi';

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
  
  // PNG 다운로드용 DOM 요소 참조
  const cardRef = useRef<HTMLDivElement>(null);

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

  // html-to-image를 사용한 PNG 다운로드 함수
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) {
      alert('카드 요소를 찾을 수 없습니다.');
      return;
    }

    try {
      // html-to-image로 DOM 요소를 PNG로 변환 (실제 크기 그대로)
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0
      });

      // PNG 다운로드
      const link = document.createElement('a');
      link.download = `${coffeeBean.beanName}_mesh_gradient.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('PNG 생성 중 오류:', error);
      alert('PNG 이미지 생성에 실패했습니다.');
    }
  }, [coffeeBean.beanName]);

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
          
          
          {/* PNG 다운로드용 카드 요소 (ref 추가) */}
          <div 
            ref={cardRef}
            className="w-full h-96 relative font-ranade"
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
                  <div 
                    className="absolute top-6 left-6 text-left"
                    style={{ 
                      maxWidth: 'calc(100% - 2rem)', // 우측 패딩 영역 확보 (w-48 ≈ 12rem) + 여유 공간
                      wordBreak: 'keep-all', // 한국어 단어 단위 줄바꿈
                      overflowWrap: 'break-word' // 긴 단어 강제 줄바꿈
                    }}
                  >
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
          
          <div className="w-full flex justify-end items-center space-x-4">
            <button
              onClick={handleDownload}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
              title="Download as PNG"
            >
              <HiPhotograph className="h-6 w-6" />
            </button>

            <button
              onClick={handleSaveToSupabase}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
              title="Save to Supabase"
            >
              <HiArchive className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-8">
            
          {/* Display Toggles */}
          <div className="space-y-6">
            
            <div className="space-y-4">
              {[
                {
                  label: '배경만 표시',
                  checked: backgroundOnly,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBackgroundOnly(e.target.checked),
                  disabled: false,
                },
                {
                  label: '원두 정보 표시',
                  checked: showName,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShowName(e.target.checked),
                  disabled: backgroundOnly,
                },
                {
                  label: '플레이버 노트 표시',
                  checked: showFlavor,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShowFlavor(e.target.checked),
                  disabled: backgroundOnly,
                },
                {
                  label: '강도 정보 표시',
                  checked: showIntensity,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShowIntensity(e.target.checked),
                  disabled: backgroundOnly,
                },
              ].map((item, idx) => (
                <label
                  key={item.label}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.onChange}
                    disabled={item.disabled}
                    className={`mr-4 text-black focus:ring-black w-5 h-5${item.disabled ? ' disabled:opacity-50' : ''}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mesh Gradient Parameters */}
          <div className="space-y-6">
            
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