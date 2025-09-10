import React, { useState, useCallback, useMemo, useRef, forwardRef, useLayoutEffect } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from '../types'; // Adjust this path to your types file
import * as htmlToImage from 'html-to-image';
import { HiPhotograph, HiArchive } from 'react-icons/hi';
import { translateDisplayName } from '../services/geminiService'; // Adjust this path to your services file

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// High-resolution card component (The Single Source of Truth)
interface HighResolutionCardProps {
  coffeeBean: CoffeeBean;
  gradientStyles: React.CSSProperties;
  showName: boolean;
  showFlavor: boolean;
  showIntensity: boolean;
  showBlend: boolean;
  backgroundOnly: boolean;
  fontClass: string;
  displayName: string;
}

const HighResolutionCard = forwardRef<HTMLDivElement, HighResolutionCardProps>((
  { coffeeBean, gradientStyles, showName, showFlavor, showIntensity, showBlend, backgroundOnly, fontClass, displayName },
  ref
) => {
  return (
    <div
      ref={ref}
      style={{
        ...gradientStyles,
        width: '1200px',
        height: '1200px',
        position: 'relative',
        borderRadius: '48px', // 16px * 3 for high resolution
        overflow: 'hidden',
      }}
    >
      {!backgroundOnly && (
        <>
          {showName && (
            <div style={{ position: 'absolute', top: '72px', left: '72px', textAlign: 'left', wordBreak: 'keep-all', overflowWrap: 'break-word', maxWidth: '80%' }}>
              <h3 className={fontClass} style={{ color: 'white', fontSize: '116px', fontWeight: 'bold', lineHeight: '1.2' }}>
                {displayName}
              </h3>
              {showBlend && coffeeBean.originType === 'blending' && (
                <div style={{ marginTop: '24px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, color: 'white', fontSize: '36px' }}>
                    {coffeeBean.blend.components.map((c, i) => (
                      <li key={i}>{c.country}: {c.ratio}%</li>
                    ))}
                  </ul>
                </div>
              )}
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

// Main editor component props
interface MeshGradientEditorProps {
  coffeeBean: CoffeeBean;
  colors: ColorRec[];
  params: MeshGradientParams;
  onParamsChange: (params: MeshGradientParams) => void;
  onBack: () => void;
}

// Available fonts constant
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
  const [showBlend, setShowBlend] = useState(true);
  const [backgroundOnly, setBackgroundOnly] = useState(false);
  const [selectedFont, setSelectedFont] = useState('font-ranade');
  const [displayNames, setDisplayNames] = useState({ ko: coffeeBean.displayName, en: null as string | null });
  const [currentLang, setCurrentLang] = useState<'ko' | 'en'>('ko');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const hiresCardRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const previewContainer = previewContainerRef.current;
    if (!previewContainer) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // The original width of HighResolutionCard is 1200px
        setScale(width / 1200);
      }
    });

    resizeObserver.observe(previewContainer);

    return () => resizeObserver.disconnect();
  }, []);

  const toggleLanguage = async () => {
    if (currentLang === 'ko') {
      if (displayNames.en) {
        setCurrentLang('en');
      } else {
        setIsTranslating(true);
        try {
          const translation = await translateDisplayName(displayNames.ko);
          setDisplayNames(prev => ({ ...prev, en: translation }));
          setCurrentLang('en');
        } catch (error) {
          console.error("Translation failed:", error);
          alert("이름을 번역하는 데 실패했습니다.");
        } finally {
          setIsTranslating(false);
        }
      }
    } else {
      setCurrentLang('ko');
    }
  };

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
    const cardElement = hiresCardRef.current;
    if (!cardElement) {
        alert('고해상도 카드 요소를 찾을 수 없습니다.');
        return;
    }
    try {
        // Temporarily remove transform for a pixel-perfect capture
        const originalTransform = cardElement.style.transform;
        cardElement.style.transform = '';

        const dataUrl = await htmlToImage.toPng(cardElement, {
            quality: 1.0,
            width: 1200,
            height: 1200,
            pixelRatio: 1, // Ensure it captures at the defined 1200x1200 size
        });
        
        // Restore the transform for the live preview
        cardElement.style.transform = originalTransform;

        const link = document.createElement('a');
        link.download = `${coffeeBean.beanName}_mesh_gradient.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('PNG 생성 중 오류:', error);
        alert('PNG 이미지 생성에 실패했습니다.');
        // Restore transform even if an error occurs
        if (cardElement) {
            const container = previewContainerRef.current;
            if(container){
                const { width } = container.getBoundingClientRect();
                cardElement.style.transform = `scale(${width / 1200})`;
            }
        }
    }
  }, [coffeeBean.beanName]);

  const handleSaveToSupabase = () => {
    alert('Supabase 저장 기능은 Phase 2에서 구현됩니다!');
  };

  const gradientStyles = useMemo(() => generateMeshGradient(), [generateMeshGradient]);
  const displayName = displayNames[currentLang] || displayNames.ko;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-black mb-3">메시 그라디언트 카드 편집</h3>
        <p className="text-lg text-gray-600">선택한 컬러로 아름다운 카드를 만들어보세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            ref={previewContainerRef}
            className="w-full relative overflow-hidden" 
            style={{ paddingTop: '100%' }} // Maintains a 1:1 aspect ratio
          >
            <div 
              className="absolute top-0 left-0" 
              style={{ 
                transform: `scale(${scale})`, 
                transformOrigin: 'top left' 
              }}
            >
              <HighResolutionCard
                ref={hiresCardRef}
                coffeeBean={coffeeBean}
                gradientStyles={gradientStyles}
                showName={showName}
                showFlavor={showFlavor}
                showIntensity={showIntensity}
                showBlend={showBlend}
                backgroundOnly={backgroundOnly}
                fontClass={selectedFont}
                displayName={displayName}
              />
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
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <input type="checkbox" checked={backgroundOnly} onChange={(e) => setBackgroundOnly(e.target.checked)} className={'mr-4 text-black focus:ring-black w-5 h-5'} />
                <span className="font-medium">배경만 표시</span>
              </label>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <input type="checkbox" checked={showName} onChange={(e) => setShowName(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
                <span className="font-medium flex-grow">원두 정보 표시</span>
                <button 
                  onClick={toggleLanguage} 
                  disabled={isTranslating || backgroundOnly || !showName}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTranslating ? '번역 중...' : (currentLang === 'ko' ? '영문으로' : '원본으로')}
                </button>
              </div>
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <input type="checkbox" checked={showFlavor} onChange={(e) => setShowFlavor(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
                <span className="font-medium">플레이버 노트 표시</span>
              </label>
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <input type="checkbox" checked={showIntensity} onChange={(e) => setShowIntensity(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
                <span className="font-medium">강도 정보 표시</span>
              </label>
              {coffeeBean.originType === 'blending' && (
                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <input type="checkbox" checked={showBlend} onChange={(e) => setShowBlend(e.target.checked)} disabled={backgroundOnly} className={`mr-4 text-black focus:ring-black w-5 h-5${backgroundOnly ? ' disabled:opacity-50' : ''}`} />
                  <span className="font-medium">블렌드 정보 표시</span>
                </label>
              )}
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