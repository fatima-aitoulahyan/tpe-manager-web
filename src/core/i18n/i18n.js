import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslation from './locales/fr.json';
import arTranslation from './locales/ar.json';

const resources = {
    fr: {
        translation: frTranslation
    },
    ar: {
        translation: arTranslation
    }
};

i18n
    .use(LanguageDetector) // Détecte la langue du navigateur
    .use(initReactI18next) // Passe i18n à react-i18next
    .init({
        resources,
        fallbackLng: 'fr', // Langue par défaut si non détectée
        debug: false,
        interpolation: {
            escapeValue: false // React protège déjà contre les XSS
        }
    });

export default i18n;