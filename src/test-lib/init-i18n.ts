import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import auth from "../../public/locales/en-GB/auth.json";
import carts from "../../public/locales/en-GB/carts.json";
import marketing from "../../public/locales/en-GB/marketing.json";
import pages from "../../public/locales/en-GB/pages.json";
import products from "../../public/locales/en-GB/products.json";
import shared from "../../public/locales/en-GB/shared.json";

export const i18nInstance = i18n;

export async function initializeI18n() {
  try {
    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        lng: "en-GB",
        fallbackLng: "en-GB",
        debug: false,
        ns: ["pages", "shared", "marketing", "products", "carts", "auth"],
        defaultNS: "shared",
        resources: {
          "en-GB": {
            pages,
            shared,
            marketing,
            products,
            carts,
            auth,
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
