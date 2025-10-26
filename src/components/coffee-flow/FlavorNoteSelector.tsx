import React, { useState } from 'react';
import { CoffeeBean, FlavorNode } from '../../types';
import { flavorWheelData } from '../../data/flavor-wheel';

interface FlavorNoteSelectorProps {
  coffeeBean: CoffeeBean;
  onFlavorNotesChange: (flavorNotes: string[]) => void;
}

const FlavorNoteSelector: React.FC<FlavorNoteSelectorProps> = ({ coffeeBean, onFlavorNotesChange }) => {
  const [customNote, setCustomNote] = useState('');
  const [allCustomNotes, setAllCustomNotes] = useState<string[]>([]);

  const handleFlavorNoteChange = (noteName: string, isChecked: boolean) => {
    const newNotes = isChecked
      ? [...coffeeBean.flavorNotes, noteName].slice(0, 5)
      : coffeeBean.flavorNotes.filter(n => n !== noteName);
    onFlavorNotesChange(newNotes);
  };

  const handleAddCustomNote = () => {
    const trimmedNote = customNote.trim();
    if (trimmedNote) {
      if (!allCustomNotes.includes(trimmedNote)) {
        setAllCustomNotes([...allCustomNotes, trimmedNote]);
      }

      if (!coffeeBean.flavorNotes.includes(trimmedNote) && coffeeBean.flavorNotes.length < 5) {
        onFlavorNotesChange([...coffeeBean.flavorNotes, trimmedNote]);
      }
      setCustomNote('');
    }
  };

  const handleCustomNoteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomNote();
    }
  };

  const isSelectionDisabled = (note: string) => {
    return !coffeeBean.flavorNotes.includes(note) && coffeeBean.flavorNotes.length >= 5;
  }

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold text-black mb-4">Flavor Note 선택 (최대 5개)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allCustomNotes.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-black mb-3">Custom</h5>
            <div className="space-y-2">
              <div className="ml-4 space-y-1">
                {allCustomNotes.map((note) => (
                  <label key={note} className="flex items-center">
                    <input
                      type="checkbox"
                      value={note}
                      checked={coffeeBean.flavorNotes.includes(note)}
                      onChange={(e) => handleFlavorNoteChange(note, e.target.checked)}
                      disabled={isSelectionDisabled(note)}
                      className="mr-2 text-black focus:ring-black w-4 h-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    />
                    <span className={`text-sm ${isSelectionDisabled(note) ? 'text-gray-400' : 'text-gray-600'}`}>{note}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {flavorWheelData.children && flavorWheelData.children.map((category: FlavorNode) => (
          <div key={category.name} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-black mb-3">{category.name}</h5>
            <div className="space-y-2">
              {category.children && category.children.map((subCategory: FlavorNode) => (
                <div key={subCategory.name} className="ml-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">{subCategory.name}</h6>
                  <div className="ml-4 space-y-1">
                    {subCategory.children && subCategory.children.length > 0 ? (
                      subCategory.children.map((note: FlavorNode) => (
                        <label key={note.name} className="flex items-center">
                          <input
                            type="checkbox"
                            value={note.name}
                            checked={coffeeBean.flavorNotes.includes(note.name)}
                            onChange={(e) => handleFlavorNoteChange(note.name, e.target.checked)}
                            disabled={isSelectionDisabled(note.name)}
                            className="mr-2 text-black focus:ring-black w-4 h-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          />
                          <span className={`text-sm ${isSelectionDisabled(note.name) ? 'text-gray-400' : 'text-gray-600'}`}>{note.name}</span>
                        </label>
                      ))
                    ) : (
                      <label key={subCategory.name} className="flex items-center">
                        <input
                          type="checkbox"
                          value={subCategory.name}
                          checked={coffeeBean.flavorNotes.includes(subCategory.name)}
                          onChange={(e) => handleFlavorNoteChange(subCategory.name, e.target.checked)}
                          disabled={isSelectionDisabled(subCategory.name)}
                          className="mr-2 text-black focus:ring-black w-4 h-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        />
                        <span className={`text-sm ${isSelectionDisabled(subCategory.name) ? 'text-gray-400' : 'text-gray-600'}`}>{subCategory.name}</span>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 사용자 직접 추가 섹션 */}
      <div className="mt-6">
        <h5 className="font-semibold text-black mb-3">직접 추가</h5>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            onKeyDown={handleCustomNoteKeyDown}
            placeholder="예: Earthy, Smoky..."
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-black focus:border-black"
            disabled={coffeeBean.flavorNotes.length >= 5}
          />
          <button
            onClick={handleAddCustomNote}
            disabled={!customNote.trim() || coffeeBean.flavorNotes.length >= 5}
            className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            추가
          </button>
        </div>
        {coffeeBean.flavorNotes.length >= 5 && (
          <p className="text-xs text-red-500 mt-1">최대 5개의 Flavor Note만 선택할 수 있습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FlavorNoteSelector;