// src/components/LanguageSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  // Daha fazla dil eklenebilir
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mevcut dil
  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  // Dil değiştirme fonksiyonu
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    // Dil tercihi tarayıcı deposunda saklanabilir
    localStorage.setItem('preferredLanguage', languageCode);
  };

  // Dropdown dışına tıklanınca kapatma
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

  // Başlangıçta tarayıcıdan dil tercihini alma
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mr-2">{currentLanguage.flag}</span>
          {currentLanguage.name}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown menü */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                className={`
                  block px-4 py-2 text-sm w-full text-left
                  ${language.code === i18n.language
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => changeLanguage(language.code)}
                role="menuitem"
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Daha basit bir alternatif versiyon
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
            px-3 py-1 rounded text-sm
            ${language.code === i18n.language
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }
          `}
          onClick={() => changeLanguage(language.code)}
        >
          {language.flag} {language.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;