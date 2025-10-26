import React, { useState, useCallback, useMemo, useRef, forwardRef } from 'react';
import { CoffeeBean, ColorRecommendation as ColorRec, MeshGradientParams } from '../../types';
import * as htmlToImage from 'html-to-image';
import { HiPhotograph, HiArchive } from 'react-icons/hi';
import CardContent from './CardContent';
import useResponsiveScale from '../../hooks/useResponsiveScale';
import useDisplayNameTranslation from '../../hooks/useDisplayNameTranslation';
import EditorControls from './EditorControls';

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
        <CardContent
          coffeeBean={coffeeBean}
          showName={showName}
          showFlavor={showFlavor}
          showIntensity={showIntensity}
          showBlend={showBlend}
          fontClass={fontClass}
          displayName={displayName}
          scaleFactor={1}
        />
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

  const { scale, containerRef: previewContainerRef } = useResponsiveScale(1200);
  const { displayName, currentLang, isTranslating, toggleLanguage } = useDisplayNameTranslation(coffeeBean.displayName);
  
  const hiresCardRef = useRef<HTMLDivElement>(null);
  const hiddenHiresCardRef = useRef<HTMLDivElement>(null);

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
    const cardElement = hiddenHiresCardRef.current;
    if (!cardElement) {
        alert('고해상도 카드 요소를 찾을 수 없습니다.');
        return;
    }
    try {
        const dataUrl = await htmlToImage.toPng(cardElement, {
            quality: 1.0,
            width: 1200,
            height: 1200,
            pixelRatio: 1, // Ensure it captures at the defined 1200x1200 size
        });
        
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
      {/* Hidden HighResolutionCard for download */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <HighResolutionCard
          ref={hiddenHiresCardRef}
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
              className="absolute" 
              style={{ 
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${scale})`, 
                transformOrigin: 'center'
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

        <EditorControls
          coffeeBean={coffeeBean}
          showName={showName}
          setShowName={setShowName}
          showFlavor={showFlavor}
          setShowFlavor={setShowFlavor}
          showIntensity={showIntensity}
          setShowIntensity={setShowIntensity}
          showBlend={showBlend}
          setShowBlend={setShowBlend}
          backgroundOnly={backgroundOnly}
          setBackgroundOnly={setBackgroundOnly}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          params={params}
          onParamsChange={onParamsChange}
          toggleLanguage={toggleLanguage}
          isTranslating={isTranslating}
          currentLang={currentLang}
          availableFonts={availableFonts}
        />
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button onClick={onBack} className="btn-secondary">← 이전</button>
      </div>
    </div>
  );
};

export default MeshGradientEditor;