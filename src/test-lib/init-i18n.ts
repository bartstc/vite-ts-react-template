import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// AIDEV-NOTE: Vite 8 forbids importing public/ assets as modules, but `?raw` is
// still allowed. The locales must live in public/ because i18next fetches them
// over HTTP at runtime (loadPath "/locales/{{lng}}/{{ns}}.json").
import authRaw from "../../public/locales/en-GB/auth.json?raw";
import cartsRaw from "../../public/locales/en-GB/carts.json?raw";
import marketingRaw from "../../public/locales/en-GB/marketing.json?raw";
import pagesRaw from "../../public/locales/en-GB/pages.json?raw";
import productsRaw from "../../public/locales/en-GB/products.json?raw";
import sharedRaw from "../../public/locales/en-GB/shared.json?raw";

type Resource = Record<string, unknown>;
const parse = (raw: string) => JSON.parse(raw) as Resource;

const auth = parse(authRaw);
const carts = parse(cartsRaw);
const marketing = parse(marketingRaw);
const pages = parse(pagesRaw);
const products = parse(productsRaw);
const shared = parse(sharedRaw);

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
