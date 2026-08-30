import "server-only";

const dictionaries = {
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
};

export const locales = Object.keys(dictionaries);

export const hasLocale = (locale) => locale in dictionaries;

export const getDictionary = async (locale) => dictionaries[locale]();
