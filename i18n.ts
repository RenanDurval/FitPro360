import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es }
};

// Obter a linguagem do dispositivo (ex: "pt-BR" -> "pt")
const locales = Localization.getLocales();
const languageTag = locales.length > 0 ? locales[0].languageTag : 'en';
const baseLng = languageTag.split('-')[0]; // Pega apenas "pt", "en", "es"

i18n.use(initReactI18next).init({
  resources,
  lng: baseLng,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
