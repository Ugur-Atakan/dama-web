import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    localStorage.setItem('preferredLanguage', languageCode);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#292A2D] focus:ring-offset-2 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Globe size={18} className="text-[#292A2D] mr-2" />
          <span className="mr-2">{currentLanguage.flag}</span>
          <span className="text-[#292A2D]">{currentLanguage.name}</span>
        </div>
        <ChevronDown
          size={18}
          className={`ml-2 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-300">
          <div className="py-1" role="menu">
            {LANGUAGES.map((language) => {
              const isSelected = language.code === i18n.language;
              return (
                <button
                  key={language.code}
                  className={`
                    flex items-center justify-between w-full px-4 py-3 text-sm
                    ${isSelected
                      ? 'bg-[#f3f1f0] text-[#292A2D] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                    transition-colors duration-300
                  `}
                  onClick={() => changeLanguage(language.code)}
                  role="menuitem"
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-base">{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  {isSelected && (
                    <Check size={16} className="text-[#292A2D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const SimpleLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
  };

  return (
    <div className="flex space-x-2">
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${language.code === i18n.language
              ? 'bg-[#292A2D] text-white'
              : 'bg-white text-[#292A2D] border border-gray-200 hover:bg-gray-50'
            }
          `}
          onClick={() => changeLanguage(language.code)}
        >
          <span className="mr-2">{language.flag}</span>
          {language.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;