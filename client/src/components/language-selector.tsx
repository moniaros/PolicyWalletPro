import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { storageUtils } from '@/lib/storage-utils';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    storageUtils.setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full h-10 border-primary/20 hover:border-primary/40 transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="el" className="flex items-center">
            <span className="flex items-center gap-2">
              {i18n.language === 'el' && <Check className="h-4 w-4" />}
              Ελληνικά
            </span>
          </SelectItem>
          <SelectItem value="en" className="flex items-center">
            <span className="flex items-center gap-2">
              {i18n.language === 'en' && <Check className="h-4 w-4" />}
              English
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
