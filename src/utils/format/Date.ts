/* eslint-disable @typescript-eslint/no-explicit-any */
type BaseDateType = string | Date;

interface ITransformer<D extends BaseDateType = BaseDateType> {
  parse(value: D): Date;
  convert(value: D): string;
}

class DateTransformer implements ITransformer<BaseDateType> {
  parse(value: BaseDateType): Date {
    return new Date(value);
  }

  convert(value: Date): string {
    return value.toISOString();
  }
}

interface IDateOptions<D extends BaseDateType = BaseDateType> {
  locale: string;
  dateFormat: Intl.DateTimeFormatOptions;
  dateTimeFormat: Intl.DateTimeFormatOptions;
  transformer: ITransformer<D>;
  fallback?: string;
}

// todo
// reactive locale
// case with custom date generation
// case with custom date format
// relative time

class DateVO<D extends BaseDateType> {
  readonly locale: string;
  readonly dateFormat: Intl.DateTimeFormatOptions;
  readonly dateTimeFormat: Intl.DateTimeFormatOptions;
  readonly transformer: ITransformer;
  readonly fallback: string;

  constructor({
    locale,
    dateFormat,
    dateTimeFormat,
    transformer,
    fallback,
  }: IDateOptions<D>) {
    this.locale = locale;
    this.dateFormat = dateFormat;
    this.dateTimeFormat = dateTimeFormat;
    this.transformer = transformer;
    this.fallback = fallback ?? "---";
  }

  public formatDate(value: D): string {
    if (!this.isValid(value)) return this.fallback;

    return Intl.DateTimeFormat(this.locale, this.dateFormat).format(
      this.toDate(value)
    );
  }

  public formatDateTime(value: D): string {
    if (!this.isValid(value)) return this.fallback;

    return Intl.DateTimeFormat(this.locale, this.dateTimeFormat).format(
      this.toDate(value)
    );
  }

  public formatRelativeTime(value: D): string {
    const timeMs = this.toDate(value).getTime();
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
    const cutoffs = [
      60,
      3600,
      86400,
      86400 * 7,
      86400 * 30,
      86400 * 365,
      Infinity,
    ];
    const units = ["second", "minute", "hour", "day", "week", "month", "year"];
    const unitIndex = cutoffs.findIndex(
      (cutoff) => cutoff > Math.abs(deltaSeconds)
    );
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

    const rtf = new Intl.RelativeTimeFormat(this.locale, { numeric: "auto" });

    return rtf.format(
      Math.floor(deltaSeconds / divisor),
      units[unitIndex] as Intl.RelativeTimeFormatUnit
    );
  }

  public given(date: D): string {
    return this.toInput(date);
  }

  public now(): string {
    return this.toInput(new Date());
  }

  public past(minDate?: D): string {
    const today = new Date();

    return this.range(
      minDate ?? (new Date(today.getFullYear() - 1, today.getMonth()) as D),
      today as D
    );
  }

  public future(maxDate?: D): string {
    const today = new Date();

    return this.range(
      today as D,
      maxDate ?? (new Date(today.getFullYear() + 1, today.getMonth()) as D)
    );
  }

  public range(minDate: D, maxDate: D) {
    // todo: validate if minDate is from the past and maxDate is from the future
    const minValue = this.toDate(minDate).getTime();
    const maxValue = this.toDate(maxDate).getTime();

    const timestamp = Math.floor(
      Math.random() * (maxValue - minValue + 1) + minValue
    );

    return this.toInput(new Date(timestamp));
  }

  public isValid(value: D): boolean {
    if (!value || isNaN(Date.parse(value.toString()))) {
      return false;
    }

    return true;
  }

  private isDate(value: any): value is Date {
    return value instanceof Date;
  }

  private toDate(value: any): Date {
    if (!this.isValid(value)) {
      throw new Error("Invalid date");
    }

    return this.isDate(value) ? value : this.transformer.parse(value);
  }

  private toInput(value: any): string {
    if (!this.isValid(value)) {
      throw new Error("Invalid date");
    }

    return this.transformer.convert(value);
  }
}

const dateTransformer = new DateTransformer();

export const dateVO = new DateVO({
  locale: "en",
  dateFormat: {
    day: "numeric",
    year: "numeric",
    month: "long",
  },
  dateTimeFormat: {
    day: "numeric",
    year: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  },
  transformer: dateTransformer,
});
