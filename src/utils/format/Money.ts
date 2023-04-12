import { locale, getLocale } from "./locale";

interface IMoneyVO {
  format(value: string | number, currency?: string): string;
}

interface IMoneyVOOptions {
  locale: string;
  currency: string;
  fallback?: string;
}

class MoneyVO implements IMoneyVO {
  readonly locale: string;
  readonly currency: string;
  readonly fallback: string;

  constructor({ locale, currency, fallback }: IMoneyVOOptions) {
    this.locale = locale;
    this.currency = currency;
    this.fallback = fallback ?? "---";
  }

  public format(value: number | string, currency = this.currency): string {
    if (!this.isValid(value)) return this.fallback;

    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      currencyDisplay: "symbol",
    }).format(Number(value));
  }

  private isValid(value: number | string): boolean {
    if (!value || Number.isNaN(value) || Number.isNaN(Number(value))) {
      return false;
    }

    return true;
  }
}

export const moneyVO = new MoneyVO({
  locale,
  currency: getLocale().defaultCurrency,
});
