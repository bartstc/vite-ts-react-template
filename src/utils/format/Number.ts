import { locale } from "./locale";
import { t } from "./message";

export class Number {
  static format(
    value: number | string,
    options: Pick<Intl.NumberFormatOptions, "minimumFractionDigits"> = {}
  ): string {
    const numberValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numberValue)) {
      return "---";
    }

    return new Intl.NumberFormat(locale, options).format(numberValue);
  }

  static formatCurrency(value: number | string, currency = "USD"): string {
    const numberValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numberValue)) {
      return "---";
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        currencyDisplay: "symbol",
      }).format(numberValue);
    } catch (e) {
      if (e instanceof Error && e.message.includes("Invalid currency code")) {
        return `${new Intl.NumberFormat(locale, {
          minimumFractionDigits: 2,
        }).format(numberValue)} ${t("(unknown currency)")}`;
      }

      return "---";
    }
  }
}
