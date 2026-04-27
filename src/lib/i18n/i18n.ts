import i18n from "i18next";
import type { InitOptions } from "i18next";
import type { ChainedBackendOptions } from "i18next-chained-backend";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import type { HttpBackendOptions } from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import { initReactI18next } from "react-i18next";

type Locale = "en-GB" | "nb-NO" | "da-DK";
export const supportedLocales: Locale[] = ["en-GB"];
export const LOCALE_STORAGE_KEY = "i18next_locale";

const namespaces = [
  "pages",
  "shared",
  "marketing",
  "products",
  "carts",
  "auth",
] as const;

void i18n
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    debug: !import.meta.env.PROD,
    supportedLngs: supportedLocales,
    lng: localStorage.getItem(LOCALE_STORAGE_KEY) ?? supportedLocales[0],
    fallbackLng: supportedLocales[0],
    load: "currentOnly",
    ns: [...namespaces],
    defaultNS: "shared",
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          expirationTime: 14 * 24 * 60 * 60 * 1000, // 14 days
          defaultVersion: import.meta.env.VERSION,
        },
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        } satisfies HttpBackendOptions,
      ],
    } satisfies ChainedBackendOptions,
  } satisfies InitOptions);

// reload i18n resources and reset local storage cache on locale files update
if (import.meta.hot) {
  const defaultI18nPrefix = "i18next_res_";

  const resetLocaleCacheOnDevServerBoot = () => {
    const allKeys = Object.keys(localStorage);
    const keysToRemove = allKeys.filter((key) =>
      key.startsWith(defaultI18nPrefix)
    );

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const resetLocaleCacheOnHMRUpdate = async (file: string) => {
    const regex = /\/locales\/(?<lng>[^/]+)\/(?<namespace>[^/]+)\.json$/;
    if (!regex.test(file)) return;

    const { lng, namespace } = regex.exec(file)?.groups ?? {};

    localStorage.removeItem(`${defaultI18nPrefix}${lng}-${namespace}`);

    await i18n.reloadResources(lng, namespace);
    await i18n.changeLanguage(i18n.language);
  };

  resetLocaleCacheOnDevServerBoot();
  import.meta.hot.on("locales-update", resetLocaleCacheOnHMRUpdate);
}

export default i18n;
