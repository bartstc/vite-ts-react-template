export const locale = navigator.language;

const Locale = {
  en: {
    defaultCurrency: "USD",
    dateFormat: "MMMM D, YYYY",
    dateTimeFormat: "MMMM D, YYYY h:mm",
  },
  pl: {
    defaultCurrency: "PLN",
    dateFormat: "d MMMM YYYY",
    dateTimeFormat: "d MMMM YYYY h:mm",
  },
};

export const getLocale = (value = locale) => {
  switch (value) {
    case "en":
      return Locale["en"];
    case "pl":
      return Locale["pl"];
    default:
      return Locale["en"];
  }
};
