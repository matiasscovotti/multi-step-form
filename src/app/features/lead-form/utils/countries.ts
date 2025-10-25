import countries from 'i18n-iso-countries';

import enLocale from 'i18n-iso-countries/langs/en.json';
import esLocale from 'i18n-iso-countries/langs/es.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import ptLocale from 'i18n-iso-countries/langs/pt.json';

const registeredLocales = new Set<string>();

function ensureLocale(language: string) {
  if (registeredLocales.has(language)) return;

  switch (language) {
    case 'es':
      countries.registerLocale(esLocale as any);
      break;
    case 'fr':
      countries.registerLocale(frLocale as any);
      break;
    case 'pt':
      countries.registerLocale(ptLocale as any);
      break;
    case 'en':
    default:
      countries.registerLocale(enLocale as any);
      break;
  }

  registeredLocales.add(language);
}

export function getCountries(language: string) {
  ensureLocale(language);

  const names = countries.getNames(language, { select: 'official' });

  return Object.entries(names)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name, language));
}
