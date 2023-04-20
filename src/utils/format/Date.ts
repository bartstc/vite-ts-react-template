/* eslint-disable no-restricted-imports */
import { Dayjs } from "dayjs";

import { dayjs } from "./dayjs";
import { getLocale } from "./locale";

type DateType = string | Date | Dayjs;

// todo: remove dayjs, use the native browser's API
// todo: replace static class with a singleton
/** @deprecated */
export class DateVO {
  static formatDate(date: DateType, format = getLocale().dateFormat): string {
    if (!date) {
      return "---";
    }

    return dayjs(date).format(format);
  }

  static formatDateTime(
    date: DateType,
    format = getLocale().dateTimeFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs(date).format(format);
  }

  static formatRelativeTime(
    date: DateType,
    format = getLocale().dateTimeFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs().to(date);
  }

  static generateDate(date: DateType = new Date(), format?: string): string {
    return dayjs(date).format(format);
  }

  static buildDate(date: DateType = new Date()): Dayjs {
    return dayjs(date);
  }
}
