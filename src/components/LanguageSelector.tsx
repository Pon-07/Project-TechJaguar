import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta' as Language, name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'od' as Language, name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'bn' as Language, name: 'বাংলা', flag: '🇮🇳' }
];

export function LanguageSelector() {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const handleLanguageChange = (languageCode: Language) => {
    setLanguage(languageCode);
    const selectedLang = languages.find(lang => lang.code === languageCode);
    toast.success(`Language changed to ${selectedLang?.name}`, {
      description: t('notification.welcome'),
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-green-200">
          <Globe className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">
            {languages.find(lang => lang.code === currentLanguage)?.flag} 
            {languages.find(lang => lang.code === currentLanguage)?.name}
          </span>
          <span className="sm:hidden">
            {languages.find(lang => lang.code === currentLanguage)?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <span className="mr-2">{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {currentLanguage === language.code && (
              <Check className="w-4 h-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}