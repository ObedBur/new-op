


import { useSettings } from '@/context/SettingsContext';
import { TRANSLATIONS } from '../constants/translations.constants';

export const useAdminTranslation = () => {
    const { language } = useSettings();
    const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

    return { t, language };
};
