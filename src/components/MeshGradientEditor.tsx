import React, { useState, useCallback, useMemo, useRef, forwardRef } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from '../types';
import * as htmlToImage from 'html-to-image';
import { HiPhotograph, HiArchive } from 'react-icons/hi';

// 헬퍼 함수
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 고해상도 카드 컴포넌트
interface HighResolutionCardProps {
  coffeeBean: CoffeeBean;
  gradientStyles: React.CSSProperties;
  showName: boolean;
  showFlavor: boolean;
  showIntensity: boolean;
  backgroundOnly: boolean;
  fontClass: string;
}

const HighResolutionCard = forwardRef<HTMLDivElement, HighResolutionCardProps>((
  { coffeeBean, gradientStyles, showName, showFlavor, showIntensity, backgroundOnly, fontClass },
  ref
) => {
  return (
    <div
      ref={ref}
      className={fontClass}
      style={{
        ...gradientStyles,
        width: '1200px',
        height: '1200px',
        position: 'relative',
        borderRadius: '48px', // 16px * 3
        overflow: 'hidden',
      }}
    >
      {!backgroundOnly && (
        <>
          {showName && (
            <div style={{ position: 'absolute', top: '72px', left: '72px', textAlign: 'left', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
              <h3 style={{ color: 'white', fontSize: '80px', fontWeight: 'bold', lineHeight: '1.2' }}>
                {coffeeBean.displayName}
              </h3>
            </div>
          )}
          {showFlavor && coffeeBean.flavorNotes.length > 0 && (
            <div style={{ position: 'absolute', bottom: '72px', left: '72px', textAlign: 'left' }}>
              <p style={{ color: 'white', fontSize: '42px' }}>
                {coffeeBean.flavorNotes.slice(0, 5).map((note, idx) => (
                  <span key={idx} style={{ display: 'block' }}># {note}</span>
                ))}
              </p>
            </div>
          )}
          {showIntensity && (
            <div style={{ position: 'absolute', right: '72px', bottom: '72px' }}>
              <div style={{ marginTop: '24px' }}>
                <span style={{ color: 'white', fontSize: '36px', fontWeight: 500, display: 'block', marginBottom: '12px' }}>Acidity</span>
                <div style={{ width: '384px', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'white', borderRadius: '9999px', width: `${(coffeeBean.intensity.acidity / 10) * 100}%` }} />
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <span style={{ color: 'white', fontSize: '36px', fontWeight: 500, display: 'block', marginBottom: '12px' }}>Sweetness</span>
                <div style={{ width: '384px', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'white', borderRadius: '9999px', width: `${(coffeeBean.intensity.sweetness / 10) * 100}%` }} />
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <span style={{ color: 'white', fontSize: '36px', fontWeight: 500, display: 'block', marginBottom: '12px' }}>Body</span>
                <div style={{ width: '384px', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'white', borderRadius: '9999px', width: `${(coffeeBean.intensity.body / 10) * 100}%` }} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

interface MeshGradientEditorProps {
  coffeeBean: CoffeeBean;
  colors: ColorRec[];
  params: MeshGradientParams;
  onParamsChange: (params: MeshGradientParams) => void;
  onBack: () => void;
}

const availableFonts = [
  { name: 'Ranade', className: 'font-ranade' },
  { name: 'Hahmlet', className: 'font-hahmlet' },
  { name: 'NanumSquare Neo', className: 'font-nanumsquareneo' },
  { name: 'HS Santokki', className: 'font-hssantokki' },
];

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
  const [selectedFont, setSelectedFont] = useState('font-ranade');
  
  const previewCardRef = useRef<HTMLDivElement>(null);
  const hiresCardRef = useRef<HTMLDivElement>(null);

  const generateMeshGradient = useCallback(() => {
    if (colors.length === 0) return { background: '#000', backgroundImage: 'none' };
    const basePoints = [[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0]];
    const additionalPoints = colors.length > 4 ? [[0.5, 0.0], [0.0, 0.5], [1.0, 0.5], [0.5, 1.0], [0.5, 0.5], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]] : [];
    const allPoints = [...basePoints, ...additionalPoints];
    const gradients = colors.map((color, index) => {
      const point = allPoints[index % allPoints.length];
      const [x, y] = point;
      const xPercent = x * 100;
      const yPercent = y * 100;
      const baseSize = 40;
      const colorSpread = params.noiseIntensity / 20;
      const size = baseSize + (colorSpread * 10) + (index * 5);
      const opacity = Math.min(0.8 + (index * 0.1), 1);
      return `radial-gradient(at ${xPercent}% ${yPercent}%, ${hexToRgba(color.hex, opacity)} 0%, transparent ${size}%)`;
    });
    const baseColor = colors[0]?.hex || '#000';
    const backgroundImage = gradients.join(', ');
    return { background: baseColor, backgroundImage };
  }, [colors, params.noiseIntensity]);

  const handleDownload = useCallback(async () => {
    if (!hiresCardRef.current) {
      alert('고해상도 카드 요소를 찾을 수 없습니다.');
      return;
    }
    try {
      const dataUrl = await htmlToImage.toPng(hiresCardRef.current, { quality: 1.0 });
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

  const gradientStyles = useMemo(() => generateMeshGradient(), [generateMeshGradient]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div style={{ position: 'absolute', top: '-9999px', left: 0 }}>
        <HighResolutionCard
          ref={hiresCardRef}
          coffeeBean={coffeeBean}
          gradientStyles={gradientStyles}
          showName={showName}
          showFlavor={showFlavor}
          showIntensity={showIntensity}
          backgroundOnly={backgroundOnly}
          fontClass={selectedFont}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-3xl font-bold text-black mb-3">메시 그라디언트 카드 편집</h3>
        <p className="text-lg text-gray-600">선택한 컬러로 아름다운 카드를 만들어보세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="w-full relative" style={{ paddingTop: '100%' }}>
            <div
              ref={previewCardRef}
              className={`absolute top-0 left-0 w-full h-full ${selectedFont}`}
              style={{ ...gradientStyles, borderRadius: '16px' }}
            >
              {!backgroundOnly && (
                <>
                  {showName && (
                    <div className="absolute top-6 left-6 text-left" style={{ maxWidth: 'calc(100% - 2rem)', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
                      <h3 className="text-white text-2xl font-bold leading-tight">
                      {coffeeBean.displayName}
                    </h3>
                    </div>
                  )}
                  {showFlavor && coffeeBean.flavorNotes.length > 0 && (
                    <div className="absolute bottom-6 left-6 text-left" >
                      <p className="text-white text-md whitespace-normal break-words">
                        {coffeeBean.flavorNotes.slice(0, 5).map((note, idx) => (
                          <span key={idx} className="block"># {note}</span>
                        ))}
                      </p>
                    </div>
                  )}
                  {showIntensity && (
                    <div className="absolute right-6 bottom-6">
                      <div className="mt-4">
                        <span className="text-white text-sm font-medium block mb-2">Acidity</span>
                        <div className="w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${(coffeeBean.intensity.acidity / 10) * 100}%` }} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-white text-sm font-medium block mb-2">Sweetness</span>
                        <div className="w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${(coffeeBean.intensity.sweetness / 10) * 100}%` }} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-white text-sm font-medium block mb-2">Body</span>
                        <div className="w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${(coffeeBean.intensity.body / 10) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="w-full flex justify-end items-center space-x-4">
            <button onClick={handleDownload} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm" title="Download as PNG">
              <HiPhotograph className="h-6 w-6" />
            </button>
            <button onClick={handleSaveToSupabase} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm" title="Save to Supabase">
              <HiArchive className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
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
              ].map((item) => (
                <label key={item.label} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <input type="checkbox" checked={item.checked} onChange={item.onChange} disabled={item.disabled} className={`mr-4 text-black focus:ring-black w-5 h-5${item.disabled ? ' disabled:opacity-50' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">폰트 선택</label>
            <div className="grid grid-cols-2 gap-4">
              {availableFonts.map((font) => (
                <button
                  key={font.className}
                  type="button"
                  onClick={() => setSelectedFont(font.className)}
                  className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                    selectedFont === font.className
                      ? 'border-black ring-2 ring-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className={`${font.className} text-xl`}>에티오피아</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">컬러 스프레드: {params.noiseIntensity}%</label>
              <input type="range" min="0" max="100" value={params.noiseIntensity} onChange={(e) => onParamsChange({ ...params, noiseIntensity: parseInt(e.target.value) })} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>집중</span>
                <span className="font-semibold">{params.noiseIntensity}%</span>
                <span>확산</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">컬러들이 얼마나 넓게 퍼져서 배치될지 조절합니다. 높을수록 컬러가 더 넓게 분산됩니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button onClick={onBack} className="btn-secondary">← 이전</button>
      </div>
    </div>
  );
};

export default MeshGradientEditor;
