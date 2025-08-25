import React from 'react';
import { CoffeeBean, FlavorNode } from '../types';
import { flavorWheelData } from '../data/flavor-wheel';

interface FlavorNoteSelectorProps {
  coffeeBean: CoffeeBean;
  onFlavorNotesChange: (flavorNotes: string[]) => void;
}

const FlavorNoteSelector: React.FC<FlavorNoteSelectorProps> = ({ coffeeBean, onFlavorNotesChange }) => {
  const handleFlavorNoteChange = (noteName: string, isChecked: boolean) => {
    const newNotes = isChecked 
      ? [...coffeeBean.flavorNotes, noteName].slice(0, 5)
      : coffeeBean.flavorNotes.filter(n => n !== noteName);
    onFlavorNotesChange(newNotes);
  };

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold text-black mb-4">Flavor Note 선택 (최대 5개)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flavorWheelData.children && flavorWheelData.children.map((category: FlavorNode) => (
          <div key={category.name} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-black mb-3">{category.name}</h5>
            <div className="space-y-2">
              {category.children && category.children.map((subCategory: FlavorNode) => (
                <div key={subCategory.name} className="ml-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">{subCategory.name}</h6>
                  <div className="ml-4 space-y-1">
                    {subCategory.children && subCategory.children.length > 0 && subCategory.children.map((note: FlavorNode) => (
                      <label key={note.name} className="flex items-center">
                        <input
                          type="checkbox"
                          value={note.name}
                          checked={coffeeBean.flavorNotes.includes(note.name)}
                          onChange={(e) => handleFlavorNoteChange(note.name, e.target.checked)}
                          className="mr-2 text-black focus:ring-black w-4 h-4"
                        />
                        <span className="text-sm text-gray-600">{note.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlavorNoteSelector;
