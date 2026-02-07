import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import * as enGB from "../../public/locales/en-GB/translation.json";

export const i18nInstance = i18n;

export async function initializeI18n() {
  try {
    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        lng: "en-GB",
        fallbackLng: "en-GB",
        debug: false,
        resources: {
          "en-GB": {
            translation: enGB,
          },
        },
        interpolation: {
          escapeValue: false,
        },
        load: "languageOnly",
      });
    }
    return i18n;
  } catch (error) {
    console.error("i18n initialization failed:", error);
    throw error;
  }
}
