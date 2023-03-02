import { Dayjs } from "dayjs";

import { dayjs } from "./dayjs";
import { getLocale } from "./locale";

class DateObject {
  static formatDate(
    date: string | Date,
    format = getLocale().dateFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs(date).format(format);
  }

  static formatDateTime(
    date: string | Date,
    format = getLocale().dateTimeFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs(date).format(format);
  }

  static formatRelativeTime(
    date: string | Date,
    format = getLocale().dateTimeFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs().to(date);
  }

  static generateDate(
    date: string | Dayjs | Date = new Date(),
    format?: string
  ): string {
    return dayjs(date).format(format);
  }

  static buildDate(date: string | Dayjs | Date = new Date()): Dayjs {
    return dayjs(date);
  }
}

export { DateObject as Date };
