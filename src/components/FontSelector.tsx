import React from 'react';

interface FontSelectorProps {
  availableFonts: { name: string; className: string }[];
  selectedFont: string;
  setSelectedFont: (fontClass: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  availableFonts,
  selectedFont,
  setSelectedFont,
}) => {
  return (
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
  );
};

export default FontSelector;
