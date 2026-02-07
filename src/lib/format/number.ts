import i18n, { supportedLocales } from "@/lib/i18n/i18n";

interface INumberVO {
  format(value: number | string, options?: Intl.NumberFormatOptions): string;
}

interface NumberVOOptions {
  locale: string;
  fallback?: string;
}

class NumberVO implements INumberVO {
  readonly locale: string;
  readonly fallback: string;

  constructor({ locale, fallback }: NumberVOOptions) {
    this.locale = locale;
    this.fallback = fallback ?? "---";
  }

  public format(
    value: number | string,
    options: Intl.NumberFormatOptions = {}
  ): string {
    if (!this.isValid(value)) return this.fallback;

    return new Intl.NumberFormat(this.locale, options).format(Number(value));
  }

  private isValid(value: number | string): boolean {
    if (!value || Number.isNaN(value) || Number.isNaN(Number(value))) {
      return false;
    }

    return true;
  }
}

export const numberVO = new NumberVO({
  locale: i18n.resolvedLanguage ?? supportedLocales[0],
});
