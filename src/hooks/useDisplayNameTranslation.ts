import { useState, useCallback } from 'react';
import { translateDisplayName } from '../services/geminiService';

const useDisplayNameTranslation = (initialDisplayName: string) => {
  const [displayNames, setDisplayNames] = useState({ ko: initialDisplayName, en: null as string | null });
  const [currentLang, setCurrentLang] = useState<'ko' | 'en'>('ko');
  const [isTranslating, setIsTranslating] = useState(false);

  const toggleLanguage = useCallback(async () => {
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
  }, [currentLang, displayNames.en, displayNames.ko]);

  const displayName = displayNames[currentLang] || displayNames.ko;

  return { displayName, currentLang, isTranslating, toggleLanguage };
};

export default useDisplayNameTranslation;
