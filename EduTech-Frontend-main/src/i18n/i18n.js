import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../assets/translations/en.json';
import ar from '../assets/translations/ar.json';
import hi from '../assets/translations/hi.json';
import pl from '../assets/translations/pl.json';

const savedLanguage = localStorage.getItem('language');
if (!savedLanguage) localStorage.setItem('language', 'en');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      hi: { translation: hi },
      pl: { translation: pl }
    },
    lng: savedLanguage, 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  }); 


i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
