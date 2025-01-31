import i18n from 'i18n';
import path from 'path';
import { detectLanguage } from './languageDetector.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
    locales: ['en', 'es'],
    directory: path.resolve(path.join(__dirname, `../assets/locales`)),
    defaultLocale: 'en',
    autoReload: false,
    updateFiles: false,
    syncFiles: true,
    objectNotation: true,
});

i18n.setLocale(detectLanguage());

export const language = i18n;
